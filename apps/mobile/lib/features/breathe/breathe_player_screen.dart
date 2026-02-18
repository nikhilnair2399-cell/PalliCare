import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'breathe_provider.dart';
import 'breathing_circle.dart';
import 'sound_selector.dart';

/// Breathe player screen — handles config, playing, and post-session views.
///
/// Immersive: no app bar during playing. Dark background (#1A3A3A).
class BreathePlayerScreen extends ConsumerStatefulWidget {
  const BreathePlayerScreen({super.key});

  @override
  ConsumerState<BreathePlayerScreen> createState() =>
      _BreathePlayerScreenState();
}

class _BreathePlayerScreenState extends ConsumerState<BreathePlayerScreen> {
  @override
  Widget build(BuildContext context) {
    final session = ref.watch(breatheProvider).session;

    return switch (session.view) {
      PlayerView.config => _ConfigView(session: session),
      PlayerView.playing => _PlayingView(session: session),
      PlayerView.complete => _CompleteView(session: session),
    };
  }
}

// ==========================================================================
// CONFIG VIEW — Duration, Guidance, Sound, Start
// ==========================================================================

class _ConfigView extends ConsumerWidget {
  final BreatheSessionState session;
  const _ConfigView({required this.session});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exercise = session.exercise;
    if (exercise == null) {
      return const Scaffold(
        body: Center(child: Text('No exercise selected')),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () {
            ref.read(breatheProvider.notifier).resetSession();
            context.pop();
          },
        ),
        title: Text(
          exercise.nameEn,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.teal,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screenPaddingHorizontal),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: AppSpacing.space4),

              // Exercise info
              Text(
                exercise.emoji,
                style: const TextStyle(fontSize: 48),
              ),
              const SizedBox(height: AppSpacing.space3),
              Text(
                exercise.nameHi,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.charcoalLight,
                ),
              ),
              const SizedBox(height: AppSpacing.space2),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  exercise.descriptionEn,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.charcoal,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space7),

              // Duration chips
              _ConfigSection(
                label: 'Duration',
                child: _ChipRow(
                  options: const [
                    _ChipOption(label: '1 min', value: 60),
                    _ChipOption(label: '3 min', value: 180),
                    _ChipOption(label: '5 min', value: 300),
                  ],
                  selected: session.durationSeconds,
                  onSelected: (val) {
                    ref.read(breatheProvider.notifier).setDuration(val);
                  },
                ),
              ),
              const SizedBox(height: AppSpacing.space5),

              // Guidance chips
              _ConfigSection(
                label: 'Guidance',
                child: _GuidanceChipRow(
                  selected: session.guidance,
                  onSelected: (level) {
                    ref.read(breatheProvider.notifier).setGuidance(level);
                  },
                ),
              ),
              const SizedBox(height: AppSpacing.space5),

              // Sound selector
              _ConfigSection(
                label: 'Sound',
                child: SoundSelector(
                  selected: session.bgSound,
                  onChanged: (sound) {
                    ref.read(breatheProvider.notifier).setBgSound(sound);
                  },
                ),
              ),

              const Spacer(),

              // Start button
              SizedBox(
                width: double.infinity,
                height: AppSpacing.buttonHeight,
                child: ElevatedButton(
                  onPressed: () {
                    ref.read(breatheProvider.notifier).startSession();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.sage,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        AppSpacing.radiusButton,
                      ),
                    ),
                  ),
                  child: const Text(
                    'Start',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space4),
            ],
          ),
        ),
      ),
    );
  }
}

class _ConfigSection extends StatelessWidget {
  final String label;
  final Widget child;
  const _ConfigSection({required this.label, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.charcoalLight,
          ),
        ),
        const SizedBox(height: AppSpacing.space2),
        child,
      ],
    );
  }
}

class _ChipOption {
  final String label;
  final int value;
  const _ChipOption({required this.label, required this.value});
}

class _ChipRow extends StatelessWidget {
  final List<_ChipOption> options;
  final int selected;
  final ValueChanged<int> onSelected;

