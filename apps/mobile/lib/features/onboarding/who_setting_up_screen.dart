import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/selection_card.dart';
import '../../widgets/progress_dots.dart';
import 'onboarding_provider.dart';

class WhoSettingUpScreen extends ConsumerWidget {
  const WhoSettingUpScreen({super.key});

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
              const SizedBox(height: 20),
              ProgressDots(
                currentStep: 1,
                totalSteps: state.totalSteps,
                label: 'Step 1 of ${state.totalSteps}',
              ),
              const SizedBox(height: 40),
              Text(
                l.onboardingWhoTitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                l.onboardingWhoSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 36),
              SelectionCard(
                title: l.onboardingWhoPatient,
                emoji: '🙂',
                accentColor: AppColors.sageGreen,
                isSelected: state.userType == UserType.patient,
                onTap: () {
                  ref.read(onboardingProvider.notifier).setUserType(UserType.patient);
                  ref.read(onboardingProvider.notifier).nextStep();
                  context.push('/onboarding/emotional');
                },
              ),
              SelectionCard(
                title: l.onboardingWhoCaregiver,
                emoji: '🤝',
                accentColor: const Color(0xFFD4856B), // Terra
                isSelected: state.userType == UserType.caregiver,
                onTap: () {
                  ref.read(onboardingProvider.notifier).setUserType(UserType.caregiver);
                  ref.read(onboardingProvider.notifier).nextStep();
                  context.push('/onboarding/emotional');
                },
              ),
              SelectionCard(
                title: l.onboardingWhoFamily,
                emoji: '👫',
                accentColor: const Color(0xFFE8A838), // Amber
                isSelected: state.userType == UserType.together,
                onTap: () {
                  ref.read(onboardingProvider.notifier).setUserType(UserType.together);
                  ref.read(onboardingProvider.notifier).nextStep();
                  context.push('/onboarding/emotional');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
