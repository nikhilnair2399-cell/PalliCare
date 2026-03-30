import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Simplified anatomical lungs breathing visualization.
///
/// Two lung shapes inflate (scale up) on inhale and deflate on exhale.
/// Uses [CustomPainter] driven by [progress] (0.0 = deflated, 1.0 = inflated).
class LungsAnimation extends StatelessWidget {
  /// 0.0 = fully deflated, 1.0 = fully inflated.
  final double progress;

  /// Current breath phase — determines color and label.
  final ExercisePhase? phase;

  /// Whether the session is paused.
  final bool isPaused;

  const LungsAnimation({
    super.key,
    required this.progress,
    this.phase,
    this.isPaused = false,
  });

  Color _phaseColor(BreathPhase? bp) {
    return switch (bp) {
      BreathPhase.inhale => AppColors.sage,
      BreathPhase.hold || BreathPhase.holdOut => AppColors.teal,
      BreathPhase.exhale => AppColors.lavender,
      BreathPhase.hum => AppColors.lavender,
      null => AppColors.sage,
    };
  }

  @override
  Widget build(BuildContext context) {
    final maxSize = AppSpacing.breatheCircleMax + 40;
    final color = _phaseColor(phase?.phase);

    return SizedBox(
      width: maxSize,
      height: maxSize,
      child: CustomPaint(
        size: Size(maxSize, maxSize),
        painter: _LungsPainter(
          progress: progress,
          color: color,
          isPaused: isPaused,
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: phase != null
                ? Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        phase!.labelEn,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        phase!.labelHi,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.7),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  )
                : const SizedBox.shrink(),
          ),
        ),
      ),
    );
  }
}

class _LungsPainter extends CustomPainter {
  final double progress;
  final Color color;
  final bool isPaused;

  _LungsPainter({
    required this.progress,
    required this.color,
    required this.isPaused,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final baseScale = 0.55 + progress * 0.45; // Scale 0.55 to 1.0
    final alpha = isPaused ? 0.4 : 0.75;

    // Trachea (top center tube)
    final tracheaPaint = Paint()
      ..color = color.withValues(alpha: alpha * 0.8)
      ..style = PaintingStyle.fill;

    final tracheaWidth = 8.0;
    final tracheaTop = cy - size.height * 0.35;
    final tracheaBottom = cy - size.height * 0.1;

    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(cx - tracheaWidth / 2, tracheaTop, tracheaWidth,
            tracheaBottom - tracheaTop),
        const Radius.circular(4),
      ),
      tracheaPaint,
    );

    // Bronchi — two angled lines from trachea bottom
    final bronchiPaint = Paint()
      ..color = color.withValues(alpha: alpha * 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    final bronchiStart = Offset(cx, tracheaBottom);
    final leftBronchi =
        Offset(cx - size.width * 0.15 * baseScale, cy + size.height * 0.02);
    final rightBronchi =
        Offset(cx + size.width * 0.15 * baseScale, cy + size.height * 0.02);

    canvas.drawLine(bronchiStart, leftBronchi, bronchiPaint);
    canvas.drawLine(bronchiStart, rightBronchi, bronchiPaint);

    // Left lung
    _drawLung(
      canvas: canvas,
      center: Offset(cx - size.width * 0.18 * baseScale, cy + size.height * 0.05),
      width: size.width * 0.32 * baseScale,
      height: size.height * 0.42 * baseScale,
      color: color,
      alpha: alpha,
      flipX: false,
    );

    // Right lung
    _drawLung(
      canvas: canvas,
      center: Offset(cx + size.width * 0.18 * baseScale, cy + size.height * 0.05),
      width: size.width * 0.32 * baseScale,
      height: size.height * 0.42 * baseScale,
      color: color,
      alpha: alpha,
      flipX: true,
    );

    // Glow effect
    final glowRadius = (size.width * 0.35) * baseScale;
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color.withValues(alpha: 0.15 * progress),
          color.withValues(alpha: 0),
        ],
      ).createShader(
        Rect.fromCircle(center: Offset(cx, cy + 10), radius: glowRadius),
      );
    canvas.drawCircle(Offset(cx, cy + 10), glowRadius, glowPaint);
  }

  void _drawLung({
    required Canvas canvas,
    required Offset center,
    required double width,
    required double height,
    required Color color,
    required double alpha,
    required bool flipX,
  }) {
    final paint = Paint()
      ..color = color.withValues(alpha: alpha)
      ..style = PaintingStyle.fill;

    final borderPaint = Paint()
      ..color = color.withValues(alpha: alpha + 0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Lung shape: rounded organic oval with flatter inner edge
    final path = Path();
    final rx = width / 2;
    final ry = height / 2;
    final innerFlatten = flipX ? -0.3 : 0.3; // flatten inner side

    // Approximate lung shape with cubic bezier
    path.moveTo(center.dx, center.dy - ry);

    // Top curve to outer edge
    path.cubicTo(
      center.dx + rx * (flipX ? 1.2 : -1.2),
      center.dy - ry * 0.6,
      center.dx + rx * (flipX ? 1.1 : -1.1),
      center.dy + ry * 0.3,
      center.dx + rx * (flipX ? 0.7 : -0.7),
      center.dy + ry,
    );

    // Bottom curve
    path.cubicTo(
      center.dx + rx * (flipX ? 0.2 : -0.2),
      center.dy + ry * 1.1,
      center.dx + rx * innerFlatten,
      center.dy + ry * 0.8,
      center.dx,
      center.dy + ry * 0.5,
    );

    // Inner edge back to top
    path.cubicTo(
      center.dx + rx * innerFlatten * 0.3,
      center.dy,
      center.dx + rx * innerFlatten * 0.2,
      center.dy - ry * 0.5,
      center.dx,
      center.dy - ry,
    );

    path.close();

    canvas.drawPath(path, paint);
    canvas.drawPath(path, borderPaint);

    // Internal branching lines (bronchioles)
    final linePaint = Paint()
      ..color = color.withValues(alpha: alpha * 0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..strokeCap = StrokeCap.round;

    final dx = flipX ? 1.0 : -1.0;
    for (int i = 0; i < 3; i++) {
      final startY = center.dy - ry * 0.2 + i * height * 0.15;
      final endX = center.dx + dx * rx * (0.4 + i * 0.1);
      final endY = startY + height * 0.08;
      canvas.drawLine(
        Offset(center.dx + dx * 4, startY),
        Offset(endX, endY),
        linePaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _LungsPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.isPaused != isPaused;
  }
}
