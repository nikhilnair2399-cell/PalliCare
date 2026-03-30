import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Financial Resources Screen — Guide to financial aid for palliative care.
///
/// Covers government schemes, national programmes, charitable organizations,
/// and practical tips for managing care costs in India.
class FinancialResourcesScreen extends StatelessWidget {
  const FinancialResourcesScreen({super.key});

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
              'Financial Resources',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0935\u093F\u0924\u094D\u0924\u0940\u092F \u0938\u0902\u0938\u093E\u0927\u0928',
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
            // Header card
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.accentHighlight.withValues(alpha: 0.12),
                    AppColors.accentWarm.withValues(alpha: 0.06),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
                border: Border.all(
                  color: AppColors.accentHighlight.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                children: [
                  const Text('\ud83d\udcb0',
                      style: TextStyle(fontSize: 32)),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Managing care costs doesn\'t have to be overwhelming.',
                    textAlign: TextAlign.center,
                    style: AppTypography.heading4.copyWith(
                      color: AppColors.accentWarmDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '\u0926\u0947\u0916\u092D\u093E\u0932 \u0916\u0930\u094D\u091A \u0915\u093E \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u092D\u093E\u0930\u0940 \u0928\u0939\u0940\u0902 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F\u0964',
                    textAlign: TextAlign.center,
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Government Schemes
            _buildSection(
              '\ud83c\udfe4',
              'Government Schemes',
              '\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0901',
              AppColors.teal,
              _governmentSchemes,
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: National Programmes
            _buildSection(
              '\ud83c\uddee\ud83c\uddf3',
              'National Programmes',
              '\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E',
              AppColors.info,
              _nationalProgrammes,
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Charitable Organizations
            _buildSection(
              '\u2764\ufe0f',
              'Charitable Organizations',
              '\u0927\u0930\u094D\u092E\u093E\u0930\u094D\u0925 \u0938\u0902\u0938\u094D\u0925\u093E\u090F\u0901',
              AppColors.accentWarm,
              _charities,
            ),
            const SizedBox(height: AppSpacing.md),

            // Section: Practical Tips
            _buildSection(
              '\ud83d\udca1',
              'Practical Tips',
              '\u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0938\u0941\u091D\u093E\u0935',
              AppColors.accentHighlight,
              _practicalTips,
            ),

            const SizedBox(height: AppSpacing.md),

            // Note
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.info.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(
                  color: AppColors.info.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                children: [
                  Text(
                    'Ask your hospital\'s social worker or patient welfare department for help with applications. They can guide you through the process.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.4,
                    ),
                  ),
                  Text(
                    '\u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0915\u0947 \u0938\u092E\u093E\u091C \u0915\u093E\u0930\u094D\u092F\u0915\u0930\u094D\u0924\u093E \u0938\u0947 \u0906\u0935\u0947\u0926\u0928 \u092E\u0947\u0902 \u0938\u0939\u093E\u092F\u0924\u093E \u0932\u0947\u0902\u0964',
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

  Widget _buildSection(
    String emoji,
    String titleEn,
    String titleHi,
    Color color,
    List<_ResourceItem> items,
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
                      item.nameEn,
                      style: AppTypography.label.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      item.nameHi,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.descriptionEn,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.4,
                      ),
                    ),
                    if (item.descriptionHi.isNotEmpty)
                      Text(
                        item.descriptionHi,
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textTertiary,
                        ),
                      ),
                    if (item.contact != null) ...[
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.1),
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusBadge),
                        ),
                        child: Text(
                          item.contact!,
                          style: AppTypography.caption.copyWith(
                            color: color,
                            fontWeight: FontWeight.w600,
                          ),
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
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

class _ResourceItem {
  final String nameEn;
  final String nameHi;
  final String descriptionEn;
  final String descriptionHi;
  final String? contact;

  const _ResourceItem({
    required this.nameEn,
    this.nameHi = '',
    required this.descriptionEn,
    this.descriptionHi = '',
    this.contact,
  });
}

const _governmentSchemes = [
  _ResourceItem(
    nameEn: 'Ayushman Bharat (PM-JAY)',
    nameHi: '\u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092D\u093E\u0930\u0924',
    descriptionEn:
        'Covers up to \u20b95 lakh per family per year for hospitalization. Includes palliative care treatments at empanelled hospitals.',
    descriptionHi:
        '\u092A\u094D\u0930\u0924\u093F \u092A\u0930\u093F\u0935\u093E\u0930 \u092A\u094D\u0930\u0924\u093F \u0935\u0930\u094D\u0937 \u20b95 \u0932\u093E\u0916 \u0924\u0915 \u0915\u093E \u0915\u0935\u0930',
    contact: 'Helpline: 14555',
  ),
  _ResourceItem(
    nameEn: 'State Health Insurance Schemes',
    nameHi: '\u0930\u093E\u091C\u094D\u092F \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u092C\u0940\u092E\u093E',
    descriptionEn:
        'Many states have additional health insurance schemes (e.g., MP Deendayal, Rajasthan Chiranjeevi). Check your state government website for eligibility.',
    descriptionHi:
        '\u0915\u0908 \u0930\u093E\u091C\u094D\u092F\u094B\u0902 \u092E\u0947\u0902 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u092C\u0940\u092E\u093E \u092F\u094B\u091C\u0928\u093E\u090F\u0901 \u0939\u0948\u0902',
  ),
  _ResourceItem(
    nameEn: 'PM National Relief Fund',
    nameHi: '\u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0902\u0924\u094D\u0930\u0940 \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0930\u093E\u0939\u0924 \u0915\u094B\u0937',
    descriptionEn:
        'Financial assistance for medical treatment in government hospitals. Application can be submitted online at pmnrf.gov.in.',
    descriptionHi:
        '\u0938\u0930\u0915\u093E\u0930\u0940 \u0905\u0938\u094D\u092A\u0924\u093E\u0932\u094B\u0902 \u092E\u0947\u0902 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0915\u0947 \u0932\u093F\u090F \u0935\u093F\u0924\u094D\u0924\u0940\u092F \u0938\u0939\u093E\u092F\u0924\u093E',
  ),
];

const _nationalProgrammes = [
  _ResourceItem(
    nameEn: 'NPPC (National Programme for Palliative Care)',
    nameHi: '\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u092A\u0948\u0932\u093F\u090F\u091F\u093F\u0935 \u0915\u0947\u092F\u0930 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E',
    descriptionEn:
        'Government programme providing free or subsidized palliative care services including medicines, equipment, and home care visits through district hospitals.',
    descriptionHi:
        '\u091C\u093F\u0932\u093E \u0905\u0938\u094D\u092A\u0924\u093E\u0932\u094B\u0902 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0928\u093F\u0903\u0936\u0941\u0932\u094D\u0915 \u0926\u0947\u0916\u092D\u093E\u0932 \u0938\u0947\u0935\u093E\u090F\u0901',
  ),
  _ResourceItem(
    nameEn: 'AMRIT Pharmacies',
    nameHi: '\u0905\u092E\u0943\u0924 \u092B\u093E\u0930\u094D\u092E\u0947\u0938\u0940',
    descriptionEn:
        'Affordable Medicines and Reliable Implants for Treatment. Discounted medicines (up to 50-90% off MRP) at AIIMS and major government hospitals.',
    descriptionHi:
        'AIIMS \u0914\u0930 \u092A\u094D\u0930\u092E\u0941\u0916 \u0938\u0930\u0915\u093E\u0930\u0940 \u0905\u0938\u094D\u092A\u0924\u093E\u0932\u094B\u0902 \u092E\u0947\u0902 \u0930\u093F\u092F\u093E\u092F\u0924\u0940 \u0926\u0935\u093E\u0908\u092F\u093E\u0901',
  ),
];

const _charities = [
  _ResourceItem(
    nameEn: 'Can Support',
    nameHi: '\u0915\u0948\u0928 \u0938\u092A\u094B\u0930\u094D\u091F',
    descriptionEn:
        'Free home-based palliative care in Delhi NCR. Also provides financial counselling and connects families with government schemes.',
    descriptionHi:
        '\u0926\u093F\u0932\u094D\u0932\u0940 \u090F\u0928\u0938\u0940\u0906\u0930 \u092E\u0947\u0902 \u0928\u093F\u0903\u0936\u0941\u0932\u094D\u0915 \u0918\u0930-\u0906\u0927\u093E\u0930\u093F\u0924 \u0926\u0947\u0916\u092D\u093E\u0932',
    contact: '011-4198-6200',
  ),
  _ResourceItem(
    nameEn: 'Pallium India',
    nameHi: '\u092A\u0948\u0932\u093F\u092F\u092E \u0907\u0902\u0921\u093F\u092F\u093E',
    descriptionEn:
        'Based in Kerala, provides training and advocacy for palliative care across India. Connects families with local free services.',
    descriptionHi:
        '\u0915\u0947\u0930\u0932 \u0938\u094D\u0925\u093F\u0924, \u092D\u093E\u0930\u0924 \u092D\u0930 \u092E\u0947\u0902 \u0926\u0947\u0916\u092D\u093E\u0932 \u0926\u0947\u0916\u092D\u093E\u0932 \u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u0923 \u0914\u0930 \u0935\u0915\u093E\u0932\u0924',
    contact: '0484-201-0007',
  ),
  _ResourceItem(
    nameEn: 'Karunashraya (Bangalore Hospice Trust)',
    nameHi: '\u0915\u0930\u0941\u0923\u093E\u0936\u094D\u0930\u092F',
    descriptionEn:
        'Completely free hospice care in Bangalore. Home care, day care, and in-patient facilities at no charge.',
    descriptionHi:
        '\u092C\u0902\u0917\u0932\u094C\u0930 \u092E\u0947\u0902 \u092A\u0942\u0930\u094D\u0923 \u0928\u093F\u0903\u0936\u0941\u0932\u094D\u0915 \u0927\u0930\u094D\u092E\u0936\u093E\u0932\u093E \u0926\u0947\u0916\u092D\u093E\u0932',
    contact: '080-2653-5665',
  ),
];

const _practicalTips = [
  _ResourceItem(
    nameEn: 'Keep all medical bills organized',
    nameHi: '\u0938\u092D\u0940 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u092C\u093F\u0932\u094B\u0902 \u0915\u094B \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0930\u0916\u0947\u0902',
    descriptionEn:
        'Save all receipts, prescriptions, and lab reports. These are needed for insurance claims, tax deductions (Section 80DDB), and government scheme applications.',
  ),
  _ResourceItem(
    nameEn: 'Ask about generic medicines',
    nameHi: '\u091C\u0947\u0928\u0947\u0930\u093F\u0915 \u0926\u0935\u093E\u0907\u092F\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902',
    descriptionEn:
        'Generic medicines can be 70-90% cheaper than branded ones with the same efficacy. Ask your doctor about switching to generics.',
  ),
  _ResourceItem(
    nameEn: 'Tax benefits under Section 80DDB',
    nameHi: '\u0927\u093E\u0930\u093E 80DDB \u0915\u0947 \u0924\u0939\u0924 \u0915\u0930 \u0932\u093E\u092D',
    descriptionEn:
        'Deduction of up to \u20b91 lakh for treatment of specified diseases including cancer. Keep Form 10-I signed by specialist.',
  ),
];
