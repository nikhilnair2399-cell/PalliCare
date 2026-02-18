import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'caregiver_provider.dart';

/// Day schedule card showing which caregiver is on duty when.
/// Also includes the activity feed below the schedule.
class CareScheduleCard extends ConsumerWidget {
  const CareScheduleCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(caregiverProvider);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          const Row(
            children: [
              Icon(Icons.calendar_today, size: 18, color: AppColors.primaryDark),
              SizedBox(width: 8),
              Text(
                'Care Schedule',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          const Text(
            '\u0926\u0947\u0916\u092D\u093E\u0932 \u0905\u0928\u0941\u0938\u0942\u091A\u0940',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.space4),

          // Schedule entries
          ...state.schedule.map((entry) => _ScheduleRow(entry: entry)),

          // Divider before activity feed
          if (state.activityFeed.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space3),
            const Divider(color: AppColors.divider, height: 1),
            const SizedBox(height: AppSpacing.space3),

            // Activity feed header
            const Row(
              children: [
                Icon(Icons.history, size: 16, color: AppColors.textSecondary),
                SizedBox(width: 6),
                Text(
                  'Recent Activity',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space2),

            // Activity entries
            ...state.activityFeed.map(
              (entry) => _ActivityRow(entry: entry),
            ),
          ],
        ],
      ),
    );
  }
}

/// A single schedule row (caregiver + shift).
class _ScheduleRow extends StatelessWidget {
  final CareScheduleEntry entry;

  const _ScheduleRow({required this.entry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          // Active indicator
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: entry.isCurrent
                  ? AppColors.primary
                  : AppColors.border,
              border: entry.isCurrent
                  ? Border.all(color: AppColors.primary.withAlpha(60), width: 2)
                  : null,
            ),
          ),
          const SizedBox(width: 12),

          // Time slot
          SizedBox(
            width: 72,
            child: Text(
              entry.timeSlot,
              style: TextStyle(
                fontSize: 13,
                fontWeight:
                    entry.isCurrent ? FontWeight.w700 : FontWeight.w500,
                color: entry.isCurrent
                    ? AppColors.primaryDark
                    : AppColors.textSecondary,
              ),
            ),
          ),

          // Caregiver name
          Expanded(
            child: Text(
              entry.caregiverName,
              style: TextStyle(
                fontSize: 14,
                fontWeight:
                    entry.isCurrent ? FontWeight.w700 : FontWeight.w500,
                color: entry.isCurrent
                    ? AppColors.textPrimary
                    : AppColors.textSecondary,
              ),
            ),
          ),

          // Time range
          Text(
            entry.timeRange,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textTertiary,
            ),
          ),

          // Current badge
          if (entry.isCurrent) ...[
            const SizedBox(width: 8),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(15),
                borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
              ),
              child: const Text(
                'Now',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// A compact activity feed row.
class _ActivityRow extends StatelessWidget {
  final ActivityFeedEntry entry;

  const _ActivityRow({required this.entry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timestamp
          SizedBox(
            width: 80,
            child: Text(
              entry.timestamp,
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textTertiary,
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Action
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 13, height: 1.3),
                children: [
                  TextSpan(
                    text: entry.actor,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  TextSpan(
                    text: ' ${entry.action}',
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                    ),
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
