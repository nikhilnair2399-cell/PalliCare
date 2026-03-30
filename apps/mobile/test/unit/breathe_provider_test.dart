import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/breathe/breathe_provider.dart';

void main() {
  // ---------------------------------------------------------------------------
  // BreatheState
  // ---------------------------------------------------------------------------

  group('BreatheState', () {
    late BreatheNotifier notifier;

    setUp(() {
      notifier = BreatheNotifier();
    });

    test('default state has exercises loaded (23 total)', () {
      expect(notifier.state.exercises.length, 23);
    });

    test('breathingExercises filters correctly', () {
      final breathing = notifier.state.breathingExercises;
      expect(breathing, isNotEmpty);
      for (final e in breathing) {
        expect(e.type, ExerciseType.breathing);
      }
      expect(breathing.length, 11);
    });

    test('pranayamaExercises filters correctly', () {
      final pranayama = notifier.state.pranayamaExercises;
      expect(pranayama, isNotEmpty);
      for (final e in pranayama) {
        expect(e.type, ExerciseType.pranayama);
      }
      expect(pranayama.length, 5);
    });

    test('meditationExercises filters correctly', () {
      final meditation = notifier.state.meditationExercises;
      expect(meditation, isNotEmpty);
      for (final e in meditation) {
        expect(e.type, ExerciseType.meditation);
      }
      expect(meditation.length, 5);
    });

    test('relaxationExercises filters correctly', () {
      final relaxation = notifier.state.relaxationExercises;
      expect(relaxation, isNotEmpty);
      for (final e in relaxation) {
        expect(e.type, ExerciseType.relaxation);
      }
      expect(relaxation.length, 2);
    });

    test('todaySessionCount counts only today entries from history', () {
      // Mock history entry h1 is 3 hours ago. If we are before 3 AM local
      // time, "3 hours ago" crosses midnight and becomes yesterday, making
      // the count 0. Otherwise it is 1. Both are valid depending on clock.
      final now = DateTime.now();
      final expectedToday = now.hour >= 3 ? 1 : 0;
      expect(notifier.state.todaySessionCount, expectedToday);
    });

    test('quickStartExercise returns 4-7-8 breathing', () {
      final qs = notifier.state.quickStartExercise;
      expect(qs, isNotNull);
      expect(qs!.id, 'breathing_478');
    });

    test('programs loaded (4 total)', () {
      expect(notifier.state.programs.length, 4);
    });

    test('history loaded with mock data', () {
      expect(notifier.state.history, isNotEmpty);
      expect(notifier.state.history.length, 5);
    });

    test('moodTrendBetter calculates from history', () {
      // Mock history: 3 "better" out of 5 entries
      expect(notifier.state.moodTrendBetter, closeTo(0.6, 0.01));
    });
  });

  // ---------------------------------------------------------------------------
  // BreatheExercise
  // ---------------------------------------------------------------------------

  group('BreatheExercise', () {
    test('cycleDuration sums all phase durations', () {
      const exercise = BreatheExercise(
        id: 'test',
        nameEn: 'Test',
        nameHi: '',
        type: ExerciseType.breathing,
        descriptionEn: '',
        descriptionHi: '',
        phases: [
          ExercisePhase(
            phase: BreathPhase.inhale,
            durationSeconds: 4,
            labelEn: 'In',
            labelHi: '',
          ),
          ExercisePhase(
            phase: BreathPhase.hold,
            durationSeconds: 7,
            labelEn: 'Hold',
            labelHi: '',
          ),
          ExercisePhase(
            phase: BreathPhase.exhale,
            durationSeconds: 8,
            labelEn: 'Out',
            labelHi: '',
          ),
        ],
      );
      expect(exercise.cycleDuration, 19); // 4 + 7 + 8
    });

    test('cycleDuration is 0 for empty phases', () {
      const exercise = BreatheExercise(
        id: 'empty',
        nameEn: 'Empty',
        nameHi: '',
        type: ExerciseType.breathing,
        descriptionEn: '',
        descriptionHi: '',
        phases: [],
      );
      expect(exercise.cycleDuration, 0);
    });

    test('4-7-8 exercise has correct cycle duration', () {
      final notifier = BreatheNotifier();
      final exercise =
          notifier.state.exercises.firstWhere((e) => e.id == 'breathing_478');
      expect(exercise.cycleDuration, 19); // 4 + 7 + 8
    });

    test('box breathing has correct cycle duration', () {
      final notifier = BreatheNotifier();
      final exercise =
          notifier.state.exercises.firstWhere((e) => e.id == 'breathing_box');
      expect(exercise.cycleDuration, 16); // 4 + 4 + 4 + 4
    });
  });

  // ---------------------------------------------------------------------------
  // BreatheSessionState
  // ---------------------------------------------------------------------------

  group('BreatheSessionState', () {
    test('remainingFormatted formats seconds correctly', () {
      const session = BreatheSessionState(totalRemaining: 125);
      expect(session.remainingFormatted, '2:05');
    });

    test('remainingFormatted handles exact minutes', () {
      const session = BreatheSessionState(totalRemaining: 60);
      expect(session.remainingFormatted, '1:00');
    });

    test('remainingFormatted handles zero', () {
      const session = BreatheSessionState(totalRemaining: 0);
      expect(session.remainingFormatted, '0:00');
    });

    test('remainingFormatted handles single digit seconds', () {
      const session = BreatheSessionState(totalRemaining: 9);
      expect(session.remainingFormatted, '0:09');
    });

    test('phaseProgress returns 0.0 when no exercise', () {
      const session = BreatheSessionState();
      expect(session.phaseProgress, 0.0);
    });

    test('phaseProgress returns value in 0.0 to 1.0 range', () {
      const exercise = BreatheExercise(
        id: 'test',
        nameEn: 'Test',
        nameHi: '',
        type: ExerciseType.breathing,
        descriptionEn: '',
        descriptionHi: '',
        phases: [
          ExercisePhase(
            phase: BreathPhase.inhale,
            durationSeconds: 4,
            labelEn: 'In',
            labelHi: '',
          ),
        ],
      );
      const session = BreatheSessionState(
        exercise: exercise,
        currentPhaseIndex: 0,
        phaseElapsed: 2,
      );
      expect(session.phaseProgress, 0.5); // 2 / 4
    });

    test('phaseProgress clamps to 1.0 max', () {
      const exercise = BreatheExercise(
        id: 'test',
        nameEn: 'Test',
        nameHi: '',
        type: ExerciseType.breathing,
        descriptionEn: '',
        descriptionHi: '',
        phases: [
          ExercisePhase(
            phase: BreathPhase.inhale,
            durationSeconds: 4,
            labelEn: 'In',
            labelHi: '',
          ),
        ],
      );
      const session = BreatheSessionState(
        exercise: exercise,
        currentPhaseIndex: 0,
        phaseElapsed: 10, // more than duration
      );
      expect(session.phaseProgress, 1.0);
    });

    test('currentPhase returns null when no exercise', () {
      const session = BreatheSessionState();
      expect(session.currentPhase, isNull);
    });

    test('currentPhase returns correct phase by index', () {
      const exercise = BreatheExercise(
        id: 'test',
        nameEn: 'Test',
        nameHi: '',
        type: ExerciseType.breathing,
        descriptionEn: '',
        descriptionHi: '',
        phases: [
          ExercisePhase(
            phase: BreathPhase.inhale,
            durationSeconds: 4,
            labelEn: 'In',
            labelHi: '',
          ),
          ExercisePhase(
            phase: BreathPhase.exhale,
            durationSeconds: 8,
            labelEn: 'Out',
            labelHi: '',
          ),
        ],
      );
      const session = BreatheSessionState(
        exercise: exercise,
        currentPhaseIndex: 1,
      );
      expect(session.currentPhase!.phase, BreathPhase.exhale);
    });

    test('default session view is config', () {
      const session = BreatheSessionState();
      expect(session.view, PlayerView.config);
    });

    test('default session duration is 60 seconds', () {
      const session = BreatheSessionState();
      expect(session.durationSeconds, 60);
    });
  });

  // ---------------------------------------------------------------------------
  // BreatheNotifier
  // ---------------------------------------------------------------------------

  group('BreatheNotifier', () {
    late BreatheNotifier notifier;

    setUp(() {
      notifier = BreatheNotifier();
    });

    test('selectExercise updates session exercise', () {
      final exercise = notifier.state.exercises.first;
      notifier.selectExercise(exercise);
      expect(notifier.state.session.exercise, isNotNull);
      expect(notifier.state.session.exercise!.id, exercise.id);
    });

    test('selectExercise resets session state to config', () {
      final exercise = notifier.state.exercises.first;
      notifier.selectExercise(exercise);
      expect(notifier.state.session.view, PlayerView.config);
      expect(notifier.state.session.isPaused, false);
      expect(notifier.state.session.currentPhaseIndex, 0);
      expect(notifier.state.session.phaseElapsed, 0);
      expect(notifier.state.session.totalElapsed, 0);
      expect(notifier.state.session.mood, isNull);
    });

    test('setDuration updates session durationSeconds', () {
      notifier.setDuration(180);
      expect(notifier.state.session.durationSeconds, 180);
      expect(notifier.state.session.totalRemaining, 180);
    });

    test('setDuration computes totalCycles when exercise is set', () {
      final exercise =
          notifier.state.exercises.firstWhere((e) => e.id == 'breathing_478');
      notifier.selectExercise(exercise);
      notifier.setDuration(60);
      // cycleDuration = 19, so cycles = ceil(60/19) = 4
      expect(notifier.state.session.totalCycles, 4);
    });

    test('setGuidance updates guidance level', () {
      notifier.setGuidance(GuidanceLevel.silent);
      expect(notifier.state.session.guidance, GuidanceLevel.silent);
    });

    test('setBgSound updates sound', () {
      notifier.setBgSound(BgSound.rain);
      expect(notifier.state.session.bgSound, BgSound.rain);
    });

    test('setBreathAnimationStyle updates animation style', () {
      expect(notifier.state.animationStyle, BreathAnimationStyle.circle);
      notifier.setBreathAnimationStyle(BreathAnimationStyle.wave);
      expect(notifier.state.animationStyle, BreathAnimationStyle.wave);
    });

    test('toggleHaptic toggles hapticEnabled', () {
      expect(notifier.state.hapticEnabled, true);
      notifier.toggleHaptic();
      expect(notifier.state.hapticEnabled, false);
      notifier.toggleHaptic();
      expect(notifier.state.hapticEnabled, true);
    });

    test('endSession sets view to complete', () {
      final exercise = notifier.state.exercises.first;
      notifier.selectExercise(exercise);
      notifier.endSession();
      expect(notifier.state.session.view, PlayerView.complete);
    });

    test('submitMood records mood on session', () {
      notifier.submitMood(PostSessionMood.better);
      expect(notifier.state.session.mood, PostSessionMood.better);
    });

    test('submitMood increments stats', () {
      final sessionsBefore = notifier.state.stats.sessionsThisWeek;
      notifier.submitMood(PostSessionMood.same);
      expect(notifier.state.stats.sessionsThisWeek, sessionsBefore + 1);
    });

    test('resetSession clears session state', () {
      final exercise = notifier.state.exercises.first;
      notifier.selectExercise(exercise);
      notifier.setDuration(180);
      notifier.setBgSound(BgSound.ocean);

      notifier.resetSession();

      expect(notifier.state.session.exercise, isNull);
      expect(notifier.state.session.view, PlayerView.config);
      expect(notifier.state.session.durationSeconds, 60); // default
      expect(notifier.state.session.bgSound, BgSound.none); // default
    });

    test('completeProgramSession increments completed count', () {
      final program = notifier.state.programs.first;
      final before = program.completedSessions;

      notifier.completeProgramSession(program.id);

      final after =
          notifier.state.programs.firstWhere((p) => p.id == program.id);
      expect(after.completedSessions, before + 1);
    });

    test('completeProgramSession does nothing for already complete program', () {
      final program = notifier.state.programs.first;
      // Complete all sessions
      for (int i = 0; i < program.totalSessions; i++) {
        notifier.completeProgramSession(program.id);
      }

      final completed =
          notifier.state.programs.firstWhere((p) => p.id == program.id);
      expect(completed.isComplete, true);

      // Try to increment again
      notifier.completeProgramSession(program.id);
      final still =
          notifier.state.programs.firstWhere((p) => p.id == program.id);
      expect(still.completedSessions, program.totalSessions);
    });

    test('startProgramSession selects exercise and sets 3 min duration', () {
      final program = notifier.state.programs.first;
      notifier.startProgramSession(program.id, 0);

      expect(notifier.state.session.exercise, isNotNull);
      expect(notifier.state.session.durationSeconds, 180);
    });

    test('recordSession adds entry to history', () {
      final exercise = notifier.state.exercises.first;
      notifier.selectExercise(exercise);
      final countBefore = notifier.state.history.length;

      notifier.recordSession(PostSessionMood.better);

      expect(notifier.state.history.length, countBefore + 1);
      expect(notifier.state.history.first.exerciseId, exercise.id);
      expect(notifier.state.history.first.mood, PostSessionMood.better);
    });

    test('recordSession does nothing when no exercise selected', () {
      notifier.resetSession();
      final countBefore = notifier.state.history.length;
      notifier.recordSession(PostSessionMood.same);
      expect(notifier.state.history.length, countBefore);
    });
  });
}
