import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'breathe_provider.dart';
import 'breathe_program_card.dart';

/// Programs Screen — condition-specific multi-session breathing programs.
///
/// Layout:
///  [A] Description banner
///  [B] 4 program cards (Pain, Anxiety, Sleep, Breathlessness)
///  [C] Each card shows 3 sessions with progress
///
/// Spec: Feature 3 — Breathing Module Enhancement.
class BreatheProgramsScreen extends ConsumerWidget {
  const BreatheProgramsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final breatheState = ref.watch(breatheProvider);
    final programs = breatheState.programs;

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Breathing Programs',
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // [A] Banner
              _ProgramsBanner(),
              const SizedBox(height: AppSpacing.lg),

              // Section header
              Text(
                'Choose Your Program',
                style: AppTypography.heading3.copyWith(color: AppColors.teal),
              ),
              const SizedBox(height: 2),
              Text(
                '\u0905\u092A\u0928\u093E \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E \u091A\u0941\u0928\u0947\u0902',
                style: AppTypography.caption.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // [B] Program cards
              ...programs.map(
                (program) => Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: BreatheProgramCard(
                    program: program,
                    exercises: breatheState.exercises,
                    onSessionTap: (sessionIndex) {
                      ref
                          .read(breatheProvider.notifier)
                          .startProgramSession(program.id, sessionIndex);
                      Navigator.of(context).pop(); // Go back to player
                    },
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // Info note
              _InfoNote(),
              const SizedBox(height: AppSpacing.lg),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// PROGRAMS BANNER
// ---------------------------------------------------------------------------

class _ProgramsBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.sage.withValues(alpha: 0.15),
            AppColors.teal.withValues(alpha: 0.08),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        border: Border.all(
          color: AppColors.sage.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: AppColors.sage.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(14),
            ),
            alignment: Alignment.center,
            child: const Text('\ud83c\udf3f', style: TextStyle(fontSize: 28)),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Guided Breathing Programs',
                  style: AppTypography.heading4.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '3-session programs designed for specific conditions. '
                  'Complete them at your own pace.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.charcoalLight,
                    height: 1.4,
                  ),
                ),
                Text(
                  '\u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0938\u094D\u0925\u093F\u0924\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F 3-\u0938\u0924\u094D\u0930 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// INFO NOTE
// ---------------------------------------------------------------------------

class _InfoNote extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.info.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.info.withValues(alpha: 0.15)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, color: AppColors.info, size: 16),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              'Complete sessions in order for best results. Take breaks between sessions as needed.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
