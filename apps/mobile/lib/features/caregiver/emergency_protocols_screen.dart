import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Emergency Protocols Screen — "What to do if..." quick access.
///
/// Provides step-by-step emergency protocols for common
/// palliative care crises that caregivers may face.
class EmergencyProtocolsScreen extends StatelessWidget {
  const EmergencyProtocolsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.accentAlert,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Emergency Protocols',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932',
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
            // Emergency number banner
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.accentAlert.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(
                  color: AppColors.accentAlert.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                children: [
                  const Icon(Icons.emergency,
                      size: 28, color: AppColors.accentAlert),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Emergency: Call 112',
                          style: AppTypography.heading4.copyWith(
                            color: AppColors.accentAlert,
                          ),
                        ),
                        Text(
                          'AIIMS Palliative Helpline: 011-2658-8500',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                        Text(
                          '\u0906\u092A\u093E\u0924\u0915\u093E\u0932: 112 \u092A\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902',
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
            const SizedBox(height: AppSpacing.md),

            // Protocol cards
            ..._protocols.map((p) => Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: _ProtocolCard(protocol: p),
                )),

            const SizedBox(height: AppSpacing.md),

            // Disclaimer
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
                  Row(
                    children: [
                      const Icon(Icons.info_outline,
                          size: 18, color: AppColors.info),
                      const SizedBox(width: 6),
                      Text(
                        'Important',
                        style: AppTypography.label.copyWith(
                          color: AppColors.info,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'These protocols are guidelines only. Always follow your care team\'s specific instructions. When in doubt, call your palliative care team.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.4,
                    ),
                  ),
                  Text(
                    '\u092F\u0947 \u0915\u0947\u0935\u0932 \u0926\u093F\u0936\u093E\u0928\u093F\u0930\u094D\u0926\u0947\u0936 \u0939\u0948\u0902\u0964 \u0938\u0902\u0926\u0947\u0939 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0905\u092A\u0928\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u091F\u0940\u092E \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964',
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
// PROTOCOL DATA
// ---------------------------------------------------------------------------

class _Protocol {
  final String emoji;
  final String titleEn;
  final String titleHi;
  final Color color;
  final List<_Step> steps;

  const _Protocol({
    required this.emoji,
    required this.titleEn,
    required this.titleHi,
    required this.color,
    required this.steps,
  });
}

class _Step {
  final String en;
  final String hi;

  const _Step(this.en, this.hi);
}

const _protocols = [
  _Protocol(
    emoji: '\ud83d\udca2',
    titleEn: 'If Pain is Uncontrolled',
    titleHi: '\u092F\u0926\u093F \u0926\u0930\u094D\u0926 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0928 \u0939\u094B',
    color: AppColors.accentAlert,
    steps: [
      _Step('Give prescribed breakthrough medication', '\u0928\u093F\u0930\u094D\u0927\u093E\u0930\u093F\u0924 \u092C\u094D\u0930\u0947\u0915\u0925\u094D\u0930\u0942 \u0926\u0935\u093E \u0926\u0947\u0902'),
      _Step('Note the time and dose given', '\u0938\u092E\u092F \u0914\u0930 \u0916\u0941\u0930\u093E\u0915 \u0928\u094B\u091F \u0915\u0930\u0947\u0902'),
      _Step('Try repositioning and comfort measures', '\u0938\u094D\u0925\u093F\u0924\u093F \u092C\u0926\u0932\u0947\u0902 \u0914\u0930 \u0906\u0930\u093E\u092E \u0926\u0947\u0902'),
      _Step('If no relief in 30 min, call palliative care team', '30 \u092E\u093F\u0928\u091F \u092E\u0947\u0902 \u0906\u0930\u093E\u092E \u0928 \u0939\u094B \u0924\u094B \u091F\u0940\u092E \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
      _Step('If severe, call Emergency 112', '\u0917\u0902\u092D\u0940\u0930 \u0939\u094B \u0924\u094B 112 \u092A\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
    ],
  ),
  _Protocol(
    emoji: '\ud83d\udca8',
    titleEn: 'If Breathing Difficulty',
    titleHi: '\u092F\u0926\u093F \u0938\u093E\u0901\u0938 \u0932\u0947\u0928\u0947 \u092E\u0947\u0902 \u0915\u0920\u093F\u0928\u093E\u0908',
    color: AppColors.info,
    steps: [
      _Step('Keep patient upright (prop with pillows)', '\u0930\u094B\u0917\u0940 \u0915\u094B \u0938\u0940\u0927\u093E \u092C\u0948\u0920\u093E\u090F\u0902 (\u0924\u0915\u093F\u092F\u0947 \u0938\u0947)'),
      _Step('Open windows for fresh air', '\u0924\u093E\u091C\u093C\u0940 \u0939\u0935\u093E \u0915\u0947 \u0932\u093F\u090F \u0916\u093F\u0921\u093C\u0915\u0940 \u0916\u094B\u0932\u0947\u0902'),
      _Step('Use fan directed at face', '\u091A\u0947\u0939\u0930\u0947 \u092A\u0930 \u092A\u0902\u0916\u093E \u091A\u0932\u093E\u090F\u0902'),
      _Step('Give prescribed oxygen if available', '\u092F\u0926\u093F \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u094B \u0924\u094B \u0911\u0915\u094D\u0938\u0940\u091C\u0928 \u0926\u0947\u0902'),
      _Step('Call palliative care team immediately', '\u0924\u0941\u0930\u0902\u0924 \u0926\u0947\u0916\u092D\u093E\u0932 \u091F\u0940\u092E \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
    ],
  ),
  _Protocol(
    emoji: '\ud83d\ude35',
    titleEn: 'If Confusion or Delirium',
    titleHi: '\u092F\u0926\u093F \u092D\u094D\u0930\u092E \u092F\u093E \u092A\u094D\u0930\u0932\u093E\u092A',
    color: AppColors.accentHighlight,
    steps: [
      _Step('Stay calm and reassure the patient', '\u0936\u093E\u0902\u0924 \u0930\u0939\u0947\u0902 \u0914\u0930 \u0930\u094B\u0917\u0940 \u0915\u094B \u0906\u0936\u094D\u0935\u0938\u094D\u0924 \u0915\u0930\u0947\u0902'),
      _Step('Keep the room well-lit and quiet', '\u0915\u092E\u0930\u0947 \u092E\u0947\u0902 \u0930\u094B\u0936\u0928\u0940 \u0914\u0930 \u0936\u093E\u0902\u0924\u093F \u0930\u0916\u0947\u0902'),
      _Step('Remove any potential hazards', '\u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0916\u0924\u0930\u0947 \u0939\u091F\u093E\u090F\u0902'),
      _Step('Do NOT restrain \u2014 guide gently', '\u092C\u093E\u0901\u0927\u0947\u0902 \u0928\u0939\u0940\u0902 \u2014 \u0927\u0940\u0930\u0947 \u0938\u0947 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0915\u0930\u0947\u0902'),
      _Step('Call care team for medication advice', '\u0926\u0935\u093E \u0938\u0932\u093E\u0939 \u0915\u0947 \u0932\u093F\u090F \u091F\u0940\u092E \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
    ],
  ),
  _Protocol(
    emoji: '\ud83e\ude78',
    titleEn: 'If Bleeding',
    titleHi: '\u092F\u0926\u093F \u0930\u0915\u094D\u0924\u0938\u094D\u0930\u093E\u0935',
    color: AppColors.accentAlert,
    steps: [
      _Step('Apply gentle, firm pressure with clean cloth', '\u0938\u093E\u092B\u093C \u0915\u092A\u0921\u093C\u0947 \u0938\u0947 \u0939\u0932\u094D\u0915\u093E \u0926\u092C\u093E\u0935 \u0926\u0947\u0902'),
      _Step('Keep the patient calm and still', '\u0930\u094B\u0917\u0940 \u0915\u094B \u0936\u093E\u0902\u0924 \u0914\u0930 \u0938\u094D\u0925\u093F\u0930 \u0930\u0916\u0947\u0902'),
      _Step('Elevate the affected area if possible', '\u092F\u0926\u093F \u0938\u0902\u092D\u0935 \u0939\u094B \u0924\u094B \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0939\u093F\u0938\u094D\u0938\u0947 \u0915\u094B \u090A\u092A\u0930 \u0909\u0920\u093E\u090F\u0902'),
      _Step('Use dark-colored towels to reduce anxiety', '\u091A\u093F\u0902\u0924\u093E \u0915\u092E \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0917\u0939\u0930\u0947 \u0930\u0902\u0917 \u0915\u0947 \u0924\u094C\u0932\u093F\u090F \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902'),
      _Step('Call care team or Emergency 112 immediately', '\u0924\u0941\u0930\u0902\u0924 \u091F\u0940\u092E \u092F\u093E 112 \u092A\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
    ],
  ),
  _Protocol(
    emoji: '\ud83e\udd22',
    titleEn: 'If Severe Nausea / Vomiting',
    titleHi: '\u092F\u0926\u093F \u0917\u0902\u092D\u0940\u0930 \u092E\u093F\u0924\u0932\u0940 / \u0909\u0932\u094D\u091F\u0940',
    color: AppColors.accentWarm,
    steps: [
      _Step('Position on side to prevent aspiration', '\u0906\u0915\u093E\u0902\u0915\u094D\u0937\u093E \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u0930\u0935\u091F \u092A\u0930 \u0932\u093F\u091F\u093E\u090F\u0902'),
      _Step('Give prescribed anti-nausea medication', '\u0928\u093F\u0930\u094D\u0927\u093E\u0930\u093F\u0924 \u092E\u093F\u0924\u0932\u0940-\u0930\u094B\u0927\u0940 \u0926\u0935\u093E \u0926\u0947\u0902'),
      _Step('Offer small sips of water or ice chips', '\u092A\u093E\u0928\u0940 \u0915\u0940 \u091B\u094B\u091F\u0940 \u091A\u0941\u0938\u094D\u0915\u093F\u092F\u093E\u0901 \u092F\u093E \u092C\u0930\u094D\u092B \u0926\u0947\u0902'),
      _Step('Avoid strong smells in the room', '\u0915\u092E\u0930\u0947 \u092E\u0947\u0902 \u0924\u0947\u091C \u0917\u0902\u0927 \u0938\u0947 \u092C\u091A\u0947\u0902'),
      _Step('Call team if vomiting persists >24 hours', '\u092F\u0926\u093F 24 \u0918\u0902\u091F\u0947 \u0938\u0947 \u0905\u0927\u093F\u0915 \u091C\u093E\u0930\u0940 \u0930\u0939\u0947 \u0924\u094B \u091F\u0940\u092E \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902'),
    ],
  ),
  _Protocol(
    emoji: '\ud83d\udca4',
    titleEn: 'If Patient is Unresponsive',
    titleHi: '\u092F\u0926\u093F \u0930\u094B\u0917\u0940 \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0930\u093F\u092F\u093E \u0928\u0939\u0940\u0902 \u0926\u0947 \u0930\u0939\u093E',
    color: AppColors.teal,
    steps: [
      _Step('Check if they are breathing', '\u091C\u093E\u0901\u091A\u0947\u0902 \u0915\u093F \u0935\u0947 \u0938\u093E\u0901\u0938 \u0932\u0947 \u0930\u0939\u0947 \u0939\u0948\u0902'),
      _Step('Speak softly \u2014 they may still hear you', '\u0927\u0940\u0930\u0947 \u0938\u0947 \u092C\u094B\u0932\u0947\u0902 \u2014 \u0935\u0947 \u0938\u0941\u0928 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902'),
      _Step('Keep them comfortable and pain-free', '\u0906\u0930\u093E\u092E \u0914\u0930 \u0926\u0930\u094D\u0926-\u092E\u0941\u0915\u094D\u0924 \u0930\u0916\u0947\u0902'),
      _Step('Continue prescribed medications', '\u0928\u093F\u0930\u094D\u0927\u093E\u0930\u093F\u0924 \u0926\u0935\u093E\u0908\u092F\u093E\u0901 \u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902'),
      _Step('Contact your palliative care team', '\u0905\u092A\u0928\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u091F\u0940\u092E \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902'),
    ],
  ),
];

// ---------------------------------------------------------------------------
// PROTOCOL CARD
// ---------------------------------------------------------------------------

class _ProtocolCard extends StatefulWidget {
  final _Protocol protocol;

  const _ProtocolCard({required this.protocol});

  @override
  State<_ProtocolCard> createState() => _ProtocolCardState();
}

class _ProtocolCardState extends State<_ProtocolCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final p = widget.protocol;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: p.color.withValues(alpha: 0.25)),
      ),
      child: Column(
        children: [
          // Header
          GestureDetector(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: p.color.withValues(alpha: 0.06),
                borderRadius: _expanded
                    ? const BorderRadius.vertical(
                        top: Radius.circular(AppSpacing.radiusCard))
                    : BorderRadius.circular(AppSpacing.radiusCard),
              ),
              child: Row(
                children: [
                  Text(p.emoji, style: const TextStyle(fontSize: 22)),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          p.titleEn,
                          style: AppTypography.label.copyWith(
                            color: p.color,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          p.titleHi,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: p.color,
                  ),
                ],
              ),
            ),
          ),

          // Steps
          if (_expanded)
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                children: p.steps.asMap().entries.map((entry) {
                  final i = entry.key;
                  final step = entry.value;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: p.color.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '${i + 1}',
                            style: AppTypography.caption.copyWith(
                              color: p.color,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                step.en,
                                style: AppTypography.bodyDefault.copyWith(
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                step.hi,
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.charcoalLight,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }
}
