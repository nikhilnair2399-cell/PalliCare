import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/local_storage_service.dart';

// ---------------------------------------------------------------------------
// USER PROFILE MODEL
// ---------------------------------------------------------------------------

/// Mock user profile data shown in the Settings screen profile card.
class UserProfile {
  final String name;
  final String nameHi;
  final int age;
  final String gender;
  final String diagnosis;
  final String diagnosisHi;
  final String hospital;
  final String doctor;
  final bool abhaLinked;
  final String abhaNumber;
  final String phone;
  final String email;

  const UserProfile({
    required this.name,
    required this.nameHi,
    required this.age,
    required this.gender,
    required this.diagnosis,
    required this.diagnosisHi,
    required this.hospital,
    required this.doctor,
    required this.abhaLinked,
    required this.abhaNumber,
    required this.phone,
    required this.email,
  });

  /// Initials derived from the English name (first letters of first two words).
  String get initials {
    final parts = name.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '';
  }
}

/// Hard-coded mock profile for demo purposes.
const UserProfile mockProfile = UserProfile(
  name: 'Ramesh Kumar',
  nameHi: '\u0930\u092E\u0947\u0936 \u0915\u0941\u092E\u093E\u0930',
  age: 62,
  gender: 'Male',
  diagnosis: 'Advanced Lung Cancer (Stage IV)',
  diagnosisHi:
      '\u090F\u0921\u0935\u093E\u0902\u0938\u094D\u0921 \u092B\u0947\u092B\u0921\u093C\u0947 \u0915\u093E \u0915\u0948\u0902\u0938\u0930 (\u0938\u094D\u091F\u0947\u091C IV)',
  hospital: 'AIIMS Bhopal',
  doctor: 'Dr. Ananya Sharma',
  abhaLinked: true,
  abhaNumber: '91-1234-5678-9012',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@email.com',
);

// ---------------------------------------------------------------------------
// SETTINGS STATE
// ---------------------------------------------------------------------------

class SettingsState {
  // Language
  final String language;
  final bool dualLanguage;

  // Appearance
  final bool darkMode;
  final String darkModePreference; // 'off', 'on', 'auto'

  // Logging
  final String loggingMode; // 'quick', 'full'

  // Notification preferences
  final bool medReminders;
  final bool morningCheckin;
  final bool eveningCheckin;
  final TimeOfDay morningCheckinTime;
  final TimeOfDay eveningCheckinTime;
  final bool educationNudges;
  final bool goalReminders;
  final bool wellnessTips;
  final bool visitReminders;

  // Quiet hours
  final bool quietHoursEnabled;
  final TimeOfDay quietHoursStart;
  final TimeOfDay quietHoursEnd;

  // Accessibility
  final bool highContrast;
  final bool reduceMotion;
  final bool voiceInput;
  final bool hapticFeedback;
  final bool appSounds;
  final int textSizeIndex; // 0=small, 1=default, 2=large, 3=extraLarge

  // Privacy
  final String lockScreenDetail; // 'full', 'minimal', 'hidden'

  // Track whether any change has been made (for Done button visibility)
  final bool hasChanges;

  const SettingsState({
    this.language = 'hi',
    this.dualLanguage = true,
    this.darkMode = false,
    this.darkModePreference = 'auto',
    this.loggingMode = 'full',
    this.medReminders = true,
    this.morningCheckin = true,
    this.eveningCheckin = true,
    this.morningCheckinTime = const TimeOfDay(hour: 9, minute: 0),
    this.eveningCheckinTime = const TimeOfDay(hour: 19, minute: 0),
    this.educationNudges = true,
    this.goalReminders = true,
    this.wellnessTips = true,
    this.visitReminders = true,
    this.quietHoursEnabled = true,
    this.quietHoursStart = const TimeOfDay(hour: 22, minute: 0),
    this.quietHoursEnd = const TimeOfDay(hour: 7, minute: 0),
    this.highContrast = false,
    this.reduceMotion = false,
    this.voiceInput = true,
    this.hapticFeedback = true,
    this.appSounds = true,
    this.textSizeIndex = 1,
    this.lockScreenDetail = 'minimal',
    this.hasChanges = false,
  });

  SettingsState copyWith({
    String? language,
    bool? dualLanguage,
    bool? darkMode,
    String? darkModePreference,
    String? loggingMode,
    bool? medReminders,
    bool? morningCheckin,
    bool? eveningCheckin,
    TimeOfDay? morningCheckinTime,
    TimeOfDay? eveningCheckinTime,
    bool? educationNudges,
    bool? goalReminders,
    bool? wellnessTips,
    bool? visitReminders,
    bool? quietHoursEnabled,
    TimeOfDay? quietHoursStart,
    TimeOfDay? quietHoursEnd,
    bool? highContrast,
    bool? reduceMotion,
    bool? voiceInput,
    bool? hapticFeedback,
    bool? appSounds,
    int? textSizeIndex,
    String? lockScreenDetail,
    bool? hasChanges,
  }) {
    return SettingsState(
      language: language ?? this.language,
      dualLanguage: dualLanguage ?? this.dualLanguage,
      darkMode: darkMode ?? this.darkMode,
      darkModePreference: darkModePreference ?? this.darkModePreference,
      loggingMode: loggingMode ?? this.loggingMode,
      medReminders: medReminders ?? this.medReminders,
      morningCheckin: morningCheckin ?? this.morningCheckin,
      eveningCheckin: eveningCheckin ?? this.eveningCheckin,
      morningCheckinTime: morningCheckinTime ?? this.morningCheckinTime,
      eveningCheckinTime: eveningCheckinTime ?? this.eveningCheckinTime,
      educationNudges: educationNudges ?? this.educationNudges,
      goalReminders: goalReminders ?? this.goalReminders,
      wellnessTips: wellnessTips ?? this.wellnessTips,
      visitReminders: visitReminders ?? this.visitReminders,
      quietHoursEnabled: quietHoursEnabled ?? this.quietHoursEnabled,
      quietHoursStart: quietHoursStart ?? this.quietHoursStart,
      quietHoursEnd: quietHoursEnd ?? this.quietHoursEnd,
      highContrast: highContrast ?? this.highContrast,
      reduceMotion: reduceMotion ?? this.reduceMotion,
      voiceInput: voiceInput ?? this.voiceInput,
      hapticFeedback: hapticFeedback ?? this.hapticFeedback,
      appSounds: appSounds ?? this.appSounds,
      textSizeIndex: textSizeIndex ?? this.textSizeIndex,
      lockScreenDetail: lockScreenDetail ?? this.lockScreenDetail,
      hasChanges: hasChanges ?? this.hasChanges,
    );
  }

