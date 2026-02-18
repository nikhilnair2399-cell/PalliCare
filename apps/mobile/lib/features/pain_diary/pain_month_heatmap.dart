import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'pain_diary_provider.dart';

/// Calendar heatmap showing pain intensity for 30+ day ranges.
class PainMonthHeatmap extends StatelessWidget {
  final List<DailyPainEntry> entries;
  const PainMonthHeatmap({super.key, required this.entries});

  @override
  Widget build(BuildContext context) {
    if (entries.isEmpty) {
      return Container(
        height: 200,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: const Center(
          child: Text('No data yet',
              style: TextStyle(color: AppColors.textTertiary)),
        ),
      );
    }

    // Build lookup map: day-of-year → entry
    final lookup = <int, DailyPainEntry>{};
    for (final e in entries) {
      final key = e.date.year * 1000 + e.date.month * 32 + e.date.day;
      lookup[key] = e;
    }

    final firstDate = entries.first.date;
    final lastDate = entries.last.date;
    final totalDays = lastDate.difference(firstDate).inDays + 1;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Day-of-week header
          Row(
            children: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                .map((d) => Expanded(
                      child: Text(
                        d,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade400,
                        ),
                      ),
                    ))
                .toList(),
          ),
          const SizedBox(height: 6),

          // Grid of days
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              childAspectRatio: 1.0,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
            ),
            itemCount: totalDays + (firstDate.weekday - 1),
            itemBuilder: (context, index) {
              final offset = firstDate.weekday - 1; // leading empty cells
              if (index < offset) return const SizedBox();

              final dayDate =
                  firstDate.add(Duration(days: index - offset));
              final key =
                  dayDate.year * 1000 + dayDate.month * 32 + dayDate.day;
              final entry = lookup[key];

              if (entry == null) {
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '${dayDate.day}',
                    style: TextStyle(
                        fontSize: 9, color: Colors.grey.shade400),
                  ),
                );
              }

              final color = PainBadge.painColor(entry.avgPain);
              return Tooltip(
                message:
                    '${_monthName(dayDate.month)} ${dayDate.day}: ${entry.avgPain}/10',
                child: Container(
                  decoration: BoxDecoration(
                    color: color.withAlpha(180),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '${dayDate.day}',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w600,
                      color: entry.avgPain >= 6
                          ? Colors.white
                          : AppColors.textPrimary,
                    ),
                  ),
                ),
              );
            },
          ),

          const SizedBox(height: 12),

          // Legend
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('0', style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
              const SizedBox(width: 4),
              ...List.generate(11, (i) {
                return Container(
                  width: 14,
                  height: 10,
                  margin: const EdgeInsets.symmetric(horizontal: 1),
                  decoration: BoxDecoration(
                    color: PainBadge.painColor(i),
                    borderRadius: BorderRadius.circular(2),
                  ),
                );
              }),
              const SizedBox(width: 4),
              Text('10', style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
            ],
          ),
        ],
      ),
    );
  }

  String _monthName(int m) {
    const names = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return names[m];
  }
}
