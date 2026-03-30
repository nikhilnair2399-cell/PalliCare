import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/journey/journey_provider.dart';
import 'package:pallicare/services/sync_provider.dart';
import 'package:pallicare/services/sync_service.dart';

/// A minimal SyncNotifier that does nothing, used to avoid real sync/network
/// initialization during unit tests.
class _FakeSyncNotifier extends StateNotifier<SyncState>
    implements SyncNotifier {
  _FakeSyncNotifier() : super(const SyncState());

  @override
  Future<String> queueSymptomLog(Map<String, dynamic> logData) async => 'fake';

  @override
  Future<String> queueMedicationLog(Map<String, dynamic> logData) async =>
      'fake';

  @override
  Future<String> queueJournalEntry(Map<String, dynamic> entryData) async =>
      'fake';

  @override
  Future<void> forceSync() async {}

  @override
  Future<void> retryConflict(String localId) async {}
}

/// Helper to create a [ProviderContainer] with sync overridden and read the
/// [JourneyNotifier] from it.
JourneyNotifier _createNotifier() {
  final container = ProviderContainer(
    overrides: [
      syncProvider.overrideWith((_) => _FakeSyncNotifier()),
    ],
  );
  // Reading the provider forces notifier construction and _loadMockData().
  container.read(journeyProvider);
  return container.read(journeyProvider.notifier);
}

