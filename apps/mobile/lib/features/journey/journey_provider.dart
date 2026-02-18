import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ---------------------------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------------------------

/// Goal category with icon and label.
enum GoalCategory {
  physical(Icons.directions_walk, 'Physical', 'शारीरिक'),
  social(Icons.people, 'Social', 'सामाजिक'),
  coping(Icons.self_improvement, 'Coping', 'मुकाबला'),
  selfCare(Icons.spa, 'Self-care', 'स्व-देखभाल'),
  medical(Icons.medication, 'Medical', 'चिकित्सा');

  final IconData icon;
  final String label;
  final String labelHi;
  const GoalCategory(this.icon, this.label, this.labelHi);
}

/// Frequency options for goals.
enum GoalFrequency { daily, weekdays, weekly }

/// A single intention suggestion chip.
class IntentionSuggestion {
  final String text;
  final String textHi;
  final IconData icon;

  const IntentionSuggestion({
    required this.text,
    required this.textHi,
    required this.icon,
  });
}

/// A gratitude journal entry.
class GratitudeEntry {
  final String id;
  final DateTime date;
  final String text;

  const GratitudeEntry({
    required this.id,
    required this.date,
    required this.text,
  });
}

/// A personal goal with progress tracking.
class Goal {
  final String id;
  final String title;
  final String titleHi;
  final GoalCategory category;
  final GoalFrequency frequency;
  final int targetDays;
  final int completedDays;
  final bool isActive;

  const Goal({
    required this.id,
    required this.title,
    required this.titleHi,
    required this.category,
    this.frequency = GoalFrequency.daily,
    this.targetDays = 30,
    this.completedDays = 0,
    this.isActive = true,
  });

  double get progress =>
      targetDays > 0 ? (completedDays / targetDays).clamp(0.0, 1.0) : 0;

  Goal copyWith({
    String? title,
    String? titleHi,
    GoalCategory? category,
    GoalFrequency? frequency,
    int? targetDays,
    int? completedDays,
    bool? isActive,
  }) {
    return Goal(
      id: id,
      title: title ?? this.title,
      titleHi: titleHi ?? this.titleHi,
      category: category ?? this.category,
      frequency: frequency ?? this.frequency,
      targetDays: targetDays ?? this.targetDays,
      completedDays: completedDays ?? this.completedDays,
      isActive: isActive ?? this.isActive,
    );
  }
}

/// A milestone event on the journey timeline.
class Milestone {
  final String id;
  final String title;
  final String titleHi;
  final DateTime date;
  final bool isUpcoming;

  const Milestone({
    required this.id,
    required this.title,
    required this.titleHi,
    required this.date,
    this.isUpcoming = false,
  });
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

/// Full journey module state.
class JourneyState {
  // Intentions
  final String? todayIntention;
  final String? selectedSuggestion;
  final bool intentionCompleted;
  final String? yesterdayIntention;
  final bool yesterdayCompleted;

  // Gratitude
  final List<GratitudeEntry> gratitudeEntries;

  // Goals
  final List<Goal> goals;

  // Milestones
  final List<Milestone> milestones;

  // Legacy
  final bool legacyEnabled;
  final bool legacyDismissed;

  const JourneyState({
    this.todayIntention,
    this.selectedSuggestion,
    this.intentionCompleted = false,
    this.yesterdayIntention,
    this.yesterdayCompleted = false,
    this.gratitudeEntries = const [],
    this.goals = const [],
    this.milestones = const [],
    this.legacyEnabled = false,
    this.legacyDismissed = false,
  });

  int get gratitudeCount => gratitudeEntries.length;

  List<GratitudeEntry> get recentGratitude =>
      gratitudeEntries.length > 3
          ? gratitudeEntries.sublist(0, 3)
          : gratitudeEntries;

  List<Goal> get activeGoals => goals.where((g) => g.isActive).toList();

