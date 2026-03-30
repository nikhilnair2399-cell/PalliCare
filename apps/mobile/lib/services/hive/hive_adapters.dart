import 'dart:typed_data';
import 'package:hive_flutter/hive_flutter.dart';
import 'sync_entry.dart';
import 'hive_boxes.dart';

/// Initialize Hive and register all type adapters.
///
/// If [encryptionKey] is provided (32 bytes / 256 bits), boxes that contain
/// patient health data or PII are opened with AES encryption via
/// [HiveAesCipher]. The key itself should come from [SecureStorageService]
/// which stores it in Android Keystore / iOS Keychain.
///
/// Must be called once at app startup (in main.dart) before any Hive operations.
Future<void> initializeHive({Uint8List? encryptionKey}) async {
  await Hive.initFlutter();

  // Register type adapters
  Hive.registerAdapter(SyncStatusAdapter());
  Hive.registerAdapter(SyncEntryTypeAdapter());
  Hive.registerAdapter(SyncEntryAdapter());

  // Create cipher if key provided
  final cipher =
      encryptionKey != null ? HiveAesCipher(encryptionKey) : null;

  // Open encrypted boxes (contain patient health data / PII)
  await Future.wait([
    Hive.openBox<SyncEntry>(HiveBoxes.syncQueue, encryptionCipher: cipher),
    Hive.openBox<String>(HiveBoxes.symptomLogs, encryptionCipher: cipher),
    Hive.openBox<String>(HiveBoxes.medicationLogs, encryptionCipher: cipher),
    Hive.openBox<String>(HiveBoxes.drafts, encryptionCipher: cipher),
    Hive.openBox<String>(HiveBoxes.journalEntries, encryptionCipher: cipher),
  ]);

  // Open unencrypted boxes (no PII after token migration)
  await Future.wait([
    Hive.openBox<dynamic>(HiveBoxes.settings),
    Hive.openBox<dynamic>(HiveBoxes.general),
  ]);
}

/// Close all Hive boxes. Call on app dispose.
Future<void> closeHive() async {
  await Hive.close();
}
