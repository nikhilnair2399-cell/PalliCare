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
  // App
  // ---------------------------------------------------------------------------

  String get appName => translate('appName');
  String get appTagline => translate('appTagline');

  // ---------------------------------------------------------------------------
  // Common
  // ---------------------------------------------------------------------------

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
  String get commonDelete => translate('commonDelete');
  String get commonEdit => translate('commonEdit');
  String get commonLoading => translate('commonLoading');
  String get commonError => translate('commonError');
  String get commonNoData => translate('commonNoData');
  String get commonSearch => translate('commonSearch');
  String get commonToday => translate('commonToday');
  String get commonYesterday => translate('commonYesterday');
  String get commonTomorrow => translate('commonTomorrow');
  String get commonViewAll => translate('commonViewAll');
  String get commonSubmit => translate('commonSubmit');
  String get commonSelect => translate('commonSelect');
  String get commonShare => translate('commonShare');
  String get commonCopy => translate('commonCopy');
  String get commonRefresh => translate('commonRefresh');

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  String get navHome => translate('navHome');
  String get navToday => translate('navToday');
  String get navPainDiary => translate('navPainDiary');
  String get navLogSymptom => translate('navLogSymptom');
  String get navMedications => translate('navMedications');
  String get navMeds => translate('navMeds');
  String get navSettings => translate('navSettings');
  String get navLearn => translate('navLearn');
  String get navBreathe => translate('navBreathe');
  String get navJourney => translate('navJourney');
  String get navCaregiver => translate('navCaregiver');
  String get navNotifications => translate('navNotifications');
  String get navMore => translate('navMore');

  // ---------------------------------------------------------------------------
  // Onboarding
  // ---------------------------------------------------------------------------

  String get onboardingLanguageTitle => translate('onboardingLanguageTitle');
  String get onboardingLanguageSubtitle => translate('onboardingLanguageSubtitle');
  String get onboardingWhoTitle => translate('onboardingWhoTitle');
  String get onboardingWhoPatient => translate('onboardingWhoPatient');
  String get onboardingWhoCaregiver => translate('onboardingWhoCaregiver');
  String get onboardingWhoFamily => translate('onboardingWhoFamily');
  String get onboardingEmotionalTitle => translate('onboardingEmotionalTitle');
  String get onboardingEmotionalSubtitle => translate('onboardingEmotionalSubtitle');
  String get onboardingHelpTitle => translate('onboardingHelpTitle');
  String get onboardingHelpSubtitle => translate('onboardingHelpSubtitle');
  String get onboardingProfileTitle => translate('onboardingProfileTitle');
  String get onboardingProfileName => translate('onboardingProfileName');
  String get onboardingProfileAge => translate('onboardingProfileAge');
  String get onboardingProfileGender => translate('onboardingProfileGender');
  String get onboardingProfilePhone => translate('onboardingProfilePhone');
  String get onboardingPrivacyTitle => translate('onboardingPrivacyTitle');
  String get onboardingPrivacyBody => translate('onboardingPrivacyBody');
  String get onboardingPrivacyConsent => translate('onboardingPrivacyConsent');
  String get onboardingWelcomeTitle => translate('onboardingWelcomeTitle');
  String get onboardingWelcomeBody => translate('onboardingWelcomeBody');
  String get onboardingWelcomeStart => translate('onboardingWelcomeStart');

  // ---------------------------------------------------------------------------
  // Home
  // ---------------------------------------------------------------------------

  String get homeGreetingMorning => translate('homeGreetingMorning');
  String get homeGreetingAfternoon => translate('homeGreetingAfternoon');
  String get homeGreetingEvening => translate('homeGreetingEvening');
  String homeGreetingUser(String greeting, String name) =>
      translateWithArgs('homeGreetingUser', {'greeting': greeting, 'name': name});
  String get homeComfortScore => translate('homeComfortScore');
  String get homeQuickLog => translate('homeQuickLog');
  String get homeFullLog => translate('homeFullLog');
  String get homeBreakthroughLog => translate('homeBreakthroughLog');
  String get homeHeroTitle => translate('homeHeroTitle');
  String homeHeroSubtitle(String time, int score) =>
      translateWithArgs('homeHeroSubtitle', {'time': time, 'score': score.toString()});
  String get homeLogNow => translate('homeLogNow');
  String get homeMedTitle => translate('homeMedTitle');
  String get homeMedMorning => translate('homeMedMorning');
  String get homeMedAfternoon => translate('homeMedAfternoon');
  String homeMedicationsDue(int count) =>
      translateWithArgs('homeMedicationsDue', {'count': count.toString()});
  String homeLastLogged(String time) =>
      translateWithArgs('homeLastLogged', {'time': time});
  String get homeTodayGoal => translate('homeTodayGoal');
  String homeStreak(int days) =>
      translateWithArgs('homeStreak', {'days': days.toString()});
  String get homeComfortQuote => translate('homeComfortQuote');
  String get homeTryBreathing => translate('homeTryBreathing');

  // ---------------------------------------------------------------------------
  // Pain Assessment
  // ---------------------------------------------------------------------------

  String get painTitle => translate('painTitle');
  String get painIntensity => translate('painIntensity');
  String get painIntensityPrompt => translate('painIntensityPrompt');
  String get painNone => translate('painNone');
  String get painMild => translate('painMild');
  String get painModerate => translate('painModerate');
  String get painSevere => translate('painSevere');
  String get painWorst => translate('painWorst');
  String get painLocation => translate('painLocation');
  String get painLocationPrompt => translate('painLocationPrompt');
  String get painQualities => translate('painQualities');
  String get painQualityAching => translate('painQualityAching');
  String get painQualityBurning => translate('painQualityBurning');
  String get painQualitySharp => translate('painQualitySharp');
  String get painQualityStabbing => translate('painQualityStabbing');
  String get painQualityThrobbing => translate('painQualityThrobbing');
  String get painQualityTingling => translate('painQualityTingling');
  String get painQualityDull => translate('painQualityDull');
  String get painQualityCramping => translate('painQualityCramping');
  String get painQualityShooting => translate('painQualityShooting');
  String get painQualityRadiating => translate('painQualityRadiating');
  String get painAggravators => translate('painAggravators');
  String get painRelievers => translate('painRelievers');
  String get painBreakthrough => translate('painBreakthrough');
  String get painBreakthroughDesc => translate('painBreakthroughDesc');
  String get painNRS => translate('painNRS');
  String get painTrend => translate('painTrend');
  String get painDays7 => translate('painDays7');
  String get painDays30 => translate('painDays30');
  String get painDaysAll => translate('painDaysAll');
  String painScoreOutOf(int score) =>
      translateWithArgs('painScoreOutOf', {'score': score.toString()});

  // ---------------------------------------------------------------------------
  // Pain Diary
  // ---------------------------------------------------------------------------

  String get painDiaryTitle => translate('painDiaryTitle');
  String get painDiaryNoEntries => translate('painDiaryNoEntries');
  String get painDiaryExport => translate('painDiaryExport');
  String get painDiaryCalendar => translate('painDiaryCalendar');
  String get painDiaryList => translate('painDiaryList');
  String get painDiaryHeatmap => translate('painDiaryHeatmap');

  // ---------------------------------------------------------------------------
  // Doctor Report
  // ---------------------------------------------------------------------------

  String get reportTitle => translate('reportTitle');
  String get reportGenerate => translate('reportGenerate');
  String get reportDateRange => translate('reportDateRange');
  String get reportIncludePain => translate('reportIncludePain');
  String get reportIncludeMeds => translate('reportIncludeMeds');
  String get reportIncludeSymptoms => translate('reportIncludeSymptoms');
  String get reportIncludeMood => translate('reportIncludeMood');
  String get reportShare => translate('reportShare');
  String get reportDownload => translate('reportDownload');

  // ---------------------------------------------------------------------------
  // Medications
  // ---------------------------------------------------------------------------

  String get medTitle => translate('medTitle');
  String get medCurrentRegimen => translate('medCurrentRegimen');
  String get medScheduled => translate('medScheduled');
  String get medPRN => translate('medPRN');
  String get medDue => translate('medDue');
  String get medTaken => translate('medTaken');
  String get medTake => translate('medTake');
  String get medMissed => translate('medMissed');
  String get medSkipped => translate('medSkipped');
  String get medPending => translate('medPending');
  String get medTakeNow => translate('medTakeNow');
  String get medMarkTaken => translate('medMarkTaken');
  String get medMarkSkipped => translate('medMarkSkipped');
  String get medSkipReason => translate('medSkipReason');
  String get medAdherence => translate('medAdherence');
  String get medMEDD => translate('medMEDD');
  String get medMEDDLabel => translate('medMEDDLabel');
  String get medSideEffects => translate('medSideEffects');
  String get medPRNUsage => translate('medPRNUsage');
  String get medOpioid => translate('medOpioid');
  String get medNonOpioid => translate('medNonOpioid');
  String get medAdjuvant => translate('medAdjuvant');
  String medDoseTime(String dose, String time) =>
      translateWithArgs('medDoseTime', {'dose': dose, 'time': time});

  // ---------------------------------------------------------------------------
  // Symptoms
  // ---------------------------------------------------------------------------

  String get symptomTitle => translate('symptomTitle');
  String get symptomMood => translate('symptomMood');
  String get symptomMoodHappy => translate('symptomMoodHappy');
  String get symptomMoodCalm => translate('symptomMoodCalm');
  String get symptomMoodAnxious => translate('symptomMoodAnxious');
  String get symptomMoodSad => translate('symptomMoodSad');
  String get symptomMoodAngry => translate('symptomMoodAngry');
  String get symptomSleep => translate('symptomSleep');
  String get symptomSleepGood => translate('symptomSleepGood');
  String get symptomSleepFair => translate('symptomSleepFair');
  String get symptomSleepPoor => translate('symptomSleepPoor');
  String get symptomSleepHours => translate('symptomSleepHours');
  String get symptomNausea => translate('symptomNausea');
  String get symptomFatigue => translate('symptomFatigue');
  String get symptomAppetite => translate('symptomAppetite');
  String get symptomConstipation => translate('symptomConstipation');
  String get symptomBreathlessness => translate('symptomBreathlessness');
  String get symptomAnxiety => translate('symptomAnxiety');
  String get symptomDepression => translate('symptomDepression');
  String get symptomDrowsiness => translate('symptomDrowsiness');
  String get symptomWellbeing => translate('symptomWellbeing');
  String get symptomNotes => translate('symptomNotes');
  String get symptomNotesHint => translate('symptomNotesHint');
  String get symptomLogSaved => translate('symptomLogSaved');
  String get symptomLogSubmitted => translate('symptomLogSubmitted');

  // ---------------------------------------------------------------------------
  // ESAS
  // ---------------------------------------------------------------------------

  String get esasTitle => translate('esasTitle');
  String get esasInstruction => translate('esasInstruction');

  // ---------------------------------------------------------------------------
  // Learn
  // ---------------------------------------------------------------------------

  String get learnTitle => translate('learnTitle');
  String get learnModules => translate('learnModules');
  String learnProgress(int percent) =>
      translateWithArgs('learnProgress', {'percent': percent.toString()});
  String learnMinutes(int minutes) =>
      translateWithArgs('learnMinutes', {'minutes': minutes.toString()});
  String get learnCompleted => translate('learnCompleted');
  String get learnLocked => translate('learnLocked');
  String get learnContinue => translate('learnContinue');
  String get learnLibrary => translate('learnLibrary');

  // ---------------------------------------------------------------------------
  // Breathe
  // ---------------------------------------------------------------------------

  String get breatheTitle => translate('breatheTitle');
  String get breatheDescription => translate('breatheDescription');
  String get breathe478 => translate('breathe478');
  String get breatheBox => translate('breatheBox');
  String get breathePranayama => translate('breathePranayama');
  String get breatheCalm => translate('breatheCalm');
  String get breatheInhale => translate('breatheInhale');
  String get breatheHold => translate('breatheHold');
  String get breatheExhale => translate('breatheExhale');
  String get breatheRest => translate('breatheRest');
  String get breatheStart => translate('breatheStart');
  String get breathePause => translate('breathePause');
  String get breatheResume => translate('breatheResume');
  String get breatheComplete => translate('breatheComplete');
  String breatheSessionMinutes(int minutes) =>
      translateWithArgs('breatheSessionMinutes', {'minutes': minutes.toString()});
  String breatheCycles(int count) =>
      translateWithArgs('breatheCycles', {'count': count.toString()});

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  String get journeyTitle => translate('journeyTitle');
  String get journeyTimeline => translate('journeyTimeline');
  String get journeyMilestones => translate('journeyMilestones');
  String get journeyGoals => translate('journeyGoals');
  String journeyDaysLogged(int count) =>
      translateWithArgs('journeyDaysLogged', {'count': count.toString()});
  String get journeySetGoal => translate('journeySetGoal');
  String get journeyGoalPlaceholder => translate('journeyGoalPlaceholder');
  String get journeyGratitude => translate('journeyGratitude');
  String get journeyGratitudePlaceholder => translate('journeyGratitudePlaceholder');
  String get journeyIntention => translate('journeyIntention');
  String get journeyIntentionPlaceholder => translate('journeyIntentionPlaceholder');
  String get journeyGoalCompleted => translate('journeyGoalCompleted');
  String journeyStreakDays(int count) =>
      translateWithArgs('journeyStreakDays', {'count': count.toString()});

  // ---------------------------------------------------------------------------
  // Community
  // ---------------------------------------------------------------------------

  String get communityTitle => translate('communityTitle');
  String get communitySubtitle => translate('communitySubtitle');
  String get communityJoin => translate('communityJoin');
  String get communityPost => translate('communityPost');
  String get communitySupport => translate('communitySupport');
  String get communityAnonymous => translate('communityAnonymous');
  String get communityLike => translate('communityLike');
  String get communityReply => translate('communityReply');
  String get communityReport => translate('communityReport');
  String get communityGuidelines => translate('communityGuidelines');
  String get communityEmpty => translate('communityEmpty');
  String get communityNewPost => translate('communityNewPost');
  String get communityPostPlaceholder => translate('communityPostPlaceholder');

  // ---------------------------------------------------------------------------
  // Caregiver
  // ---------------------------------------------------------------------------

  String get caregiverTitle => translate('caregiverTitle');
  String get caregiverDistress => translate('caregiverDistress');
  String get caregiverResources => translate('caregiverResources');
  String get caregiverSelfCare => translate('caregiverSelfCare');
  String get caregiverSOS => translate('caregiverSOS');
  String get caregiverPatientSummary => translate('caregiverPatientSummary');
  String caregiverSharedWith(String name) =>
      translateWithArgs('caregiverSharedWith', {'name': name});
  String get caregiverProxyLog => translate('caregiverProxyLog');
  String get caregiverWellnessCheck => translate('caregiverWellnessCheck');
  String get caregiverBurnoutWarning => translate('caregiverBurnoutWarning');

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------

  String get settingsTitle => translate('settingsTitle');
  String get settingsProfile => translate('settingsProfile');
  String get settingsLanguage => translate('settingsLanguage');
  String get settingsLanguageDesc => translate('settingsLanguageDesc');
  String get settingsHindi => translate('settingsHindi');
  String get settingsEnglish => translate('settingsEnglish');
  String get settingsDualLanguage => translate('settingsDualLanguage');
  String get settingsDualLanguageDesc => translate('settingsDualLanguageDesc');
  String get settingsAppearance => translate('settingsAppearance');
  String get settingsDarkMode => translate('settingsDarkMode');
  String get settingsDarkModeOff => translate('settingsDarkModeOff');
  String get settingsDarkModeOn => translate('settingsDarkModeOn');
  String get settingsDarkModeAuto => translate('settingsDarkModeAuto');
  String get settingsNotifications => translate('settingsNotifications');
  String get settingsMedReminders => translate('settingsMedReminders');
  String get settingsMorningCheckin => translate('settingsMorningCheckin');
  String get settingsEveningCheckin => translate('settingsEveningCheckin');
  String get settingsEducationNudges => translate('settingsEducationNudges');
  String get settingsGoalReminders => translate('settingsGoalReminders');
  String get settingsWellnessTips => translate('settingsWellnessTips');
  String get settingsVisitReminders => translate('settingsVisitReminders');
  String get settingsQuietHours => translate('settingsQuietHours');
  String get settingsQuietHoursDesc => translate('settingsQuietHoursDesc');
  String get settingsAccessibility => translate('settingsAccessibility');
  String get settingsHighContrast => translate('settingsHighContrast');
  String get settingsReduceMotion => translate('settingsReduceMotion');
  String get settingsVoiceInput => translate('settingsVoiceInput');
  String get settingsHapticFeedback => translate('settingsHapticFeedback');
  String get settingsAppSounds => translate('settingsAppSounds');
  String get settingsTextSize => translate('settingsTextSize');
  String get settingsTextSizeSmall => translate('settingsTextSizeSmall');
  String get settingsTextSizeDefault => translate('settingsTextSizeDefault');
  String get settingsTextSizeLarge => translate('settingsTextSizeLarge');
  String get settingsTextSizeExtraLarge => translate('settingsTextSizeExtraLarge');
  String get settingsPrivacy => translate('settingsPrivacy');
  String get settingsLockScreenDetail => translate('settingsLockScreenDetail');
  String get settingsLockScreenFull => translate('settingsLockScreenFull');
  String get settingsLockScreenMinimal => translate('settingsLockScreenMinimal');
  String get settingsLockScreenHidden => translate('settingsLockScreenHidden');
  String get settingsLogging => translate('settingsLogging');
  String get settingsLoggingMode => translate('settingsLoggingMode');
  String get settingsLoggingQuick => translate('settingsLoggingQuick');
  String get settingsLoggingFull => translate('settingsLoggingFull');
  String get settingsAbout => translate('settingsAbout');
  String get settingsVersion => translate('settingsVersion');
  String get settingsSupport => translate('settingsSupport');
  String get settingsDataExport => translate('settingsDataExport');
  String get settingsDataDelete => translate('settingsDataDelete');
  String get settingsLogout => translate('settingsLogout');
  String get settingsSaved => translate('settingsSaved');

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  String get notifTitle => translate('notifTitle');
  String get notifMarkAllRead => translate('notifMarkAllRead');
  String get notifEmpty => translate('notifEmpty');
  String get notifEmptyDesc => translate('notifEmptyDesc');
  String get notifCategoryAll => translate('notifCategoryAll');
  String get notifCategoryMedication => translate('notifCategoryMedication');
  String get notifCategoryCheckIn => translate('notifCategoryCheckIn');
  String get notifCategoryPain => translate('notifCategoryPain');
  String get notifCategoryEducation => translate('notifCategoryEducation');
  String get notifCategoryGoal => translate('notifCategoryGoal');
  String get notifCategoryWellness => translate('notifCategoryWellness');
  String get notifCategoryVisit => translate('notifCategoryVisit');
  String get notifCategoryMilestone => translate('notifCategoryMilestone');
  String get notifCategoryCaregiver => translate('notifCategoryCaregiver');
  String get notifCategorySystem => translate('notifCategorySystem');
  String get notifEarlier => translate('notifEarlier');

  // ---------------------------------------------------------------------------
  // Feedback
  // ---------------------------------------------------------------------------

  String get feedbackTitle => translate('feedbackTitle');
  String get feedbackPrompt => translate('feedbackPrompt');
  String get feedbackCategory => translate('feedbackCategory');
  String get feedbackCategoryBug => translate('feedbackCategoryBug');
  String get feedbackCategoryFeature => translate('feedbackCategoryFeature');
  String get feedbackCategoryPraise => translate('feedbackCategoryPraise');
  String get feedbackCategoryOther => translate('feedbackCategoryOther');
  String get feedbackComment => translate('feedbackComment');
  String get feedbackSubmit => translate('feedbackSubmit');
  String get feedbackThankYou => translate('feedbackThankYou');

  // ---------------------------------------------------------------------------
  // Offline / Sync
  // ---------------------------------------------------------------------------

  String get offlineBanner => translate('offlineBanner');
  String get offlineSyncing => translate('offlineSyncing');
  String get offlineSynced => translate('offlineSynced');
  String offlinePending(int count) =>
      translateWithArgs('offlinePending', {'count': count.toString()});
  String offlineConflict(int count) =>
      translateWithArgs('offlineConflict', {'count': count.toString()});
  String get offlineConflictTitle => translate('offlineConflictTitle');
  String get offlineConflictMessage => translate('offlineConflictMessage');
  String get offlineKeepLocal => translate('offlineKeepLocal');
  String get offlineKeepServer => translate('offlineKeepServer');
  String get offlineRetrying => translate('offlineRetrying');
  String get offlineSyncFailed => translate('offlineSyncFailed');
  String get offlineForceSync => translate('offlineForceSync');
  String offlineLastSync(String time) =>
      translateWithArgs('offlineLastSync', {'time': time});

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  String get authEnterPhone => translate('authEnterPhone');
  String get authSendOtp => translate('authSendOtp');
  String get authEnterOtp => translate('authEnterOtp');
  String get authVerify => translate('authVerify');
  String get authResendOtp => translate('authResendOtp');
  String authResendIn(int seconds) =>
      translateWithArgs('authResendIn', {'seconds': seconds.toString()});
  String get authPhoneHint => translate('authPhoneHint');
  String authOtpSent(String phone) =>
      translateWithArgs('authOtpSent', {'phone': phone});

  // ---------------------------------------------------------------------------
  // Voice
  // ---------------------------------------------------------------------------

  String get voiceTitle => translate('voiceTitle');
  String get voiceListening => translate('voiceListening');
  String get voiceProcessing => translate('voiceProcessing');
  String get voiceTapToSpeak => translate('voiceTapToSpeak');
  String get voiceNotAvailable => translate('voiceNotAvailable');
  String get voicePermissionNeeded => translate('voicePermissionNeeded');
  String get voiceLanguageHindi => translate('voiceLanguageHindi');
  String get voiceLanguageEnglish => translate('voiceLanguageEnglish');

  // ---------------------------------------------------------------------------
  // More Sheet
  // ---------------------------------------------------------------------------

  String get moreVoiceComfort => translate('moreVoiceComfort');
  String get moreBreatheComfort => translate('moreBreatheComfort');
  String get moreDiseaseLibrary => translate('moreDiseaseLibrary');
  String get morePainDiary => translate('morePainDiary');
  String get moreCaregiverHub => translate('moreCaregiverHub');

  // ---------------------------------------------------------------------------
  // Errors
  // ---------------------------------------------------------------------------

  String get errorNetwork => translate('errorNetwork');
  String get errorServer => translate('errorServer');
  String get errorTimeout => translate('errorTimeout');
  String get errorUnknown => translate('errorUnknown');
  String get errorRetry => translate('errorRetry');
  String get errorSessionExpired => translate('errorSessionExpired');
  String get errorPermission => translate('errorPermission');

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  String a11yPainSlider(int value) =>
      translateWithArgs('a11yPainSlider', {'value': value.toString()});
  String a11yMedTakeButton(String medication) =>
      translateWithArgs('a11yMedTakeButton', {'medication': medication});
  String a11yNotificationBadge(int count) =>
      translateWithArgs('a11yNotificationBadge', {'count': count.toString()});
  String get a11yNavBar => translate('a11yNavBar');
  String get a11yMoreMenu => translate('a11yMoreMenu');
  String get a11yCloseMenu => translate('a11yCloseMenu');
  String a11yConnectivityStatus(String status) =>
      translateWithArgs('a11yConnectivityStatus', {'status': status});
  String get a11yVoiceRecording => translate('a11yVoiceRecording');
  String get a11yBodyMap => translate('a11yBodyMap');

  // --- Medication Tracker (new) ---
  String get medTodayAdherence => translate('medTodayAdherence');
  String medAdherenceStatus(int taken, int pending) =>
      translateWithArgs('medAdherenceStatus', {'taken': taken.toString(), 'pending': pending.toString()});
  String get medSideEffectsWatch => translate('medSideEffectsWatch');

  // --- Pain Diary (new) ---
  String get painDiaryDailyLog => translate('painDiaryDailyLog');
  String get painDiary3Months => translate('painDiary3Months');

  // --- Learn (new) ---
  String get learnLibraryDesc => translate('learnLibraryDesc');
  String get learnFaqCorner => translate('learnFaqCorner');
  String get learnSearchTopics => translate('learnSearchTopics');
  String get learnRecommended => translate('learnRecommended');
  String get learnPaths => translate('learnPaths');
  String learnPathsDone(int completed, int total) =>
      translateWithArgs('learnPathsDone', {'completed': completed.toString(), 'total': total.toString()});
  String get learnPhase1Title => translate('learnPhase1Title');
  String get learnPhase2Title => translate('learnPhase2Title');
  String get learnPhase3Title => translate('learnPhase3Title');
  String get learnBrowseAll => translate('learnBrowseAll');
  String get learnAllTopics => translate('learnAllTopics');
  String get learnSensitiveTitle => translate('learnSensitiveTitle');
  String get learnSensitiveBody => translate('learnSensitiveBody');
  String get learnNotRightNow => translate('learnNotRightNow');
  String get learnImReady => translate('learnImReady');
  String learnLockedUnlocks(int days) =>
      translateWithArgs('learnLockedUnlocks', {'days': days});
  String get learnLockedSoon => translate('learnLockedSoon');
  String get learnSensitiveNotice => translate('learnSensitiveNotice');

  // --- Breathe (new) ---
  String get breatheQuickStartTitle => translate('breatheQuickStartTitle');
  String get breatheQuickStartTap => translate('breatheQuickStartTap');
  String get breathePrograms => translate('breathePrograms');
  String get breatheHistory => translate('breatheHistory');
  String get breatheBreathingExercises => translate('breatheBreathingExercises');
  String get breatheGuidedMeditations => translate('breatheGuidedMeditations');
  String get breatheRelaxation => translate('breatheRelaxation');
  String get breatheAnimationStyle => translate('breatheAnimationStyle');
  String get breatheAmbientSounds => translate('breatheAmbientSounds');
  String breatheStatsWeek(int sessions) =>
      translateWithArgs('breatheStatsWeek', {'sessions': sessions.toString()});
  String breatheStatsMinutes(int minutes) =>
      translateWithArgs('breatheStatsMinutes', {'minutes': minutes.toString()});

  // --- Journey (new) ---
  String get journeyGratitudeJournal => translate('journeyGratitudeJournal');
  String get journeyMyGoals => translate('journeyMyGoals');
  String get journeyLegacy => translate('journeyLegacy');
  String get journeyMyValues => translate('journeyMyValues');
  String get journeyMyValuesDesc => translate('journeyMyValuesDesc');
  String get journeyMessages => translate('journeyMessages');
  String get journeyMessagesDesc => translate('journeyMessagesDesc');
  String get journeyLifeStory => translate('journeyLifeStory');
  String get journeyLifeStoryDesc => translate('journeyLifeStoryDesc');
  String get journeyLegacyDesc => translate('journeyLegacyDesc');
  String get journeyImReady => translate('journeyImReady');
  String get journeyNotRightNow => translate('journeyNotRightNow');
  String get journeyStartWriting => translate('journeyStartWriting');

  // --- Community (new) ---
  String get communityBannerTitle => translate('communityBannerTitle');
  String get communityBannerDesc => translate('communityBannerDesc');
  String get communitySupportChannels => translate('communitySupportChannels');
  String get communityNeedHelp => translate('communityNeedHelp');

  // --- Caregiver (new) ---
  String get caregiverHome => translate('caregiverHome');
  String get caregiverBadge => translate('caregiverBadge');
  String caregiverCareLabel(String patient, String caregiver) =>
      translateWithArgs('caregiverCareLabel', {'patient': patient, 'caregiver': caregiver});
  String get caregiverModeLabel => translate('caregiverModeLabel');
  String get caregiverQuickActions => translate('caregiverQuickActions');
  String get caregiverJournal => translate('caregiverJournal');
  String get caregiverBurnout => translate('caregiverBurnout');
  String get caregiverTasks => translate('caregiverTasks');
  String get caregiverEmergency => translate('caregiverEmergency');
  String get caregiverMedManagement => translate('caregiverMedManagement');
  String get caregiverCommunity => translate('caregiverCommunity');
  String get caregiverTaskBoard => translate('caregiverTaskBoard');
  String get caregiverNoTasks => translate('caregiverNoTasks');
  String get caregiverAddTasks => translate('caregiverAddTasks');
  String caregiverViewAllTasks(int count) =>
      translateWithArgs('caregiverViewAllTasks', {'count': count.toString()});
  String get caregiverResourcesLabel => translate('caregiverResourcesLabel');
  String get caregiverFinancial => translate('caregiverFinancial');
  String get caregiverRespite => translate('caregiverRespite');
  String get caregiverGrief => translate('caregiverGrief');
  String caregiverMedsGiven(int given, int total) =>
      translateWithArgs('caregiverMedsGiven', {'given': given.toString(), 'total': total.toString()});

  // --- Symptom Logger (new) ---
  String get symptomCheckinTitle => translate('symptomCheckinTitle');
  String symptomPainLabel(int intensity) =>
      translateWithArgs('symptomPainLabel', {'intensity': intensity.toString()});
  String symptomLocationsMarked(int count) =>
      translateWithArgs('symptomLocationsMarked', {'count': count.toString()});
  String get symptomQuickSaveTip => translate('symptomQuickSaveTip');
  String get painIntensityQuestion => translate('painIntensityQuestion');
  String get painScaleMin => translate('painScaleMin');
  String get painScaleMax => translate('painScaleMax');
  String get bodyMapQuestion => translate('bodyMapQuestion');
  String bodyMapLocationsSelected(int count) =>
      translateWithArgs('bodyMapLocationsSelected', {'count': count.toString()});
  String get painQualityQuestion => translate('painQualityQuestion');
  String painQualitySelected(int count) =>
      translateWithArgs('painQualitySelected', {'count': count.toString()});
  String get triggersWorsensQuestion => translate('triggersWorsensQuestion');
  String get triggersHelpsQuestion => translate('triggersHelpsQuestion');
  String get esasQuestion => translate('esasQuestion');
  String get moodQuestion => translate('moodQuestion');
  String get sleepQualityQuestion => translate('sleepQualityQuestion');
  String get sleepHoursLabel => translate('sleepHoursLabel');
  String get notesQuestion => translate('notesQuestion');
  String get notesHintText => translate('notesHintText');
  String get notesPromptsLabel => translate('notesPromptsLabel');
  String get notesPrompt1 => translate('notesPrompt1');
  String get notesPrompt2 => translate('notesPrompt2');
  String get notesPrompt3 => translate('notesPrompt3');
  String get notesPrompt4 => translate('notesPrompt4');
  String get notesPrompt5 => translate('notesPrompt5');

  // --- Onboarding (new) ---
  String get onboardingLanguageTitle => translate('onboardingLanguageTitle');
  String get onboardingWhoTitle => translate('onboardingWhoTitle');
  String get onboardingWhoSubtitle => translate('onboardingWhoSubtitle');
  String get onboardingEmotionalTitle => translate('onboardingEmotionalTitle');
  String get onboardingEmotionalSubtitle => translate('onboardingEmotionalSubtitle');
  String get onboardingEmotionalThankYou => translate('onboardingEmotionalThankYou');
  String get onboardingHelpTitle => translate('onboardingHelpTitle');
  String get onboardingHelpSubtitle => translate('onboardingHelpSubtitle');
  String onboardingHelpContinue(int count) =>
      translateWithArgs('onboardingHelpContinue', {'count': count.toString()});
  String get onboardingProfileTitle => translate('onboardingProfileTitle');
  String get onboardingProfileSubtitle => translate('onboardingProfileSubtitle');
  String get onboardingProfileNameLabel => translate('onboardingProfileNameLabel');
  String get onboardingProfileNameHint => translate('onboardingProfileNameHint');
  String get onboardingProfilePhoneLabel => translate('onboardingProfilePhoneLabel');
  String get onboardingProfilePhoneHint => translate('onboardingProfilePhoneHint');
  String get onboardingProfileSendOtp => translate('onboardingProfileSendOtp');
  String get onboardingProfileOtpPrompt => translate('onboardingProfileOtpPrompt');
  String get validationNameRequired => translate('validationNameRequired');
  String get validationPhoneInvalid => translate('validationPhoneInvalid');
  String get validationOtpInvalid => translate('validationOtpInvalid');
  String onboardingOtpResendCountdown(int seconds) =>
      translateWithArgs('onboardingOtpResendCountdown', {'seconds': seconds.toString()});
  String get onboardingOtpResend => translate('onboardingOtpResend');
  String get onboardingOtpCallInstead => translate('onboardingOtpCallInstead');
  String get onboardingOtpVerified => translate('onboardingOtpVerified');
  String get onboardingPrivacyTitle => translate('onboardingPrivacyTitle');
  String get privacyDataEncrypted => translate('privacyDataEncrypted');
  String get privacyNoSell => translate('privacyNoSell');
  String get privacyYouChoose => translate('privacyYouChoose');
  String get privacyDeleteAnytime => translate('privacyDeleteAnytime');
  String get onboardingPrivacyConfirm => translate('onboardingPrivacyConfirm');
  String get privacyShowLess => translate('privacyShowLess');
  String get privacyShowMore => translate('privacyShowMore');
  String get privacyRightsTitle => translate('privacyRightsTitle');
  String welcomeGreeting(String name) =>
      translateWithArgs('welcomeGreeting', {'name': name});
  String get welcomeSubtitle => translate('welcomeSubtitle');
  String get welcomeToughDayMessage => translate('welcomeToughDayMessage');
  String get welcomePrimaryAction => translate('welcomePrimaryAction');
  String get welcomePrimaryActionHint => translate('welcomePrimaryActionHint');
  String get welcomeSecondaryBreath => translate('welcomeSecondaryBreath');
  String get welcomeSecondaryExplore => translate('welcomeSecondaryExplore');
  String get welcomeSkip => translate('welcomeSkip');

  // --- Settings (new) ---
  String get settingsLanguageLabel => translate('settingsLanguageLabel');
  String get settingsDualLanguageLabel => translate('settingsDualLanguageLabel');
  String get settingsDualLanguageHint => translate('settingsDualLanguageHint');
  String get settingsNotificationsLabel => translate('settingsNotificationsLabel');
  String get settingsMedRemindersLabel => translate('settingsMedRemindersLabel');
  String get settingsMorningCheckinLabel => translate('settingsMorningCheckinLabel');
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
