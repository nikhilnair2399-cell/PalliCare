import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// Morphine Equivalent Daily Dose (MEDD) display widget.
class MeddDisplay extends StatelessWidget {
  final double medd;
  const MeddDisplay({super.key, required this.medd});

  @override
  Widget build(BuildContext context) {
    // Thresholds per WHO guidelines adapted for Indian context
    final level = medd >= 90
        ? _MeddLevel.high
        : medd >= 50
            ? _MeddLevel.moderate
            : _MeddLevel.low;

    final color = switch (level) {
      _MeddLevel.high => AppColors.error,
      _MeddLevel.moderate => AppColors.warning,
      _MeddLevel.low => AppColors.primary,
    };

    final label = switch (level) {
      _MeddLevel.high => 'High — Monitor closely',
      _MeddLevel.moderate => 'Moderate',
      _MeddLevel.low => 'Within guidelines',
    };

    final labelHindi = switch (level) {
      _MeddLevel.high => 'उच्च — निगरानी ज़रूरी',
      _MeddLevel.moderate => 'मध्यम',
      _MeddLevel.low => 'दिशानिर्देशों के भीतर',
    };

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withAlpha(12),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: color.withAlpha(40)),
      ),
      child: Row(
        children: [
          // MEDD circle
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color.withAlpha(25),
              border: Border.all(color: color, width: 2),
            ),
            alignment: Alignment.center,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${medd.round()}',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
                Text(
                  'mg',
                  style: TextStyle(fontSize: 9, color: color),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'MEDD (Morphine Equivalent)',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: color,
                  ),
                ),
                Text(
                  labelHindi,
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                ),
              ],
            ),
          ),

          Icon(
            level == _MeddLevel.high
                ? Icons.warning_amber_rounded
                : Icons.info_outline,
            color: color,
            size: 22,
          ),
        ],
      ),
    );
  }
}

enum _MeddLevel { low, moderate, high }
