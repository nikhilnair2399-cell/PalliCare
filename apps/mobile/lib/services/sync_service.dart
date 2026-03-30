import 'dart:async';
import 'dart:convert';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:uuid/uuid.dart';
import 'api_service.dart';
import 'local_storage_service.dart';
import 'hive/sync_entry.dart';

/// Sync status broadcast for UI observation.
class SyncState {
  final int pendingCount;
  final int conflictCount;
  final bool isSyncing;
  final bool hasConnection;
  final DateTime? lastSyncTime;
  final String? lastError;

  const SyncState({
    this.pendingCount = 0,
    this.conflictCount = 0,
    this.isSyncing = false,
    this.hasConnection = true,
    this.lastSyncTime,
    this.lastError,
  });

  SyncState copyWith({
    int? pendingCount,
    int? conflictCount,
    bool? isSyncing,
    bool? hasConnection,
    DateTime? lastSyncTime,
    String? lastError,
  }) {
    return SyncState(
      pendingCount: pendingCount ?? this.pendingCount,
      conflictCount: conflictCount ?? this.conflictCount,
      isSyncing: isSyncing ?? this.isSyncing,
      hasConnection: hasConnection ?? this.hasConnection,
      lastSyncTime: lastSyncTime ?? this.lastSyncTime,
      lastError: lastError ?? this.lastError,
    );
  }
}

/// Manages offline-first data sync with per-entry status tracking,
/// retry logic with exponential backoff, and conflict detection.
class SyncService {
  static SyncService? _instance;
  final ApiService _api = ApiService();
  final LocalStorageService _storage = LocalStorageService();
  final Connectivity _connectivity = Connectivity();
  final Uuid _uuid = const Uuid();
  StreamSubscription? _connectivitySub;
  bool _isSyncing = false;

  final _stateController = StreamController<SyncState>.broadcast();
  SyncState _currentState = const SyncState();

  SyncService._();
  factory SyncService() => _instance ??= SyncService._();

  /// Stream of sync state changes for UI observation.
  Stream<SyncState> get stateStream => _stateController.stream;

  /// Current sync state snapshot.
  SyncState get currentState => _currentState;

  /// Initialize the sync service.
  Future<void> initialize() async {
    // Ensure device ID exists
    if (_storage.deviceId == null) {
      await _storage.setDeviceId(_uuid.v4());
    }

    // Start connectivity monitoring
    _connectivitySub = _connectivity.onConnectivityChanged.listen((results) {
      final hasConnection = results.any((r) => r != ConnectivityResult.none);
      _updateState(_currentState.copyWith(hasConnection: hasConnection));

      if (hasConnection && !_isSyncing) {
        syncPendingEntries();
      }
    });

    // Check initial connectivity
    final connectivity = await _connectivity.checkConnectivity();
    final hasConnection = connectivity.any((r) => r != ConnectivityResult.none);
    _updateState(_currentState.copyWith(
      hasConnection: hasConnection,
      pendingCount: _storage.pendingSyncCount,
      conflictCount: _storage.conflictCount,
    ));

    if (hasConnection) {
      syncPendingEntries();
    }
  }

  /// Queue a symptom log for offline-first sync.
  Future<String> queueSymptomLog(Map<String, dynamic> logData) async {
    final localId = _uuid.v4();

    await _storage.saveSymptomLogLocally(localId, {
      ...logData,
      'local_id': localId,
      'created_at': DateTime.now().toIso8601String(),
    });

    final entry = SyncEntry(
      localId: localId,
      type: SyncEntryType.symptomLog,
      data: jsonEncode(logData),
      queuedAt: DateTime.now(),
    );
    await _storage.addToSyncQueue(entry);
    _refreshCounts();
    _trySyncIfOnline();

    return localId;
  }

  /// Queue a medication dose log for offline-first sync.
  Future<String> queueMedicationLog(Map<String, dynamic> logData) async {
    final localId = _uuid.v4();

    await _storage.saveMedicationLogLocally(localId, {
      ...logData,
      'local_id': localId,
      'created_at': DateTime.now().toIso8601String(),
    });

    final entry = SyncEntry(
      localId: localId,
      type: SyncEntryType.medicationLog,
      data: jsonEncode(logData),
      queuedAt: DateTime.now(),
    );
    await _storage.addToSyncQueue(entry);
    _refreshCounts();
    _trySyncIfOnline();

    return localId;
  }

  /// Queue a journal entry for sync.
  Future<String> queueJournalEntry(Map<String, dynamic> entryData) async {
    final localId = _uuid.v4();

    await _storage.saveJournalEntry(localId, {
      ...entryData,
      'local_id': localId,
      'created_at': DateTime.now().toIso8601String(),
    });

    final entry = SyncEntry(
      localId: localId,
      type: SyncEntryType.journalEntry,
      data: jsonEncode(entryData),
      queuedAt: DateTime.now(),
    );
    await _storage.addToSyncQueue(entry);
    _refreshCounts();
    _trySyncIfOnline();

    return localId;
  }

