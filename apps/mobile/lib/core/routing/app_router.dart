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
  static const String breathe = '/breathe';
  static const String journey = '/journey';
  static const String caregiver = '/caregiver';
  static const String settings = '/settings';
  static const String doctorReport = '/doctor-report';
  static const String notifications = '/notifications';
}

/// GoRouter configuration with all Sprint 1 screens wired.
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
    // Placeholder routes for Sprint 2+
    GoRoute(
      path: AppRoutes.learn,
      builder: (_, __) => const _PlaceholderScreen(title: 'Learn'),
    ),
    GoRoute(
      path: AppRoutes.breathe,
      builder: (_, __) => const _PlaceholderScreen(title: 'Breathe'),
    ),
    GoRoute(
      path: AppRoutes.journey,
      builder: (_, __) => const _PlaceholderScreen(title: 'My Journey'),
    ),
    GoRoute(
      path: AppRoutes.caregiver,
      builder: (_, __) => const _PlaceholderScreen(title: 'Caregiver Hub'),
    ),
    GoRoute(
      path: AppRoutes.settings,
      builder: (_, __) => const _PlaceholderScreen(title: 'Settings'),
    ),
  ],
);

/// Placeholder for screens not yet built (Sprint 2+).
class _PlaceholderScreen extends StatelessWidget {
  final String title;
  const _PlaceholderScreen({required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Text('$title — Coming in Sprint 2',
            style: const TextStyle(fontSize: 18, color: Colors.grey)),
      ),
    );
  }
}
