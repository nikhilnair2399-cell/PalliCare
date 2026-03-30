import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'burnout_scale_widget.dart';
import 'caregiver_provider.dart';

/// Caregiver Burnout Assessment Screen — Adapted Zarit Burden Interview.
///
/// 12 questions, each scored 0-4 (Never → Nearly Always).
/// Total 0-48 mapped to four burden levels.
class CaregiverBurnoutScreen extends ConsumerStatefulWidget {
  const CaregiverBurnoutScreen({super.key});

  @override
  ConsumerState<CaregiverBurnoutScreen> createState() =>
      _CaregiverBurnoutScreenState();
}

class _CaregiverBurnoutScreenState
    extends ConsumerState<CaregiverBurnoutScreen> {
  bool _showResult = false;

  void _submit() {
    ref.read(caregiverProvider.notifier).submitBurnoutAssessment();
    setState(() => _showResult = true);
  }

  void _retake() {
    ref.read(caregiverProvider.notifier).resetBurnoutResponses();
    setState(() => _showResult = false);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(caregiverProvider);

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
              'Burnout Check',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u092C\u0930\u094D\u0928\u0906\u0909\u091F \u091C\u093E\u0901\u091A',
              style: AppTypography.caption.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      body: _showResult ? _buildResult(state) : _buildQuestionnaire(state),
    );
  }

  Widget _buildQuestionnaire(CaregiverState state) {
    return Column(
      children: [
        // Progress
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          color: AppColors.surfaceCard,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Adapted Zarit Burden Interview',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.teal,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    '12 Questions',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'Rate how often you feel each statement applies to you.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
              Text(
                '\u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0915\u0925\u0928 \u0906\u092A \u092A\u0930 \u0915\u093F\u0924\u0928\u093E \u0932\u093E\u0917\u0942 \u0939\u094B\u0924\u093E \u0939\u0948 \u0930\u0947\u091F \u0915\u0930\u0947\u0902',
                style: AppTypography.caption.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: AppColors.border),

        // Questions list
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.md),
            itemCount: zbiQuestions.length,
            itemBuilder: (_, index) {
              return _QuestionCard(
                questionIndex: index,
                question: zbiQuestions[index],
                value: state.burnoutResponses[index],
                onChanged: (val) => ref
                    .read(caregiverProvider.notifier)
                    .setBurnoutResponse(index, val),
              );
            },
          ),
        ),

        // Submit button
        Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          color: AppColors.surfaceCard,
          child: SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accentWarm,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
              child: const Text(
                'See My Results',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildResult(CaregiverState state) {
    final score = state.lastBurnoutScore ?? state.burnoutTotal;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        children: [
          const SizedBox(height: AppSpacing.md),

          // Score visualization
          BurnoutScaleWidget(score: score),
          const SizedBox(height: AppSpacing.lg),

          // Helpline card (always shown for moderate+)
          if (score > 20) ...[
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.accentAlert.withValues(alpha: 0.08),
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(
                  color: AppColors.accentAlert.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.phone_in_talk,
                          size: 20, color: AppColors.accentAlert),
                      const SizedBox(width: 8),
                      Text(
                        'Support Helplines',
                        style: AppTypography.label.copyWith(
                          color: AppColors.accentAlert,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  _buildHelpline(
                    'iCall (TISS)',
                    '9152987821',
                    'Mon-Sat 8 AM \u2013 10 PM',
                  ),
                  const SizedBox(height: 6),
                  _buildHelpline(
                    'Vandrevala Foundation',
                    '1860-2662-345',
                    '24/7 Helpline',
                  ),
                  const SizedBox(height: 6),
                  _buildHelpline(
                    'AIIMS Palliative Care',
                    '011-2658-8500',
                    'Mon-Fri 9 AM \u2013 5 PM',
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],

          // Retake button
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: OutlinedButton(
              onPressed: _retake,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.accentWarm,
                side: const BorderSide(color: AppColors.accentWarm),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
              child: const Text(
                'Retake Assessment',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          Text(
            'This is a self-screening tool, not a clinical diagnosis.\nPlease consult a professional for formal evaluation.',
            textAlign: TextAlign.center,
            style: AppTypography.caption.copyWith(
              color: AppColors.textTertiary,
              height: 1.4,
            ),
          ),
          Text(
            '\u092F\u0939 \u0906\u0924\u094D\u092E-\u091C\u093E\u0901\u091A \u0939\u0948, \u0928\u093F\u0926\u093E\u0928 \u0928\u0939\u0940\u0902\u0964 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902\u0964',
            textAlign: TextAlign.center,
            style: AppTypography.caption.copyWith(
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHelpline(String name, String phone, String hours) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: AppTypography.label.copyWith(color: AppColors.textPrimary)),
              Text(hours, style: AppTypography.caption.copyWith(color: AppColors.textTertiary)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.accentAlert.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
          ),
          child: Text(
            phone,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.accentAlert,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// QUESTION CARD
// ---------------------------------------------------------------------------

class _QuestionCard extends StatelessWidget {
  final int questionIndex;
  final BurnoutQuestion question;
  final int value;
  final ValueChanged<int> onChanged;

  const _QuestionCard({
    required this.questionIndex,
    required this.question,
    required this.value,
    required this.onChanged,
  });

  static const _labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  static const _labelsHi = [
    '\u0915\u092D\u0940 \u0928\u0939\u0940\u0902',
    '\u0936\u093E\u092F\u0926 \u0939\u0940',
    '\u0915\u092D\u0940-\u0915\u092D\u0940',
    '\u0905\u0915\u094D\u0938\u0930',
    '\u0939\u092E\u0947\u0936\u093E',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: AppColors.accentWarm.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Text(
                  '${questionIndex + 1}',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.accentWarm,
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
                      question.textEn,
                      style: AppTypography.bodyDefault.copyWith(
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      question.textHi,
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

          // Score buttons
          Row(
            children: List.generate(5, (i) {
              final selected = i == value;
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(right: i < 4 ? 6 : 0),
                  child: GestureDetector(
                    onTap: () => onChanged(i),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: selected
                            ? _scoreColor(i).withValues(alpha: 0.15)
                            : AppColors.surface,
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusBadge),
                        border: Border.all(
                          color: selected ? _scoreColor(i) : AppColors.border,
                          width: selected ? 1.5 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            '$i',
                            style: AppTypography.label.copyWith(
                              color: selected
                                  ? _scoreColor(i)
                                  : AppColors.charcoalLight,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            _labels[i],
                            style: AppTypography.caption.copyWith(
                              color: selected
                                  ? _scoreColor(i)
                                  : AppColors.textTertiary,
                              fontSize: 9,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Color _scoreColor(int score) => switch (score) {
        0 => AppColors.sage,
        1 => AppColors.primaryLight,
        2 => AppColors.accentHighlight,
        3 => AppColors.accentWarm,
        _ => AppColors.accentAlert,
      };
}
