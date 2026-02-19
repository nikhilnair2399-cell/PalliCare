import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// A full-width tappable row with bilingual title, optional subtitle, and
/// a [Switch] on the right. Used throughout the Settings screen for boolean
/// toggle preferences.
///
/// Design spec:
///  - Full row tappable, min 56dp height
///  - Title: 16sp Regular, with Hindi subtitle 13sp grey below
///  - Switch: sage green ON (#7BA68C), grey OFF
class SettingsToggleRow extends StatelessWidget {
  final String titleEn;
  final String titleHi;
  final String? subtitleEn;
  final String? subtitleHi;
  final bool value;
  final ValueChanged<bool> onChanged;

  const SettingsToggleRow({
    super.key,
    required this.titleEn,
    required this.titleHi,
    this.subtitleEn,
    this.subtitleHi,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 56),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            vertical: AppSpacing.space3,
            horizontal: AppSpacing.space1,
          ),
          child: Row(
            children: [
              // -- Text column --
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      titleEn,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      titleHi,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    if (subtitleEn != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        subtitleEn!,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                    if (subtitleHi != null)
                      Text(
                        subtitleHi!,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
                  ],
                ),
              ),

              // -- Switch --
              Switch(
                value: value,
                onChanged: onChanged,
                activeColor: AppColors.primary,
                activeTrackColor: AppColors.primaryLight,
                inactiveThumbColor: Colors.white,
                inactiveTrackColor: AppColors.border,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
