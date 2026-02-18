/// PalliCare route definitions for the patient mobile app.
///
/// This file defines named routes for all 10 patient-facing screens.
/// Replace the placeholder page classes with actual implementations once
/// the feature modules are built.
///
/// Intended for use with GoRouter, AutoRoute, or Navigator 2.0.
class AppRoutes {
  AppRoutes._();

  // ---------------------------------------------------------------------------
  // ROUTE PATH CONSTANTS
  // ---------------------------------------------------------------------------

  /// Splash / loading screen.
  static const String splash = '/';

  /// Onboarding flow (first launch).
  static const String onboarding = '/onboarding';

  /// OTP-based login.
  static const String login = '/login';

  /// Home (Today) — hero check-in card, daily summary.
  static const String home = '/home';

  /// Quick Symptom Logger — fast pain + mood entry.
  static const String symptomLogger = '/symptom-logger';

  /// Full Symptom Logger — body map, ESAS, triggers.
  static const String symptomLoggerFull = '/symptom-logger/full';

  /// Pain Diary / Journal — history list + detail view.
  static const String painDiary = '/pain-diary';

  /// Pain Diary single entry detail.
  static const String painDiaryDetail = '/pain-diary/:logId';

  /// Medication Tracker — schedule, adherence, MEDD.
  static const String medicationTracker = '/medication-tracker';

  /// Learn Module — education content, phase progress.
  static const String learn = '/learn';

  /// Learn Module — specific module detail.
  static const String learnModule = '/learn/:moduleId';

  /// Breathe Module — breathing exercises, coping tools.
  static const String breathe = '/breathe';

  /// My Journey — goals, gratitude, milestones, legacy.
  static const String journey = '/journey';

  /// Caregiver Hub — linked caregivers, proxy logging.
  static const String caregiver = '/caregiver';

  /// Settings — profile, language, notifications, accessibility.
  static const String settings = '/settings';

  /// Doctor Report — generate and share summary with clinician.
  static const String doctorReport = '/doctor-report';

  /// Notifications centre.
  static const String notifications = '/notifications';
}

// ---------------------------------------------------------------------------
// PLACEHOLDER: GoRouter configuration
// ---------------------------------------------------------------------------
//
// import 'package:go_router/go_router.dart';
//
// final GoRouter appRouter = GoRouter(
//   initialLocation: AppRoutes.splash,
//   routes: [
//     GoRoute(path: AppRoutes.splash,           builder: (_, __) => const SplashPage()),
//     GoRoute(path: AppRoutes.onboarding,       builder: (_, __) => const OnboardingPage()),
//     GoRoute(path: AppRoutes.login,            builder: (_, __) => const LoginPage()),
//     GoRoute(path: AppRoutes.home,             builder: (_, __) => const HomePage()),
//     GoRoute(path: AppRoutes.symptomLogger,    builder: (_, __) => const SymptomLoggerPage()),
//     GoRoute(path: AppRoutes.symptomLoggerFull,builder: (_, __) => const SymptomLoggerFullPage()),
//     GoRoute(path: AppRoutes.painDiary,        builder: (_, __) => const PainDiaryPage()),
//     GoRoute(path: AppRoutes.painDiaryDetail,  builder: (_, state) => PainDiaryDetailPage(logId: state.pathParameters['logId']!)),
//     GoRoute(path: AppRoutes.medicationTracker,builder: (_, __) => const MedicationTrackerPage()),
//     GoRoute(path: AppRoutes.learn,            builder: (_, __) => const LearnPage()),
//     GoRoute(path: AppRoutes.learnModule,      builder: (_, state) => LearnModulePage(moduleId: state.pathParameters['moduleId']!)),
//     GoRoute(path: AppRoutes.breathe,          builder: (_, __) => const BreathePage()),
//     GoRoute(path: AppRoutes.journey,          builder: (_, __) => const JourneyPage()),
//     GoRoute(path: AppRoutes.caregiver,        builder: (_, __) => const CaregiverPage()),
//     GoRoute(path: AppRoutes.settings,         builder: (_, __) => const SettingsPage()),
//     GoRoute(path: AppRoutes.doctorReport,     builder: (_, __) => const DoctorReportPage()),
//     GoRoute(path: AppRoutes.notifications,    builder: (_, __) => const NotificationsPage()),
//   ],
// );
