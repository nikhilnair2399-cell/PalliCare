import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/caregiver/caregiver_provider.dart';
import 'package:pallicare/features/caregiver/task_assignment_card.dart';

void main() {
  group('CaregiverState', () {
    test('default state has mock patient data loaded', () {
      const state = CaregiverState();
      expect(state.patientName, 'Ramesh');
      expect(state.caregiverName, 'Priya');
      expect(state.relationship, 'daughter');
      expect(state.todayWellness, isNull);
      expect(state.consecutiveTiredCount, 0);
      expect(state.showWellnessFollowUp, false);
      expect(state.isLoading, false);
    });

    test('burnoutTotal sums responses correctly', () {
      const state = CaregiverState(
        burnoutResponses: [1, 2, 3, 0, 4, 1, 0, 2, 3, 1, 0, 1],
      );
      expect(state.burnoutTotal, 18); // 1+2+3+0+4+1+0+2+3+1+0+1
    });

    test('initial medications list is populated (3 meds) after notifier init',
        () {
      final notifier = CaregiverNotifier();
      expect(notifier.state.medications.length, 3);
    });
  });

  group('CaregiverNotifier', () {
    late CaregiverNotifier notifier;

    setUp(() {
      notifier = CaregiverNotifier();
    });

    // -- Wellness --

    test('recordWellness(fine) sets todayWellness, resets consecutiveTiredCount',
        () {
      // First set tired count to something non-zero
      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.consecutiveTiredCount, 1);

      notifier.recordWellness(WellnessResponse.fine);
      expect(notifier.state.todayWellness, WellnessResponse.fine);
      expect(notifier.state.consecutiveTiredCount, 0);
      expect(notifier.state.showWellnessFollowUp, false);
    });

    test('recordWellness(tired) increments consecutiveTiredCount', () {
      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.todayWellness, WellnessResponse.tired);
      expect(notifier.state.consecutiveTiredCount, 1);
    });

    test('recordWellness(tired) 3 times triggers showWellnessFollowUp', () {
      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.showWellnessFollowUp, false);

      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.showWellnessFollowUp, false);

      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.consecutiveTiredCount, 3);
      expect(notifier.state.showWellnessFollowUp, true);
    });

    test('skipWellnessCheck does not change consecutiveTiredCount', () {
      notifier.recordWellness(WellnessResponse.tired);
      notifier.recordWellness(WellnessResponse.tired);
      expect(notifier.state.consecutiveTiredCount, 2);

      notifier.skipWellnessCheck();
      expect(notifier.state.consecutiveTiredCount, 2);
      expect(notifier.state.todayWellness, WellnessResponse.fine);
      expect(notifier.state.showWellnessFollowUp, false);
    });

    test('dismissWellnessFollowUp sets flag to false', () {
      notifier.recordWellness(WellnessResponse.stressed);
      expect(notifier.state.showWellnessFollowUp, true);

      notifier.dismissWellnessFollowUp();
      expect(notifier.state.showWellnessFollowUp, false);
    });

    // -- Medications --

    test('markMedicationGiven sets given=true for matching med', () {
      // cm_1 starts as given=false
      final before =
          notifier.state.medications.firstWhere((m) => m.id == 'cm_1');
      expect(before.given, false);

      notifier.markMedicationGiven('cm_1');

      final after =
          notifier.state.medications.firstWhere((m) => m.id == 'cm_1');
      expect(after.given, true);
    });

    // -- Journal --

    test('addJournalEntry adds entry with auto-generated id', () {
      expect(notifier.state.journalEntries, isEmpty);

      notifier.addJournalEntry('Feeling grateful today', JournalMood.grateful);

      expect(notifier.state.journalEntries.length, 1);
      final entry = notifier.state.journalEntries.first;
      expect(entry.text, 'Feeling grateful today');
      expect(entry.mood, JournalMood.grateful);
      expect(entry.id, startsWith('j_'));
    });

    test('deleteJournalEntry removes matching entry', () {
      notifier.addJournalEntry('Entry one', JournalMood.relieved);
      notifier.addJournalEntry('Entry two', JournalMood.stressed);
      expect(notifier.state.journalEntries.length, 2);

      final idToDelete = notifier.state.journalEntries.last.id;
      notifier.deleteJournalEntry(idToDelete);

      expect(notifier.state.journalEntries.length, 1);
      expect(
        notifier.state.journalEntries.any((e) => e.id == idToDelete),
        false,
      );
    });

    // -- Burnout Assessment --

    test('setBurnoutResponse stores value at index', () {
      notifier.setBurnoutResponse(0, 3);
      notifier.setBurnoutResponse(5, 4);

      expect(notifier.state.burnoutResponses[0], 3);
      expect(notifier.state.burnoutResponses[5], 4);
      // Other indices remain 0
      expect(notifier.state.burnoutResponses[1], 0);
    });

    test('submitBurnoutAssessment calculates lastBurnoutScore', () {
      notifier.setBurnoutResponse(0, 2);
      notifier.setBurnoutResponse(1, 3);
      notifier.setBurnoutResponse(2, 1);
      notifier.submitBurnoutAssessment();

      expect(notifier.state.lastBurnoutScore, 6); // 2+3+1
      expect(notifier.state.lastBurnoutDate, isNotNull);
    });

    test('resetBurnoutResponses clears all responses', () {
      notifier.setBurnoutResponse(0, 4);
      notifier.setBurnoutResponse(3, 2);
      notifier.resetBurnoutResponses();

      expect(notifier.state.burnoutResponses, everyElement(0));
      expect(notifier.state.burnoutResponses.length, 12);
    });

    // -- Visitor Log --

    test('addVisitorEntry adds to visitorLog', () {
      expect(notifier.state.visitorLog, isEmpty);

      notifier.addVisitorEntry('Dr. Sharma', 'Medical visit',
          notes: 'Routine check');

      expect(notifier.state.visitorLog.length, 1);
      final entry = notifier.state.visitorLog.first;
      expect(entry.visitorName, 'Dr. Sharma');
      expect(entry.purpose, 'Medical visit');
      expect(entry.notes, 'Routine check');
      expect(entry.id, startsWith('v_'));
    });

    test('deleteVisitorEntry removes from visitorLog', () {
      notifier.addVisitorEntry('Dr. Sharma', 'Medical visit');
      notifier.addVisitorEntry('Rahul', 'Family visit');
      expect(notifier.state.visitorLog.length, 2);

      final idToDelete = notifier.state.visitorLog.last.id;
      notifier.deleteVisitorEntry(idToDelete);

      expect(notifier.state.visitorLog.length, 1);
      expect(
        notifier.state.visitorLog.any((e) => e.id == idToDelete),
        false,
      );
    });

    // -- Tasks --

    test('addTask adds to tasks list', () {
      expect(notifier.state.tasks, isEmpty);

      final task = CareTask(
        id: 't_1',
        title: 'Buy medicine',
        titleHi: '\u0926\u0935\u093E\u0908 \u0916\u0930\u0940\u0926\u0947\u0902',
        assignee: 'Priya',
      );
      notifier.addTask(task);

      expect(notifier.state.tasks.length, 1);
      expect(notifier.state.tasks.first.title, 'Buy medicine');
    });

    test('toggleTask toggles isCompleted', () {
      final task = CareTask(
        id: 't_1',
        title: 'Buy medicine',
        titleHi: '\u0926\u0935\u093E\u0908 \u0916\u0930\u0940\u0926\u0947\u0902',
        assignee: 'Priya',
      );
      notifier.addTask(task);
      expect(notifier.state.tasks.first.isCompleted, false);

      notifier.toggleTask('t_1');
      expect(notifier.state.tasks.first.isCompleted, true);

      notifier.toggleTask('t_1');
      expect(notifier.state.tasks.first.isCompleted, false);
    });

    test('deleteTask removes from tasks list', () {
      final task = CareTask(
        id: 't_1',
        title: 'Buy medicine',
        titleHi: '\u0926\u0935\u093E\u0908 \u0916\u0930\u0940\u0926\u0947\u0902',
        assignee: 'Priya',
      );
      notifier.addTask(task);
      expect(notifier.state.tasks.length, 1);

      notifier.deleteTask('t_1');
      expect(notifier.state.tasks, isEmpty);
    });
  });
}
