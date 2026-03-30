import 'package:hive/hive.dart';

part 'sync_entry.g.dart';

/// Status of a sync queue entry.
@HiveType(typeId: 0)
enum SyncStatus {
  @HiveField(0)
  pending,

  @HiveField(1)
  syncing,

  @HiveField(2)
  synced,

  @HiveField(3)
  conflict,

  @HiveField(4)
  failed,
}

/// Type of data being synced.
@HiveType(typeId: 1)
enum SyncEntryType {
  @HiveField(0)
  symptomLog,

  @HiveField(1)
  medicationLog,

  @HiveField(2)
  journalEntry,
}

/// A single entry in the offline sync queue.
///
/// Stored in Hive and processed by [SyncService] when connectivity is available.
@HiveType(typeId: 2)
class SyncEntry extends HiveObject {
  /// Unique local ID (UUID v4) for idempotency.
  @HiveField(0)
  final String localId;

  /// Type of record being synced.
  @HiveField(1)
  final SyncEntryType type;

  /// JSON-encoded payload data.
  @HiveField(2)
  final String data;

  /// Current sync status.
  @HiveField(3)
  SyncStatus syncStatus;

  /// When the entry was queued locally.
  @HiveField(4)
  final DateTime queuedAt;

  /// When the entry was successfully synced (null if not yet synced).
  @HiveField(5)
  DateTime? syncedAt;

  /// Number of sync retry attempts.
  @HiveField(6)
  int retryCount;

  /// Error message from last failed sync attempt.
  @HiveField(7)
  String? errorMessage;

  /// Server-assigned ID after successful sync.
  @HiveField(8)
  String? serverId;

  SyncEntry({
    required this.localId,
    required this.type,
    required this.data,
    this.syncStatus = SyncStatus.pending,
    required this.queuedAt,
    this.syncedAt,
    this.retryCount = 0,
    this.errorMessage,
    this.serverId,
  });

  /// Maximum number of retry attempts before marking as failed.
  static const int maxRetries = 3;

  /// Whether this entry can be retried.
  bool get canRetry => retryCount < maxRetries && syncStatus != SyncStatus.synced;

  /// Map type enum to API string.
  String get typeString {
    switch (type) {
      case SyncEntryType.symptomLog:
        return 'symptom_log';
      case SyncEntryType.medicationLog:
        return 'medication_log';
      case SyncEntryType.journalEntry:
        return 'journal_entry';
    }
  }
}
