import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------

/// Type of breathing exercise.
enum ExerciseType { breathing, pranayama, meditation, relaxation }

/// Phase within a breathing cycle.
enum BreathPhase { inhale, hold, exhale, holdOut, hum }

/// Guidance verbosity during session.
enum GuidanceLevel { full, minimal, silent }

/// Background sound selection.
enum BgSound {
  none,
  rain,
  birds,
  templeBells,
  river,
  ocean,
  night,
  flute,
  whiteNoise,
}

/// Post-session mood response.
enum PostSessionMood { better, same, skip }

/// Player screen sub-view.
enum PlayerView { config, playing, complete }

/// Animation visualization style.
enum BreathAnimationStyle { circle, wave, lungs, nature }

/// Condition-specific program type.
enum ProgramCondition { pain, anxiety, sleep, breathlessness }

// ---------------------------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------------------------

/// A single phase in a breathing cycle (e.g. "inhale 4 seconds").
class ExercisePhase {
  final BreathPhase phase;
  final int durationSeconds;
  final String labelEn;
  final String labelHi;

  const ExercisePhase({
    required this.phase,
    required this.durationSeconds,
    required this.labelEn,
    required this.labelHi,
  });
}

/// Full exercise definition.
class BreatheExercise {
  final String id;
  final String nameEn;
  final String nameHi;
  final ExerciseType type;
  final String descriptionEn;
  final String descriptionHi;
  final List<ExercisePhase> phases;
  final String emoji;

  const BreatheExercise({
    required this.id,
    required this.nameEn,
    required this.nameHi,
    required this.type,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.phases,
    this.emoji = '',
  });

  /// Total seconds for one cycle.
  int get cycleDuration =>
      phases.fold(0, (sum, p) => sum + p.durationSeconds);
}

/// Ambient sound entry.
class AmbientSound {
  final BgSound sound;
  final String label;
  final String emoji;

  const AmbientSound({
    required this.sound,
    required this.label,
    required this.emoji,
  });
}

/// A multi-session breathing program for a specific condition.
class BreatheProgram {
  final String id;
  final ProgramCondition condition;
  final String nameEn;
  final String nameHi;
  final String descriptionEn;
  final String descriptionHi;
  final String emoji;
  final List<String> sessionExerciseIds; // 3 exercise IDs per program
  final List<String> sessionLabelsEn;
  final List<String> sessionLabelsHi;
  final int completedSessions;

  const BreatheProgram({
    required this.id,
    required this.condition,
    required this.nameEn,
    required this.nameHi,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.emoji,
    required this.sessionExerciseIds,
    required this.sessionLabelsEn,
    required this.sessionLabelsHi,
    this.completedSessions = 0,
  });

  int get totalSessions => sessionExerciseIds.length;
  bool get isComplete => completedSessions >= totalSessions;
  double get progress =>
      totalSessions > 0 ? completedSessions / totalSessions : 0;

  BreatheProgram copyWith({int? completedSessions}) {
    return BreatheProgram(
      id: id,
      condition: condition,
      nameEn: nameEn,
      nameHi: nameHi,
      descriptionEn: descriptionEn,
      descriptionHi: descriptionHi,
      emoji: emoji,
      sessionExerciseIds: sessionExerciseIds,
      sessionLabelsEn: sessionLabelsEn,
      sessionLabelsHi: sessionLabelsHi,
      completedSessions: completedSessions ?? this.completedSessions,
    );
  }
}

/// A completed session history entry.
class SessionHistoryEntry {
  final String id;
  final String exerciseId;
  final String exerciseNameEn;
  final DateTime completedAt;
  final int durationSeconds;
  final PostSessionMood mood;

  const SessionHistoryEntry({
    required this.id,
    required this.exerciseId,
    required this.exerciseNameEn,
    required this.completedAt,
    required this.durationSeconds,
    required this.mood,
  });
}

// ---------------------------------------------------------------------------
// SESSION STATE
// ---------------------------------------------------------------------------

class BreatheSessionState {
  final BreatheExercise? exercise;
  final PlayerView view;

  // Config
  final int durationSeconds; // total session length
  final GuidanceLevel guidance;
  final BgSound bgSound;

  // Playing
  final bool isPaused;
  final int currentPhaseIndex;
  final int phaseElapsed; // seconds elapsed in current phase
  final int currentCycle;
  final int totalCycles;
  final int totalElapsed; // seconds elapsed in entire session
  final int totalRemaining; // seconds remaining

  // Complete
  final PostSessionMood? mood;

  const BreatheSessionState({
    this.exercise,
    this.view = PlayerView.config,
    this.durationSeconds = 60,
    this.guidance = GuidanceLevel.full,
    this.bgSound = BgSound.none,
    this.isPaused = false,
    this.currentPhaseIndex = 0,
    this.phaseElapsed = 0,
    this.currentCycle = 1,
    this.totalCycles = 1,
    this.totalElapsed = 0,
    this.totalRemaining = 60,
    this.mood,
  });

  BreatheSessionState copyWith({
    BreatheExercise? exercise,
    PlayerView? view,
    int? durationSeconds,
    GuidanceLevel? guidance,
    BgSound? bgSound,
    bool? isPaused,
    int? currentPhaseIndex,
    int? phaseElapsed,
    int? currentCycle,
    int? totalCycles,
    int? totalElapsed,
    int? totalRemaining,
    PostSessionMood? mood,
  }) {
    return BreatheSessionState(
      exercise: exercise ?? this.exercise,
      view: view ?? this.view,
      durationSeconds: durationSeconds ?? this.durationSeconds,
      guidance: guidance ?? this.guidance,
      bgSound: bgSound ?? this.bgSound,
      isPaused: isPaused ?? this.isPaused,
      currentPhaseIndex: currentPhaseIndex ?? this.currentPhaseIndex,
      phaseElapsed: phaseElapsed ?? this.phaseElapsed,
      currentCycle: currentCycle ?? this.currentCycle,
      totalCycles: totalCycles ?? this.totalCycles,
      totalElapsed: totalElapsed ?? this.totalElapsed,
      totalRemaining: totalRemaining ?? this.totalRemaining,
      mood: mood ?? this.mood,
    );
  }

