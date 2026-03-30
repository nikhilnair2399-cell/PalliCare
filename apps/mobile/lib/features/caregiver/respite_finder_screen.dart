import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Respite Finder Screen — Information about respite care options.
///
/// Provides information on temporary relief options for caregivers,
/// including volunteer services, day-care centres, and night nursing.
class RespiteFinderScreen extends StatelessWidget {
  const RespiteFinderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.accentWarmDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Respite Care',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0935\u093F\u0936\u094D\u0930\u093E\u092E \u0926\u0947\u0916\u092D\u093E\u0932',
              style: AppTypography.caption.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Intro
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.sage.withValues(alpha: 0.12),
                    AppColors.teal.withValues(alpha: 0.06),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
                border: Border.all(
                  color: AppColors.sage.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                children: [
                  const Text('\ud83c\udf3f',
                      style: TextStyle(fontSize: 32)),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Taking a break is not selfish \u2014 it\'s essential.',
                    textAlign: TextAlign.center,
                    style: AppTypography.heading4.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  Text(
                    '\u0935\u093F\u0936\u094D\u0930\u093E\u092E \u0932\u0947\u0928\u093E \u0938\u094D\u0935\u093E\u0930\u094D\u0925\u0940 \u0928\u0939\u0940\u0902 \u2014 \u092F\u0939 \u091C\u093C\u0930\u0942\u0930\u0940 \u0939\u0948\u0964',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Respite care provides temporary relief so you can rest, attend to your own health, or simply recharge.',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Options
            ..._respiteOptions.map((o) => Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: _RespiteCard(option: o),
                )),

            const SizedBox(height: AppSpacing.md),

            // Tip
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.accentHighlight.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(
                  color: AppColors.accentHighlight.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.lightbulb_outline,
                          size: 18, color: AppColors.accentHighlight),
                      const SizedBox(width: 6),
                      Text(
                        'Tip',
                        style: AppTypography.label.copyWith(
                          color: AppColors.accentHighlight,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Ask your palliative care team about local respite programs. Many hospitals and NGOs offer free or subsidized respite services.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.4,
                    ),
                  ),
                  Text(
                    '\u0905\u092A\u0928\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u091F\u0940\u092E \u0938\u0947 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0935\u093F\u0936\u094D\u0930\u093E\u092E \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902\u0964',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

class _RespiteOption {
  final String emoji;
  final String titleEn;
  final String titleHi;
  final String descriptionEn;
  final String descriptionHi;
  final Color color;

  const _RespiteOption({
    required this.emoji,
    required this.titleEn,
    required this.titleHi,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.color,
  });
}

const _respiteOptions = [
  _RespiteOption(
    emoji: '\ud83c\udfe5',
    titleEn: 'In-Patient Respite (Hospital)',
    titleHi: '\u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0935\u093F\u0936\u094D\u0930\u093E\u092E',
    descriptionEn:
        'Short-term admission (3-7 days) at a palliative care unit while you rest. Ask your care team about availability at AIIMS Bhopal and partner centres.',
    descriptionHi:
        '\u0906\u092A\u0915\u0947 \u0906\u0930\u093E\u092E \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u092A\u0948\u0932\u093F\u090F\u091F\u093F\u0935 \u0915\u0947\u092F\u0930 \u092F\u0942\u0928\u093F\u091F \u092E\u0947\u0902 3-7 \u0926\u093F\u0928 \u0915\u093E \u092D\u0930\u094D\u0924\u0940',
    color: AppColors.info,
  ),
  _RespiteOption(
    emoji: '\ud83c\udfe0',
    titleEn: 'Home-Based Respite',
    titleHi: '\u0918\u0930-\u0906\u0927\u093E\u0930\u093F\u0924 \u0935\u093F\u0936\u094D\u0930\u093E\u092E',
    descriptionEn:
        'Trained volunteer or nurse comes to your home for a few hours so you can step out. Contact Pallium India or Can Support for options.',
    descriptionHi:
        '\u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u093F\u0924 \u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0915 \u092F\u093E \u0928\u0930\u094D\u0938 \u0906\u092A\u0915\u0947 \u0918\u0930 \u0906\u090F\u0902\u0917\u0947',
    color: AppColors.sage,
  ),
  _RespiteOption(
    emoji: '\ud83c\udf19',
    titleEn: 'Night Nursing',
    titleHi: '\u0930\u093E\u0924 \u0928\u0930\u094D\u0938\u093F\u0902\u0917',
    descriptionEn:
        'A nurse stays overnight so you can sleep uninterrupted. Available through home care agencies and some NGOs. Costs vary by city.',
    descriptionHi:
        '\u0928\u0930\u094D\u0938 \u0930\u093E\u0924 \u092D\u0930 \u0930\u0939\u0924\u0940 \u0939\u0948\u0902 \u0924\u093E\u0915\u093F \u0906\u092A \u0928\u093F\u0930\u094D\u092C\u093E\u0927 \u0930\u0942\u092A \u0938\u0947 \u0938\u094B \u0938\u0915\u0947\u0902',
    color: AppColors.lavender,
  ),
  _RespiteOption(
    emoji: '\ud83e\udd1d',
    titleEn: 'Volunteer Companion Programs',
    titleHi: '\u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0940 \u0938\u093E\u0925\u0940 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E',
    descriptionEn:
        'Trained volunteers provide companionship and basic care for 2-4 hours. Free through organizations like Can Support, Pallium India, and Karunashraya.',
    descriptionHi:
        '\u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u093F\u0924 \u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0915 2-4 \u0918\u0902\u091F\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u093E\u0925 \u0914\u0930 \u092C\u0941\u0928\u093F\u092F\u093E\u0926\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902',
    color: AppColors.accentWarm,
  ),
  _RespiteOption(
    emoji: '\ud83c\udfe2',
    titleEn: 'Day Care Centres',
    titleHi: '\u0921\u0947 \u0915\u0947\u092F\u0930 \u0938\u0947\u0902\u091F\u0930',
    descriptionEn:
        'Patient attends a supervised day programme with activities, meals, and medical support. Available in major cities through palliative care organizations.',
    descriptionHi:
        '\u0930\u094B\u0917\u0940 \u0917\u0924\u093F\u0935\u093F\u0927\u093F\u092F\u094B\u0902, \u092D\u094B\u091C\u0928 \u0914\u0930 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947 \u0938\u093E\u0925 \u092A\u0930\u094D\u092F\u0935\u0947\u0915\u094D\u0937\u093F\u0924 \u0926\u093F\u0928 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E \u092E\u0947\u0902 \u092D\u093E\u0917 \u0932\u0947\u0924\u093E \u0939\u0948',
    color: AppColors.accentHighlight,
  ),
];

// ---------------------------------------------------------------------------
// RESPITE CARD
// ---------------------------------------------------------------------------

class _RespiteCard extends StatelessWidget {
  final _RespiteOption option;

  const _RespiteCard({required this.option});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: option.color.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(option.emoji, style: const TextStyle(fontSize: 22)),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      option.titleEn,
                      style: AppTypography.label.copyWith(
                        color: option.color,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      option.titleHi,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            option.descriptionEn,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textPrimary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            option.descriptionHi,
            style: AppTypography.caption.copyWith(
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}
