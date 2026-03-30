import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Nature-themed breathing visualization.
///
/// A tree/flower blooms on inhale and releases petal particles on exhale.
/// Uses [CustomPainter] driven by [progress] (0.0 = small, 1.0 = full bloom).
class NatureSceneAnimation extends StatefulWidget {
  /// 0.0 = small/contracted, 1.0 = full bloom/expanded.
  final double progress;

  /// Current breath phase — determines behavior.
  final ExercisePhase? phase;

  /// Whether the session is paused.
  final bool isPaused;

  const NatureSceneAnimation({
    super.key,
    required this.progress,
    this.phase,
    this.isPaused = false,
  });

  @override
  State<NatureSceneAnimation> createState() => _NatureSceneAnimationState();
}

class _NatureSceneAnimationState extends State<NatureSceneAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _particleController;
  final List<_Particle> _particles = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _particleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    // Pre-generate particles
    for (int i = 0; i < 12; i++) {
      _particles.add(_Particle(
        angle: _random.nextDouble() * 2 * math.pi,
        speed: 0.3 + _random.nextDouble() * 0.7,
        size: 3 + _random.nextDouble() * 4,
        delay: _random.nextDouble(),
      ));
    }
  }

  @override
  void didUpdateWidget(NatureSceneAnimation oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isPaused && _particleController.isAnimating) {
      _particleController.stop();
    } else if (!widget.isPaused && !_particleController.isAnimating) {
      _particleController.repeat();
    }
  }

  @override
  void dispose() {
    _particleController.dispose();
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
    final color = _phaseColor(widget.phase?.phase);
    final isExhale = widget.phase?.phase == BreathPhase.exhale ||
        widget.phase?.phase == BreathPhase.hum;

    return SizedBox(
      width: maxSize,
      height: maxSize,
      child: AnimatedBuilder(
        animation: _particleController,
        builder: (context, _) {
          return CustomPaint(
            size: Size(maxSize, maxSize),
            painter: _NatureScenePainter(
              progress: widget.progress,
              color: color,
              isPaused: widget.isPaused,
              isExhale: isExhale,
              particleTime: _particleController.value,
              particles: _particles,
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.only(top: 20),
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
            ),
          );
        },
      ),
    );
  }
}

class _Particle {
  final double angle;
  final double speed;
  final double size;
  final double delay;

  const _Particle({
    required this.angle,
    required this.speed,
    required this.size,
    required this.delay,
  });
}

class _NatureScenePainter extends CustomPainter {
  final double progress;
  final Color color;
  final bool isPaused;
  final bool isExhale;
  final double particleTime;
  final List<_Particle> particles;

  _NatureScenePainter({
    required this.progress,
    required this.color,
    required this.isPaused,
    required this.isExhale,
    required this.particleTime,
    required this.particles,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final alpha = isPaused ? 0.4 : 0.8;

    // --- Stem ---
    final stemPaint = Paint()
      ..color = AppColors.sage.withValues(alpha: alpha * 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    final stemBottom = Offset(cx, cy + size.height * 0.35);
    final stemTop = Offset(cx, cy - size.height * 0.05);
    canvas.drawLine(stemBottom, stemTop, stemPaint);

    // --- Flower / Canopy ---
    final bloomScale = 0.4 + progress * 0.6;
    final petalCount = 8;

    for (int i = 0; i < petalCount; i++) {
      final angle = (i / petalCount) * 2 * math.pi - math.pi / 2;
      final petalRadius = size.width * 0.15 * bloomScale;
      final petalCx = cx + math.cos(angle) * petalRadius * 0.9;
      final petalCy = (cy - size.height * 0.05) +
          math.sin(angle) * petalRadius * 0.9;

      final petalPaint = Paint()
        ..color = color.withValues(alpha: alpha * (0.5 + progress * 0.3))
        ..style = PaintingStyle.fill;

      canvas.drawOval(
        Rect.fromCenter(
          center: Offset(petalCx, petalCy),
          width: petalRadius * 0.8,
          height: petalRadius * 1.1,
        ),
        petalPaint,
      );
    }

    // Center circle (flower center)
    final centerPaint = Paint()
      ..color = AppColors.accentHighlight.withValues(alpha: alpha * 0.7)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(
      Offset(cx, cy - size.height * 0.05),
      8 + progress * 4,
      centerPaint,
    );

    // --- Glow behind flower ---
    final glowRadius = size.width * 0.25 * bloomScale;
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color.withValues(alpha: 0.2 * progress),
          color.withValues(alpha: 0),
        ],
      ).createShader(
        Rect.fromCircle(
          center: Offset(cx, cy - size.height * 0.05),
          radius: glowRadius,
        ),
      );
    canvas.drawCircle(
      Offset(cx, cy - size.height * 0.05),
      glowRadius,
      glowPaint,
    );

    // --- Leaves on stem ---
    _drawLeaf(canvas, Offset(cx - 14, cy + size.height * 0.12),
        color, alpha * 0.6, bloomScale, false);
    _drawLeaf(canvas, Offset(cx + 14, cy + size.height * 0.22),
        color, alpha * 0.6, bloomScale, true);

    // --- Exhale particles (petals drifting) ---
    if (isExhale && !isPaused) {
      for (final p in particles) {
        final t = (particleTime + p.delay) % 1.0;
        final distance = t * size.width * 0.4 * p.speed;
        final px = cx + math.cos(p.angle) * distance;
        final py = (cy - size.height * 0.05) +
            math.sin(p.angle) * distance -
            t * 10; // slight upward drift
        final particleAlpha = (1.0 - t) * 0.6;

        if (px > 0 && px < size.width && py > 0 && py < size.height) {
          final particlePaint = Paint()
            ..color = color.withValues(alpha: particleAlpha);
          canvas.drawCircle(Offset(px, py), p.size * (1.0 - t * 0.5),
              particlePaint);
        }
      }
    }
  }

  void _drawLeaf(Canvas canvas, Offset position, Color color, double alpha,
      double scale, bool flipX) {
    final leafPaint = Paint()
      ..color = AppColors.sage.withValues(alpha: alpha)
      ..style = PaintingStyle.fill;

    final leafSize = 10.0 * scale;
    final dir = flipX ? 1.0 : -1.0;

    final path = Path();
    path.moveTo(position.dx, position.dy);
    path.quadraticBezierTo(
      position.dx + dir * leafSize * 1.5,
      position.dy - leafSize * 0.5,
      position.dx + dir * leafSize * 2,
      position.dy,
    );
    path.quadraticBezierTo(
      position.dx + dir * leafSize * 1.5,
      position.dy + leafSize * 0.5,
      position.dx,
      position.dy,
    );
    path.close();

    canvas.drawPath(path, leafPaint);
  }

  @override
  bool shouldRepaint(covariant _NatureScenePainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.isPaused != isPaused ||
        oldDelegate.isExhale != isExhale ||
        oldDelegate.particleTime != particleTime;
  }
}
