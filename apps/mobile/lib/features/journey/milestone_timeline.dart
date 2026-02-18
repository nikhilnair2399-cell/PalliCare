import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'journey_provider.dart';

/// Vertical timeline with golden amber dots and milestone cards.
class MilestoneTimeline extends StatelessWidget {
  final List<Milestone> milestones;
  const MilestoneTimeline({super.key, required this.milestones});

  @override
  Widget build(BuildContext context) {
    if (milestones.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.cardPadding),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        ),
        child: const Center(
          child: Text(
            'Your milestones will appear here as you go.',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textTertiary,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children:
            List.generate(milestones.length, (i) {
              final milestone = milestones[i];
              final isLast = i == milestones.length - 1;
              return _MilestoneRow(
                milestone: milestone,
                isLast: isLast,
              );
            }),
      ),
    );
  }
}

/// A single milestone row with dot, connecting line, and content card.
class _MilestoneRow extends StatelessWidget {
  final Milestone milestone;
  final bool isLast;

  const _MilestoneRow({
    required this.milestone,
    required this.isLast,
  });

  String _formatDate(DateTime date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${date.day} ${months[date.month - 1]}';
  }

  @override
  Widget build(BuildContext context) {
    final dotColor = milestone.isUpcoming
        ? AppColors.border
        : AppColors.accentHighlight;
    final textColor = milestone.isUpcoming
        ? AppColors.textTertiary
        : AppColors.textPrimary;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline column: dot + line
          SizedBox(
            width: 28,
            child: Column(
              children: [
                const SizedBox(height: 4),
                // Dot
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: dotColor,
                    shape: BoxShape.circle,
                    border: milestone.isUpcoming
                        ? Border.all(color: AppColors.textTertiary, width: 1.5)
                        : null,
                    boxShadow: milestone.isUpcoming
                        ? null
                        : [
                            BoxShadow(
                              color: AppColors.accentHighlight
                                  .withValues(alpha: 0.3),
                              blurRadius: 4,
                              spreadRadius: 1,
                            ),
                          ],
                  ),
                ),
                // Connecting line
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: AppColors.border,
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(width: AppSpacing.space3),

          // Content
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(
                bottom: isLast ? 0 : AppSpacing.space4,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    milestone.title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                      fontStyle: milestone.isUpcoming
                          ? FontStyle.italic
                          : FontStyle.normal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    milestone.titleHi,
                    style: TextStyle(
                      fontSize: 11,
                      color: milestone.isUpcoming
                          ? AppColors.textTertiary
                          : AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(
                        _formatDate(milestone.date),
                        style: TextStyle(
                          fontSize: 12,
                          color: milestone.isUpcoming
                              ? AppColors.textTertiary
                              : AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      if (milestone.isUpcoming) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.accentHighlight
                                .withValues(alpha: 0.15),
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusBadge),
                          ),
                          child: const Text(
                            'Upcoming',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppColors.accentHighlight,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
