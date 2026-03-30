import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Grief Resources Screen — Anticipatory grief and bereavement preparation.
///
/// Provides compassionate, evidence-based information about grief,
/// normalizes the experience, and offers practical coping strategies.
class GriefResourcesScreen extends StatelessWidget {
  const GriefResourcesScreen({super.key});

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
              'Grief & Preparation',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0936\u094B\u0915 \u0914\u0930 \u0924\u0948\u092F\u093E\u0930\u0940',
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
            // Compassionate intro
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.lavender.withValues(alpha: 0.2),
                    AppColors.sage.withValues(alpha: 0.08),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
                border: Border.all(
                  color: AppColors.lavender.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  const Text('\ud83d\udd6f\ufe0f',
                      style: TextStyle(fontSize: 32)),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Grief is love with nowhere to go.',
                    textAlign: TextAlign.center,
                    style: AppTypography.heading4.copyWith(
                      color: AppColors.teal,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '\u0936\u094B\u0915 \u092A\u094D\u092F\u093E\u0930 \u0939\u0948 \u091C\u093F\u0938\u0947 \u0915\u0939\u0940\u0902 \u091C\u093E\u0928\u0947 \u0915\u093E \u0930\u093E\u0938\u094D\u0924\u093E \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0924\u093E\u0964',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Whatever you are feeling right now is normal. There is no right or wrong way to grieve.',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Anticipatory Grief
            _buildSection(
              '\ud83c\udf3e',
              'Anticipatory Grief',
              '\u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928\u093F\u0924 \u0936\u094B\u0915',
              AppColors.lavender,
              [
                _GriefContent(
                  titleEn: 'What is anticipatory grief?',
                  titleHi: '\u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928\u093F\u0924 \u0936\u094B\u0915 \u0915\u094D\u092F\u093E \u0939\u0948?',
                  bodyEn:
                      'Grieving that begins before the actual loss. It\'s common when caring for someone with a serious illness and is a natural response to impending loss.',
                  bodyHi:
                      '\u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u0928\u0941\u0915\u0938\u093E\u0928 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0928\u0947 \u0935\u093E\u0932\u093E \u0936\u094B\u0915\u0964 \u092F\u0939 \u090F\u0915 \u0938\u094D\u0935\u093E\u092D\u093E\u0935\u093F\u0915 \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0930\u093F\u092F\u093E \u0939\u0948\u0964',
                ),
                _GriefContent(
                  titleEn: 'Common feelings you may experience',
                  titleHi: '\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092D\u093E\u0935\u0928\u093E\u090F\u0901',
                  bodyEn:
                      'Sadness, anger, guilt, anxiety, numbness, relief \u2014 all of these are normal. You may feel them in waves or all at once. Allow yourself to feel without judgement.',
                  bodyHi:
                      '\u0926\u0941\u0916, \u0917\u0941\u0938\u094D\u0938\u093E, \u0905\u092A\u0930\u093E\u0927\u092C\u094B\u0927, \u091A\u093F\u0902\u0924\u093E, \u0938\u0941\u0928\u094D\u0928\u092A\u0928, \u0930\u093E\u0939\u0924 \u2014 \u092F\u0947 \u0938\u092D\u0940 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948\u0902\u0964',
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Coping Strategies
            _buildSection(
              '\ud83c\udf31',
              'Coping Strategies',
              '\u0938\u0902\u092D\u093E\u0932\u0928\u0947 \u0915\u0947 \u0924\u0930\u0940\u0915\u0947',
              AppColors.sage,
              [
                _GriefContent(
                  titleEn: 'Talk to someone you trust',
                  titleHi: '\u0915\u093F\u0938\u0940 \u092D\u0930\u094B\u0938\u0947\u092E\u0902\u0926 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0938\u0947 \u092C\u093E\u0924 \u0915\u0930\u0947\u0902',
                  bodyEn:
                      'Share your feelings with a trusted friend, family member, counsellor, or support group. You don\'t have to carry this alone.',
                  bodyHi:
                      '\u0905\u092A\u0928\u0940 \u092D\u093E\u0935\u0928\u093E\u090F\u0901 \u0915\u093F\u0938\u0940 \u092D\u0930\u094B\u0938\u0947\u092E\u0902\u0926 \u0938\u0947 \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902\u0964',
                ),
                _GriefContent(
                  titleEn: 'Write in your journal',
                  titleHi: '\u0905\u092A\u0928\u0940 \u0921\u093E\u092F\u0930\u0940 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902',
                  bodyEn:
                      'Writing down your thoughts and feelings can help process emotions. Use the caregiver journal in this app to express yourself privately.',
                  bodyHi:
                      '\u0935\u093F\u091A\u093E\u0930 \u0914\u0930 \u092D\u093E\u0935\u0928\u093E\u090F\u0901 \u0932\u093F\u0916\u0928\u0947 \u0938\u0947 \u092D\u093E\u0935\u0928\u093E\u0913\u0902 \u0915\u094B \u0938\u092E\u091D\u0928\u0947 \u092E\u0947\u0902 \u092E\u0926\u0926 \u092E\u093F\u0932\u0924\u0940 \u0939\u0948\u0964',
                ),
                _GriefContent(
                  titleEn: 'Take care of your body',
                  titleHi: '\u0905\u092A\u0928\u0947 \u0936\u0930\u0940\u0930 \u0915\u093E \u0927\u094D\u092F\u093E\u0928 \u0930\u0916\u0947\u0902',
                  bodyEn:
                      'Grief is physically exhausting. Try to eat regularly, sleep when you can, and take short walks. Small acts of self-care matter.',
                  bodyHi:
                      '\u0936\u094B\u0915 \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0925\u0915\u093E \u0926\u0947\u0928\u0947 \u0935\u093E\u0932\u093E \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0928\u093F\u092F\u092E\u093F\u0924 \u0916\u093E\u090F\u0902, \u0938\u094B\u090F\u0902 \u0914\u0930 \u091B\u094B\u091F\u0940 \u0938\u0948\u0930 \u0915\u0930\u0947\u0902\u0964',
                ),
                _GriefContent(
                  titleEn: 'Allow yourself to still feel joy',
                  titleHi: '\u0916\u0941\u0936\u0940 \u092E\u0939\u0938\u0942\u0938 \u0915\u0930\u0928\u0947 \u0926\u0947\u0902',
                  bodyEn:
                      'Laughing or feeling happy doesn\'t mean you care less. Moments of joy amidst grief are healthy and normal.',
                  bodyHi:
                      '\u0939\u0901\u0938\u0928\u093E \u092F\u093E \u0916\u0941\u0936\u0940 \u092E\u0939\u0938\u0942\u0938 \u0915\u0930\u0928\u093E \u092F\u0939 \u0928\u0939\u0940\u0902 \u0926\u0930\u094D\u0936\u093E\u0924\u093E \u0915\u093F \u0906\u092A \u0915\u092E \u0926\u0947\u0916\u092D\u093E\u0932 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964',
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Preparing Together
            _buildSection(
              '\ud83e\udd1d',
              'Preparing Together',
              '\u090F\u0915 \u0938\u093E\u0925 \u0924\u0948\u092F\u093E\u0930\u0940',
              AppColors.accentWarm,
              [
                _GriefContent(
                  titleEn: 'Have conversations about wishes',
                  titleHi: '\u0907\u091A\u094D\u091B\u093E\u0913\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092C\u093E\u0924 \u0915\u0930\u0947\u0902',
                  bodyEn:
                      'If possible, discuss end-of-life preferences, rituals, and final wishes. These conversations, while difficult, can bring peace to both of you.',
                  bodyHi:
                      '\u092F\u0926\u093F \u0938\u0902\u092D\u0935 \u0939\u094B, \u0905\u0902\u0924\u093F\u092E \u0907\u091A\u094D\u091B\u093E\u0913\u0902, \u0930\u0940\u0924\u093F-\u0930\u093F\u0935\u093E\u091C\u094B\u0902 \u092A\u0930 \u091A\u0930\u094D\u091A\u093E \u0915\u0930\u0947\u0902\u0964',
                ),
                _GriefContent(
                  titleEn: 'Create meaningful moments',
                  titleHi: '\u0938\u093E\u0930\u094D\u0925\u0915 \u092A\u0932 \u092C\u0928\u093E\u090F\u0902',
                  bodyEn:
                      'Share stories, look at photos together, play their favourite music, or simply sit together in silence. These moments become precious memories.',
                  bodyHi:
                      '\u0915\u0939\u093E\u0928\u093F\u092F\u093E\u0901 \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902, \u092B\u094B\u091F\u094B \u0926\u0947\u0916\u0947\u0902, \u092A\u0938\u0902\u0926\u0940\u0926\u093E \u0938\u0902\u0917\u0940\u0924 \u092C\u091C\u093E\u090F\u0902\u0964',
                ),
                _GriefContent(
                  titleEn: 'Practical preparations',
                  titleHi: '\u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0924\u0948\u092F\u093E\u0930\u0940',
                  bodyEn:
                      'Ensure important documents are accessible. Discuss financial matters, insurance, and legal requirements when ready. Your palliative care social worker can help.',
                  bodyHi:
                      '\u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u0938\u0941\u0932\u092D \u0930\u0916\u0947\u0902\u0964 \u0935\u093F\u0924\u094D\u0924\u0940\u092F, \u092C\u0940\u092E\u093E \u0914\u0930 \u0915\u093E\u0928\u0942\u0928\u0940 \u092E\u093E\u092E\u0932\u094B\u0902 \u092A\u0930 \u091A\u0930\u094D\u091A\u093E \u0915\u0930\u0947\u0902\u0964',
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // Helpline card
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.lavender.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(
                  color: AppColors.lavender.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.phone_in_talk,
                          size: 20, color: AppColors.teal),
                      const SizedBox(width: 8),
                      Text(
                        'Grief & Bereavement Support',
                        style: AppTypography.label.copyWith(
                          color: AppColors.teal,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '\u0936\u094B\u0915 \u0938\u0939\u093E\u092F\u0924\u093E',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  _helpline('iCall (TISS)', '9152987821', 'Mon-Sat 8 AM \u2013 10 PM'),
                  const SizedBox(height: 6),
                  _helpline('Vandrevala Foundation', '1860-2662-345', '24/7'),
                  const SizedBox(height: 6),
                  _helpline('AIIMS Palliative Care', '011-2658-8500', 'Mon-Fri 9 AM \u2013 5 PM'),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
    String emoji,
    String titleEn,
    String titleHi,
    Color color,
    List<_GriefContent> items,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 6),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titleEn,
                  style: AppTypography.heading4.copyWith(color: color),
                ),
                Text(
                  titleHi,
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.surfaceCard,
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusCard),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.titleEn,
                      style: AppTypography.label.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      item.titleHi,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.bodyEn,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.5,
                      ),
                    ),
                    if (item.bodyHi.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        item.bodyHi,
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            )),
      ],
    );
  }

  Widget _helpline(String name, String phone, String hours) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name,
                  style: AppTypography.label
                      .copyWith(color: AppColors.textPrimary)),
              Text(hours,
                  style: AppTypography.caption
                      .copyWith(color: AppColors.textTertiary)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.teal.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
          ),
          child: Text(
            phone,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.teal,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

class _GriefContent {
  final String titleEn;
  final String titleHi;
  final String bodyEn;
  final String bodyHi;

  const _GriefContent({
    required this.titleEn,
    this.titleHi = '',
    required this.bodyEn,
    this.bodyHi = '',
  });
}