  /// The currently active phase, or null if no exercise.
  ExercisePhase? get currentPhase {
    if (exercise == null) return null;
    if (currentPhaseIndex >= exercise!.phases.length) return null;
    return exercise!.phases[currentPhaseIndex];
  }

  /// Progress within current phase (0.0 to 1.0).
  double get phaseProgress {
    final phase = currentPhase;
    if (phase == null || phase.durationSeconds == 0) return 0;
    return (phaseElapsed / phase.durationSeconds).clamp(0.0, 1.0);
  }

  /// Formatted remaining time "M:SS".
  String get remainingFormatted {
    final m = totalRemaining ~/ 60;
    final s = totalRemaining % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }
}

// ---------------------------------------------------------------------------
// PRACTICE STATS (mock)
// ---------------------------------------------------------------------------

class PracticeStats {
  final int sessionsThisWeek;
  final int totalMinutesThisWeek;

  const PracticeStats({
    this.sessionsThisWeek = 0,
    this.totalMinutesThisWeek = 0,
  });
}

// ---------------------------------------------------------------------------
// BREATHE STATE (top-level)
// ---------------------------------------------------------------------------

class BreatheState {
  final List<BreatheExercise> exercises;
  final BreatheSessionState session;
  final PracticeStats stats;
  final BreathAnimationStyle animationStyle;
  final bool hapticEnabled;
  final List<BreatheProgram> programs;
  final List<SessionHistoryEntry> history;

  const BreatheState({
    this.exercises = const [],
    this.session = const BreatheSessionState(),
    this.stats = const PracticeStats(),
    this.animationStyle = BreathAnimationStyle.circle,
    this.hapticEnabled = true,
    this.programs = const [],
    this.history = const [],
  });

  BreatheState copyWith({
    List<BreatheExercise>? exercises,
    BreatheSessionState? session,
    PracticeStats? stats,
    BreathAnimationStyle? animationStyle,
    bool? hapticEnabled,
    List<BreatheProgram>? programs,
    List<SessionHistoryEntry>? history,
  }) {
    return BreatheState(
      exercises: exercises ?? this.exercises,
      session: session ?? this.session,
      stats: stats ?? this.stats,
      animationStyle: animationStyle ?? this.animationStyle,
      hapticEnabled: hapticEnabled ?? this.hapticEnabled,
      programs: programs ?? this.programs,
      history: history ?? this.history,
    );
  }

  List<BreatheExercise> get breathingExercises =>
      exercises.where((e) => e.type == ExerciseType.breathing).toList();

  List<BreatheExercise> get pranayamaExercises =>
      exercises.where((e) => e.type == ExerciseType.pranayama).toList();

  List<BreatheExercise> get meditationExercises =>
      exercises.where((e) => e.type == ExerciseType.meditation).toList();

  List<BreatheExercise> get relaxationExercises =>
      exercises.where((e) => e.type == ExerciseType.relaxation).toList();

  /// The quick-start exercise (4-7-8 Breathing).
  BreatheExercise? get quickStartExercise {
    try {
      return exercises.firstWhere((e) => e.id == 'breathing_478');
    } catch (_) {
      return exercises.isNotEmpty ? exercises.first : null;
    }
  }

  /// Sessions completed today.
  int get todaySessionCount {
    final now = DateTime.now();
    return history.where((h) =>
        h.completedAt.year == now.year &&
        h.completedAt.month == now.month &&
        h.completedAt.day == now.day).length;
  }

