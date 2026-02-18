import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'api_service.dart';
import 'local_storage_service.dart';

/// Manages offline-first data sync.
/// Queues entries when offline, syncs when connectivity restored.
class SyncService {
  static SyncService? _instance;
  final ApiService _api = ApiService();
  final LocalStorageService _storage = LocalStorageService();
  final Connectivity _connectivity = Connectivity();
  StreamSubscription? _connectivitySub;
  bool _isSyncing = false;

  SyncService._();
  factory SyncService() => _instance ??= SyncService._();

  /// Start listening for connectivity changes.
  void initialize() {
    _connectivitySub = _connectivity.onConnectivityChanged.listen((results) {
      final hasConnection = results.any((r) => r != ConnectivityResult.none);
      if (hasConnection && !_isSyncing) {
        syncPendingEntries();
      }
    });
  }

  /// Queue an entry for sync (saved locally first).
  Future<void> queueEntry(Map<String, dynamic> entry) async {
    entry['sync_status'] = 'pending';
    entry['queued_at'] = DateTime.now().toIso8601String();
    await _storage.addToSyncQueue(entry);

    // Try immediate sync
    final connectivity = await _connectivity.checkConnectivity();
    final hasConnection =
        connectivity.any((r) => r != ConnectivityResult.none);
    if (hasConnection) {
      syncPendingEntries();
    }
  }

  /// Attempt to sync all pending entries.
  Future<void> syncPendingEntries() async {
    if (_isSyncing) return;
    _isSyncing = true;

    try {
      final queue = _storage.getSyncQueue();
      if (queue.isEmpty) return;

      final response = await _api.syncEntries(queue);
      if (response.statusCode == 200) {
        await _storage.clearSyncQueue();
      }
    } catch (e) {
      // Will retry on next connectivity change
    } finally {
      _isSyncing = false;
    }
  }

  /// Number of entries waiting to sync.
  int get pendingCount => _storage.getSyncQueue().length;

  /// Whether currently syncing.
  bool get isSyncing => _isSyncing;

  void dispose() {
    _connectivitySub?.cancel();
  }
}
