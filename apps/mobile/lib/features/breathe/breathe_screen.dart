import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/routing/app_router.dart';
import 'breathe_provider.dart';
import 'breathe_exercise_card.dart';
import 'sound_selector.dart';
import 'animation_style_selector.dart';

/// Breathe & Comfort home screen — Screen 07.
///
/// Sections:
/// 1. Quick Start
/// 1b. Programs & History quick links
/// 2. Breathing Exercises (horizontal scroll)
/// 3. Pranayama (horizontal scroll)
/// 4. Guided Meditations (horizontal scroll)
/// 5. Relaxation (horizontal scroll)
/// 6. Animation Style selector
/// 7. Ambient Sounds (horizontal pills)
/// 8. Practice Stats
class BreatheScreen extends ConsumerWidget {
  const BreatheScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final breatheState = ref.watch(breatheProvider);

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l.breatheTitle,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.teal,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: AppSpacing.space8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacing.space4),

              // 1. Quick Start
              _QuickStartCard(
                onTap: () {
                  ref.read(breatheProvider.notifier).quickStart();
                  context.push('/breathe/player');
                },
              ),
              const SizedBox(height: AppSpacing.space4),

              // 1b. Programs & History quick links
              _ProgramsHistoryRow(),
              const SizedBox(height: AppSpacing.space6),

              // 2. Breathing Exercises
              _SectionHeader(
                title: l.breatheBreathingExercises,
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.breathingExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 3. Pranayama
              _SectionHeader(
                title: l.breathePranayama,
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.pranayamaExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 4. Guided Meditations
              _SectionHeader(
                title: l.breatheGuidedMeditations,
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.meditationExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 5. Relaxation
              _SectionHeader(
                title: l.breatheRelaxation,
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.relaxationExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 6. Animation Style
              _SectionHeader(
                title: l.breatheAnimationStyle,
              ),
              const SizedBox(height: AppSpacing.space3),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.screenPaddingHorizontal,
                ),
                child: AnimationStyleSelector(
                  selected: breatheState.animationStyle,
                  onChanged: (style) {
                    ref.read(breatheProvider.notifier).setBreathAnimationStyle(style);
                  },
                ),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 7. Ambient Sounds
              _SectionHeader(
                title: l.breatheAmbientSounds,
              ),
              const SizedBox(height: AppSpacing.space3),
              SoundSelector(
                selected: breatheState.session.bgSound,
                onChanged: (sound) {
                  ref.read(breatheProvider.notifier).setBgSound(sound);
                },
              ),
              const SizedBox(height: AppSpacing.space6),

              // 8. Practice Stats
              _PracticeStatsCard(stats: breatheState.stats),
            ],
          ),
        ),
      ),
    );
  }

  void _openExercise(BuildContext context, WidgetRef ref, BreatheExercise ex) {
    ref.read(breatheProvider.notifier).selectExercise(ex);
    context.push('/breathe/player');
  }
}

// ---------------------------------------------------------------------------
// 1. Quick Start Card
// ---------------------------------------------------------------------------

class _QuickStartCard extends StatelessWidget {
  final VoidCallback onTap;
  const _QuickStartCard({required this.onTap});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.screenPaddingHorizontal,
      ),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.sage, AppColors.teal],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
            boxShadow: [
              BoxShadow(
                color: AppColors.sage.withValues(alpha: 0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l.breatheQuickStartTitle,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      l.breatheQuickStartTap,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.2),
                ),
                child: const Icon(
                  Icons.play_arrow_rounded,
                  color: Colors.white,
                  size: 32,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.screenPaddingHorizontal,
      ),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppColors.charcoal,
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Horizontal exercise row
// ---------------------------------------------------------------------------

class _ExerciseRow extends StatelessWidget {
  final List<BreatheExercise> exercises;
  final ValueChanged<BreatheExercise> onSelect;

  const _ExerciseRow({required this.exercises, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 140,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.screenPaddingHorizontal,
        ),
        itemCount: exercises.length,
        separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.space3),
        itemBuilder: (context, index) {
          final ex = exercises[index];
          return BreatheExerciseCard(
            exercise: ex,
            onTap: () => onSelect(ex),
          );
        },
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 1b. Programs & History Quick Links
// ---------------------------------------------------------------------------

class _ProgramsHistoryRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.screenPaddingHorizontal,
      ),
      child: Row(
        children: [
          Expanded(
            child: _QuickLinkCard(
              icon: Icons.auto_awesome,
              label: l.breathePrograms,
              color: AppColors.lavender,
              onTap: () => context.push(AppRoutes.breathePrograms),
            ),
          ),
          const SizedBox(width: AppSpacing.space3),
          Expanded(
            child: _QuickLinkCard(
              icon: Icons.history,
              label: l.breatheHistory,
              color: AppColors.sage,
              onTap: () => context.push(AppRoutes.breatheHistory),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickLinkCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickLinkCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.space3,
        ),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: AppSpacing.space2),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.teal,
                ),
              ),
            ),
            Icon(Icons.chevron_right, color: color, size: 18),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 8. Practice Stats Card
// ---------------------------------------------------------------------------

class _PracticeStatsCard extends StatelessWidget {
  final PracticeStats stats;
  const _PracticeStatsCard({required this.stats});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.screenPaddingHorizontal,
      ),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.space3,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.self_improvement, size: 20, color: AppColors.sage),
            const SizedBox(width: AppSpacing.space2),
            Text(
              l.breatheStatsWeek(stats.sessionsThisWeek),
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.charcoal,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space2),
              child: Text(
                '\u00B7',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.charcoalLight,
                ),
              ),
            ),
            Text(
              l.breatheStatsMinutes(stats.totalMinutesThisWeek),
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.charcoal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
