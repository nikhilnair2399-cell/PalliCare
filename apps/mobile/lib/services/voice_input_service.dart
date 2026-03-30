import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

/// Voice input service for PalliCare — supports Hindi (hi-IN) and English (en-IN).
///
/// Wraps `speech_to_text` to provide locale-aware speech recognition
/// for symptom logging, gratitude journal, and free-text fields.
class VoiceInputService {
  VoiceInputService._();
  static final VoiceInputService instance = VoiceInputService._();

  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isInitialized = false;
  bool _isListening = false;

  /// Whether speech recognition is currently active.
  bool get isListening => _isListening;

  /// Whether the service has been initialized and is available.
  bool get isAvailable => _isInitialized;

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  /// Initialize the speech recognition engine. Returns `true` if available.
  Future<bool> initialize() async {
    if (_isInitialized) return true;
    try {
      _isInitialized = await _speech.initialize(
        onError: (error) {
          debugPrint('VoiceInput error: ${error.errorMsg}');
          _isListening = false;
        },
        onStatus: (status) {
          debugPrint('VoiceInput status: $status');
          if (status == 'done' || status == 'notListening') {
            _isListening = false;
          }
        },
      );
      return _isInitialized;
    } catch (e) {
      debugPrint('VoiceInput init failed: $e');
      _isInitialized = false;
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Locale helpers
  // ---------------------------------------------------------------------------

  /// Locale ID for Hindi speech recognition.
  static const String hindiLocale = 'hi_IN';

  /// Locale ID for English (India) speech recognition.
  static const String englishLocale = 'en_IN';

  /// Returns the speech locale ID for the given language code ('hi' or 'en').
  static String localeIdFor(String languageCode) {
    return languageCode == 'hi' ? hindiLocale : englishLocale;
  }

  /// List available locales on the device.
  Future<List<stt.LocaleName>> getAvailableLocales() async {
    if (!_isInitialized) await initialize();
    return _speech.locales();
  }

  /// Check if Hindi recognition is available on this device.
  Future<bool> isHindiAvailable() async {
    final locales = await getAvailableLocales();
    return locales.any((l) => l.localeId.startsWith('hi'));
  }

  // ---------------------------------------------------------------------------
  // Listening
  // ---------------------------------------------------------------------------

  /// Start listening for speech. Calls [onResult] with recognized text.
  ///
  /// [languageCode] — 'hi' for Hindi, 'en' for English (default based on app).
  /// [onResult] — Called with the recognized text (may be called multiple times
  ///   as recognition progresses, with `isFinal` indicating the last result).
  /// [onDone] — Called when recognition completes.
  Future<void> startListening({
    required String languageCode,
    required void Function(String text, bool isFinal) onResult,
    VoidCallback? onDone,
  }) async {
    if (!_isInitialized) {
      final ok = await initialize();
      if (!ok) return;
    }

    if (_isListening) {
      await stopListening();
    }

    _isListening = true;

    await _speech.listen(
      localeId: localeIdFor(languageCode),
      onResult: (result) {
        onResult(result.recognizedWords, result.finalResult);
        if (result.finalResult) {
          _isListening = false;
          onDone?.call();
        }
      },
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 3),
      partialResults: true,
      cancelOnError: true,
      listenMode: stt.ListenMode.dictation,
    );
  }

  /// Stop listening if currently active.
  Future<void> stopListening() async {
    if (_isListening) {
      await _speech.stop();
      _isListening = false;
    }
  }

  /// Cancel recognition without returning results.
  Future<void> cancel() async {
    await _speech.cancel();
    _isListening = false;
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /// Dispose resources. Call when the service is no longer needed.
  void dispose() {
    _speech.cancel();
    _isListening = false;
  }
}
