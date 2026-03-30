import 'package:go_router/go_router.dart';
import '../../features/onboarding/splash_screen.dart';
import '../../features/onboarding/language_screen.dart';
import '../../features/onboarding/who_setting_up_screen.dart';
import '../../features/onboarding/emotional_checkin_screen.dart';
import '../../features/onboarding/what_helps_screen.dart';
import '../../features/onboarding/quick_profile_screen.dart';
import '../../features/onboarding/privacy_screen.dart';
import '../../features/onboarding/welcome_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/symptom_logger/symptom_logger_screen.dart';
import '../../features/pain_diary/pain_diary_screen.dart';
import '../../features/pain_diary/report_generator_screen.dart';
import '../../features/medication_tracker/medication_tracker_screen.dart';
import '../../features/learn/learn_screen.dart';
import '../../features/learn/learn_module_screen.dart';
import '../../features/breathe/breathe_screen.dart';
import '../../features/breathe/breathe_player_screen.dart';
import '../../features/journey/journey_screen.dart';
import '../../features/caregiver/caregiver_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/notifications/notification_screen.dart';
import '../../features/community/community_screen.dart';
import '../../features/community/community_channel_screen.dart';
import '../../features/community/community_post_screen.dart';
import '../../features/community/community_compose_screen.dart';
import '../../features/learn/learn_library_screen.dart';
import '../../features/learn/learn_disease_detail_screen.dart';
import '../../features/learn/learn_search_screen.dart';
import '../../features/learn/learn_faq_screen.dart';
import '../../features/breathe/breathe_programs_screen.dart';
import '../../features/breathe/breathe_history_screen.dart';
import '../../features/caregiver/caregiver_home_screen.dart';
import '../../features/caregiver/caregiver_journal_screen.dart';
import '../../features/caregiver/caregiver_burnout_screen.dart';
import '../../features/caregiver/care_coordination_screen.dart';
import '../../features/caregiver/visitor_log_screen.dart';
import '../../features/caregiver/emergency_protocols_screen.dart';
import '../../features/caregiver/respite_finder_screen.dart';
import '../../features/caregiver/financial_resources_screen.dart';
import '../../features/caregiver/grief_resources_screen.dart';
import '../../features/voice/voice_screen.dart';
import '../../features/voice/voice_journal_screen.dart';
import '../../features/voice/comfort_audio_screen.dart';

/// PalliCare route path constants.
class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String onboardingLanguage = '/onboarding/language';
  static const String onboardingWho = '/onboarding/who';
  static const String onboardingEmotional = '/onboarding/emotional';
  static const String onboardingHelps = '/onboarding/helps';
  static const String onboardingProfile = '/onboarding/profile';
  static const String onboardingPrivacy = '/onboarding/privacy';
  static const String onboardingWelcome = '/onboarding/welcome';
  static const String home = '/home';
  static const String symptomLogger = '/symptom-logger';
  static const String painDiary = '/pain-diary';
  static const String painReport = '/pain-report';
  static const String medicationTracker = '/medication-tracker';
  static const String learn = '/learn';
  static const String learnModule = '/learn/module';
  static const String breathe = '/breathe';
  static const String breathePlayer = '/breathe/player';
  static const String journey = '/journey';
  static const String caregiver = '/caregiver';
  static const String settings = '/settings';
  static const String doctorReport = '/doctor-report';
  static const String notifications = '/notifications';
  static const String community = '/community';
  static const String communityChannel = '/community/channel';
  static const String communityPost = '/community/post';
  static const String communityCompose = '/community/compose';
  static const String breathePrograms = '/breathe/programs';
  static const String breatheHistory = '/breathe/history';
  static const String learnLibrary = '/learn/library';
  static const String learnDiseaseDetail = '/learn/library/disease';
  static const String learnSearch = '/learn/search';
  static const String learnFaq = '/learn/faq';

  // Voice Module
  static const String voice = '/voice';
  static const String voiceJournal = '/voice/journal';
  static const String comfortAudio = '/voice/comfort-audio';

  // Caregiver Mode
  static const String caregiverHome = '/caregiver/home';
  static const String caregiverJournal = '/caregiver/journal';
  static const String caregiverBurnout = '/caregiver/burnout';
  static const String caregiverTasks = '/caregiver/tasks';
  static const String caregiverVisitors = '/caregiver/visitors';
  static const String caregiverEmergency = '/caregiver/emergency';
  static const String caregiverRespite = '/caregiver/respite';
  static const String caregiverFinancial = '/caregiver/financial';
  static const String caregiverGrief = '/caregiver/grief';
}

