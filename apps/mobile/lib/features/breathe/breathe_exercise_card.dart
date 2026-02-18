import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// 120x140 exercise preview card used in horizontal scroll lists.
class BreatheExerciseCard extends StatelessWidget {
  final BreatheExercise exercise;
  final VoidCallback onTap;

  const BreatheExerciseCard({
    super.key,
    required this.exercise,
    required this.onTap,
  });

  Color _bgColor(ExerciseType type) {
    return switch (type) {
      ExerciseType.breathing => AppColors.sage.withValues(alpha: 0.12),
      ExerciseType.pranayama => AppColors.accentHighlight.withValues(alpha: 0.10),
      ExerciseType.meditation => AppColors.lavender.withValues(alpha: 0.30),
      ExerciseType.relaxation => AppColors.teal.withValues(alpha: 0.10),
    };
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 120,
        height: 140,
        padding: const EdgeInsets.all(AppSpacing.space3),
        decoration: BoxDecoration(
          color: _bgColor(exercise.type),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.border.withValues(alpha: 0.3),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              exercise.emoji,
              style: const TextStyle(fontSize: 24),
            ),
            const SizedBox(height: AppSpacing.space2),
            Expanded(
              child: Text(
                exercise.nameEn,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoal,
                  height: 1.3,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text(
              exercise.nameHi,
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.charcoalLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppSpacing.space1),
            Text(
              '${exercise.cycleDuration}s / cycle',
              style: const TextStyle(
                fontSize: 10,
                color: AppColors.charcoalLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
