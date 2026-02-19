import 'package:flutter/material.dart';
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
  ],
);
