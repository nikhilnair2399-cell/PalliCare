import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Burnout scale visualization widget.
///
/// Displays the Zarit Burden Interview score as a colored arc gauge
/// with severity level and recommendation text.
class BurnoutScaleWidget extends StatelessWidget {
  /// ZBI score (0-48).
  final int score;

  const BurnoutScaleWidget({super.key, required this.score});

  _BurnoutLevel get _level {
    if (score <= 10) return _BurnoutLevel.low;
    if (score <= 20) return _BurnoutLevel.mild;
    if (score <= 35) return _BurnoutLevel.moderate;
    return _BurnoutLevel.severe;
  }

  @override
  Widget build(BuildContext context) {
    final level = _level;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: level.color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: level.color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          // Score gauge
          SizedBox(
            width: 120,
            height: 70,
            child: CustomPaint(
              painter: _ArcGaugePainter(
                score: score,
                maxScore: 48,
                color: level.color,
              ),
              child: Align(
                alignment: Alignment.bottomCenter,
                child: Text(
                  '$score',
                  style: AppTypography.heading3.copyWith(
                    color: level.color,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Level badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: level.color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
            ),
            child: Text(
              level.labelEn,
              style: AppTypography.label.copyWith(
                color: level.color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            level.labelHi,
            style: AppTypography.caption.copyWith(
              color: AppColors.charcoalLight,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Recommendation
          Text(
            level.recommendation,
            textAlign: TextAlign.center,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.charcoalLight,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            level.recommendationHi,
            textAlign: TextAlign.center,
            style: AppTypography.caption.copyWith(
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}

enum _BurnoutLevel {
  low,
  mild,
  moderate,
  severe;

  String get labelEn => switch (this) {
        low => 'Low Burden',
        mild => 'Mild Burden',
        moderate => 'Moderate Burden',
        severe => 'Severe Burden',
      };

  String get labelHi => switch (this) {
        low => '\u0915\u092E \u092C\u094B\u091D',
        mild => '\u0939\u0932\u094D\u0915\u093E \u092C\u094B\u091D',
        moderate => '\u092E\u0927\u094D\u092F\u092E \u092C\u094B\u091D',
        severe => '\u0917\u0902\u092D\u0940\u0930 \u092C\u094B\u091D',
      };

  String get recommendation => switch (this) {
        low => 'You are managing well. Keep taking care of yourself.',
        mild =>
          'Consider taking regular breaks and accepting help from others.',
        moderate =>
          'Please reach out to a support group or counselor. You deserve help too.',
        severe =>
          'Please contact a counselor or helpline. Your wellbeing matters.',
      };

  String get recommendationHi => switch (this) {
        low =>
          '\u0906\u092A \u0905\u091A\u094D\u091B\u0947 \u0938\u0947 \u0938\u0902\u092D\u093E\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902',
        mild =>
          '\u0928\u093F\u092F\u092E\u093F\u0924 \u0906\u0930\u093E\u092E \u0932\u0947\u0902',
        moderate =>
          '\u0938\u0939\u093E\u092F\u0924\u093E \u0938\u092E\u0942\u0939 \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902',
        severe =>
          '\u0915\u0943\u092A\u092F\u093E \u0915\u093E\u0909\u0902\u0938\u0932\u0930 \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902',
      };

  Color get color => switch (this) {
        low => AppColors.sage,
        mild => AppColors.accentHighlight,
        moderate => AppColors.accentWarm,
        severe => AppColors.accentAlert,
      };
}

class _ArcGaugePainter extends CustomPainter {
  final int score;
  final int maxScore;
  final Color color;

  _ArcGaugePainter({
    required this.score,
    required this.maxScore,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height);
    final radius = size.width / 2 - 8;
    const startAngle = 3.14159; // pi (left)
    const sweepFull = 3.14159; // pi (semicircle)
    final sweepProgress = sweepFull * (score / maxScore).clamp(0.0, 1.0);

    // Background arc
    final bgPaint = Paint()
      ..color = AppColors.border
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepFull,
      false,
      bgPaint,
    );

    // Progress arc
    final progressPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepProgress,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _ArcGaugePainter oldDelegate) {
    return oldDelegate.score != score || oldDelegate.color != color;
  }
}
