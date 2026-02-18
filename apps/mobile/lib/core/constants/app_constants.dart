/// App-wide constants for PalliCare patient mobile app.
class AppConstants {
  AppConstants._();

  // ---------------------------------------------------------------------------
  // APP IDENTITY
  // ---------------------------------------------------------------------------

  static const String appName = 'PalliCare';
  static const String appTaglineEn =
      'Compassionate Pain Management for Every Patient';
  static const String appTaglineHi =
      '\u0939\u0930 \u092E\u0930\u0940\u091C\u093C \u0915\u0947 \u0932\u093F\u090F \u0926\u0930\u094D\u0926 \u0938\u0947 \u0930\u093E\u0939\u0924, \u092A\u094D\u092F\u093E\u0930 \u0938\u0947';
  static const String appVersion = '1.0.0';
  static const int appBuildNumber = 1;

  // ---------------------------------------------------------------------------
  // LOCALIZATION
  // ---------------------------------------------------------------------------

  /// Supported locales: English (India) and Hindi.
  static const String localeEnglish = 'en';
  static const String localeHindi = 'hi';
  static const String defaultLocale = localeEnglish;
  static const String countryCode = 'IN';

  static const List<String> supportedLocales = [localeEnglish, localeHindi];

  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------

  /// OTP length (digits).
  static const int otpLength = 6;

  /// Maximum OTP requests per 10-minute window.
  static const int maxOtpRequestsPer10Min = 3;

  /// OTP validity in seconds.
  static const int otpExpirySeconds = 300; // 5 minutes

  /// Indian phone number prefix.
  static const String phonePrefix = '+91';

  /// Phone number regex pattern.
  static const String phonePattern = r'^\+91[0-9]{10}$';

  // ---------------------------------------------------------------------------
  // PAIN & SYMPTOM SCALE
  // ---------------------------------------------------------------------------

  /// NRS pain scale minimum.
  static const int painScaleMin = 0;

  /// NRS pain scale maximum.
  static const int painScaleMax = 10;

  /// Pain score threshold where text switches to white on buttons.
  static const int painLightTextThreshold = 6;

  /// ESAS (Edmonton Symptom Assessment System) max score.
  static const int esasMax = 10;

  /// Maximum text length for free-text notes.
  static const int maxNoteLength = 2000;

  // ---------------------------------------------------------------------------
  // MOOD
  // ---------------------------------------------------------------------------

  static const List<String> moodOptions = [
    'great',
    'good',
    'okay',
    'low',
    'distressed',
  ];

  // ---------------------------------------------------------------------------
  // SLEEP
  // ---------------------------------------------------------------------------

  static const List<String> sleepQualityOptions = ['well', 'okay', 'poorly'];

  // ---------------------------------------------------------------------------
  // MEDICATION
  // ---------------------------------------------------------------------------

  /// Maximum number of active medications a patient can track.
  static const int maxActiveMedications = 30;

  // ---------------------------------------------------------------------------
  // FILE UPLOAD
  // ---------------------------------------------------------------------------

  /// Max file upload size in bytes (10 MB).
  static const int maxFileUploadBytes = 10 * 1024 * 1024;

  /// Allowed image MIME types.
  static const List<String> allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  /// Allowed audio MIME types (voice notes).
  static const List<String> allowedAudioTypes = [
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
  ];

  // ---------------------------------------------------------------------------
  // ANIMATION DURATIONS (ms)
  // ---------------------------------------------------------------------------

  static const int motionInstant = 100;
  static const int motionFast = 150;
  static const int motionNormal = 200;
  static const int motionSlow = 300;

  /// Breathing exercise phase range (per phase).
  static const int breathePhaseMin = 4000;
  static const int breathePhaseMax = 8000;

  /// Toast / snackbar auto-dismiss duration.
  static const int toastDuration = 4000;

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------

  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // ---------------------------------------------------------------------------
  // ACCESSIBILITY
  // ---------------------------------------------------------------------------

  /// Minimum touch target in dp (exceeds WCAG 2.5.5).
  static const double minTouchTargetDp = 48;

  /// Maximum font scale supported without layout breakage.
  static const double maxFontScale = 2.0;

  /// Maximum line length in characters (mobile).
  static const int maxLineLengthMobile = 65;

  // ---------------------------------------------------------------------------
  // DATE & TIME FORMATTING
  // ---------------------------------------------------------------------------

  static const String dateFormat = 'dd MMM yyyy';
  static const String timeFormat12 = 'hh:mm a';
  static const String timeFormat24 = 'HH:mm';
  static const String dateTimeFormat = 'dd MMM yyyy, hh:mm a';
}
