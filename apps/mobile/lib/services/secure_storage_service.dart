import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure storage service for sensitive data (auth tokens, encryption keys).
/// Uses Android Keystore / iOS Keychain under the hood.
///
/// All secrets are isolated from the app filesystem and protected by
/// hardware-backed key stores on both platforms.
class SecureStorageService {
  static SecureStorageService? _instance;

  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  // Storage keys
  static const _keyAccessToken = 'pallicare_access_token';
  static const _keyRefreshToken = 'pallicare_refresh_token';
  static const _keyHiveEncryptionKey = 'pallicare_hive_key';
  static const _keyConsents = 'pallicare_consents';

  SecureStorageService._();
  factory SecureStorageService() => _instance ??= SecureStorageService._();

  // ---- Auth Tokens ----

  /// Store the short-lived JWT access token.
  Future<void> setAccessToken(String token) =>
      _storage.write(key: _keyAccessToken, value: token);

  /// Read the current access token (null if not logged in).
  Future<String?> getAccessToken() =>
      _storage.read(key: _keyAccessToken);

  /// Store the long-lived refresh token.
  Future<void> setRefreshToken(String token) =>
      _storage.write(key: _keyRefreshToken, value: token);

  /// Read the current refresh token.
  Future<String?> getRefreshToken() =>
      _storage.read(key: _keyRefreshToken);

  /// Clear both tokens on logout.
  Future<void> clearTokens() async {
    await _storage.delete(key: _keyAccessToken);
    await _storage.delete(key: _keyRefreshToken);
  }

  // ---- Hive Encryption Key ----

  /// Returns an existing 256-bit AES key or generates a new one.
  ///
  /// The key is stored in Keystore/Keychain and never touches the app
  /// filesystem. Hive boxes opened with this key are encrypted at rest.
  Future<Uint8List> getOrCreateHiveEncryptionKey() async {
    final existing = await _storage.read(key: _keyHiveEncryptionKey);
    if (existing != null) {
      return base64Decode(existing);
    }

    // Generate 32-byte (256-bit) key using a cryptographically secure PRNG
    final secureRandom = Random.secure();
    final keyBytes = Uint8List(32);
    for (var i = 0; i < 32; i++) {
      keyBytes[i] = secureRandom.nextInt(256);
    }

    await _storage.write(
      key: _keyHiveEncryptionKey,
      value: base64Encode(keyBytes),
    );
    return keyBytes;
  }

  // ---- Consent Cache (DPDPA 2023) ----

  /// Cache the user's consent map locally for offline checks.
  Future<void> cacheConsents(Map<String, bool> consents) async {
    await _storage.write(key: _keyConsents, value: jsonEncode(consents));
  }

  /// Read cached consent map. Returns empty map if nothing stored.
  Future<Map<String, bool>> getCachedConsents() async {
    final raw = await _storage.read(key: _keyConsents);
    if (raw == null) return {};
    final map = jsonDecode(raw) as Map<String, dynamic>;
    return map.map((k, v) => MapEntry(k, v as bool));
  }

  // ---- Clear All ----

  /// Wipe every entry from secure storage (logout / account deletion).
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
