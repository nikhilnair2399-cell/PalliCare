import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'symptom_log_provider.dart';

/// Aggravating / relieving factors (multi-select).
class TriggersCard extends ConsumerWidget {
  const TriggersCard({super.key});

  static const _aggravators = [
    _TriggerItem('movement', 'Movement', 'हिलना-डुलना', '🚶'),
    _TriggerItem('coughing', 'Coughing', 'खाँसी', '😮‍💨'),
    _TriggerItem('eating', 'Eating', 'खाना', '🍽️'),
    _TriggerItem('stress', 'Stress', 'तनाव', '😰'),
    _TriggerItem('lying_down', 'Lying down', 'लेटना', '🛏️'),
    _TriggerItem('sitting', 'Sitting', 'बैठना', '🪑'),
    _TriggerItem('weather', 'Weather', 'मौसम', '🌧️'),
    _TriggerItem('night', 'Night time', 'रात को', '🌙'),
  ];

  static const _relievers = [
    _TriggerItem('medication', 'Medication', 'दवाई', '💊'),
    _TriggerItem('rest', 'Rest', 'आराम', '😴'),
    _TriggerItem('heat', 'Heat / Warmth', 'गर्माहट', '♨️'),
    _TriggerItem('cold', 'Cold', 'ठंडक', '🧊'),
    _TriggerItem('massage', 'Massage', 'मालिश', '🤲'),
    _TriggerItem('position_change', 'Position change', 'करवट बदलना', '🔄'),
    _TriggerItem('distraction', 'Distraction', 'ध्यान हटाना', '📺'),
    _TriggerItem('breathing', 'Deep breathing', 'गहरी साँस', '🧘'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final entry = ref.watch(symptomLogProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'What makes it worse?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'किससे दर्द बढ़ता है?',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),
          _buildChipGrid(
            items: _aggravators,
            selected: entry.aggravators,
            onTap: (id) =>
                ref.read(symptomLogProvider.notifier).toggleAggravator(id),
            selectedColor: AppColors.accentWarm,
          ),

          const SizedBox(height: 28),

          const Text(
            'What helps?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'किससे आराम मिलता है?',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),
          _buildChipGrid(
            items: _relievers,
            selected: entry.relievers,
            onTap: (id) =>
                ref.read(symptomLogProvider.notifier).toggleReliever(id),
            selectedColor: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildChipGrid({
    required List<_TriggerItem> items,
    required List<String> selected,
    required void Function(String) onTap,
    required Color selectedColor,
  }) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: items.map((item) {
        final isSelected = selected.contains(item.id);
        return GestureDetector(
          onTap: () => onTap(item.id),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color:
                  isSelected ? selectedColor.withAlpha(20) : Colors.white,
              borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
              border: Border.all(
                color: isSelected ? selectedColor : Colors.grey.shade300,
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(item.emoji, style: const TextStyle(fontSize: 16)),
                const SizedBox(width: 6),
                Text(
                  item.label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight:
                        isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _TriggerItem {
  final String id;
  final String label;
  final String hindi;
  final String emoji;
  const _TriggerItem(this.id, this.label, this.hindi, this.emoji);
}
