import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'sync_service.dart';

/// Riverpod provider for sync state.
///
/// Wraps [SyncService] to provide reactive sync state to the UI.
/// Use `ref.watch(syncProvider)` to observe connectivity and sync status.
final syncProvider = StateNotifierProvider<SyncNotifier, SyncState>((ref) {
  final notifier = SyncNotifier();
  ref.onDispose(() => notifier.dispose());
  return notifier;
});

class SyncNotifier extends StateNotifier<SyncState> {
  final SyncService _syncService = SyncService();
  StreamSubscription? _stateSub;

  SyncNotifier() : super(const SyncState()) {
    _initialize();
  }

  Future<void> _initialize() async {
    await _syncService.initialize();

    // Listen to sync service state changes
    _stateSub = _syncService.stateStream.listen((syncState) {
      if (mounted) {
        state = syncState;
      }
    });

    // Set initial state
    state = _syncService.currentState;
  }

  /// Queue a symptom log for offline-first sync.
  /// Returns the local ID for tracking.
  Future<String> queueSymptomLog(Map<String, dynamic> logData) {
    return _syncService.queueSymptomLog(logData);
  }

  /// Queue a medication dose log for offline-first sync.
  Future<String> queueMedicationLog(Map<String, dynamic> logData) {
    return _syncService.queueMedicationLog(logData);
  }

  /// Queue a journal entry (gratitude, intention, goal) for sync.
  Future<String> queueJournalEntry(Map<String, dynamic> entryData) {
    return _syncService.queueJournalEntry(entryData);
  }

  /// Force an immediate sync attempt.
  Future<void> forceSync() => _syncService.forceSync();

  /// Retry a conflicted entry.
  Future<void> retryConflict(String localId) =>
      _syncService.retryConflict(localId);

  @override
  void dispose() {
    _stateSub?.cancel();
    super.dispose();
  }
}
