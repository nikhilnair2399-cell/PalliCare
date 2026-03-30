import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'disease_library_provider.dart';

/// A 2-column grid card representing a disease class category.
///
/// Shows emoji, EN title, HI subtitle, and disease count badge.
class DiseaseCategoryCard extends StatelessWidget {
  final DiseaseClass diseaseClass;
  final int count;
  final VoidCallback onTap;

  const DiseaseCategoryCard({
    super.key,
    required this.diseaseClass,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final info = _classInfo(diseaseClass);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.sm),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: info.color.withValues(alpha: 0.25),
          ),
          boxShadow: [
            BoxShadow(
              color: info.color.withValues(alpha: 0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              children: [
                Text(info.emoji, style: const TextStyle(fontSize: 22)),
                const Spacer(),
                if (count > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: info.color.withValues(alpha: 0.12),
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusBadge),
                    ),
                    child: Text(
                      '$count',
                      style: AppTypography.labelSmall.copyWith(
                        color: info.color,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              info.nameEn,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.teal,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              info.nameHi,
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// CLASS INFO MAPPING
// ---------------------------------------------------------------------------

class _ClassInfo {
  final String emoji;
  final String nameEn;
  final String nameHi;
  final Color color;

  const _ClassInfo({
    required this.emoji,
    required this.nameEn,
    required this.nameHi,
    required this.color,
  });
}

_ClassInfo _classInfo(DiseaseClass cls) {
  switch (cls) {
    case DiseaseClass.cancer:
      return const _ClassInfo(
        emoji: '\ud83c\udf80',
        nameEn: 'Cancer Types',
        nameHi:
            '\u0915\u0948\u0902\u0938\u0930 \u0915\u0947 \u092A\u094D\u0930\u0915\u093E\u0930',
        color: AppColors.accentWarm,
      );
    case DiseaseClass.neurological:
      return const _ClassInfo(
        emoji: '\ud83e\udde0',
        nameEn: 'Neurological',
        nameHi:
            '\u0928\u094D\u092F\u0942\u0930\u094B\u0932\u0949\u091C\u093F\u0915\u0932',
        color: AppColors.lavender,
      );
    case DiseaseClass.cardiac:
      return const _ClassInfo(
        emoji: '\u2764\ufe0f',
        nameEn: 'Cardiac',
        nameHi: '\u0939\u0943\u0926\u092F',
        color: AppColors.error,
      );
    case DiseaseClass.respiratory:
      return const _ClassInfo(
        emoji: '\ud83e\udec1',
        nameEn: 'Respiratory',
        nameHi:
            '\u0936\u094D\u0935\u0938\u0928',
        color: AppColors.teal,
      );
    case DiseaseClass.renal:
      return const _ClassInfo(
        emoji: '\ud83e\udec0',
        nameEn: 'Renal',
        nameHi:
            '\u0917\u0941\u0930\u094D\u0926\u093E',
        color: AppColors.accentHighlight,
      );
    case DiseaseClass.hepatic:
      return const _ClassInfo(
        emoji: '\ud83e\udec1',
        nameEn: 'Hepatic',
        nameHi: '\u0932\u093F\u0935\u0930',
        color: AppColors.sage,
      );
    case DiseaseClass.hematological:
      return const _ClassInfo(
        emoji: '\ud83e\ude78',
        nameEn: 'Hematological',
        nameHi:
            '\u0930\u0915\u094D\u0924 \u0938\u0902\u092C\u0902\u0927\u0940',
        color: AppColors.info,
      );
    case DiseaseClass.autoimmune:
      return const _ClassInfo(
        emoji: '\ud83d\udee1\ufe0f',
        nameEn: 'Autoimmune',
        nameHi:
            '\u0911\u091F\u094B\u0907\u092E\u094D\u092F\u0942\u0928',
        color: AppColors.accentCalm,
      );
  }
}