  /// Mood trend: percentage of "better" moods in last 7 entries.
  double get moodTrendBetter {
    if (history.isEmpty) return 0;
    final recent = history.take(7).toList();
    final betterCount = recent.where((h) => h.mood == PostSessionMood.better).length;
    return betterCount / recent.length;
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class BreatheNotifier extends StateNotifier<BreatheState> {
  Timer? _timer;

  BreatheNotifier() : super(const BreatheState()) {
    _loadExercises();
    _loadStats();
    _loadPrograms();
    _loadHistory();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  // ---- Exercise catalog ----

  void _loadExercises() {
    state = state.copyWith(exercises: _exerciseCatalog);
  }

  void _loadStats() {
    // Mock stats — will be replaced with local DB query
    state = state.copyWith(
      stats: const PracticeStats(
        sessionsThisWeek: 5,
        totalMinutesThisWeek: 18,
      ),
    );
  }

  // ---- Session config ----

  void selectExercise(BreatheExercise exercise) {
    final cycles = _computeCycles(exercise, state.session.durationSeconds);
    state = state.copyWith(
      session: state.session.copyWith(
        exercise: exercise,
        view: PlayerView.config,
        currentCycle: 1,
        totalCycles: cycles,
        currentPhaseIndex: 0,
        phaseElapsed: 0,
        totalElapsed: 0,
        totalRemaining: state.session.durationSeconds,
        isPaused: false,
        mood: null,
      ),
    );
  }

  void setDuration(int seconds) {
    final cycles = state.session.exercise != null
        ? _computeCycles(state.session.exercise!, seconds)
        : 1;
    state = state.copyWith(
      session: state.session.copyWith(
        durationSeconds: seconds,
        totalRemaining: seconds,
        totalCycles: cycles,
      ),
    );
  }

  void setGuidance(GuidanceLevel level) {
    state = state.copyWith(
      session: state.session.copyWith(guidance: level),
    );
  }

  void setBgSound(BgSound sound) {
    state = state.copyWith(
      session: state.session.copyWith(bgSound: sound),
    );
  }

  int _computeCycles(BreatheExercise exercise, int totalSeconds) {
    if (exercise.cycleDuration == 0) return 1;
    return (totalSeconds / exercise.cycleDuration).ceil().clamp(1, 999);
  }

  // ---- Playback ----

  void startSession() {
    if (state.session.exercise == null) return;

    final duration = state.session.durationSeconds;
    final cycles = _computeCycles(state.session.exercise!, duration);

    state = state.copyWith(
      session: state.session.copyWith(
        view: PlayerView.playing,
        isPaused: false,
        currentPhaseIndex: 0,
        phaseElapsed: 0,
        currentCycle: 1,
        totalCycles: cycles,
        totalElapsed: 0,
        totalRemaining: duration,
      ),
    );

    _startTimer();
  }

  /// Quick start: select 4-7-8 with 1-min duration and start immediately.
  void quickStart() {
    final exercise = state.quickStartExercise;
    if (exercise == null) return;
    selectExercise(exercise);
    setDuration(60);
    startSession();
  }

  void togglePause() {
    final isPaused = !state.session.isPaused;
    state = state.copyWith(
      session: state.session.copyWith(isPaused: isPaused),
    );
    if (isPaused) {
      _timer?.cancel();
    } else {
      _startTimer();
    }
  }

  void endSession() {
    _timer?.cancel();
    state = state.copyWith(
      session: state.session.copyWith(view: PlayerView.complete),
    );
  }

  void submitMood(PostSessionMood mood) {
    state = state.copyWith(
      session: state.session.copyWith(mood: mood),
    );
    // Increment stats
    final elapsed = state.session.totalElapsed;
    state = state.copyWith(
      stats: PracticeStats(
        sessionsThisWeek: state.stats.sessionsThisWeek + 1,
        totalMinutesThisWeek:
            state.stats.totalMinutesThisWeek + (elapsed / 60).ceil(),
      ),
    );
  }

  void resetSession() {
    _timer?.cancel();
    state = state.copyWith(
      session: const BreatheSessionState(),
    );
  }

  // ---- Animation style ----

  void setBreathAnimationStyle(BreathAnimationStyle style) {
    state = state.copyWith(animationStyle: style);
  }

  void toggleHaptic() {
    state = state.copyWith(hapticEnabled: !state.hapticEnabled);
  }

  // ---- Programs ----

  void _loadPrograms() {
    state = state.copyWith(programs: _programCatalog);
  }

  void startProgramSession(String programId, int sessionIndex) {
    final program = state.programs.firstWhere(
      (p) => p.id == programId,
      orElse: () => state.programs.first,
    );
    if (sessionIndex >= program.sessionExerciseIds.length) return;

    final exerciseId = program.sessionExerciseIds[sessionIndex];
    final exercise = state.exercises.firstWhere(
      (e) => e.id == exerciseId,
      orElse: () => state.exercises.first,
    );
    selectExercise(exercise);
    setDuration(180); // 3 minutes for program sessions
  }

  void completeProgramSession(String programId) {
    final updated = state.programs.map((p) {
      if (p.id == programId && !p.isComplete) {
        return p.copyWith(completedSessions: p.completedSessions + 1);
      }
      return p;
    }).toList();
    state = state.copyWith(programs: updated);
  }

  // ---- History ----

  void _loadHistory() {
    // Mock history — will be replaced with local DB
    final now = DateTime.now();
    state = state.copyWith(history: [
      SessionHistoryEntry(
        id: 'h1',
        exerciseId: 'breathing_478',
        exerciseNameEn: '4-7-8 Breathing',
        completedAt: now.subtract(const Duration(hours: 3)),
        durationSeconds: 120,
        mood: PostSessionMood.better,
      ),
      SessionHistoryEntry(
        id: 'h2',
        exerciseId: 'pranayama_bhramari',
        exerciseNameEn: 'Bhramari',
        completedAt: now.subtract(const Duration(days: 1)),
        durationSeconds: 180,
        mood: PostSessionMood.better,
      ),
      SessionHistoryEntry(
        id: 'h3',
        exerciseId: 'breathing_box',
        exerciseNameEn: 'Box Breathing',
        completedAt: now.subtract(const Duration(days: 1, hours: 8)),
        durationSeconds: 60,
        mood: PostSessionMood.same,
      ),
      SessionHistoryEntry(
        id: 'h4',
        exerciseId: 'meditation_bodyscan',
        exerciseNameEn: 'Body Scan',
        completedAt: now.subtract(const Duration(days: 2)),
        durationSeconds: 300,
        mood: PostSessionMood.better,
      ),
      SessionHistoryEntry(
        id: 'h5',
        exerciseId: 'breathing_belly',
        exerciseNameEn: 'Deep Belly Breathing',
        completedAt: now.subtract(const Duration(days: 3)),
        durationSeconds: 120,
        mood: PostSessionMood.same,
      ),
    ]);
  }

  void recordSession(PostSessionMood mood) {
    final exercise = state.session.exercise;
    if (exercise == null) return;

    final entry = SessionHistoryEntry(
      id: 'h_${DateTime.now().millisecondsSinceEpoch}',
      exerciseId: exercise.id,
      exerciseNameEn: exercise.nameEn,
      completedAt: DateTime.now(),
      durationSeconds: state.session.totalElapsed,
      mood: mood,
    );

    state = state.copyWith(
      history: [entry, ...state.history],
    );
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
  }

  void _tick() {
    final s = state.session;
    if (s.isPaused || s.exercise == null) return;

    final newElapsed = s.totalElapsed + 1;
    final newRemaining = (s.durationSeconds - newElapsed).clamp(0, s.durationSeconds);

    // Check if session is complete
    if (newRemaining <= 0) {
      _timer?.cancel();
      state = state.copyWith(
        session: s.copyWith(
          totalElapsed: newElapsed,
          totalRemaining: 0,
          view: PlayerView.complete,
        ),
      );
      return;
    }

    final currentPhase = s.exercise!.phases[s.currentPhaseIndex];
    final newPhaseElapsed = s.phaseElapsed + 1;

    if (newPhaseElapsed >= currentPhase.durationSeconds) {
      // Advance to next phase
      int nextPhaseIndex = s.currentPhaseIndex + 1;
      int nextCycle = s.currentCycle;

      if (nextPhaseIndex >= s.exercise!.phases.length) {
        // Completed one cycle, wrap around
        nextPhaseIndex = 0;
        nextCycle = s.currentCycle + 1;
      }

      state = state.copyWith(
        session: s.copyWith(
          currentPhaseIndex: nextPhaseIndex,
          phaseElapsed: 0,
          currentCycle: nextCycle,
          totalElapsed: newElapsed,
          totalRemaining: newRemaining,
        ),
      );
    } else {
      state = state.copyWith(
        session: s.copyWith(
          phaseElapsed: newPhaseElapsed,
          totalElapsed: newElapsed,
          totalRemaining: newRemaining,
        ),
      );
    }
  }

  // -------------------------------------------------------------------------
  // EXERCISE CATALOG
  // -------------------------------------------------------------------------

  static const List<BreatheExercise> _exerciseCatalog = [
    // ---- Breathing Exercises ----
    BreatheExercise(
      id: 'breathing_478',
      nameEn: '4-7-8 Breathing',
      nameHi: '4-7-8 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\u{1F32C}\u{FE0F}',
      descriptionEn: 'Inhale 4s, Hold 7s, Exhale 8s. Calms the nervous system.',
      descriptionHi: '\u0936\u093E\u0902\u0924 \u0914\u0930 \u0917\u0939\u0930\u0940 \u0928\u0940\u0902\u0926 \u0915\u0947 \u0932\u093F\u090F',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.hold,
          durationSeconds: 7,
          labelEn: 'Hold',
          labelHi: '\u0930\u094B\u0915\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 8,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),
    BreatheExercise(
      id: 'breathing_box',
      nameEn: 'Box Breathing',
      nameHi: '\u092C\u0949\u0915\u094D\u0938 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\u{1F7E9}',
      descriptionEn: 'Equal 4s phases. Balances the mind.',
      descriptionHi: '\u092E\u0928 \u0915\u094B \u0936\u093E\u0902\u0924 \u0915\u0930\u0924\u093E \u0939\u0948',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.hold,
          durationSeconds: 4,
          labelEn: 'Hold',
          labelHi: '\u0930\u094B\u0915\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 4,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.holdOut,
          durationSeconds: 4,
          labelEn: 'Hold',
          labelHi: '\u0930\u094B\u0915\u0947\u0902',
        ),
      ],
    ),
    BreatheExercise(
      id: 'breathing_belly',
      nameEn: 'Deep Belly Breathing',
      nameHi: '\u0917\u0939\u0930\u0940 \u092A\u0947\u091F \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\u{1F343}',
      descriptionEn: 'Slow, deep breaths. Inhale 5s, Exhale 5s.',
      descriptionHi: '\u0927\u0940\u092E\u0940 \u0914\u0930 \u0917\u0939\u0930\u0940 \u0938\u093E\u0901\u0938',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 5,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 5,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),
    BreatheExercise(
      id: 'breathing_pain',
      nameEn: 'Pain-Breath Integration',
      nameHi: '\u0926\u0930\u094D\u0926-\u0936\u094D\u0935\u093E\u0938 \u090F\u0915\u0940\u0915\u0930\u0923',
      type: ExerciseType.breathing,
      emoji: '\u{1F49C}',
      descriptionEn: 'Breathe into the pain. Inhale 4s, Hold 2s, Exhale 6s.',
      descriptionHi: '\u0926\u0930\u094D\u0926 \u0915\u094B \u0938\u093E\u0901\u0938 \u0938\u0947 \u0936\u093E\u0902\u0924 \u0915\u0930\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.hold,
          durationSeconds: 2,
          labelEn: 'Hold',
          labelHi: '\u0930\u094B\u0915\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 6,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),

    // ---- Pranayama ----
    BreatheExercise(
      id: 'pranayama_anulom',
      nameEn: 'Anulom Vilom',
      nameHi: '\u0905\u0928\u0941\u0932\u094B\u092E \u0935\u093F\u0932\u094B\u092E',
      type: ExerciseType.pranayama,
      emoji: '\u{1F9D8}',
      descriptionEn: 'Alternate nostril breathing. Balances energy.',
      descriptionHi: '\u090F\u0915 \u0928\u0925\u0941\u0928\u0947 \u0938\u0947 \u0938\u093E\u0901\u0938 \u0932\u0947\u0928\u093E',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Inhale Left',
          labelHi: '\u092C\u093E\u090F\u0902 \u0938\u0947 \u0938\u093E\u0901\u0938 \u0932\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.hold,
          durationSeconds: 2,
          labelEn: 'Hold',
          labelHi: '\u0930\u094B\u0915\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 4,
          labelEn: 'Exhale Right',
          labelHi: '\u0926\u093E\u090F\u0902 \u0938\u0947 \u0938\u093E\u0901\u0938 \u091B\u094B\u0921\u093C\u0947\u0902',
        ),
      ],
    ),
    BreatheExercise(
      id: 'pranayama_bhramari',
      nameEn: 'Bhramari',
      nameHi: '\u092D\u094D\u0930\u093E\u092E\u0930\u0940',
      type: ExerciseType.pranayama,
      emoji: '\u{1F41D}',
      descriptionEn: 'Humming bee breath. Eases anxiety.',
      descriptionHi: '\u092D\u094C\u0902\u0930\u0947 \u0915\u0940 \u0917\u0941\u0902\u091C\u093E\u0930 \u0936\u094D\u0935\u093E\u0938',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.hum,
          durationSeconds: 8,
          labelEn: 'Exhale + Hum',
          labelHi: '\u0938\u093E\u0901\u0938 + \u0917\u0941\u0902\u091C\u093E\u0930',
        ),
      ],
    ),
    BreatheExercise(
      id: 'pranayama_ujjayi',
      nameEn: 'Ujjayi',
      nameHi: '\u0909\u091C\u094D\u091C\u093E\u092F\u0940',
      type: ExerciseType.pranayama,
      emoji: '\u{1F30A}',
      descriptionEn: 'Ocean breath. Warming and grounding.',
      descriptionHi: '\u0938\u092E\u0941\u0926\u094D\u0930 \u0936\u094D\u0935\u093E\u0938, \u0936\u093E\u0902\u0924\u093F \u0926\u0947\u0924\u0940 \u0939\u0948',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 5,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 5,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),

