import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'hive/hive_boxes.dart';
import 'hive/sync_entry.dart';
import 'secure_storage_service.dart';

/// Local storage service backed by Hive for persistent offline storage.
///
/// All data survives app restarts and is available offline.
/// Replaces the previous in-memory Map implementation.
class LocalStorageService {
  static LocalStorageService? _instance;

  LocalStorageService._();
  factory LocalStorageService() => _instance ??= LocalStorageService._();

  // ---- Box Accessors ----

  Box<dynamic> get _general => Hive.box<dynamic>(HiveBoxes.general);
  Box<dynamic> get _settings => Hive.box<dynamic>(HiveBoxes.settings);
  Box<String> get _drafts => Hive.box<String>(HiveBoxes.drafts);
  Box<SyncEntry> get _syncQueue => Hive.box<SyncEntry>(HiveBoxes.syncQueue);
  Box<String> get _symptomLogs => Hive.box<String>(HiveBoxes.symptomLogs);
  Box<String> get _medicationLogs => Hive.box<String>(HiveBoxes.medicationLogs);
  Box<String> get _journalEntries => Hive.box<String>(HiveBoxes.journalEntries);

  // ---- Generic Key-Value ----

  Future<void> put(String key, dynamic value) async {
    await _general.put(key, value);
  }

  T? get<T>(String key) => _general.get(key) as T?;

  Future<void> remove(String key) async {
    await _general.delete(key);
  }

  // ---- Onboarding ----

  Future<void> saveOnboardingProgress(Map<String, dynamic> data) async {
    await _drafts.put('onboarding_progress', jsonEncode(data));
  }

  Map<String, dynamic>? getOnboardingProgress() {
    final raw = _drafts.get('onboarding_progress');
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> clearOnboarding() async {
    await _drafts.delete('onboarding_progress');
  }

  bool get isOnboardingComplete => get<bool>('onboarding_complete') ?? false;

  Future<void> setOnboardingComplete() async {
    await put('onboarding_complete', true);
  }

  // ---- Symptom Log Drafts ----

  Future<void> saveLogDraft(Map<String, dynamic> draft) async {
    await _drafts.put('current_log_draft', jsonEncode(draft));
  }

  Map<String, dynamic>? getLogDraft() {
    final raw = _drafts.get('current_log_draft');
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> clearLogDraft() async {
    await _drafts.delete('current_log_draft');
  }

  // ---- Offline Symptom Logs ----

  Future<void> saveSymptomLogLocally(String localId, Map<String, dynamic> log) async {
    await _symptomLogs.put(localId, jsonEncode(log));
  }

  Map<String, dynamic>? getSymptomLog(String localId) {
    final raw = _symptomLogs.get(localId);
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  List<Map<String, dynamic>> getAllSymptomLogs() {
    return _symptomLogs.values
        .map((raw) => jsonDecode(raw) as Map<String, dynamic>)
        .toList();
  }

  // ---- Offline Medication Logs ----

  Future<void> saveMedicationLogLocally(String localId, Map<String, dynamic> log) async {
    await _medicationLogs.put(localId, jsonEncode(log));
  }

  List<Map<String, dynamic>> getAllMedicationLogs() {
    return _medicationLogs.values
        .map((raw) => jsonDecode(raw) as Map<String, dynamic>)
        .toList();
  }

  // ---- Journal Entries ----

  Future<void> saveJournalEntry(String localId, Map<String, dynamic> entry) async {
    await _journalEntries.put(localId, jsonEncode(entry));
  }

  List<Map<String, dynamic>> getAllJournalEntries() {
    return _journalEntries.values
        .map((raw) => jsonDecode(raw) as Map<String, dynamic>)
        .toList();
  }

  // ---- Sync Queue (Typed) ----

  Future<void> addToSyncQueue(SyncEntry entry) async {
    await _syncQueue.put(entry.localId, entry);
  }

  List<SyncEntry> getSyncQueue() {
    return _syncQueue.values.toList();
  }

  List<SyncEntry> getPendingSyncEntries() {
    return _syncQueue.values
        .where((e) =>
            e.syncStatus == SyncStatus.pending ||
            (e.syncStatus == SyncStatus.failed && e.canRetry))
        .toList();
  }

  Future<void> updateSyncEntry(SyncEntry entry) async {
    await entry.save();
  }

  Future<void> removeSyncEntry(String localId) async {
    await _syncQueue.delete(localId);
  }

  Future<void> clearSyncedEntries() async {
    final synced = _syncQueue.values
        .where((e) => e.syncStatus == SyncStatus.synced)
        .toList();
    for (final entry in synced) {
      await entry.delete();
    }
  }

  int get pendingSyncCount =>
      _syncQueue.values.where((e) => e.syncStatus == SyncStatus.pending).length;

  int get conflictCount =>
      _syncQueue.values.where((e) => e.syncStatus == SyncStatus.conflict).length;

  // ---- User Preferences ----

  String get language => _settings.get('language', defaultValue: 'en') as String;
  Future<void> setLanguage(String lang) => _settings.put('language', lang);

  // Auth tokens moved to SecureStorageService for Keystore/Keychain protection.
  // These methods delegate to SecureStorageService for backwards compatibility.
  final SecureStorageService _secureStorage = SecureStorageService();

  Future<String?> getAuthToken() => _secureStorage.getAccessToken();
  Future<void> setAuthToken(String token) => _secureStorage.setAccessToken(token);
  Future<void> setRefreshToken(String token) => _secureStorage.setRefreshToken(token);
  Future<void> clearAuth() => _secureStorage.clearTokens();

  String? get deviceId => get<String>('device_id');
  Future<void> setDeviceId(String id) => put('device_id', id);

  // ---- Debug ----

  @visibleForTesting
  Future<void> clearAll() async {
    await _general.clear();
    await _settings.clear();
    await _drafts.clear();
    await _syncQueue.clear();
    await _symptomLogs.clear();
    await _medicationLogs.clear();
    await _journalEntries.clear();
  }
}
