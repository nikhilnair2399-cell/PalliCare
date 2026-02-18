import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';
import 'breathe_exercise_card.dart';
import 'sound_selector.dart';

/// Breathe & Comfort home screen — Screen 07.
///
/// Sections:
/// 1. Quick Start
/// 2. Breathing Exercises (horizontal scroll)
/// 3. Pranayama (horizontal scroll)
/// 4. Guided Meditations (horizontal scroll)
/// 5. Relaxation (horizontal scroll)
/// 6. Ambient Sounds (horizontal pills)
/// 7. Practice Stats
class BreatheScreen extends ConsumerWidget {
  const BreatheScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
        title: Column(
          children: [
            const Text(
              'Breathe & Comfort',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.teal,
              ),
            ),
            Text(
              '\u0938\u093E\u0901\u0938 \u0914\u0930 \u0906\u0930\u093E\u092E',
              style: TextStyle(
                fontSize: 12,
                color: AppColors.charcoalLight,
              ),
            ),
          ],
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
              const SizedBox(height: AppSpacing.space6),

              // 2. Breathing Exercises
              _SectionHeader(
                titleEn: 'Breathing Exercises',
                titleHi: '\u0936\u094D\u0935\u093E\u0938 \u0905\u092D\u094D\u092F\u093E\u0938',
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.breathingExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 3. Pranayama
              _SectionHeader(
                titleEn: 'Pranayama',
                titleHi: '\u092A\u094D\u0930\u093E\u0923\u093E\u092F\u093E\u092E',
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.pranayamaExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 4. Guided Meditations
              _SectionHeader(
                titleEn: 'Guided Meditations',
                titleHi: '\u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0924 \u0927\u094D\u092F\u093E\u0928',
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.meditationExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 5. Relaxation
              _SectionHeader(
                titleEn: 'Relaxation',
                titleHi: '\u0935\u093F\u0936\u094D\u0930\u093E\u092E',
              ),
              const SizedBox(height: AppSpacing.space3),
              _ExerciseRow(
                exercises: breatheState.relaxationExercises,
                onSelect: (ex) => _openExercise(context, ref, ex),
              ),
              const SizedBox(height: AppSpacing.space6),

              // 6. Ambient Sounds
              _SectionHeader(
                titleEn: 'Ambient Sounds',
                titleHi: '\u092A\u0930\u093F\u0935\u0947\u0936 \u0927\u094D\u0935\u0928\u093F',
              ),
              const SizedBox(height: AppSpacing.space3),
              SoundSelector(
                selected: breatheState.session.bgSound,
                onChanged: (sound) {
                  ref.read(breatheProvider.notifier).setBgSound(sound);
                },
              ),
              const SizedBox(height: AppSpacing.space6),

              // 7. Practice Stats
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
                    const Text(
                      '1-Minute Calm',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '\u090F\u0915 \u092E\u093F\u0928\u091F \u0915\u0940 \u0936\u093E\u0902\u0924\u093F',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.8),
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tap to start',
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
  final String titleEn;
  final String titleHi;
  const _SectionHeader({required this.titleEn, required this.titleHi});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.screenPaddingHorizontal,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            titleEn,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.charcoal,
            ),
          ),
          Text(
            titleHi,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.charcoalLight,
            ),
          ),
        ],
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
// 7. Practice Stats Card
// ---------------------------------------------------------------------------

class _PracticeStatsCard extends StatelessWidget {
  final PracticeStats stats;
  const _PracticeStatsCard({required this.stats});

  @override
  Widget build(BuildContext context) {
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
              '${stats.sessionsThisWeek} sessions this week',
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
              '${stats.totalMinutesThisWeek} min total',
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
