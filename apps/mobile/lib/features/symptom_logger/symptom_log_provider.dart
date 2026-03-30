import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/sync_provider.dart';

/// Log mode determines the card sequence.
enum LogMode { quick, full, breakthrough }

/// In-progress symptom log entry.
class SymptomLogEntry {
  final LogMode mode;
  final int currentCard;
  final int? painIntensity;
  final Map<String, int> painLocations; // zoneId → intensity
  final List<String> painQualities;
  final List<String> aggravators;
  final List<String> relievers;
  final Map<String, int> esasScores; // symptom → 0-10
  final String? mood;
  final String? sleepQuality;
  final int? sleepHours;
  final String? notes;

  const SymptomLogEntry({
    this.mode = LogMode.full,
    this.currentCard = 0,
    this.painIntensity,
    this.painLocations = const {},
    this.painQualities = const [],
    this.aggravators = const [],
    this.relievers = const [],
    this.esasScores = const {},
    this.mood,
    this.sleepQuality,
    this.sleepHours,
    this.notes,
  });

  int get totalCards {
    switch (mode) {
      case LogMode.quick:
        return 3;
      case LogMode.full:
        return 7;
      case LogMode.breakthrough:
        return 1;
    }
  }

  SymptomLogEntry copyWith({
    LogMode? mode,
    int? currentCard,
    int? painIntensity,
    Map<String, int>? painLocations,
    List<String>? painQualities,
    List<String>? aggravators,
    List<String>? relievers,
    Map<String, int>? esasScores,
    String? mood,
    String? sleepQuality,
    int? sleepHours,
    String? notes,
  }) {
    return SymptomLogEntry(
      mode: mode ?? this.mode,
      currentCard: currentCard ?? this.currentCard,
      painIntensity: painIntensity ?? this.painIntensity,
      painLocations: painLocations ?? this.painLocations,
      painQualities: painQualities ?? this.painQualities,
      aggravators: aggravators ?? this.aggravators,
      relievers: relievers ?? this.relievers,
      esasScores: esasScores ?? this.esasScores,
      mood: mood ?? this.mood,
      sleepQuality: sleepQuality ?? this.sleepQuality,
      sleepHours: sleepHours ?? this.sleepHours,
      notes: notes ?? this.notes,
    );
  }
}

class SymptomLogNotifier extends StateNotifier<SymptomLogEntry> {
  final Ref _ref;

  SymptomLogNotifier(this._ref) : super(const SymptomLogEntry());

  void startLog(LogMode mode) =>
      state = SymptomLogEntry(mode: mode);

  void setPainIntensity(int val) =>
      state = state.copyWith(painIntensity: val);

  void togglePainLocation(String zoneId, int intensity) {
    final locs = Map<String, int>.from(state.painLocations);
    if (locs.containsKey(zoneId)) {
      locs.remove(zoneId);
    } else {
      locs[zoneId] = intensity;
    }
    state = state.copyWith(painLocations: locs);
  }

  void setPainQualities(List<String> q) =>
      state = state.copyWith(painQualities: q);

  void togglePainQuality(String q) {
    final current = List<String>.from(state.painQualities);
    current.contains(q) ? current.remove(q) : current.add(q);
    state = state.copyWith(painQualities: current);
  }

  void toggleAggravator(String a) {
    final current = List<String>.from(state.aggravators);
    current.contains(a) ? current.remove(a) : current.add(a);
    state = state.copyWith(aggravators: current);
  }

  void toggleReliever(String r) {
    final current = List<String>.from(state.relievers);
    current.contains(r) ? current.remove(r) : current.add(r);
    state = state.copyWith(relievers: current);
  }

  void setEsasScore(String symptom, int score) {
    final scores = Map<String, int>.from(state.esasScores);
    scores[symptom] = score;
    state = state.copyWith(esasScores: scores);
  }

  void setMood(String m) => state = state.copyWith(mood: m);
  void setSleepQuality(String q) => state = state.copyWith(sleepQuality: q);
  void setSleepHours(int h) => state = state.copyWith(sleepHours: h);
  void setNotes(String n) => state = state.copyWith(notes: n);

  void nextCard() =>
      state = state.copyWith(currentCard: state.currentCard + 1);

  void prevCard() {
    if (state.currentCard > 0) {
      state = state.copyWith(currentCard: state.currentCard - 1);
    }
  }

  void reset() => state = const SymptomLogEntry();

  /// Submit the current log entry — saves locally first, then queues sync.
  /// Returns the local ID for tracking.
  Future<String> submitLog() async {
    final logData = <String, dynamic>{
      'mode': state.mode.name,
      'pain_intensity': state.painIntensity,
      'pain_locations': state.painLocations,
      'pain_qualities': state.painQualities,
      'aggravators': state.aggravators,
      'relievers': state.relievers,
      'esas_scores': state.esasScores,
      'mood': state.mood,
      'sleep_quality': state.sleepQuality,
      'sleep_hours': state.sleepHours,
      'notes': state.notes,
    };

    final localId =
        await _ref.read(syncProvider.notifier).queueSymptomLog(logData);
    reset();
    return localId;
  }
}

final symptomLogProvider =
    StateNotifierProvider<SymptomLogNotifier, SymptomLogEntry>(
  (ref) => SymptomLogNotifier(ref),
);
