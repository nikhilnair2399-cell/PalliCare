import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Horizontal scrolling row of sound option pills.
class SoundSelector extends StatelessWidget {
  final BgSound selected;
  final ValueChanged<BgSound> onChanged;

  /// If true, uses light styling for dark backgrounds (player screen).
  final bool darkMode;

  const SoundSelector({
    super.key,
    required this.selected,
    required this.onChanged,
    this.darkMode = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: AppSpacing.minTouchTarget,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.screenPaddingHorizontal,
        ),
        itemCount: ambientSounds.length,
        separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.space2),
        itemBuilder: (context, index) {
          final sound = ambientSounds[index];
          final isSelected = sound.sound == selected;
          return _SoundPill(
            sound: sound,
            isSelected: isSelected,
            darkMode: darkMode,
            onTap: () => onChanged(sound.sound),
          );
        },
      ),
    );
  }
}

class _SoundPill extends StatelessWidget {
  final AmbientSound sound;
  final bool isSelected;
  final bool darkMode;
  final VoidCallback onTap;

  const _SoundPill({
    required this.sound,
    required this.isSelected,
    required this.darkMode,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color bgColor;
    final Color textColor;
    final Color borderColor;

    if (darkMode) {
      bgColor = isSelected
          ? AppColors.sage.withValues(alpha: 0.3)
          : Colors.white.withValues(alpha: 0.08);
      textColor = isSelected
          ? Colors.white
          : Colors.white.withValues(alpha: 0.6);
      borderColor = isSelected
          ? AppColors.sage.withValues(alpha: 0.5)
          : Colors.white.withValues(alpha: 0.15);
    } else {
      bgColor = isSelected
          ? AppColors.sage.withValues(alpha: 0.15)
          : Colors.white;
      textColor = isSelected ? AppColors.teal : AppColors.charcoalLight;
      borderColor = isSelected
          ? AppColors.sage.withValues(alpha: 0.4)
          : AppColors.border;
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space3,
          vertical: AppSpacing.space2,
        ),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(sound.emoji, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 4),
            Text(
              sound.label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
