import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Time range for diary view.
enum DiaryRange { week, month, threeMonths }

/// A single daily pain entry (from stored logs).
class DailyPainEntry {
  final DateTime date;
  final int avgPain;
  final int maxPain;
  final int minPain;
  final int logCount;
  final List<String> locations;
  final String? mood;
  final int? sleepHours;
  final double? medicationAdherence;

  const DailyPainEntry({
    required this.date,
    required this.avgPain,
    required this.maxPain,
    required this.minPain,
    this.logCount = 1,
    this.locations = const [],
    this.mood,
    this.sleepHours,
    this.medicationAdherence,
  });
}

/// State for the pain diary screen.
class PainDiaryState {
  final DiaryRange range;
  final List<DailyPainEntry> entries;
  final bool isLoading;
  final DateTime? selectedDate;

  const PainDiaryState({
    this.range = DiaryRange.week,
    this.entries = const [],
    this.isLoading = false,
    this.selectedDate,
  });

  PainDiaryState copyWith({
    DiaryRange? range,
    List<DailyPainEntry>? entries,
    bool? isLoading,
    DateTime? selectedDate,
  }) {
    return PainDiaryState(
      range: range ?? this.range,
      entries: entries ?? this.entries,
      isLoading: isLoading ?? this.isLoading,
      selectedDate: selectedDate ?? this.selectedDate,
    );
  }

  /// Average pain across all entries in range.
  double get averagePain {
    if (entries.isEmpty) return 0;
    return entries.map((e) => e.avgPain).reduce((a, b) => a + b) /
        entries.length;
  }

  /// Maximum pain recorded in range.
  int get peakPain {
    if (entries.isEmpty) return 0;
    return entries.map((e) => e.maxPain).reduce((a, b) => a > b ? a : b);
  }

  /// Total log entries in range.
  int get totalLogs {
    return entries.fold(0, (sum, e) => sum + e.logCount);
  }

  /// Pain trend: positive = increasing, negative = decreasing.
  double get trend {
    if (entries.length < 2) return 0;
    final first = entries.take(entries.length ~/ 2);
    final second = entries.skip(entries.length ~/ 2);
    final avgFirst =
        first.map((e) => e.avgPain).reduce((a, b) => a + b) / first.length;
    final avgSecond =
        second.map((e) => e.avgPain).reduce((a, b) => a + b) / second.length;
    return avgSecond - avgFirst;
  }

  /// Selected day entry, if any.
  DailyPainEntry? get selectedEntry {
    if (selectedDate == null) return null;
    try {
      return entries.firstWhere(
        (e) =>
            e.date.year == selectedDate!.year &&
            e.date.month == selectedDate!.month &&
            e.date.day == selectedDate!.day,
      );
    } catch (_) {
      return null;
    }
  }
}

class PainDiaryNotifier extends StateNotifier<PainDiaryState> {
  PainDiaryNotifier() : super(const PainDiaryState()) {
    loadEntries();
  }

  void setRange(DiaryRange range) {
    state = state.copyWith(range: range);
    loadEntries();
  }

  void selectDate(DateTime? date) {
    state = state.copyWith(selectedDate: date);
  }

  /// Load entries from local storage. Uses mock data until DB is wired.
  void loadEntries() {
    state = state.copyWith(isLoading: true);

    final now = DateTime.now();
    final days = switch (state.range) {
      DiaryRange.week => 7,
      DiaryRange.month => 30,
      DiaryRange.threeMonths => 90,
    };

    // Mock data — will be replaced with local DB query
    final entries = List.generate(days, (i) {
      final date = now.subtract(Duration(days: days - 1 - i));
      final base = (3 + (i % 5)).clamp(0, 10);
      return DailyPainEntry(
        date: date,
        avgPain: base,
        maxPain: (base + 2).clamp(0, 10),
        minPain: (base - 1).clamp(0, 10),
        logCount: i % 3 == 0 ? 2 : 1,
        locations: i % 2 == 0 ? ['lower_back', 'abdomen'] : ['chest'],
        mood: ['peaceful', 'okay', 'worried', 'sad', 'okay'][i % 5],
        sleepHours: 4 + (i % 5),
        medicationAdherence: 0.7 + (i % 4) * 0.1,
      );
    });

    state = state.copyWith(entries: entries, isLoading: false);
  }
}

final painDiaryProvider =
    StateNotifierProvider<PainDiaryNotifier, PainDiaryState>(
  (ref) => PainDiaryNotifier(),
);