  /// Human-readable label for the current text size index.
  String get textSizeLabel {
    switch (textSizeIndex) {
      case 0:
        return 'Small';
      case 1:
        return 'Default';
      case 2:
        return 'Large';
      case 3:
        return 'Extra Large';
      default:
        return 'Default';
    }
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class SettingsNotifier extends StateNotifier<SettingsState> {
  final LocalStorageService _storage = LocalStorageService();

  SettingsNotifier() : super(const SettingsState()) {
    _loadPersistedSettings();
  }

  void _loadPersistedSettings() {
    final lang = _storage.language;
    if (lang != state.language) {
      state = state.copyWith(language: lang);
    }
  }

  // -- Language ---------------------------------------------------------------

  void setLanguage(String lang) {
    state = state.copyWith(language: lang, hasChanges: true);
    _storage.setLanguage(lang);
  }

  void toggleDualLanguage(bool value) {
    state = state.copyWith(dualLanguage: value, hasChanges: true);
  }

  // -- Appearance -------------------------------------------------------------

  void setDarkMode(bool value) {
    state = state.copyWith(darkMode: value, hasChanges: true);
  }

  void setDarkModePreference(String pref) {
    state = state.copyWith(
      darkModePreference: pref,
      darkMode: pref == 'on',
      hasChanges: true,
    );
  }

  // -- Logging ----------------------------------------------------------------

  void setLoggingMode(String mode) {
    state = state.copyWith(loggingMode: mode, hasChanges: true);
  }

  // -- Notifications ----------------------------------------------------------

  void toggleMedReminders(bool value) {
    state = state.copyWith(medReminders: value, hasChanges: true);
  }

  void toggleMorningCheckin(bool value) {
    state = state.copyWith(morningCheckin: value, hasChanges: true);
  }

  void toggleEveningCheckin(bool value) {
    state = state.copyWith(eveningCheckin: value, hasChanges: true);
  }

  void setMorningCheckinTime(TimeOfDay time) {
    state = state.copyWith(morningCheckinTime: time, hasChanges: true);
  }

  void setEveningCheckinTime(TimeOfDay time) {
    state = state.copyWith(eveningCheckinTime: time, hasChanges: true);
  }

  void toggleEducationNudges(bool value) {
    state = state.copyWith(educationNudges: value, hasChanges: true);
  }

  void toggleGoalReminders(bool value) {
    state = state.copyWith(goalReminders: value, hasChanges: true);
  }

  void toggleWellnessTips(bool value) {
    state = state.copyWith(wellnessTips: value, hasChanges: true);
  }

  void toggleVisitReminders(bool value) {
    state = state.copyWith(visitReminders: value, hasChanges: true);
  }

  // -- Quiet Hours ------------------------------------------------------------

  void toggleQuietHours(bool value) {
    state = state.copyWith(quietHoursEnabled: value, hasChanges: true);
  }

  void setQuietHoursStart(TimeOfDay time) {
    state = state.copyWith(quietHoursStart: time, hasChanges: true);
  }

  void setQuietHoursEnd(TimeOfDay time) {
    state = state.copyWith(quietHoursEnd: time, hasChanges: true);
  }

  // -- Accessibility ----------------------------------------------------------

  void toggleHighContrast(bool value) {
    state = state.copyWith(highContrast: value, hasChanges: true);
  }

  void toggleReduceMotion(bool value) {
    state = state.copyWith(reduceMotion: value, hasChanges: true);
  }

  void toggleVoiceInput(bool value) {
    state = state.copyWith(voiceInput: value, hasChanges: true);
  }

  void toggleHapticFeedback(bool value) {
    state = state.copyWith(hapticFeedback: value, hasChanges: true);
  }

  void toggleAppSounds(bool value) {
    state = state.copyWith(appSounds: value, hasChanges: true);
  }

  void setTextSizeIndex(int index) {
    state = state.copyWith(textSizeIndex: index, hasChanges: true);
  }

  // -- Privacy ----------------------------------------------------------------

  void setLockScreenDetail(String detail) {
    state = state.copyWith(lockScreenDetail: detail, hasChanges: true);
  }

  // -- Save -------------------------------------------------------------------

  /// Mark changes as saved (hides the Done button).
  void markSaved() {
    state = state.copyWith(hasChanges: false);
  }
}

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, SettingsState>(
  (ref) => SettingsNotifier(),
);
