import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/app_router.dart';
import 'core/l10n/app_localizations.dart';
import 'features/settings/settings_provider.dart';
import 'services/hive/hive_adapters.dart';
import 'services/sync_provider.dart';
import 'services/push_notification_service.dart';

/// Handle background messages (must be top-level function).
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  PushNotificationService.handleBackgroundMessage(message);
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for offline-first storage
  await initializeHive();

  // Initialize Firebase
  await Firebase.initializeApp();

  // Set up background message handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Initialize push notifications
  await PushNotificationService.instance.initialize();

  runApp(
    const ProviderScope(
      child: PalliCareApp(),
    ),
  );
}

class PalliCareApp extends ConsumerWidget {
  const PalliCareApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Initialize sync service on app start
    ref.watch(syncProvider);

    // Reactive locale from settings
    final settings = ref.watch(settingsProvider);
    final locale = Locale(settings.language, 'IN');

    return MaterialApp.router(
      title: 'PalliCare',
      debugShowCheckedModeBanner: false,

      // Theme
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,

      // Routing
      routerConfig: appRouter,

      // Localization — reactive via settingsProvider.language
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'IN'),
        Locale('hi', 'IN'),
      ],
      locale: locale,
    );
  }
}
