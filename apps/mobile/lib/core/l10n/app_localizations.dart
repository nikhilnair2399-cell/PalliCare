import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// PalliCare localization class that loads translations from ARB files.
///
/// Supports runtime locale switching between English and Hindi.
/// Usage: `AppLocalizations.of(context).appName`
class AppLocalizations {
  final Locale locale;
  late Map<String, String> _localizedStrings;

  AppLocalizations(this.locale);

  /// Helper to access localizations from any widget context.
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  /// Delegate for MaterialApp.localizationsDelegates
  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// Supported locales for PalliCare.
  static const List<Locale> supportedLocales = [
    Locale('en'),
    Locale('hi'),
  ];

  /// Load the ARB JSON file for the current locale.
  Future<bool> load() async {
    final jsonString = await rootBundle
        .loadString('assets/l10n/app_${locale.languageCode}.arb');
    final Map<String, dynamic> jsonMap = json.decode(jsonString);

    _localizedStrings = {};
    jsonMap.forEach((key, value) {
      if (!key.startsWith('@') && value is String) {
        _localizedStrings[key] = value;
      }
    });

    return true;
  }

  /// Get a translated string by key.
  String translate(String key) {
    return _localizedStrings[key] ?? key;
  }

  /// Get a translated string with positional parameter replacement.
  /// Replaces `{paramName}` with the provided value.
  String translateWithArgs(String key, Map<String, String> args) {
    var text = translate(key);
    args.forEach((paramKey, paramValue) {
      text = text.replaceAll('{$paramKey}', paramValue);
    });
    return text;
  }

  // ---------------------------------------------------------------------------
  // CONVENIENCE GETTERS — most commonly used strings
  // ---------------------------------------------------------------------------

  String get appName => translate('appName');
  String get appTagline => translate('appTagline');

  // Common
  String get commonContinue => translate('commonContinue');
  String get commonCancel => translate('commonCancel');
  String get commonDone => translate('commonDone');
  String get commonSave => translate('commonSave');
  String get commonBack => translate('commonBack');
  String get commonNext => translate('commonNext');
  String get commonSkip => translate('commonSkip');
  String get commonYes => translate('commonYes');
  String get commonNo => translate('commonNo');
  String get commonOk => translate('commonOk');
  String get commonRetry => translate('commonRetry');
  String get commonClose => translate('commonClose');
  String get commonLoading => translate('commonLoading');
  String get commonError => translate('commonError');
  String get commonNoData => translate('commonNoData');
  String get commonToday => translate('commonToday');

  // Navigation
  String get navHome => translate('navHome');
  String get navPainDiary => translate('navPainDiary');
  String get navLogSymptom => translate('navLogSymptom');
  String get navMedications => translate('navMedications');
  String get navSettings => translate('navSettings');
  String get navLearn => translate('navLearn');
  String get navBreathe => translate('navBreathe');
  String get navJourney => translate('navJourney');
  String get navCaregiver => translate('navCaregiver');
  String get navNotifications => translate('navNotifications');

  // Pain
  String get painTitle => translate('painTitle');
  String get painIntensity => translate('painIntensity');
  String get painNone => translate('painNone');
  String get painMild => translate('painMild');
  String get painModerate => translate('painModerate');
  String get painSevere => translate('painSevere');
  String get painWorst => translate('painWorst');
  String get painLocation => translate('painLocation');
  String get painQualities => translate('painQualities');
  String get painBreakthrough => translate('painBreakthrough');

  // Medications
  String get medTitle => translate('medTitle');
  String get medScheduled => translate('medScheduled');
  String get medPRN => translate('medPRN');
  String get medTaken => translate('medTaken');
  String get medMissed => translate('medMissed');
  String get medSkipped => translate('medSkipped');
  String get medPending => translate('medPending');
  String get medAdherence => translate('medAdherence');
  String get medMEDD => translate('medMEDD');

  // Settings
  String get settingsTitle => translate('settingsTitle');
  String get settingsLanguage => translate('settingsLanguage');
  String get settingsDarkMode => translate('settingsDarkMode');
  String get settingsNotifications => translate('settingsNotifications');
  String get settingsAccessibility => translate('settingsAccessibility');
  String get settingsPrivacy => translate('settingsPrivacy');

  // Notifications
  String get notifTitle => translate('notifTitle');
  String get notifEmpty => translate('notifEmpty');
  String get notifMarkAllRead => translate('notifMarkAllRead');

  // Offline
  String get offlineBanner => translate('offlineBanner');
  String get offlineSyncing => translate('offlineSyncing');
  String get offlineSynced => translate('offlineSynced');

  // Errors
  String get errorNetwork => translate('errorNetwork');
  String get errorServer => translate('errorServer');
  String get errorUnknown => translate('errorUnknown');
}

/// Localizations delegate that loads and provides [AppLocalizations].
class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'hi'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    final localizations = AppLocalizations(locale);
    await localizations.load();
    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
