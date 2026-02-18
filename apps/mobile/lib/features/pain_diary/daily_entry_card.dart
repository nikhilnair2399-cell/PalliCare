import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'pain_diary_provider.dart';

/// Expandable card for a single day's pain diary entry.
class DailyEntryCard extends StatelessWidget {
  final DailyPainEntry entry;
  final bool isSelected;
  final VoidCallback onTap;

  const DailyEntryCard({
    super.key,
    required this.entry,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isToday = _isToday(entry.date);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withAlpha(10)
              : Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            // Summary row
            Row(
              children: [
                // Date
                Container(
                  width: 48,
                  child: Column(
                    children: [
                      Text(
                        '${entry.date.day}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: isToday
                              ? AppColors.primary
                              : AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        _dayName(entry.date.weekday),
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),

                // Pain badge
                PainBadge(score: entry.avgPain, size: 40),
                const SizedBox(width: 12),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Avg: ${entry.avgPain}/10  (${entry.minPain}-${entry.maxPain})',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${entry.logCount} log(s) · ${_moodEmoji(entry.mood)}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),

                // Expand indicator
                Icon(
                  isSelected
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: Colors.grey.shade400,
                  size: 20,
                ),
              ],
            ),

            // Expanded details
            if (isSelected) ...[
              const SizedBox(height: 12),
              const Divider(height: 1),
              const SizedBox(height: 12),
              Row(
                children: [
                  _DetailChip(
                    icon: Icons.bed,
                    label: '${entry.sleepHours ?? "?"}h sleep',
                  ),
                  const SizedBox(width: 12),
                  _DetailChip(
                    icon: Icons.medication,
                    label: entry.medicationAdherence != null
                        ? '${(entry.medicationAdherence! * 100).round()}% adherence'
                        : 'No med data',
                  ),
                ],
              ),
              if (entry.locations.isNotEmpty) ...[
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  children: entry.locations
                      .map((loc) => Chip(
                            label: Text(
                              _formatLocation(loc),
                              style: const TextStyle(fontSize: 11),
                            ),
                            backgroundColor: AppColors.primary.withAlpha(20),
                            side: BorderSide.none,
                            padding: EdgeInsets.zero,
                            materialTapTargetSize:
                                MaterialTapTargetSize.shrinkWrap,
                          ))
                      .toList(),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }

  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  String _dayName(int weekday) {
    const names = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return names[weekday];
  }

  String _moodEmoji(String? mood) {
    return switch (mood) {
      'peaceful' => '😌',
      'okay' => '🙂',
      'worried' => '😟',
      'sad' => '😢',
      'frustrated' => '😤',
      _ => '',
    };
  }

  String _formatLocation(String loc) {
    return loc.replaceAll('_', ' ').split(' ').map((w) {
      if (w.isEmpty) return w;
      return w[0].toUpperCase() + w.substring(1);
    }).join(' ');
  }
}

class _DetailChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _DetailChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
