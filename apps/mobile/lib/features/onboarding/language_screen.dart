import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pallicare_button.dart';
import 'onboarding_provider.dart';

class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});

  static const _languages = [
    {'code': 'hi', 'native': 'हिंदी', 'english': 'Hindi'},
    {'code': 'en', 'native': 'English', 'english': 'English'},
    {'code': 'bn', 'native': 'বাংলা', 'english': 'Bangla'},
    {'code': 'ta', 'native': 'தமிழ்', 'english': 'Tamil'},
    {'code': 'te', 'native': 'తెలుగు', 'english': 'Telugu'},
    {'code': 'mr', 'native': 'मराठी', 'english': 'Marathi'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final state = ref.watch(onboardingProvider);

    return Scaffold(
      backgroundColor: AppColors.warmCream,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Text(
                l.onboardingLanguageTitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 32),
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 2.4,
                  ),
                  itemCount: _languages.length,
                  itemBuilder: (context, i) {
                    final lang = _languages[i];
                    final selected = state.language == lang['code'];
                    return GestureDetector(
                      onTap: () => ref
                          .read(onboardingProvider.notifier)
                          .setLanguage(lang['code']!),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusCard),
                          border: Border.all(
                            color:
                                selected ? AppColors.sageGreen : Colors.grey.shade200,
                            width: selected ? 2.5 : 1,
                          ),
                          boxShadow: selected
                              ? [
                                  BoxShadow(
                                    color: AppColors.sageGreen.withAlpha(40),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  )
                                ]
                              : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              lang['native']!,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: selected
                                    ? AppColors.deepTeal
                                    : const Color(0xFF2D2D2D),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              lang['english']!,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                            if (selected) ...[
                              const SizedBox(height: 4),
                              const Icon(Icons.check_circle,
                                  color: AppColors.sageGreen, size: 18),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              PalliCareButton(
                label: l.commonContinue,
                onPressed: () {
                  ref.read(onboardingProvider.notifier).nextStep();
                  context.push('/onboarding/who');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
