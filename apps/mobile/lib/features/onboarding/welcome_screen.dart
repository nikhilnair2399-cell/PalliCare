import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'onboarding_provider.dart';

class WelcomeScreen extends ConsumerWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final state = ref.watch(onboardingProvider);
    final name = state.patientFirstName.isNotEmpty
        ? state.patientFirstName
        : 'there';

    return Scaffold(
      backgroundColor: AppColors.warmCream,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(flex: 2),

              // Breathing circle placeholder
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.sageGreen.withAlpha(30),
                  ),
                  child: const Icon(
                    Icons.spa_rounded,
                    size: 48,
                    color: AppColors.sageGreen,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              Text(
                l.welcomeGreeting(name),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                l.welcomeSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  height: 1.6,
                  color: Colors.grey.shade700,
                ),
              ),
              if (state.emotionalState == EmotionalState.toughDay) ...[
                const SizedBox(height: 12),
                Text(
                  l.welcomeToughDayMessage,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 15,
                    fontStyle: FontStyle.italic,
                    color: AppColors.deepTeal.withAlpha(160),
                  ),
                ),
              ],

              const Spacer(),

              // Primary action
              GestureDetector(
                onTap: () {
                  ref.read(onboardingProvider.notifier).completeOnboarding();
                  context.go('/home');
                },
                child: Container(
                  height: 120,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.sageGreen, AppColors.deepTeal],
                    ),
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusHero),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        l.welcomePrimaryAction,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        l.welcomePrimaryActionHint,
                        style: const TextStyle(fontSize: 14, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Secondary actions
              Row(
                children: [
                  Expanded(
                    child: _secondaryCard(
                      '🧘',
                      l.welcomeSecondaryBreath,
                      () {
                        ref
                            .read(onboardingProvider.notifier)
                            .completeOnboarding();
                        context.go('/home');
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _secondaryCard(
                      '📖',
                      l.welcomeSecondaryExplore,
                      () {
                        ref
                            .read(onboardingProvider.notifier)
                            .completeOnboarding();
                        context.go('/home');
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Skip
              Center(
                child: TextButton(
                  onPressed: () {
                    ref
                        .read(onboardingProvider.notifier)
                        .completeOnboarding();
                    context.go('/home');
                  },
                  child: Text(
                    l.welcomeSkip,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _secondaryCard(String emoji, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 4),
            Text(label,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