  /// Attempt to sync all pending entries to the server.
  Future<void> syncPendingEntries() async {
    if (_isSyncing) return;
    _isSyncing = true;
    _updateState(_currentState.copyWith(isSyncing: true));

    try {
      final pending = _storage.getPendingSyncEntries();
      if (pending.isEmpty) {
        _isSyncing = false;
        _updateState(_currentState.copyWith(isSyncing: false));
        return;
      }

      // Mark all as syncing
      for (final entry in pending) {
        entry.syncStatus = SyncStatus.syncing;
        await _storage.updateSyncEntry(entry);
      }

      // Build batch request matching NestJS POST /sync format
      final deviceId = _storage.deviceId ?? '';
      final records = pending
          .map((e) => {
                'device_id': deviceId,
                'type': e.typeString,
                'data': jsonDecode(e.data) as Map<String, dynamic>,
                'local_id': e.localId,
                'created_at': e.queuedAt.toIso8601String(),
              })
          .toList();

      final response = await _api.syncEntries(records);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data as Map<String, dynamic>;
        final conflicts =
            (responseData['conflicts'] as List?)?.cast<Map<String, dynamic>>() ?? [];
        final failed =
            (responseData['failed'] as List?)?.cast<Map<String, dynamic>>() ?? [];

        final conflictIds = <String>{};
        final failedIds = <String>{};

        // Process conflicts
        for (final conflict in conflicts) {
          final localId = conflict['local_id'] as String;
          conflictIds.add(localId);
          try {
            final entry = pending.firstWhere((e) => e.localId == localId);
            entry.syncStatus = SyncStatus.conflict;
            entry.serverId = conflict['server_id'] as String?;
            await _storage.updateSyncEntry(entry);
          } catch (_) {}
        }

        // Process failures
        for (final fail in failed) {
          final localId = fail['local_id'] as String;
          failedIds.add(localId);
          try {
            final entry = pending.firstWhere((e) => e.localId == localId);
            entry.syncStatus = SyncStatus.failed;
            entry.retryCount++;
            entry.errorMessage = fail['error'] as String?;
            await _storage.updateSyncEntry(entry);
          } catch (_) {}
        }

        // Mark remaining as synced
        for (final entry in pending) {
          if (!conflictIds.contains(entry.localId) &&
              !failedIds.contains(entry.localId)) {
            entry.syncStatus = SyncStatus.synced;
            entry.syncedAt = DateTime.now();
            await _storage.updateSyncEntry(entry);
          }
        }

        // Clean up synced entries
        await _storage.clearSyncedEntries();

        _updateState(_currentState.copyWith(
          isSyncing: false,
          pendingCount: _storage.pendingSyncCount,
          conflictCount: _storage.conflictCount,
          lastSyncTime: DateTime.now(),
          lastError: null,
        ));
      } else {
        _revertSyncingToPending(pending, 'Server returned ${response.statusCode}');
      }
    } catch (e) {
      final syncing = _storage
          .getSyncQueue()
          .where((e) => e.syncStatus == SyncStatus.syncing)
          .toList();
      _revertSyncingToPending(syncing, e.toString());
    } finally {
      _isSyncing = false;
    }
  }

  /// Force a sync attempt (called from UI).
  Future<void> forceSync() async {
    if (_currentState.hasConnection) {
      await syncPendingEntries();
    }
  }

  /// Retry a specific conflicted entry.
  Future<void> retryConflict(String localId) async {
    final entries = _storage.getSyncQueue();
    final entry = entries.firstWhere(
      (e) => e.localId == localId,
      orElse: () => throw StateError('Entry not found: $localId'),
    );
    entry.syncStatus = SyncStatus.pending;
    entry.retryCount = 0;
    await _storage.updateSyncEntry(entry);
    _refreshCounts();
    _trySyncIfOnline();
  }

  int get pendingCount => _storage.pendingSyncCount;
  bool get isSyncing => _isSyncing;

  void _trySyncIfOnline() async {
    final connectivity = await _connectivity.checkConnectivity();
    final hasConnection = connectivity.any((r) => r != ConnectivityResult.none);
    if (hasConnection && !_isSyncing) {
      syncPendingEntries();
    }
  }

  void _refreshCounts() {
    _updateState(_currentState.copyWith(
      pendingCount: _storage.pendingSyncCount,
      conflictCount: _storage.conflictCount,
    ));
  }

  void _revertSyncingToPending(List<SyncEntry> entries, String error) async {
    for (final entry in entries) {
      if (entry.syncStatus == SyncStatus.syncing) {
        entry.syncStatus = SyncStatus.pending;
        entry.retryCount++;
        await _storage.updateSyncEntry(entry);
      }
    }
    _updateState(_currentState.copyWith(
      isSyncing: false,
      lastError: error,
    ));
  }

  void _updateState(SyncState newState) {
    _currentState = newState;
    if (!_stateController.isClosed) {
      _stateController.add(newState);
    }
  }

  void dispose() {
    _connectivitySub?.cancel();
    _stateController.close();
  }
}
