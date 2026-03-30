import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'breathe_provider.dart';

/// Selector widget for choosing breathing animation visualization style.
///
/// Displays 4 icon-labeled options: Circle, Wave, Lungs, Nature.
/// Used in both the config view and breathe home screen.
class AnimationStyleSelector extends StatelessWidget {
  final BreathAnimationStyle selected;
  final ValueChanged<BreathAnimationStyle> onChanged;
  final bool darkMode;

  const AnimationStyleSelector({
    super.key,
    required this.selected,
    required this.onChanged,
    this.darkMode = false,
  });

  static const _styles = [
    (BreathAnimationStyle.circle, Icons.circle_outlined, 'Circle', '\u0935\u0943\u0924\u094D\u0924'),
    (BreathAnimationStyle.wave, Icons.waves, 'Wave', '\u0932\u0939\u0930'),
    (BreathAnimationStyle.lungs, Icons.air, 'Lungs', '\u092B\u0947\u092B\u0921\u093C\u0947'),
    (BreathAnimationStyle.nature, Icons.park, 'Nature', '\u092A\u094D\u0930\u0915\u0943\u0924\u093F'),
  ];

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: _styles.map((entry) {
        final (style, icon, labelEn, _) = entry;
        final isSelected = style == selected;
        final fgColor = darkMode
            ? (isSelected ? Colors.white : Colors.white.withValues(alpha: 0.4))
            : (isSelected ? AppColors.teal : AppColors.charcoalLight);
        final bgColor = darkMode
            ? (isSelected
                ? Colors.white.withValues(alpha: 0.15)
                : Colors.white.withValues(alpha: 0.05))
            : (isSelected
                ? AppColors.sage.withValues(alpha: 0.15)
                : AppColors.surfaceCard);
        final borderColor = darkMode
            ? (isSelected
                ? Colors.white.withValues(alpha: 0.3)
                : Colors.white.withValues(alpha: 0.08))
            : (isSelected
                ? AppColors.sage.withValues(alpha: 0.4)
                : AppColors.border);

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: GestureDetector(
            onTap: () => onChanged(style),
            child: Container(
              width: 68,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(icon, color: fgColor, size: 22),
                  const SizedBox(height: 4),
                  Text(
                    labelEn,
                    style: AppTypography.caption.copyWith(
                      color: fgColor,
                      fontWeight: isSelected ? FontWeight.w600 : null,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
