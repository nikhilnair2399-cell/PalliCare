import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/progress_dots.dart';
import '../../widgets/pallicare_button.dart';
import 'onboarding_provider.dart';

class WhatHelpsScreen extends ConsumerWidget {
  const WhatHelpsScreen({super.key});

  static const _topics = [
    {'id': 'track_pain', 'emoji': '📊', 'en': 'Track my pain'},
    {'id': 'manage_meds', 'emoji': '💊', 'en': 'Manage medications'},
    {'id': 'talk_team', 'emoji': '🩺', 'en': 'Talk to care team'},
    {'id': 'relief', 'emoji': '🧘', 'en': 'Relief techniques'},
    {'id': 'help_family', 'emoji': '👨‍👩‍👧', 'en': 'Help my family'},
    {'id': 'understand', 'emoji': '📖', 'en': 'Understand condition'},
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
              const SizedBox(height: 20),
              ProgressDots(
                currentStep: 3,
                totalSteps: state.totalSteps,
                label: 'Step 3 of ${state.totalSteps}',
              ),
              const SizedBox(height: 32),
              Text(
                l.onboardingHelpTitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                l.onboardingHelpSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.1,
                  ),
                  itemCount: _topics.length,
                  itemBuilder: (context, i) {
                    final topic = _topics[i];
                    final selected =
                        state.helpTopics.contains(topic['id']);
                    return GestureDetector(
                      onTap: () => ref
                          .read(onboardingProvider.notifier)
                          .toggleHelpTopic(topic['id']!),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusCard),
                          border: Border.all(
                            color: selected
                                ? AppColors.sageGreen
                                : Colors.grey.shade200,
                            width: selected ? 2.5 : 1,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(topic['emoji']!,
                                style: const TextStyle(fontSize: 32)),
                            const SizedBox(height: 8),
                            Text(
                              topic['en']!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            if (selected) ...[
                              const SizedBox(height: 6),
                              const Icon(Icons.check_circle,
                                  color: AppColors.sageGreen, size: 20),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              PalliCareButton(
                label: l.onboardingHelpContinue(state.helpTopics.length),
                onPressed: state.helpTopics.isNotEmpty
                    ? () {
                        ref.read(onboardingProvider.notifier).nextStep();
                        context.push('/onboarding/profile');
                      }
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
