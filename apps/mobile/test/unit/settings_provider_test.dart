import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/settings/settings_provider.dart';

void main() {
  group('UserProfile', () {
    test('initials from two-word name', () {
      expect(mockProfile.initials, 'RK'); // Ramesh Kumar
    });

    test('initials from single-word name', () {
      const profile = UserProfile(
        name: 'Priya',
        nameHi: '',
        age: 30,
        gender: 'Female',
        diagnosis: '',
        diagnosisHi: '',
        hospital: '',
        doctor: '',
        abhaLinked: false,
        abhaNumber: '',
        phone: '',
        email: '',
      );
      expect(profile.initials, 'P');
    });

    test('mock profile has expected values', () {
      expect(mockProfile.name, 'Ramesh Kumar');
      expect(mockProfile.age, 62);
      expect(mockProfile.hospital, 'AIIMS Bhopal');
      expect(mockProfile.abhaLinked, true);
    });
  });

  group('SettingsState', () {
    test('default values are correct', () {
      const state = SettingsState();
      expect(state.language, 'hi');
      expect(state.dualLanguage, true);
      expect(state.darkMode, false);
      expect(state.darkModePreference, 'auto');
      expect(state.loggingMode, 'full');
      expect(state.medReminders, true);
      expect(state.morningCheckin, true);
      expect(state.eveningCheckin, true);
      expect(state.educationNudges, true);
      expect(state.goalReminders, true);
      expect(state.wellnessTips, true);
      expect(state.visitReminders, true);
      expect(state.quietHoursEnabled, true);
      expect(state.highContrast, false);
      expect(state.reduceMotion, false);
      expect(state.voiceInput, true);
      expect(state.hapticFeedback, true);
      expect(state.appSounds, true);
      expect(state.textSizeIndex, 1);
      expect(state.lockScreenDetail, 'minimal');
      expect(state.hasChanges, false);
    });

    test('textSizeLabel returns correct labels', () {
      expect(const SettingsState(textSizeIndex: 0).textSizeLabel, 'Small');
      expect(const SettingsState(textSizeIndex: 1).textSizeLabel, 'Default');
      expect(const SettingsState(textSizeIndex: 2).textSizeLabel, 'Large');
      expect(
          const SettingsState(textSizeIndex: 3).textSizeLabel, 'Extra Large');
      expect(const SettingsState(textSizeIndex: 99).textSizeLabel, 'Default');
    });

    test('copyWith preserves unchanged fields', () {
      const state = SettingsState(language: 'en', darkMode: true);
      final updated = state.copyWith(language: 'hi');
      expect(updated.language, 'hi');
      expect(updated.darkMode, true); // preserved
    });

    test('quiet hours have correct defaults', () {
      const state = SettingsState();
      expect(state.quietHoursStart, const TimeOfDay(hour: 22, minute: 0));
      expect(state.quietHoursEnd, const TimeOfDay(hour: 7, minute: 0));
    });

    test('check-in times have correct defaults', () {
      const state = SettingsState();
      expect(state.morningCheckinTime, const TimeOfDay(hour: 9, minute: 0));
      expect(state.eveningCheckinTime, const TimeOfDay(hour: 19, minute: 0));
    });
  });

  group('SettingsNotifier', () {
    late SettingsNotifier notifier;

    setUp(() {
      notifier = SettingsNotifier();
    });

    test('initial state has no changes', () {
      expect(notifier.state.hasChanges, false);
    });

    // -- Language --

    test('setLanguage updates language and marks changes', () {
      notifier.setLanguage('en');
      expect(notifier.state.language, 'en');
      expect(notifier.state.hasChanges, true);
    });

    test('toggleDualLanguage updates and marks changes', () {
      notifier.toggleDualLanguage(false);
      expect(notifier.state.dualLanguage, false);
      expect(notifier.state.hasChanges, true);
    });

    // -- Appearance --

    test('setDarkMode updates dark mode', () {
      notifier.setDarkMode(true);
      expect(notifier.state.darkMode, true);
      expect(notifier.state.hasChanges, true);
    });

    test('setDarkModePreference sets on/off/auto', () {
      notifier.setDarkModePreference('on');
      expect(notifier.state.darkModePreference, 'on');
      expect(notifier.state.darkMode, true);

      notifier.setDarkModePreference('off');
      expect(notifier.state.darkModePreference, 'off');
      expect(notifier.state.darkMode, false);

      notifier.setDarkModePreference('auto');
      expect(notifier.state.darkModePreference, 'auto');
      expect(notifier.state.darkMode, false); // auto defaults to off
    });

    // -- Logging --

    test('setLoggingMode updates mode', () {
      notifier.setLoggingMode('quick');
      expect(notifier.state.loggingMode, 'quick');
      expect(notifier.state.hasChanges, true);
    });

    // -- Notifications --

    test('toggle notification preferences', () {
      notifier.toggleMedReminders(false);
      expect(notifier.state.medReminders, false);

      notifier.toggleMorningCheckin(false);
      expect(notifier.state.morningCheckin, false);

      notifier.toggleEveningCheckin(false);
      expect(notifier.state.eveningCheckin, false);

      notifier.toggleEducationNudges(false);
      expect(notifier.state.educationNudges, false);

      notifier.toggleGoalReminders(false);
      expect(notifier.state.goalReminders, false);

      notifier.toggleWellnessTips(false);
      expect(notifier.state.wellnessTips, false);

      notifier.toggleVisitReminders(false);
      expect(notifier.state.visitReminders, false);
    });

    test('set check-in times', () {
      const morning = TimeOfDay(hour: 7, minute: 30);
      const evening = TimeOfDay(hour: 20, minute: 0);

      notifier.setMorningCheckinTime(morning);
      expect(notifier.state.morningCheckinTime, morning);

      notifier.setEveningCheckinTime(evening);
      expect(notifier.state.eveningCheckinTime, evening);
    });

    // -- Quiet Hours --

    test('toggle and set quiet hours', () {
      notifier.toggleQuietHours(false);
      expect(notifier.state.quietHoursEnabled, false);

      const start = TimeOfDay(hour: 23, minute: 0);
      const end = TimeOfDay(hour: 6, minute: 0);

      notifier.setQuietHoursStart(start);
      expect(notifier.state.quietHoursStart, start);

      notifier.setQuietHoursEnd(end);
      expect(notifier.state.quietHoursEnd, end);
    });

    // -- Accessibility --

    test('toggle accessibility settings', () {
      notifier.toggleHighContrast(true);
      expect(notifier.state.highContrast, true);

      notifier.toggleReduceMotion(true);
      expect(notifier.state.reduceMotion, true);

      notifier.toggleVoiceInput(false);
      expect(notifier.state.voiceInput, false);

      notifier.toggleHapticFeedback(false);
      expect(notifier.state.hapticFeedback, false);

      notifier.toggleAppSounds(false);
      expect(notifier.state.appSounds, false);
    });

    test('setTextSizeIndex updates text size', () {
      notifier.setTextSizeIndex(3);
      expect(notifier.state.textSizeIndex, 3);
      expect(notifier.state.textSizeLabel, 'Extra Large');
    });

    // -- Privacy --

    test('setLockScreenDetail updates detail level', () {
      notifier.setLockScreenDetail('hidden');
      expect(notifier.state.lockScreenDetail, 'hidden');
    });

    // -- Save --

    test('markSaved resets hasChanges to false', () {
      notifier.setLanguage('en'); // triggers hasChanges = true
      expect(notifier.state.hasChanges, true);

      notifier.markSaved();
      expect(notifier.state.hasChanges, false);
    });
  });
}
