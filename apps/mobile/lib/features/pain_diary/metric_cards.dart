import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'pain_diary_provider.dart';

/// Row of summary metric cards: Avg Pain, Peak, Logs, Trend.
class MetricCards extends StatelessWidget {
  final PainDiaryState diary;
  const MetricCards({super.key, required this.diary});

  @override
  Widget build(BuildContext context) {
    final trend = diary.trend;
    final trendIcon = trend > 0.5
        ? Icons.trending_up
        : trend < -0.5
            ? Icons.trending_down
            : Icons.trending_flat;
    final trendColor = trend > 0.5
        ? AppColors.error
        : trend < -0.5
            ? AppColors.primary
            : AppColors.warning;
    final trendLabel = trend > 0.5
        ? 'Increasing'
        : trend < -0.5
            ? 'Improving'
            : 'Stable';

    return Row(
      children: [
        Expanded(
          child: _MetricCard(
            label: 'Average',
            value: diary.averagePain.toStringAsFixed(1),
            color: PainBadge.painColor(diary.averagePain.round()),
            icon: Icons.analytics_outlined,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MetricCard(
            label: 'Peak',
            value: '${diary.peakPain}',
            color: PainBadge.painColor(diary.peakPain),
            icon: Icons.arrow_upward,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MetricCard(
            label: 'Logs',
            value: '${diary.totalLogs}',
            color: AppColors.info,
            icon: Icons.edit_note,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MetricCard(
            label: trendLabel,
            value: '',
            color: trendColor,
            icon: trendIcon,
          ),
        ),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  const _MetricCard({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, size: 22, color: color),
          const SizedBox(height: 6),
          if (value.isNotEmpty)
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          const SizedBox(height: 2),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