  JourneyState copyWith({
    String? todayIntention,
    String? selectedSuggestion,
    bool? intentionCompleted,
    String? yesterdayIntention,
    bool? yesterdayCompleted,
    List<GratitudeEntry>? gratitudeEntries,
    List<Goal>? goals,
    List<Milestone>? milestones,
    bool? legacyEnabled,
    bool? legacyDismissed,
  }) {
    return JourneyState(
      todayIntention: todayIntention ?? this.todayIntention,
      selectedSuggestion: selectedSuggestion ?? this.selectedSuggestion,
      intentionCompleted: intentionCompleted ?? this.intentionCompleted,
      yesterdayIntention: yesterdayIntention ?? this.yesterdayIntention,
      yesterdayCompleted: yesterdayCompleted ?? this.yesterdayCompleted,
      gratitudeEntries: gratitudeEntries ?? this.gratitudeEntries,
      goals: goals ?? this.goals,
      milestones: milestones ?? this.milestones,
      legacyEnabled: legacyEnabled ?? this.legacyEnabled,
      legacyDismissed: legacyDismissed ?? this.legacyDismissed,
    );
  }
}

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

/// Quick-select intention suggestions.
const List<IntentionSuggestion> intentionSuggestions = [
  IntentionSuggestion(
    text: 'Go for a walk',
    textHi: 'टहलने जाना',
    icon: Icons.directions_walk,
  ),
  IntentionSuggestion(
    text: 'Call someone I love',
    textHi: 'किसी प्रिय को फोन करना',
    icon: Icons.phone,
  ),
  IntentionSuggestion(
    text: 'Practice breathing',
    textHi: 'सांस का अभ्यास करना',
    icon: Icons.air,
  ),
  IntentionSuggestion(
    text: 'Read something',
    textHi: 'कुछ पढ़ना',
    icon: Icons.menu_book,
  ),
  IntentionSuggestion(
    text: 'Listen to music',
    textHi: 'संगीत सुनना',
    icon: Icons.music_note,
  ),
];

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class JourneyNotifier extends StateNotifier<JourneyState> {
  JourneyNotifier() : super(const JourneyState()) {
    _loadMockData();
  }

  /// Load demo data for milestone & goals.
  void _loadMockData() {
    final milestones = [
      Milestone(
        id: 'm1',
        title: 'Welcome to PalliCare',
        titleHi: 'PalliCare में आपका स्वागत है',
        date: DateTime(2026, 2, 1),
      ),
      Milestone(
        id: 'm2',
        title: 'You shared your first log',
        titleHi: 'आपने अपना पहला लॉग साझा किया',
        date: DateTime(2026, 2, 3),
      ),
      Milestone(
        id: 'm3',
        title: 'One week with PalliCare',
        titleHi: 'PalliCare के साथ एक सप्ताह',
        date: DateTime(2026, 2, 8),
      ),
      Milestone(
        id: 'm4',
        title: 'You tried a coping tool',
        titleHi: 'आपने एक मुकाबला उपकरण आज़माया',
        date: DateTime(2026, 2, 10),
      ),
      Milestone(
        id: 'm5',
        title: 'You shared with your doctor',
        titleHi: 'आपने अपने डॉक्टर के साथ साझा किया',
        date: DateTime(2026, 2, 14),
      ),
      Milestone(
        id: 'm6',
        title: "One month — you're doing great",
        titleHi: 'एक महीना — आप बहुत अच्छा कर रहे हैं',
        date: DateTime(2026, 3, 1),
        isUpcoming: true,
      ),
    ];

    final goals = [
      const Goal(
        id: 'g1',
        title: 'Walk 10 minutes daily',
        titleHi: 'रोज़ 10 मिनट टहलना',
        category: GoalCategory.physical,
        frequency: GoalFrequency.daily,
        targetDays: 30,
        completedDays: 12,
      ),
      const Goal(
        id: 'g2',
        title: 'Call a friend weekly',
        titleHi: 'हर हफ़्ते दोस्त को फोन करना',
        category: GoalCategory.social,
        frequency: GoalFrequency.weekly,
        targetDays: 8,
        completedDays: 3,
      ),
      const Goal(
        id: 'g3',
        title: 'Evening breathing exercise',
        titleHi: 'शाम को सांस का अभ्यास',
        category: GoalCategory.coping,
        frequency: GoalFrequency.daily,
        targetDays: 30,
        completedDays: 18,
      ),
    ];

    final gratitudeEntries = [
      GratitudeEntry(
        id: 'gr1',
        date: DateTime.now().subtract(const Duration(days: 0)),
        text: 'My daughter visited today and we laughed together.',
      ),
      GratitudeEntry(
        id: 'gr2',
        date: DateTime.now().subtract(const Duration(days: 1)),
        text: 'The garden looked beautiful this morning.',
      ),
      GratitudeEntry(
        id: 'gr3',
        date: DateTime.now().subtract(const Duration(days: 2)),
        text: 'Good conversation with my doctor.',
      ),
      GratitudeEntry(
        id: 'gr4',
        date: DateTime.now().subtract(const Duration(days: 4)),
        text: 'Enjoyed a cup of chai in the sun.',
      ),
      GratitudeEntry(
        id: 'gr5',
        date: DateTime.now().subtract(const Duration(days: 5)),
        text: 'My neighbor brought flowers.',
      ),
    ];

    state = state.copyWith(
      milestones: milestones,
      goals: goals,
      gratitudeEntries: gratitudeEntries,
      yesterdayIntention: 'Practice breathing',
      yesterdayCompleted: true,
    );
  }

  // -- Intentions --

  void setIntention(String text) {
    state = state.copyWith(
      todayIntention: text,
      selectedSuggestion: null,
    );
  }

  void selectSuggestion(String suggestion) {
    state = state.copyWith(
      todayIntention: suggestion,
      selectedSuggestion: suggestion,
    );
  }

  void completeIntention() {
    state = state.copyWith(intentionCompleted: true);
  }

  void clearIntention() {
    state = JourneyState(
      todayIntention: null,
      selectedSuggestion: null,
      intentionCompleted: false,
      yesterdayIntention: state.yesterdayIntention,
      yesterdayCompleted: state.yesterdayCompleted,
      gratitudeEntries: state.gratitudeEntries,
      goals: state.goals,
      milestones: state.milestones,
      legacyEnabled: state.legacyEnabled,
      legacyDismissed: state.legacyDismissed,
    );
  }

  // -- Gratitude --

  void addGratitude(String text) {
    if (text.trim().isEmpty) return;
    final entry = GratitudeEntry(
      id: 'gr_${DateTime.now().millisecondsSinceEpoch}',
      date: DateTime.now(),
      text: text.trim(),
    );
    state = state.copyWith(
      gratitudeEntries: [entry, ...state.gratitudeEntries],
    );
  }

  // -- Goals --

  void markGoalToday(String goalId) {
    final updated = state.goals.map((g) {
      if (g.id == goalId) {
        return g.copyWith(completedDays: g.completedDays + 1);
      }
      return g;
    }).toList();
    state = state.copyWith(goals: updated);
  }

  void addGoal(Goal goal) {
    if (state.activeGoals.length >= 3) return;
    state = state.copyWith(goals: [...state.goals, goal]);
  }

  void removeGoal(String goalId) {
    final updated = state.goals.map((g) {
      if (g.id == goalId) return g.copyWith(isActive: false);
      return g;
    }).toList();
    state = state.copyWith(goals: updated);
  }

  void adjustGoal(String goalId, {int? targetDays}) {
    final updated = state.goals.map((g) {
      if (g.id == goalId) return g.copyWith(targetDays: targetDays);
      return g;
    }).toList();
    state = state.copyWith(goals: updated);
  }

  // -- Legacy --

  void enableLegacy() {
    state = state.copyWith(legacyEnabled: true);
  }

  void dismissLegacy() {
    state = state.copyWith(legacyDismissed: true);
  }
}

// ---------------------------------------------------------------------------
// PROVIDERS
// ---------------------------------------------------------------------------

final journeyProvider =
    StateNotifierProvider<JourneyNotifier, JourneyState>(
  (ref) => JourneyNotifier(),
);
