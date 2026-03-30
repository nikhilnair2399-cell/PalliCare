import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Sinusoidal wave breathing visualization.
///
/// The wave amplitude rises with inhale and falls with exhale.
/// Uses [CustomPainter] driven by [progress] (0.0 = contracted, 1.0 = expanded).
class WaveAnimation extends StatefulWidget {
  /// 0.0 = fully contracted (min amplitude), 1.0 = fully expanded (max amplitude).
  final double progress;

  /// Current breath phase — determines color.
  final ExercisePhase? phase;

  /// Whether the session is paused.
  final bool isPaused;

  const WaveAnimation({
    super.key,
    required this.progress,
    this.phase,
    this.isPaused = false,
  });

  @override
  State<WaveAnimation> createState() => _WaveAnimationState();
}

class _WaveAnimationState extends State<WaveAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _shiftController;

  @override
  void initState() {
    super.initState();
    _shiftController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void didUpdateWidget(WaveAnimation oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isPaused && _shiftController.isAnimating) {
      _shiftController.stop();
    } else if (!widget.isPaused && !_shiftController.isAnimating) {
      _shiftController.repeat();
    }
  }

  @override
  void dispose() {
    _shiftController.dispose();
    super.dispose();
  }

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

    return SizedBox(
      width: maxSize,
      height: maxSize,
      child: AnimatedBuilder(
        animation: _shiftController,
        builder: (context, _) {
          return CustomPaint(
            size: Size(maxSize, maxSize),
            painter: _WavePainter(
              progress: widget.progress,
              phaseShift: _shiftController.value * 2 * math.pi,
              color: _phaseColor(widget.phase?.phase),
              isPaused: widget.isPaused,
            ),
            child: Center(
              child: widget.phase != null
                  ? Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          widget.phase!.labelEn,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.phase!.labelHi,
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.7),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    )
                  : const SizedBox.shrink(),
            ),
          );
        },
      ),
    );
  }
}

class _WavePainter extends CustomPainter {
  final double progress;
  final double phaseShift;
  final Color color;
  final bool isPaused;

  _WavePainter({
    required this.progress,
    required this.phaseShift,
    required this.color,
    required this.isPaused,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerY = size.height / 2;
    final maxAmplitude = size.height * 0.3;
    final amplitude = maxAmplitude * progress;
    final wavelength = size.width * 0.6;
    final frequency = 2 * math.pi / wavelength;

    // Draw 3 overlapping waves with decreasing opacity
    for (int layer = 2; layer >= 0; layer--) {
      final layerAmplitude = amplitude * (1.0 - layer * 0.25);
      final layerShift = phaseShift + layer * 0.7;
      final alpha = isPaused ? 0.2 + layer * 0.05 : 0.4 + layer * 0.15;

      final paint = Paint()
        ..color = color.withValues(alpha: alpha)
        ..style = PaintingStyle.fill;

      final path = Path();
      path.moveTo(0, size.height);

      for (double x = 0; x <= size.width; x += 1) {
        final y =
            centerY + layerAmplitude * math.sin(frequency * x + layerShift);
        path.lineTo(x, y);
      }

      path.lineTo(size.width, size.height);
      path.close();
      canvas.drawPath(path, paint);
    }

    // Draw stroke on top wave
    final strokePaint = Paint()
      ..color = color.withValues(alpha: isPaused ? 0.3 : 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    final strokePath = Path();
    for (double x = 0; x <= size.width; x += 1) {
      final y = centerY + amplitude * math.sin(frequency * x + phaseShift);
      if (x == 0) {
        strokePath.moveTo(x, y);
      } else {
        strokePath.lineTo(x, y);
      }
    }
    canvas.drawPath(strokePath, strokePaint);

    // Glow effect around center
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color.withValues(alpha: 0.2 * progress),
          color.withValues(alpha: 0),
        ],
      ).createShader(
        Rect.fromCircle(
          center: Offset(size.width / 2, centerY),
          radius: size.width * 0.4,
        ),
      );
    canvas.drawCircle(
      Offset(size.width / 2, centerY),
      size.width * 0.4,
      glowPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _WavePainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.phaseShift != phaseShift ||
        oldDelegate.color != color ||
        oldDelegate.isPaused != isPaused;
  }
}