  const _ChipRow({
    required this.options,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: options.map((opt) {
        final isSelected = opt.value == selected;
        return Padding(
          padding: const EdgeInsets.only(right: AppSpacing.space2),
          child: ChoiceChip(
            label: Text(opt.label),
            selected: isSelected,
            onSelected: (_) => onSelected(opt.value),
            selectedColor: AppColors.sage.withValues(alpha: 0.2),
            backgroundColor: Colors.white,
            labelStyle: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              color: isSelected ? AppColors.teal : AppColors.charcoalLight,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
              side: BorderSide(
                color: isSelected
                    ? AppColors.sage.withValues(alpha: 0.4)
                    : AppColors.border,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _GuidanceChipRow extends StatelessWidget {
  final GuidanceLevel selected;
  final ValueChanged<GuidanceLevel> onSelected;

  const _GuidanceChipRow({
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    const levels = [
      (GuidanceLevel.full, 'Full'),
      (GuidanceLevel.minimal, 'Minimal'),
      (GuidanceLevel.silent, 'Silent'),
    ];

    return Row(
      children: levels.map((entry) {
        final (level, label) = entry;
        final isSelected = level == selected;
        return Padding(
          padding: const EdgeInsets.only(right: AppSpacing.space2),
          child: ChoiceChip(
            label: Text(label),
            selected: isSelected,
            onSelected: (_) => onSelected(level),
            selectedColor: AppColors.sage.withValues(alpha: 0.2),
            backgroundColor: Colors.white,
            labelStyle: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              color: isSelected ? AppColors.teal : AppColors.charcoalLight,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
              side: BorderSide(
                color: isSelected
                    ? AppColors.sage.withValues(alpha: 0.4)
                    : AppColors.border,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ==========================================================================
// PLAYING VIEW — Immersive dark background, breathing circle, controls
// ==========================================================================

class _PlayingView extends ConsumerStatefulWidget {
  final BreatheSessionState session;
  const _PlayingView({required this.session});

  @override
  ConsumerState<_PlayingView> createState() => _PlayingViewState();
}

class _PlayingViewState extends ConsumerState<_PlayingView>
    with SingleTickerProviderStateMixin {
  late AnimationController _circleController;
  late Animation<double> _circleAnimation;
  BreathPhase? _lastPhase;

  @override
  void initState() {
    super.initState();
    _circleController = AnimationController(
      vsync: this,
      duration: _phaseDuration,
    );
    _circleAnimation = _buildTween().animate(
      CurvedAnimation(parent: _circleController, curve: Curves.easeInOut),
    );
    _lastPhase = widget.session.currentPhase?.phase;
    _startPhaseAnimation();
  }

  @override
  void didUpdateWidget(_PlayingView oldWidget) {
    super.didUpdateWidget(oldWidget);
    final newPhase = widget.session.currentPhase?.phase;
    if (newPhase != _lastPhase) {
      _lastPhase = newPhase;
      _circleController.duration = _phaseDuration;
      _circleAnimation = _buildTween().animate(
        CurvedAnimation(parent: _circleController, curve: Curves.easeInOut),
      );
      _startPhaseAnimation();
    }

    if (widget.session.isPaused && _circleController.isAnimating) {
      _circleController.stop();
    } else if (!widget.session.isPaused &&
        !_circleController.isAnimating &&
        widget.session.view == PlayerView.playing) {
      _circleController.forward(from: _circleController.value);
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
    _circleController.reset();
    if (!widget.session.isPaused) {
      _circleController.forward();
    }
  }

  @override
  void dispose() {
    _circleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(breatheProvider).session;
    final exercise = session.exercise;

    return Scaffold(
      backgroundColor: AppColors.breatheBackground,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: AppSpacing.space4),

            // Exercise name
            if (exercise != null) ...[
              Text(
                exercise.nameEn,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white.withValues(alpha: 0.7),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                exercise.nameHi,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white.withValues(alpha: 0.4),
                ),
              ),
            ],
            const SizedBox(height: AppSpacing.space4),

            // Cycle counter
            Text(
              'Cycle ${session.currentCycle} of ${session.totalCycles}',
              style: TextStyle(
                fontSize: 13,
                color: Colors.white.withValues(alpha: 0.5),
              ),
            ),
            const SizedBox(height: AppSpacing.space2),

            // Timer
            Text(
              session.remainingFormatted,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.white.withValues(alpha: 0.6),
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),

            // Breathing circle — centered
            Expanded(
              child: Center(
                child: AnimatedBuilder(
                  animation: _circleAnimation,
                  builder: (context, _) {
                    return BreathingCircle(
                      progress: _circleAnimation.value,
                      phase: session.currentPhase,
                      isPaused: session.isPaused,
                    );
                  },
                ),
              ),
            ),

            // Guidance text
            if (session.guidance != GuidanceLevel.silent &&
                session.currentPhase != null) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Text(
                  _guidanceText(session),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.5),
                    fontStyle: FontStyle.italic,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space5),
            ],

            // Controls: Pause + End
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _PlayerButton(
                  icon: session.isPaused
                      ? Icons.play_arrow_rounded
                      : Icons.pause_rounded,
                  label: session.isPaused ? 'Resume' : 'Pause',
                  onTap: () {
                    ref.read(breatheProvider.notifier).togglePause();
                  },
                ),
                const SizedBox(width: AppSpacing.space7),
                _PlayerButton(
                  icon: Icons.stop_rounded,
                  label: 'End',
                  onTap: () {
                    ref.read(breatheProvider.notifier).endSession();
                  },
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space5),

            // Sound selector at bottom
            SoundSelector(
              selected: session.bgSound,
              darkMode: true,
              onChanged: (sound) {
                ref.read(breatheProvider.notifier).setBgSound(sound);
              },
            ),
            const SizedBox(height: AppSpacing.space4),
          ],
        ),
      ),
    );
  }

  String _guidanceText(BreatheSessionState session) {
    final phase = session.currentPhase?.phase;
    if (session.guidance == GuidanceLevel.minimal) {
      return session.currentPhase?.labelEn ?? '';
    }
    return switch (phase) {
      BreathPhase.inhale =>
        'Let the air fill your lungs gently...',
      BreathPhase.hold || BreathPhase.holdOut =>
        'Hold softly, no strain...',
      BreathPhase.exhale =>
        'Release slowly, let tension melt away...',
      BreathPhase.hum =>
        'Hum gently, feel the vibration...',
      null => '',
    };
  }
}

class _PlayerButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _PlayerButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: AppSpacing.minTouchTarget,
            height: AppSpacing.minTouchTarget,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.12),
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================================================
// POST-SESSION / COMPLETE VIEW
// ==========================================================================

class _CompleteView extends ConsumerWidget {
  final BreatheSessionState session;
  const _CompleteView({required this.session});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hasSubmittedMood = session.mood != null;

    return Scaffold(
      backgroundColor: AppColors.breatheBackground,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screenPaddingHorizontal),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),

              // Checkmark
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.sage.withValues(alpha: 0.2),
                ),
                child: const Icon(
                  Icons.check_rounded,
                  color: AppColors.sage,
                  size: 44,
                ),
              ),
              const SizedBox(height: AppSpacing.space6),

              // Empathic message
              const Text(
                'Well done. You showed up for yourself.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: AppSpacing.space2),
              Text(
                '\u092C\u0939\u0941\u0924 \u0905\u091A\u094D\u091B\u093E\u0964 \u0906\u092A\u0928\u0947 \u0905\u092A\u0928\u093E \u0916\u094D\u092F\u093E\u0932 \u0930\u0916\u093E\u0964',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white.withValues(alpha: 0.5),
                ),
              ),
              const SizedBox(height: AppSpacing.space8),

              // "How do you feel?" section
              if (!hasSubmittedMood) ...[
                Text(
                  'How do you feel?',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.6),
                  ),
                ),
                Text(
                  '\u0906\u092A \u0915\u0948\u0938\u093E \u092E\u0939\u0938\u0942\u0938 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.35),
                  ),
                ),
                const SizedBox(height: AppSpacing.space4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _MoodButton(
                      label: 'Better',
                      mood: PostSessionMood.better,
                      icon: Icons.sentiment_satisfied_alt,
                    ),
                    const SizedBox(width: AppSpacing.space3),
                    _MoodButton(
                      label: 'Same',
                      mood: PostSessionMood.same,
                      icon: Icons.sentiment_neutral,
                    ),
                    const SizedBox(width: AppSpacing.space3),
                    _MoodButton(
                      label: 'Skip',
                      mood: PostSessionMood.skip,
                      icon: Icons.skip_next,
                    ),
                  ],
                ),
              ] else ...[
                const Icon(
                  Icons.favorite,
                  color: AppColors.sage,
                  size: 28,
                ),
                const SizedBox(height: AppSpacing.space2),
                Text(
                  'Thank you for sharing',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.6),
                  ),
                ),
              ],

              const Spacer(),

              // Navigation buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        ref.read(breatheProvider.notifier).resetSession();
                        context.go('/breathe');
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            AppSpacing.radiusButton,
                          ),
                        ),
                      ),
                      child: const Text('Home'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space3),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        ref.read(breatheProvider.notifier).resetSession();
                        // Pop back to breathe home to pick another exercise
                        context.go('/breathe');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.sage,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            AppSpacing.radiusButton,
                          ),
                        ),
                      ),
                      child: const Text('Do Another'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.space4),
            ],
          ),
        ),
      ),
    );
  }
}

class _MoodButton extends ConsumerWidget {
  final String label;
  final PostSessionMood mood;
  final IconData icon;

  const _MoodButton({
    required this.label,
    required this.mood,
    required this.icon,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () {
        ref.read(breatheProvider.notifier).submitMood(mood);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.space3,
        ),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.15),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: Colors.white.withValues(alpha: 0.7), size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withValues(alpha: 0.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
