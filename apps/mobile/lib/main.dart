import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // TODO: Initialize Firebase
  // await Firebase.initializeApp();

  // TODO: Initialize Hive for offline storage
  // await Hive.initFlutter();

  runApp(
    const ProviderScope(
      child: PalliCareApp(),
    ),
  );
}

class PalliCareApp extends StatelessWidget {
  const PalliCareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'PalliCare',
      debugShowCheckedModeBanner: false,

      // Theme
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,

      // Routing
      routerConfig: appRouter,

      // Localization
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'IN'), // English (India)
        Locale('hi', 'IN'), // Hindi (India)
      ],
      locale: const Locale('en', 'IN'),
    );
  }
}
