import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';

/// Animated expanding / contracting breathing circle.
///
/// Uses [AnimationController] driven by the parent [TickerProvider].
/// Phase colors: Inhale = Sage Green, Hold = Teal, Exhale = Lavender.
class BreathingCircle extends StatelessWidget {
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

  Color _phaseColor(BreathPhase? bp) {
    return switch (bp) {
      BreathPhase.inhale => AppColors.sage,
      BreathPhase.hold || BreathPhase.holdOut => AppColors.teal,
      BreathPhase.exhale => AppColors.lavender,
      BreathPhase.hum => AppColors.lavender,
      null => AppColors.sage,
    };
  }

  Color _glowColor(BreathPhase? bp) {
    return switch (bp) {
      BreathPhase.inhale => AppColors.sage.withValues(alpha: 0.35),
      BreathPhase.hold || BreathPhase.holdOut => AppColors.teal.withValues(alpha: 0.3),
      BreathPhase.exhale => AppColors.lavender.withValues(alpha: 0.3),
      BreathPhase.hum => AppColors.lavender.withValues(alpha: 0.3),
      null => AppColors.sage.withValues(alpha: 0.25),
    };
  }

  @override
  Widget build(BuildContext context) {
    final minSize = AppSpacing.breatheCircleMin;
    final maxSize = AppSpacing.breatheCircleMax;
    final size = minSize + (maxSize - minSize) * progress;
    final color = _phaseColor(phase?.phase);
    final glow = _glowColor(phase?.phase);

    return SizedBox(
      width: maxSize + 40,
      height: maxSize + 40,
      child: Center(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isPaused ? color.withValues(alpha: 0.5) : color.withValues(alpha: 0.85),
            boxShadow: [
              BoxShadow(
                color: glow,
                blurRadius: 30 + progress * 20,
                spreadRadius: 5 + progress * 10,
              ),
            ],
          ),
          child: Center(
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
    } else if (!widget.session.isPaused && !_controller.isAnimating && widget.session.view == PlayerView.playing) {
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