/// GoRouter configuration with Sprint 1 + Sprint 2 screens wired.
final GoRouter appRouter = GoRouter(
  initialLocation: AppRoutes.splash,
  routes: [
    GoRoute(
      path: AppRoutes.splash,
      builder: (_, __) => const SplashScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingLanguage,
      builder: (_, __) => const LanguageScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingWho,
      builder: (_, __) => const WhoSettingUpScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingEmotional,
      builder: (_, __) => const EmotionalCheckinScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingHelps,
      builder: (_, __) => const WhatHelpsScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingProfile,
      builder: (_, __) => const QuickProfileScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingPrivacy,
      builder: (_, __) => const PrivacyScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingWelcome,
      builder: (_, __) => const WelcomeScreen(),
    ),
    GoRoute(
      path: AppRoutes.home,
      builder: (_, __) => const HomeScreen(),
    ),
    GoRoute(
      path: AppRoutes.symptomLogger,
      builder: (_, __) => const SymptomLoggerScreen(),
    ),
    GoRoute(
      path: AppRoutes.painDiary,
      builder: (_, __) => const PainDiaryScreen(),
    ),
    GoRoute(
      path: AppRoutes.painReport,
      builder: (_, __) => const ReportGeneratorScreen(),
    ),
    GoRoute(
      path: AppRoutes.medicationTracker,
      builder: (_, __) => const MedicationTrackerScreen(),
    ),
    // Sprint 2: Learn module
    GoRoute(
      path: AppRoutes.learn,
      builder: (_, __) => const LearnScreen(),
    ),
    // Sprint 2: Breathe & Comfort module
    GoRoute(
      path: AppRoutes.breathe,
      builder: (_, __) => const BreatheScreen(),
    ),
    GoRoute(
      path: AppRoutes.breathePlayer,
      builder: (_, __) => const BreathePlayerScreen(),
    ),
    // Sprint 2: Learn module detail (receives moduleId via extra)
    GoRoute(
      path: AppRoutes.learnModule,
      builder: (_, state) {
        final moduleId = state.extra as String? ?? '';
        return LearnModuleScreen(moduleId: moduleId);
      },
    ),
    // Sprint 2: My Journey
    GoRoute(
      path: AppRoutes.journey,
      builder: (_, __) => const JourneyScreen(),
    ),
    // Sprint 2: Caregiver Hub
    GoRoute(
      path: AppRoutes.caregiver,
      builder: (_, __) => const CaregiverScreen(),
    ),
    // Sprint 4: Settings & Profile
    GoRoute(
      path: AppRoutes.settings,
      builder: (_, __) => const SettingsScreen(),
    ),
    // Sprint 4: Notification Center
    GoRoute(
      path: AppRoutes.notifications,
      builder: (_, __) => const NotificationScreen(),
    ),
    // Community Forum
    GoRoute(
      path: AppRoutes.community,
      builder: (_, __) => const CommunityScreen(),
    ),
    GoRoute(
      path: AppRoutes.communityChannel,
      builder: (_, state) {
        final channelId = state.extra as String? ?? '';
        return CommunityChannelScreen(channelId: channelId);
      },
    ),
    GoRoute(
      path: AppRoutes.communityPost,
      builder: (_, state) {
        final postId = state.extra as String? ?? '';
        return CommunityPostScreen(postId: postId);
      },
    ),
    GoRoute(
      path: AppRoutes.communityCompose,
      builder: (_, state) {
        final channelId = state.extra as String? ?? '';
        return CommunityComposeScreen(channelId: channelId);
      },
    ),
    // Breathing Programs & History
    GoRoute(
      path: AppRoutes.breathePrograms,
      builder: (_, __) => const BreatheProgramsScreen(),
    ),
    GoRoute(
      path: AppRoutes.breatheHistory,
      builder: (_, __) => const BreatheHistoryScreen(),
    ),
    // Psychoeducation Library
    GoRoute(
      path: AppRoutes.learnLibrary,
      builder: (_, __) => const LearnLibraryScreen(),
    ),
    GoRoute(
      path: AppRoutes.learnDiseaseDetail,
      builder: (_, state) {
        final diseaseId = state.extra as String? ?? '';
        return LearnDiseaseDetailScreen(diseaseId: diseaseId);
      },
    ),
    GoRoute(
      path: AppRoutes.learnSearch,
      builder: (_, __) => const LearnSearchScreen(),
    ),
    GoRoute(
      path: AppRoutes.learnFaq,
      builder: (_, __) => const LearnFaqScreen(),
    ),
    // Voice Module
    GoRoute(
      path: AppRoutes.voice,
      builder: (_, __) => const VoiceScreen(),
    ),
    GoRoute(
      path: AppRoutes.voiceJournal,
      builder: (_, __) => const VoiceJournalScreen(),
    ),
    GoRoute(
      path: AppRoutes.comfortAudio,
      builder: (_, __) => const ComfortAudioScreen(),
    ),
    // Caregiver Mode Enhancement
    GoRoute(
      path: AppRoutes.caregiverHome,
      builder: (_, __) => const CaregiverHomeScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverJournal,
      builder: (_, __) => const CaregiverJournalScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverBurnout,
      builder: (_, __) => const CaregiverBurnoutScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverTasks,
      builder: (_, __) => const CareCoordinationScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverVisitors,
      builder: (_, __) => const VisitorLogScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverEmergency,
      builder: (_, __) => const EmergencyProtocolsScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverRespite,
      builder: (_, __) => const RespiteFinderScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverFinancial,
      builder: (_, __) => const FinancialResourcesScreen(),
    ),
    GoRoute(
      path: AppRoutes.caregiverGrief,
      builder: (_, __) => const GriefResourcesScreen(),
    ),
  ],
);
