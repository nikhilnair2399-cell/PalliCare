import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/selection_card.dart';
import '../../widgets/progress_dots.dart';
import 'onboarding_provider.dart';

class EmotionalCheckinScreen extends ConsumerStatefulWidget {
  const EmotionalCheckinScreen({super.key});

  @override
  ConsumerState<EmotionalCheckinScreen> createState() =>
      _EmotionalCheckinScreenState();
}

class _EmotionalCheckinScreenState
    extends ConsumerState<EmotionalCheckinScreen> {
  bool _showThankYou = false;
  Timer? _autoAdvance;

  void _select(EmotionalState es) {
    ref.read(onboardingProvider.notifier).setEmotionalState(es);
    setState(() => _showThankYou = true);

    _autoAdvance = Timer(const Duration(milliseconds: 1500), () {
      if (mounted) _advance(es);
    });
  }

  void _advance(EmotionalState es) {
    ref.read(onboardingProvider.notifier).nextStep();
    if (es == EmotionalState.okay) {
      context.push('/onboarding/helps');
    } else {
      context.push('/onboarding/profile');
    }
  }

  @override
  void dispose() {
    _autoAdvance?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
                currentStep: 2,
                totalSteps: state.totalSteps,
                label: 'Step 2 of ${state.totalSteps}',
              ),
              const SizedBox(height: 48),
              const Text(
                'How are you feeling today?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'आज आप कैसा महसूस कर रहे हैं?',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 16, color: AppColors.deepTeal.withAlpha(180)),
              ),
              const SizedBox(height: 8),
              Text(
                'There are no right or wrong answers',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 36),
              SelectionCard(
                title: 'Doing okay',
                subtitle: 'ठीक हूँ',
                emoji: '😊',
                accentColor: AppColors.sageGreen,
                isSelected: state.emotionalState == EmotionalState.okay,
                onTap: () => _select(EmotionalState.okay),
              ),
              SelectionCard(
                title: 'A bit tired',
                subtitle: 'थोड़ा थका हुआ',
                emoji: '😐',
                accentColor: const Color(0xFFD9D4E7), // Lavender
                isSelected: state.emotionalState == EmotionalState.tired,
                onTap: () => _select(EmotionalState.tired),
              ),
              SelectionCard(
                title: 'Having a tough day',
                subtitle: 'मुश्किल दिन है',
                emoji: '😔',
                accentColor: const Color(0xFFD4856B), // Terra/coral
                isSelected: state.emotionalState == EmotionalState.toughDay,
                onTap: () => _select(EmotionalState.toughDay),
              ),
              const Spacer(),
              AnimatedOpacity(
                opacity: _showThankYou ? 1 : 0,
                duration: const Duration(milliseconds: 400),
                child: Column(
                  children: [
                    Text(
                      'Thank you for sharing that',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        fontStyle: FontStyle.italic,
                        color: AppColors.deepTeal.withAlpha(160),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'शुक्रिया कि आपने बताया',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.deepTeal.withAlpha(130),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextButton(
                      onPressed: () {
                        _autoAdvance?.cancel();
                        _advance(state.emotionalState!);
                      },
                      child: const Text('Continue →'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