    // ---- Guided Meditations ----
    BreatheExercise(
      id: 'meditation_bodyscan',
      nameEn: 'Body Scan',
      nameHi: '\u0936\u0930\u0940\u0930 \u0938\u094D\u0915\u0948\u0928',
      type: ExerciseType.meditation,
      emoji: '\u{1F9D1}\u{200D}\u{1F3A4}',
      descriptionEn: 'Gently notice each part of your body.',
      descriptionHi: '\u0936\u0930\u0940\u0930 \u0915\u0947 \u0939\u0930 \u0939\u093F\u0938\u094D\u0938\u0947 \u092A\u0930 \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 6,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),
    BreatheExercise(
      id: 'meditation_lovingkindness',
      nameEn: 'Loving-Kindness',
      nameHi: '\u092A\u094D\u0930\u0947\u092E-\u0915\u0930\u0941\u0923\u093E',
      type: ExerciseType.meditation,
      emoji: '\u{1F49B}',
      descriptionEn: 'Send warmth to yourself and loved ones.',
      descriptionHi: '\u0905\u092A\u0928\u0947 \u0914\u0930 \u092A\u094D\u0930\u093F\u092F\u091C\u0928\u094B\u0902 \u0915\u094B \u092A\u094D\u0930\u0947\u092E \u092D\u0947\u091C\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In Love',
          labelHi: '\u092A\u094D\u0930\u0947\u092E \u0938\u093E\u0901\u0938 \u0932\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 6,
          labelEn: 'Send Kindness',
          labelHi: '\u0915\u0930\u0941\u0923\u093E \u092D\u0947\u091C\u0947\u0902',
        ),
      ],
    ),
    BreatheExercise(
      id: 'meditation_safeplace',
      nameEn: 'Safe Place',
      nameHi: '\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0938\u094D\u0925\u093E\u0928',
      type: ExerciseType.meditation,
      emoji: '\u{1F3E1}',
      descriptionEn: 'Visualize your peaceful safe space.',
      descriptionHi: '\u0905\u092A\u0928\u0940 \u0936\u093E\u0902\u0924 \u091C\u0917\u0939 \u0915\u0940 \u0915\u0932\u094D\u092A\u0928\u093E \u0915\u0930\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 5,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 5,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),
    BreatheExercise(
      id: 'meditation_painwaves',
      nameEn: 'Pain and Waves',
      nameHi: '\u0926\u0930\u094D\u0926 \u0914\u0930 \u0932\u0939\u0930\u0947\u0902',
      type: ExerciseType.meditation,
      emoji: '\u{1F30A}',
      descriptionEn: 'Imagine pain as waves that rise and fall.',
      descriptionHi: '\u0926\u0930\u094D\u0926 \u0915\u094B \u0906\u0924\u0940-\u091C\u093E\u0924\u0940 \u0932\u0939\u0930\u094B\u0902 \u0915\u0940 \u0924\u0930\u0939 \u0926\u0947\u0916\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Wave Rises',
          labelHi: '\u0932\u0939\u0930 \u0906\u0924\u0940 \u0939\u0948',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 6,
          labelEn: 'Wave Falls',
          labelHi: '\u0932\u0939\u0930 \u091C\u093E\u0924\u0940 \u0939\u0948',
        ),
      ],
    ),
    BreatheExercise(
      id: 'meditation_gratitude',
      nameEn: 'Gratitude',
      nameHi: '\u0906\u092D\u093E\u0930',
      type: ExerciseType.meditation,
      emoji: '\u{1F64F}',
      descriptionEn: 'Breathe in gratitude for small comforts.',
      descriptionHi: '\u091B\u094B\u091F\u0940 \u0916\u0941\u0936\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0906\u092D\u093E\u0930',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 4,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 6,
          labelEn: 'Breathe Out',
          labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930',
        ),
      ],
    ),

    // ---- Relaxation ----
    BreatheExercise(
      id: 'relaxation_pmr',
      nameEn: 'Progressive Muscle Relaxation',
      nameHi: '\u092A\u094D\u0930\u0917\u0924\u093F\u0936\u0940\u0932 \u092E\u093E\u0902\u0938\u092A\u0947\u0936\u0940 \u0936\u093F\u0925\u093F\u0932\u0924\u093E',
      type: ExerciseType.relaxation,
      emoji: '\u{1F4AA}',
      descriptionEn: 'Tense and release muscle groups.',
      descriptionHi: '\u092E\u093E\u0902\u0938\u092A\u0947\u0936\u093F\u092F\u094B\u0902 \u0915\u094B \u0915\u0938\u0947\u0902 \u0914\u0930 \u0922\u0940\u0932\u093E \u091B\u094B\u0921\u093C\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 5,
          labelEn: 'Tense',
          labelHi: '\u0915\u0938\u0947\u0902',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 5,
          labelEn: 'Release',
          labelHi: '\u091B\u094B\u0921\u093C\u0947\u0902',
        ),
      ],
    ),
    BreatheExercise(
      id: 'relaxation_lettinggo',
      nameEn: 'Body Letting Go',
      nameHi: '\u0936\u0930\u0940\u0930 \u0915\u094B \u0922\u0940\u0932\u093E \u091B\u094B\u0921\u093C\u0947\u0902',
      type: ExerciseType.relaxation,
      emoji: '\u{1F54A}\u{FE0F}',
      descriptionEn: 'Soften each part of the body with each breath.',
      descriptionHi: '\u0939\u0930 \u0938\u093E\u0901\u0938 \u0915\u0947 \u0938\u093E\u0925 \u0936\u0930\u0940\u0930 \u0915\u094B \u0928\u0930\u092E \u0915\u0930\u0947\u0902',
      phases: [
        ExercisePhase(
          phase: BreathPhase.inhale,
          durationSeconds: 5,
          labelEn: 'Breathe In',
          labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930',
        ),
        ExercisePhase(
          phase: BreathPhase.exhale,
          durationSeconds: 5,
          labelEn: 'Let Go',
          labelHi: '\u091B\u094B\u0921\u093C \u0926\u0947\u0902',
        ),
      ],
    ),

    // ---- NEW: 9 Additional Breathing Exercises ----

    BreatheExercise(
      id: 'breathing_pursedlip',
      nameEn: 'Pursed-Lip Breathing',
      nameHi: '\u0938\u093F\u0915\u0941\u0921\u093C\u0947 \u0939\u094B\u0902\u0920 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83d\udca8',
      descriptionEn: 'Inhale 2s, Exhale 4s through pursed lips. Ideal for COPD patients.',
      descriptionHi: 'COPD \u0930\u094B\u0917\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0906\u0926\u0930\u094D\u0936',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 2, labelEn: 'Breathe In (Nose)', labelHi: '\u0928\u093E\u0915 \u0938\u0947 \u0938\u093E\u0901\u0938'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 4, labelEn: 'Purse Lips Out', labelHi: '\u0939\u094B\u0902\u0920 \u0938\u093F\u0915\u094B\u0921\u093C\u0947\u0902'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_diaphragmatic',
      nameEn: 'Diaphragmatic Breathing',
      nameHi: '\u0921\u093E\u092F\u093E\u092B\u094D\u0930\u093E\u092E\u0948\u091F\u093F\u0915 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83e\udec3',
      descriptionEn: 'Inhale 4s, Hold 2s, Exhale 6s. Engages the diaphragm for deep body awareness.',
      descriptionHi: '\u0921\u093E\u092F\u093E\u092B\u094D\u0930\u093E\u092E \u0915\u094B \u0938\u0915\u094D\u0930\u093F\u092F \u0915\u0930\u0924\u093E \u0939\u0948',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 4, labelEn: 'Belly Rise', labelHi: '\u092A\u0947\u091F \u092B\u0942\u0932\u0947'),
        ExercisePhase(phase: BreathPhase.hold, durationSeconds: 2, labelEn: 'Hold', labelHi: '\u0930\u094B\u0915\u0947\u0902'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 6, labelEn: 'Belly Fall', labelHi: '\u092A\u0947\u091F \u0938\u093F\u0915\u0941\u0921\u093C\u0947'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_coherent',
      nameEn: 'Coherent Breathing',
      nameHi: '\u0938\u0902\u0917\u0924 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83d\udc9a',
      descriptionEn: 'Inhale 5s, Exhale 6s (~5.5 breaths/min). Optimizes heart rate variability.',
      descriptionHi: 'HRV \u0905\u0928\u0941\u0915\u0942\u0932\u0928 \u0915\u0947 \u0932\u093F\u090F',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 5, labelEn: 'Breathe In', labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 6, labelEn: 'Breathe Out', labelHi: '\u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930'),
      ],
    ),
    BreatheExercise(
      id: 'pranayama_sitali',
      nameEn: 'Sitali (Cooling Breath)',
      nameHi: '\u0936\u0940\u0924\u0932\u0940 \u092A\u094D\u0930\u093E\u0923\u093E\u092F\u093E\u092E',
      type: ExerciseType.pranayama,
      emoji: '\u2744\ufe0f',
      descriptionEn: 'Inhale through curled tongue 4s, Hold 2s, Exhale 4s. Cooling, helps with nausea.',
      descriptionHi: '\u0936\u0940\u0924\u0932 \u0914\u0930 \u092E\u093F\u091A\u0932\u0940 \u092E\u0947\u0902 \u0938\u0939\u093E\u092F\u0915',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 4, labelEn: 'Cool Inhale', labelHi: '\u0920\u0902\u0921\u0940 \u0938\u093E\u0901\u0938'),
        ExercisePhase(phase: BreathPhase.hold, durationSeconds: 2, labelEn: 'Hold', labelHi: '\u0930\u094B\u0915\u0947\u0902'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 4, labelEn: 'Exhale Nose', labelHi: '\u0928\u093E\u0915 \u0938\u0947 \u091B\u094B\u0921\u093C\u0947\u0902'),
      ],
    ),
    BreatheExercise(
      id: 'pranayama_kapalbhati',
      nameEn: 'Kapalbhati (Skull Shine)',
      nameHi: '\u0915\u092A\u093E\u0932\u092D\u093E\u0924\u093F',
      type: ExerciseType.pranayama,
      emoji: '\u2728',
      descriptionEn: 'Quick exhale 1s, Passive inhale 2s. Energizing. Avoid if pregnant or post-surgery.',
      descriptionHi: '\u090A\u0930\u094D\u091C\u093E\u0926\u093E\u092F\u0915\u0964 \u0917\u0930\u094D\u092D\u093E\u0935\u0938\u094D\u0925\u093E/\u0938\u0930\u094D\u091C\u0930\u0940 \u0915\u0947 \u092C\u093E\u0926 \u0928 \u0915\u0930\u0947\u0902',
      phases: [
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 1, labelEn: 'Sharp Exhale', labelHi: '\u0924\u0947\u091C\u093C \u091B\u094B\u0921\u093C\u0947\u0902'),
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 2, labelEn: 'Passive Inhale', labelHi: '\u0938\u0939\u091C \u0938\u093E\u0901\u0938'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_straw',
      nameEn: 'Straw Breathing',
      nameHi: '\u0938\u094D\u091F\u094D\u0930\u0949 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83e\uddcb',
      descriptionEn: 'Inhale 3s, Exhale through imaginary straw 6s. Builds lung capacity.',
      descriptionHi: '\u092B\u0947\u092B\u0921\u093C\u094B\u0902 \u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u092C\u0922\u093C\u093E\u0924\u093E \u0939\u0948',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 3, labelEn: 'Breathe In', labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 6, labelEn: 'Straw Exhale', labelHi: '\u0938\u094D\u091F\u094D\u0930\u0949 \u0938\u0947 \u091B\u094B\u0921\u093C\u0947\u0902'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_buteyko',
      nameEn: 'Buteyko Breathing',
      nameHi: '\u092C\u094D\u092F\u0942\u091F\u0947\u0915\u094B \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83d\udc43',
      descriptionEn: 'Inhale 3s, Exhale 3s, Hold 3s, Rest 3s. Nasal breathing focus.',
      descriptionHi: '\u0928\u093E\u0915 \u0938\u0947 \u0936\u094D\u0935\u093E\u0938 \u092A\u0930 \u0915\u0947\u0902\u0926\u094D\u0930\u093F\u0924',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 3, labelEn: 'Nose Inhale', labelHi: '\u0928\u093E\u0915 \u0938\u0947 \u0938\u093E\u0901\u0938'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 3, labelEn: 'Nose Exhale', labelHi: '\u0928\u093E\u0915 \u0938\u0947 \u091B\u094B\u0921\u093C\u0947\u0902'),
        ExercisePhase(phase: BreathPhase.holdOut, durationSeconds: 3, labelEn: 'Pause', labelHi: '\u0920\u0939\u0930\u0947\u0902'),
        ExercisePhase(phase: BreathPhase.hold, durationSeconds: 3, labelEn: 'Rest', labelHi: '\u0906\u0930\u093E\u092E'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_extended_exhale',
      nameEn: '2:1 Extended Exhale',
      nameHi: '2:1 \u0926\u0940\u0930\u094D\u0918 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\ud83c\udf19',
      descriptionEn: 'Inhale 4s, Exhale 8s. Activates the parasympathetic nervous system.',
      descriptionHi: '\u0917\u0939\u0930\u0940 \u0936\u093E\u0902\u0924\u093F \u0915\u0947 \u0932\u093F\u090F',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 4, labelEn: 'Breathe In', labelHi: '\u0938\u093E\u0901\u0938 \u0905\u0902\u0926\u0930'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 8, labelEn: 'Long Exhale', labelHi: '\u0932\u0902\u092C\u0940 \u0938\u093E\u0901\u0938 \u092C\u093E\u0939\u0930'),
      ],
    ),
    BreatheExercise(
      id: 'breathing_power',
      nameEn: 'Power Breathing',
      nameHi: '\u092A\u093E\u0935\u0930 \u0936\u094D\u0935\u093E\u0938',
      type: ExerciseType.breathing,
      emoji: '\u26a1',
      descriptionEn: 'Inhale 2s, Exhale 2s (rapid). Energizing. Only when feeling low energy.',
      descriptionHi: '\u090A\u0930\u094D\u091C\u093E\u0926\u093E\u092F\u0915\u0964 \u0915\u092E \u090A\u0930\u094D\u091C\u093E \u0939\u094B\u0928\u0947 \u092A\u0930 \u0939\u0940 \u0915\u0930\u0947\u0902',
      phases: [
        ExercisePhase(phase: BreathPhase.inhale, durationSeconds: 2, labelEn: 'Power In', labelHi: '\u0924\u0947\u091C\u093C \u0938\u093E\u0901\u0938'),
        ExercisePhase(phase: BreathPhase.exhale, durationSeconds: 2, labelEn: 'Power Out', labelHi: '\u0924\u0947\u091C\u093C \u091B\u094B\u0921\u093C\u0947\u0902'),
      ],
    ),
  ];
}

