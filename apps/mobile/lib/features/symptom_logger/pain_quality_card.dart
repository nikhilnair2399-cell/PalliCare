import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'symptom_log_provider.dart';

/// Pain quality descriptor selection (multi-select chips).
class PainQualityCard extends ConsumerWidget {
  const PainQualityCard({super.key});

  static const _qualities = [
    _QualityOption('aching', 'Aching', 'टीस', '😣'),
    _QualityOption('burning', 'Burning', 'जलन', '🔥'),
    _QualityOption('shooting', 'Shooting', 'चुभने वाला', '⚡'),
    _QualityOption('stabbing', 'Stabbing', 'छेदने वाला', '🗡️'),
    _QualityOption('throbbing', 'Throbbing', 'धड़कता हुआ', '💓'),
    _QualityOption('cramping', 'Cramping', 'ऐंठन', '🤏'),
    _QualityOption('tingling', 'Tingling', 'झुनझुनी', '✨'),
    _QualityOption('numbness', 'Numbness', 'सुन्न', '🧊'),
    _QualityOption('pressure', 'Pressure', 'दबाव', '🫸'),
    _QualityOption('dull', 'Dull', 'मंद दर्द', '😶'),
    _QualityOption('sharp', 'Sharp', 'तेज़', '📌'),
    _QualityOption('radiating', 'Radiating', 'फैलता हुआ', '🌊'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final selected = ref.watch(symptomLogProvider).painQualities;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            l.painQualityQuestion,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'दर्द कैसा लगता है? (एक या अधिक चुनें)',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 24),

          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _qualities.map((q) {
              final isSelected = selected.contains(q.id);
              return GestureDetector(
                onTap: () => ref
                    .read(symptomLogProvider.notifier)
                    .togglePainQuality(q.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary.withAlpha(20)
                        : Colors.white,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
                    border: Border.all(
                      color:
                          isSelected ? AppColors.primary : Colors.grey.shade300,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(q.emoji, style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 6),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            q.label,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: isSelected
                                  ? FontWeight.w700
                                  : FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          Text(
                            q.hindi,
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                      if (isSelected) ...[
                        const SizedBox(width: 6),
                        const Icon(Icons.check_circle,
                            size: 16, color: AppColors.primary),
                      ],
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          if (selected.isNotEmpty) ...[
            const SizedBox(height: 20),
            Text(
              l.painQualitySelected(selected.length),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _QualityOption {
  final String id;
  final String label;
  final String hindi;
  final String emoji;
  const _QualityOption(this.id, this.label, this.hindi, this.emoji);
}
