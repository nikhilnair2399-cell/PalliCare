import 'dart:convert';
import 'package:flutter/foundation.dart';

/// Local storage service using a simple in-memory + file-based approach.
/// Replace with Hive once initialized in main.dart.
class LocalStorageService {
  static LocalStorageService? _instance;
  final Map<String, dynamic> _cache = {};

  LocalStorageService._();
  factory LocalStorageService() => _instance ??= LocalStorageService._();

  // ---- Generic Key-Value ----

  Future<void> put(String key, dynamic value) async {
    _cache[key] = value;
  }

  T? get<T>(String key) => _cache[key] as T?;

  Future<void> remove(String key) async {
    _cache.remove(key);
  }

  // ---- Onboarding ----

  Future<void> saveOnboardingProgress(Map<String, dynamic> data) async {
    _cache['onboarding_progress'] = jsonEncode(data);
  }

  Map<String, dynamic>? getOnboardingProgress() {
    final raw = _cache['onboarding_progress'] as String?;
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> clearOnboarding() async {
    _cache.remove('onboarding_progress');
  }

  bool get isOnboardingComplete =>
      get<bool>('onboarding_complete') ?? false;

  Future<void> setOnboardingComplete() async {
    await put('onboarding_complete', true);
  }

  // ---- Symptom Log Drafts ----

  Future<void> saveLogDraft(Map<String, dynamic> draft) async {
    _cache['current_log_draft'] = jsonEncode(draft);
  }

  Map<String, dynamic>? getLogDraft() {
    final raw = _cache['current_log_draft'] as String?;
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> clearLogDraft() async {
    _cache.remove('current_log_draft');
  }

  // ---- Offline Sync Queue ----

  Future<void> addToSyncQueue(Map<String, dynamic> entry) async {
    final queue = getSyncQueue();
    queue.add(entry);
    _cache['sync_queue'] = jsonEncode(queue);
  }

  List<Map<String, dynamic>> getSyncQueue() {
    final raw = _cache['sync_queue'] as String?;
    if (raw == null) return [];
    final list = jsonDecode(raw) as List;
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> clearSyncQueue() async {
    _cache.remove('sync_queue');
  }

  // ---- User Preferences ----

  String get language => get<String>('language') ?? 'en';
  Future<void> setLanguage(String lang) => put('language', lang);

  String? get authToken => get<String>('auth_token');
  Future<void> setAuthToken(String token) => put('auth_token', token);
  Future<void> clearAuth() => remove('auth_token');

  // ---- Debug ----

  @visibleForTesting
  void clearAll() => _cache.clear();
}