// ---------------------------------------------------------------------------
// AMBIENT SOUNDS LIST
// ---------------------------------------------------------------------------

const List<AmbientSound> ambientSounds = [
  AmbientSound(sound: BgSound.none, label: 'None', emoji: '\u{1F515}'),
  AmbientSound(sound: BgSound.rain, label: 'Rain', emoji: '\u{1F327}\u{FE0F}'),
  AmbientSound(sound: BgSound.birds, label: 'Birds', emoji: '\u{1F426}'),
  AmbientSound(sound: BgSound.templeBells, label: 'Bells', emoji: '\u{1F514}'),
  AmbientSound(sound: BgSound.river, label: 'River', emoji: '\u{1F3DE}\u{FE0F}'),
  AmbientSound(sound: BgSound.ocean, label: 'Ocean', emoji: '\u{1F30A}'),
  AmbientSound(sound: BgSound.night, label: 'Night', emoji: '\u{1F319}'),
  AmbientSound(sound: BgSound.flute, label: 'Flute', emoji: '\u{1F3B6}'),
  AmbientSound(sound: BgSound.whiteNoise, label: 'White', emoji: '\u{26C1}'),
];

// ---------------------------------------------------------------------------
// PROGRAM CATALOG (4 condition-specific programs, 3 sessions each)
// ---------------------------------------------------------------------------

