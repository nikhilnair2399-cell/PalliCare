import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'learn_provider.dart';

/// Small card for module preview used in the horizontal "Recommended For You"
/// scroll (compact mode) and as a list row inside [LearnPathCard].
class LearnModuleCard extends StatelessWidget {
  final LearnModule module;
  final VoidCallback onTap;

  /// When `true`, renders as a 160x130dp horizontal scroll card.
  /// When `false`, renders as a full-width list row.
  final bool isCompact;

  const LearnModuleCard({
    super.key,
    required this.module,
    required this.onTap,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    return isCompact ? _buildCompactCard(context) : _buildListRow(context);
  }

  // ---------------------------------------------------------------------------
  // COMPACT CARD (horizontal scroll — 160 x 130dp)
  // ---------------------------------------------------------------------------

  Widget _buildCompactCard(BuildContext context) {
    final isLocked = module.status == ModuleStatus.locked;

    return GestureDetector(
      onTap: isLocked ? null : onTap,
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(AppSpacing.sm),
        decoration: BoxDecoration(
          color: isLocked ? AppColors.divider : AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Duration badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.sage.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
              ),
              child: Text(
                '${module.durationMinutes} min',
                style: AppTypography.caption.copyWith(
                  color: isLocked ? AppColors.textTertiary : AppColors.sage,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 6),
            // Title
            Text(
              module.titleEn,
              style: AppTypography.label.copyWith(
                color: isLocked ? AppColors.textTertiary : AppColors.teal,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              module.titleHi,
              style: AppTypography.caption.copyWith(
                color: isLocked ? AppColors.textTertiary : AppColors.charcoalLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const Spacer(),
            // Audio indicator
            if (module.hasAudio && !isLocked)
              Row(
                children: [
                  Icon(Icons.headphones,
                      size: 14, color: AppColors.sage.withValues(alpha: 0.7)),
                  const SizedBox(width: 4),
                  Text(
                    'Audio',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // LIST ROW (inside path card)
  // ---------------------------------------------------------------------------

  Widget _buildListRow(BuildContext context) {
    final isLocked = module.status == ModuleStatus.locked;

    return InkWell(
      onTap: isLocked ? null : onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        child: Row(
          children: [
            // Status icon
            _buildStatusIcon(module.status),
            const SizedBox(width: AppSpacing.sm),
            // Module info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${module.number}  ${module.titleEn}',
                    style: AppTypography.label.copyWith(
                      color: isLocked
                          ? AppColors.textTertiary
                          : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    module.titleHi,
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
            ),
            // Duration
            Text(
              '${module.durationMinutes} min',
              style: AppTypography.caption,
            ),
            const SizedBox(width: 8),
            // Progress indicator for in-progress modules
            if (module.status == ModuleStatus.inProgress)
              SizedBox(
                width: 32,
                height: 32,
                child: CircularProgressIndicator(
                  value: module.progress,
                  strokeWidth: 3,
                  backgroundColor: AppColors.border,
                  valueColor:
                      const AlwaysStoppedAnimation<Color>(AppColors.teal),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // STATUS ICON
  // ---------------------------------------------------------------------------

  static Widget _buildStatusIcon(ModuleStatus status) {
    switch (status) {
      case ModuleStatus.completed:
        return Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppColors.sage,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check, color: Colors.white, size: 16),
        );
      case ModuleStatus.inProgress:
        return Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: AppColors.teal.withValues(alpha: 0.12),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.play_arrow, color: AppColors.teal, size: 16),
        );
      case ModuleStatus.available:
        return Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.border, width: 2),
          ),
        );
      case ModuleStatus.locked:
        return Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppColors.divider,
            shape: BoxShape.circle,
          ),
          child:
              const Icon(Icons.lock, color: AppColors.textTertiary, size: 14),
        );
    }
  }
}

/// Hero card showing the "Continue Where You Left Off" module with a gradient
/// background, progress bar, and bilingual title.
class ContinueModuleCard extends StatelessWidget {
  final LearnModule module;
  final VoidCallback onTap;

  const ContinueModuleCard({
    super.key,
    required this.module,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [AppColors.sage, AppColors.teal],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.play_circle_filled,
                    color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Continue Where You Left Off',
                  style: AppTypography.labelSmall.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              '${module.number}  ${module.titleEn}',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            const SizedBox(height: 4),
            Text(
              module.titleHi,
              style: AppTypography.hindiBody.copyWith(
                color: Colors.white.withValues(alpha: 0.85),
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            // Progress bar
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: module.progress,
                minHeight: 6,
                backgroundColor: Colors.white.withValues(alpha: 0.25),
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '${(module.progress * 100).round()}% complete  \u00b7  ${module.durationMinutes} min',
              style: AppTypography.caption.copyWith(
                color: Colors.white.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
