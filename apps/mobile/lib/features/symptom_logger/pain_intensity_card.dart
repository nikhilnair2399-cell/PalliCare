import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'symptom_log_provider.dart';

/// NRS 0-10 pain intensity selector with large tap targets
/// and bilingual labels.
class PainIntensityCard extends ConsumerWidget {
  const PainIntensityCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final intensity = ref.watch(symptomLogProvider).painIntensity;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            l.painIntensityQuestion,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'अभी आपका दर्द कैसा है?',
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 32),

          // NRS 0-10 grid
          Center(
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: List.generate(11, (i) {
                final isSelected = intensity == i;
                final color = PainBadge.painColor(i);
                return GestureDetector(
                  onTap: () =>
                      ref.read(symptomLogProvider.notifier).setPainIntensity(i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: AppSpacing.painButtonWidth,
                    height: AppSpacing.painButtonHeight,
                    decoration: BoxDecoration(
                      color: isSelected ? color : color.withAlpha(40),
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusPainButton),
                      border: isSelected
                          ? Border.all(color: color, width: 2)
                          : null,
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: color.withAlpha(80),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              )
                            ]
                          : null,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '$i',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: isSelected && i >= 6
                            ? Colors.white
                            : AppColors.textPrimary,
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),

          const SizedBox(height: 20),

          // Scale labels
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(l.painScaleMin,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
              Text(l.painScaleMax,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
            ],
          ),

          const SizedBox(height: 32),

          // Selected value feedback
          if (intensity != null) ...[
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: Container(
                key: ValueKey(intensity),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: PainBadge.painColor(intensity).withAlpha(20),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                ),
                child: Row(
                  children: [
                    PainBadge(score: intensity, size: 48),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            PainBadge.painLabel(intensity),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            PainBadge.painLabelHindi(intensity),
                            style: TextStyle(
                                fontSize: 14, color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