const List<BreatheProgram> _programCatalog = [
  BreatheProgram(
    id: 'program_pain',
    condition: ProgramCondition.pain,
    nameEn: 'Breathe for Pain',
    nameHi: '\u0926\u0930\u094D\u0926 \u0915\u0947 \u0932\u093F\u090F \u0936\u094D\u0935\u093E\u0938',
    descriptionEn: 'A 3-session journey to manage pain through breath.',
    descriptionHi: '\u0938\u093E\u0901\u0938 \u0938\u0947 \u0926\u0930\u094D\u0926 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u0940 3 \u0938\u0924\u094D\u0930 \u092F\u093E\u0924\u094D\u0930\u093E',
    emoji: '\ud83d\udc9c',
    sessionExerciseIds: ['breathing_pain', 'breathing_belly', 'relaxation_lettinggo'],
    sessionLabelsEn: ['Pain-Breath Integration', 'Deep Belly', 'Body Letting Go'],
    sessionLabelsHi: ['\u0926\u0930\u094D\u0926-\u0936\u094D\u0935\u093E\u0938', '\u0917\u0939\u0930\u0940 \u092A\u0947\u091F', '\u0936\u0930\u0940\u0930 \u0922\u0940\u0932\u093E'],
  ),
  BreatheProgram(
    id: 'program_anxiety',
    condition: ProgramCondition.anxiety,
    nameEn: 'Breathe for Anxiety',
    nameHi: '\u091A\u093F\u0902\u0924\u093E \u0915\u0947 \u0932\u093F\u090F \u0936\u094D\u0935\u093E\u0938',
    descriptionEn: 'Calm your nervous system in 3 guided sessions.',
    descriptionHi: '\u0924\u0940\u0928 \u0938\u0924\u094D\u0930\u094B\u0902 \u092E\u0947\u0902 \u0924\u0902\u0924\u094D\u0930\u093F\u0915\u093E \u0924\u0902\u0924\u094D\u0930 \u0915\u094B \u0936\u093E\u0902\u0924 \u0915\u0930\u0947\u0902',
    emoji: '\ud83e\udde1',
    sessionExerciseIds: ['breathing_478', 'breathing_box', 'pranayama_bhramari'],
    sessionLabelsEn: ['4-7-8 Calming', 'Box Breathing', 'Bhramari Humming'],
    sessionLabelsHi: ['4-7-8 \u0936\u093E\u0902\u0924\u093F', '\u092C\u0949\u0915\u094D\u0938 \u0936\u094D\u0935\u093E\u0938', '\u092D\u094D\u0930\u093E\u092E\u0930\u0940'],
  ),
  BreatheProgram(
    id: 'program_sleep',
    condition: ProgramCondition.sleep,
    nameEn: 'Breathe for Sleep',
    nameHi: '\u0928\u0940\u0902\u0926 \u0915\u0947 \u0932\u093F\u090F \u0936\u094D\u0935\u093E\u0938',
    descriptionEn: 'Wind down with 3 evening breathing sessions.',
    descriptionHi: '\u0924\u0940\u0928 \u0936\u093E\u092E \u0915\u0947 \u0938\u0924\u094D\u0930\u094B\u0902 \u0938\u0947 \u0906\u0930\u093E\u092E \u092A\u093E\u090F\u0902',
    emoji: '\ud83c\udf19',
    sessionExerciseIds: ['breathing_extended_exhale', 'pranayama_ujjayi', 'relaxation_lettinggo'],
    sessionLabelsEn: ['Extended Exhale', 'Ujjayi Ocean', 'Body Letting Go'],
    sessionLabelsHi: ['\u0926\u0940\u0930\u094D\u0918 \u0936\u094D\u0935\u093E\u0938', '\u0909\u091C\u094D\u091C\u093E\u092F\u0940', '\u0936\u0930\u0940\u0930 \u0922\u0940\u0932\u093E'],
  ),
  BreatheProgram(
    id: 'program_breathlessness',
    condition: ProgramCondition.breathlessness,
    nameEn: 'Breathe for Breathlessness',
    nameHi: '\u0938\u093E\u0901\u0938 \u0915\u0940 \u0924\u0915\u0932\u0940\u092B \u0915\u0947 \u0932\u093F\u090F',
    descriptionEn: 'Build lung capacity and manage dyspnea in 3 sessions.',
    descriptionHi: '\u0924\u0940\u0928 \u0938\u0924\u094D\u0930\u094B\u0902 \u092E\u0947\u0902 \u092B\u0947\u092B\u0921\u093C\u094B\u0902 \u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u092C\u0922\u093C\u093E\u090F\u0902',
    emoji: '\ud83e\udec1',
    sessionExerciseIds: ['breathing_pursedlip', 'breathing_diaphragmatic', 'breathing_straw'],
    sessionLabelsEn: ['Pursed-Lip', 'Diaphragmatic', 'Straw Breathing'],
    sessionLabelsHi: ['\u0938\u093F\u0915\u0941\u0921\u093C\u0947 \u0939\u094B\u0902\u0920', '\u0921\u093E\u092F\u093E\u092B\u094D\u0930\u093E\u092E', '\u0938\u094D\u091F\u094D\u0930\u0949 \u0936\u094D\u0935\u093E\u0938'],
  ),
];

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final breatheProvider = StateNotifierProvider<BreatheNotifier, BreatheState>(
  (ref) => BreatheNotifier(),
);
