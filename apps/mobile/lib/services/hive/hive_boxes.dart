/// Hive box name constants for PalliCare offline storage.
class HiveBoxes {
  HiveBoxes._();

  /// Sync queue entries awaiting upload to server.
  static const String syncQueue = 'sync_queue';

  /// Cached symptom logs (structured offline storage).
  static const String symptomLogs = 'symptom_logs';

  /// Cached medication logs (structured offline storage).
  static const String medicationLogs = 'medication_logs';

  /// User settings and preferences.
  static const String settings = 'settings';

  /// In-progress drafts (onboarding, log entries).
  static const String drafts = 'drafts';

  /// General key-value store (auth tokens, device ID, etc.).
  static const String general = 'general';

  /// Journey entries (gratitude, intentions, goals).
  static const String journalEntries = 'journal_entries';
}
