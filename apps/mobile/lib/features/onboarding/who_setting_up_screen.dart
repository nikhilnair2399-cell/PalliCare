import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/selection_card.dart';
import '../../widgets/progress_dots.dart';
import 'onboarding_provider.dart';

class WhoSettingUpScreen extends ConsumerWidget {
  const WhoSettingUpScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
              const Text(
                'Who is using this app today?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'आज यह ऐप कौन इस्तेमाल कर रहा है?',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: AppColors.deepTeal.withAlpha(180)),
              ),
              const SizedBox(height: 12),
              Text(
                'We want to create the right experience for you',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 36),
              SelectionCard(
                title: 'I am the patient',
                subtitle: 'मैं मरीज़ हूँ',
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
                title: "I'm helping someone set up",
                subtitle: 'मैं किसी की मदद कर रहा/रही हूँ',
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
                title: "We're doing this together",
                subtitle: 'हम साथ में कर रहे हैं',
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
