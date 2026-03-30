import 'dart:math' as math;

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Animated expanding / contracting breathing circle.
///
/// Uses [AnimationController] driven by the parent [TickerProvider].
/// Phase colors: Inhale = Sage Green, Hold = Teal, Exhale = Lavender.
///
/// Enhanced: Gradual color transitions using [ColorTween] instead of
/// instant color snapping, plus subtle exhale particle effects.
class BreathingCircle extends StatefulWidget {
  /// 0.0 = fully contracted (min), 1.0 = fully expanded (max).
  final double progress;

  /// Current breath phase — determines color and label.
  final ExercisePhase? phase;

  /// Whether the session is paused (dims the circle slightly).
  final bool isPaused;

  const BreathingCircle({
    super.key,
    required this.progress,
    this.phase,
    this.isPaused = false,
  });

  @override
  State<BreathingCircle> createState() => _BreathingCircleState();
}

class _BreathingCircleState extends State<BreathingCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _colorController;
  late Animation<Color?> _colorAnimation;
  late Animation<Color?> _glowAnimation;
  Color _currentColor = AppColors.sage;
  Color _currentGlow = AppColors.sage.withValues(alpha: 0.35);

  @override
  void initState() {
    super.initState();
    _colorController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _currentColor = _phaseColor(widget.phase?.phase);
    _currentGlow = _glowColor(widget.phase?.phase);
    _colorAnimation = AlwaysStoppedAnimation(_currentColor);
    _glowAnimation = AlwaysStoppedAnimation(_currentGlow);
  }

  @override
  void didUpdateWidget(BreathingCircle oldWidget) {
    super.didUpdateWidget(oldWidget);

    final newColor = _phaseColor(widget.phase?.phase);
    final newGlow = _glowColor(widget.phase?.phase);

    if (newColor != _currentColor) {
      _colorAnimation = ColorTween(
        begin: _currentColor,
        end: newColor,
      ).animate(CurvedAnimation(
        parent: _colorController,
        curve: Curves.easeInOut,
      ));
      _glowAnimation = ColorTween(
        begin: _currentGlow,
        end: newGlow,
      ).animate(CurvedAnimation(
        parent: _colorController,
        curve: Curves.easeInOut,
      ));
      _currentColor = newColor;
      _currentGlow = newGlow;
      _colorController.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _colorController.dispose();
    super.dispose();
  }

  static Color _phaseColor(BreathPhase? bp) {
    return switch (bp) {
      BreathPhase.inhale => AppColors.sage,
      BreathPhase.hold || BreathPhase.holdOut => AppColors.teal,
      BreathPhase.exhale => AppColors.lavender,
      BreathPhase.hum => AppColors.lavender,
      null => AppColors.sage,
    };
  }

  static Color _glowColor(BreathPhase? bp) {
    return switch (bp) {
      BreathPhase.inhale => AppColors.sage.withValues(alpha: 0.35),
      BreathPhase.hold || BreathPhase.holdOut =>
        AppColors.teal.withValues(alpha: 0.3),
      BreathPhase.exhale => AppColors.lavender.withValues(alpha: 0.3),
      BreathPhase.hum => AppColors.lavender.withValues(alpha: 0.3),
      null => AppColors.sage.withValues(alpha: 0.25),
    };
  }

  @override
  Widget build(BuildContext context) {
    final minSize = AppSpacing.breatheCircleMin;
    final maxSize = AppSpacing.breatheCircleMax;
    final size = minSize + (maxSize - minSize) * widget.progress;

    return AnimatedBuilder(
      animation: _colorController,
      builder: (context, _) {
        final color = _colorAnimation.value ?? _currentColor;
        final glow = _glowAnimation.value ?? _currentGlow;

        return SizedBox(
          width: maxSize + 40,
          height: maxSize + 40,
          child: CustomPaint(
            painter: _ExhaleParticlePainter(
              progress: widget.progress,
              isExhale: widget.phase?.phase == BreathPhase.exhale ||
                  widget.phase?.phase == BreathPhase.hum,
              color: color,
              isPaused: widget.isPaused,
            ),
            child: Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.isPaused
                      ? color.withValues(alpha: 0.5)
                      : color.withValues(alpha: 0.85),
                  boxShadow: [
                    BoxShadow(
                      color: glow,
                      blurRadius: 30 + widget.progress * 20,
                      spreadRadius: 5 + widget.progress * 10,
                    ),
                  ],
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
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Subtle exhale particle effect — small circles drift outward during exhale.
class _ExhaleParticlePainter extends CustomPainter {
  final double progress;
  final bool isExhale;
  final Color color;
  final bool isPaused;

  _ExhaleParticlePainter({
    required this.progress,
    required this.isExhale,
    required this.color,
    required this.isPaused,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (!isExhale || isPaused) return;

    final cx = size.width / 2;
    final cy = size.height / 2;
    final exhaleProgress = 1.0 - progress; // 0 at start, 1 at end of exhale

    // 8 particles radiating outward
    for (int i = 0; i < 8; i++) {
      final angle = (i / 8) * 2 * math.pi;
      final dist = 50 + exhaleProgress * 60;
      final px = cx + math.cos(angle) * dist;
      final py = cy + math.sin(angle) * dist;
      final alpha = (0.3 * exhaleProgress).clamp(0.0, 0.3);
      final radius = 2.0 + exhaleProgress * 2;

      final paint = Paint()..color = color.withValues(alpha: alpha);
      canvas.drawCircle(Offset(px, py), radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _ExhaleParticlePainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.isExhale != isExhale ||
        oldDelegate.color != color ||
        oldDelegate.isPaused != isPaused;
  }
}

/// A wrapper that drives the [BreathingCircle] animation smoothly
/// based on the current session state from the provider.
class AnimatedBreathingCircle extends StatefulWidget {
  final BreatheSessionState session;

  const AnimatedBreathingCircle({super.key, required this.session});

  @override
  State<AnimatedBreathingCircle> createState() =>
      _AnimatedBreathingCircleState();
}

class _AnimatedBreathingCircleState extends State<AnimatedBreathingCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  BreathPhase? _lastPhase;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: _phaseDuration,
    );
    _animation = _buildTween().animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _startPhaseAnimation();
  }

  @override
  void didUpdateWidget(AnimatedBreathingCircle oldWidget) {
    super.didUpdateWidget(oldWidget);
    final newPhase = widget.session.currentPhase?.phase;
    if (newPhase != _lastPhase) {
      _lastPhase = newPhase;
      _controller.duration = _phaseDuration;
      _animation = _buildTween().animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
      );
      _startPhaseAnimation();
    }

    if (widget.session.isPaused && _controller.isAnimating) {
      _controller.stop();
    } else if (!widget.session.isPaused &&
        !_controller.isAnimating &&
        widget.session.view == PlayerView.playing) {
      _controller.forward(from: _controller.value);
    }
  }

  Duration get _phaseDuration {
    final phase = widget.session.currentPhase;
    if (phase == null) return const Duration(seconds: 4);
    return Duration(seconds: phase.durationSeconds);
  }

  Tween<double> _buildTween() {
    final phase = widget.session.currentPhase?.phase;
    return switch (phase) {
      BreathPhase.inhale => Tween(begin: 0.0, end: 1.0),
      BreathPhase.hold || BreathPhase.holdOut => Tween(begin: 1.0, end: 1.0),
      BreathPhase.exhale => Tween(begin: 1.0, end: 0.0),
      BreathPhase.hum => Tween(begin: 1.0, end: 0.3),
      null => Tween(begin: 0.5, end: 0.5),
    };
  }

  void _startPhaseAnimation() {
    _controller.reset();
    if (!widget.session.isPaused) {
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, _) {
        return BreathingCircle(
          progress: _animation.value,
          phase: widget.session.currentPhase,
          isPaused: widget.session.isPaused,
        );
      },
    );
  }
}