void main() {
  // ---------------------------------------------------------------------------
  // JourneyState
  // ---------------------------------------------------------------------------

  group('JourneyState', () {
    test('default state has null intention, empty gratitude, empty goals', () {
      const state = JourneyState();
      expect(state.todayIntention, isNull);
      expect(state.selectedSuggestion, isNull);
      expect(state.intentionCompleted, false);
      expect(state.yesterdayIntention, isNull);
      expect(state.yesterdayCompleted, false);
      expect(state.gratitudeEntries, isEmpty);
      expect(state.goals, isEmpty);
      expect(state.milestones, isEmpty);
      expect(state.legacyEnabled, false);
      expect(state.legacyDismissed, false);
    });

    test('gratitudeCount returns correct count', () {
      final state = JourneyState(gratitudeEntries: [
        GratitudeEntry(id: '1', date: DateTime.now(), text: 'a'),
        GratitudeEntry(id: '2', date: DateTime.now(), text: 'b'),
      ]);
      expect(state.gratitudeCount, 2);
    });

    test('recentGratitude returns last 3 entries', () {
      final state = JourneyState(gratitudeEntries: [
        GratitudeEntry(id: '1', date: DateTime.now(), text: 'a'),
        GratitudeEntry(id: '2', date: DateTime.now(), text: 'b'),
        GratitudeEntry(id: '3', date: DateTime.now(), text: 'c'),
        GratitudeEntry(id: '4', date: DateTime.now(), text: 'd'),
        GratitudeEntry(id: '5', date: DateTime.now(), text: 'e'),
      ]);
      expect(state.recentGratitude.length, 3);
      expect(state.recentGratitude.first.id, '1');
      expect(state.recentGratitude.last.id, '3');
    });

    test('recentGratitude returns all when fewer than 3', () {
      final state = JourneyState(gratitudeEntries: [
        GratitudeEntry(id: '1', date: DateTime.now(), text: 'a'),
        GratitudeEntry(id: '2', date: DateTime.now(), text: 'b'),
      ]);
      expect(state.recentGratitude.length, 2);
    });

    test('activeGoals filters by isActive', () {
      const state = JourneyState(goals: [
        Goal(
          id: 'g1',
          title: 'Walk',
          titleHi: '',
          category: GoalCategory.physical,
          isActive: true,
        ),
        Goal(
          id: 'g2',
          title: 'Read',
          titleHi: '',
          category: GoalCategory.coping,
          isActive: false,
        ),
        Goal(
          id: 'g3',
          title: 'Call',
          titleHi: '',
          category: GoalCategory.social,
          isActive: true,
        ),
      ]);
      expect(state.activeGoals.length, 2);
      expect(state.activeGoals.map((g) => g.id), containsAll(['g1', 'g3']));
    });
  });

  // ---------------------------------------------------------------------------
  // JourneyNotifier
  // ---------------------------------------------------------------------------

  group('JourneyNotifier', () {
    late JourneyNotifier notifier;

    setUp(() {
      notifier = _createNotifier();
    });

    // -- Mock data loaded --

    test('loads mock data on init', () {
      expect(notifier.state.milestones, isNotEmpty);
      expect(notifier.state.goals, isNotEmpty);
      expect(notifier.state.gratitudeEntries, isNotEmpty);
      expect(notifier.state.yesterdayIntention, 'Practice breathing');
      expect(notifier.state.yesterdayCompleted, true);
    });

    // -- Intentions --

    test('setIntention updates todayIntention', () {
      notifier.setIntention('Meditate for 5 minutes');
      expect(notifier.state.todayIntention, 'Meditate for 5 minutes');
    });

    test('setIntention preserves selectedSuggestion (copyWith null = keep)', () {
      notifier.selectSuggestion('Go for a walk');
      expect(notifier.state.selectedSuggestion, 'Go for a walk');

      // Note: copyWith treats null as "keep old value", so selectedSuggestion
      // is NOT cleared by setIntention — use clearIntention for full reset.
      notifier.setIntention('Custom intention');
      expect(notifier.state.todayIntention, 'Custom intention');
      expect(notifier.state.selectedSuggestion, 'Go for a walk');
    });

    test('selectSuggestion updates selectedSuggestion and todayIntention', () {
      notifier.selectSuggestion('Call someone I love');
      expect(notifier.state.selectedSuggestion, 'Call someone I love');
      expect(notifier.state.todayIntention, 'Call someone I love');
    });

    test('completeIntention marks intentionCompleted true', () {
      notifier.setIntention('Something');
      expect(notifier.state.intentionCompleted, false);

      notifier.completeIntention();
      expect(notifier.state.intentionCompleted, true);
    });

    test('clearIntention resets intention fields', () {
      notifier.setIntention('Something');
      notifier.completeIntention();

      notifier.clearIntention();
      expect(notifier.state.todayIntention, isNull);
      expect(notifier.state.selectedSuggestion, isNull);
      expect(notifier.state.intentionCompleted, false);
    });

    test('clearIntention preserves non-intention fields', () {
      notifier.setIntention('Something');
      final goalsBefore = notifier.state.goals;
      final gratBefore = notifier.state.gratitudeEntries;

      notifier.clearIntention();
      expect(notifier.state.goals, goalsBefore);
      expect(notifier.state.gratitudeEntries, gratBefore);
      expect(notifier.state.yesterdayIntention, 'Practice breathing');
    });

    // -- Gratitude --

    test('addGratitude adds entry to list with auto-generated id', () {
      final countBefore = notifier.state.gratitudeEntries.length;
      notifier.addGratitude('Sunshine today');

      expect(notifier.state.gratitudeEntries.length, countBefore + 1);
      final newest = notifier.state.gratitudeEntries.first;
      expect(newest.text, 'Sunshine today');
      expect(newest.id, startsWith('gr_'));
    });

    test('addGratitude increments gratitudeCount', () {
      final countBefore = notifier.state.gratitudeCount;
      notifier.addGratitude('A kind word');
      expect(notifier.state.gratitudeCount, countBefore + 1);
    });

    test('addGratitude ignores empty text', () {
      final countBefore = notifier.state.gratitudeCount;
      notifier.addGratitude('   ');
      expect(notifier.state.gratitudeCount, countBefore);
    });

    // -- Goals --

    test('markGoalToday increments completedDays for matching goal', () {
      final goal = notifier.state.goals.first;
      final daysBefore = goal.completedDays;

      notifier.markGoalToday(goal.id);

      final updated =
          notifier.state.goals.firstWhere((g) => g.id == goal.id);
      expect(updated.completedDays, daysBefore + 1);
    });

    test('addGoal adds to goals list', () {
      // First deactivate one goal so we have room (mock loads 3 active)
      notifier.removeGoal(notifier.state.goals.first.id);
      final countBefore = notifier.state.goals.length;

      const newGoal = Goal(
        id: 'g_new',
        title: 'Read daily',
        titleHi: '',
        category: GoalCategory.selfCare,
      );
      notifier.addGoal(newGoal);
      expect(notifier.state.goals.length, countBefore + 1);
      expect(notifier.state.goals.last.id, 'g_new');
    });

    test('addGoal enforces max 3 active goals', () {
      // Mock data already has 3 active goals
      expect(notifier.state.activeGoals.length, 3);

      const extraGoal = Goal(
        id: 'g_extra',
        title: 'Extra',
        titleHi: '',
        category: GoalCategory.medical,
      );
      notifier.addGoal(extraGoal);
      // Should not have been added
      expect(notifier.state.goals.where((g) => g.id == 'g_extra'), isEmpty);
    });

    test('removeGoal sets isActive to false', () {
      final goal = notifier.state.goals.first;
      expect(goal.isActive, true);

      notifier.removeGoal(goal.id);

      final updated =
          notifier.state.goals.firstWhere((g) => g.id == goal.id);
      expect(updated.isActive, false);
    });

    test('adjustGoal updates targetDays', () {
      final goal = notifier.state.goals.first;
      notifier.adjustGoal(goal.id, targetDays: 60);

      final updated =
          notifier.state.goals.firstWhere((g) => g.id == goal.id);
      expect(updated.targetDays, 60);
    });

    // -- Legacy --

    test('enableLegacy sets legacyEnabled', () {
      expect(notifier.state.legacyEnabled, false);
      notifier.enableLegacy();
      expect(notifier.state.legacyEnabled, true);
    });

    test('dismissLegacy sets legacyDismissed', () {
      expect(notifier.state.legacyDismissed, false);
      notifier.dismissLegacy();
      expect(notifier.state.legacyDismissed, true);
    });
  });
}
