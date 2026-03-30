import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Patient Status Dashboard — 24-hour at-a-glance widget.
///
/// Shows last pain score, mood, medications given, and sleep quality
/// from the past 24 hours. Used on the caregiver home screen.
class PatientStatusDashboard extends StatelessWidget {
  final String patientName;
  final int lastPainScore;
  final String lastMood;
  final String lastMoodHi;
  final int medsGiven;
  final int medsTotal;
  final String sleepQuality;

  const PatientStatusDashboard({
    super.key,
    required this.patientName,
    this.lastPainScore = 4,
    this.lastMood = 'Calm',
    this.lastMoodHi = '\u0936\u093E\u0902\u0924',
    this.medsGiven = 5,
    this.medsTotal = 7,
    this.sleepQuality = 'Fair',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.accentWarm.withValues(alpha: 0.12),
            AppColors.teal.withValues(alpha: 0.06),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        border: Border.all(
          color: AppColors.accentWarm.withValues(alpha: 0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.accentWarm.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: const Text('\ud83d\udc64',
                    style: TextStyle(fontSize: 18)),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$patientName \u2014 Last 24 Hours',
                      style: AppTypography.heading4.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                    Text(
                      '\u092A\u093F\u091B\u0932\u0947 24 \u0918\u0902\u091F\u0947',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              _StatusTile(
                emoji: '\ud83d\udcca',
                label: 'Pain',
                value: '$lastPainScore/10',
                valueColor:
                    lastPainScore > 6 ? AppColors.accentAlert : AppColors.sage,
              ),
              const SizedBox(width: AppSpacing.sm),
              _StatusTile(
                emoji: '\ud83d\ude0a',
                label: 'Mood',
                value: lastMood,
                valueColor: AppColors.teal,
              ),
              const SizedBox(width: AppSpacing.sm),
              _StatusTile(
                emoji: '\ud83d\udc8a',
                label: 'Meds',
                value: '$medsGiven/$medsTotal',
                valueColor: medsGiven == medsTotal
                    ? AppColors.sage
                    : AppColors.accentHighlight,
              ),
              const SizedBox(width: AppSpacing.sm),
              _StatusTile(
                emoji: '\ud83d\ude34',
                label: 'Sleep',
                value: sleepQuality,
                valueColor: AppColors.lavender,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatusTile extends StatelessWidget {
  final String emoji;
  final String label;
  final String value;
  final Color valueColor;

  const _StatusTile({
    required this.emoji,
    required this.label,
    required this.value,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 4),
            Text(
              value,
              style: AppTypography.label.copyWith(
                color: valueColor,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              label,
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
