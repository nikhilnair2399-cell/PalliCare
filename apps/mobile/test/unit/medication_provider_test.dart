import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/medication_tracker/medication_provider.dart';

void main() {
  group('Medication', () {
    test('default schedule is scheduled', () {
      final med = Medication(
        id: 'test',
        name: 'Test Med',
        dose: '10mg',
        startDate: DateTime(2026, 1, 1),
      );
      expect(med.schedule, MedSchedule.scheduled);
      expect(med.isOpioid, false);
      expect(med.nameHindi, '');
      expect(med.route, 'oral');
    });
  });

  group('MedDoseLog', () {
    test('isTaken returns true when takenTime is set', () {
      final log = MedDoseLog(
        medicationId: 'med_1',
        scheduledTime: DateTime(2026, 1, 1, 8),
        takenTime: DateTime(2026, 1, 1, 8, 15),
      );
      expect(log.isTaken, true);
      expect(log.isPending, false);
    });

    test('isPending returns true when not taken and not skipped', () {
      final log = MedDoseLog(
        medicationId: 'med_1',
        scheduledTime: DateTime(2026, 1, 1, 8),
      );
      expect(log.isPending, true);
      expect(log.isTaken, false);
    });

    test('skipped log is not pending', () {
      final log = MedDoseLog(
        medicationId: 'med_1',
        scheduledTime: DateTime(2026, 1, 1, 8),
        skipped: true,
        skipReason: 'nausea',
      );
      expect(log.isPending, false);
      expect(log.isTaken, false);
      expect(log.skipped, true);
    });
  });

  group('MedicationState', () {
    test('default state has empty lists', () {
      const state = MedicationState();
      expect(state.medications, isEmpty);
      expect(state.todayLogs, isEmpty);
      expect(state.isLoading, false);
      expect(state.totalMedd, 0);
    });

    test('adherence returns 1.0 when no scheduled logs', () {
      const state = MedicationState();
      expect(state.adherence, 1.0);
    });

    test('adherence calculates correctly with mixed taken/pending', () {
      final meds = [
        Medication(
          id: 'med_1',
          name: 'Morphine',
          dose: '30mg',
          schedule: MedSchedule.scheduled,
          startDate: DateTime(2026, 1, 1),
        ),
      ];
      final now = DateTime.now();
      final logs = [
        MedDoseLog(
          medicationId: 'med_1',
          scheduledTime: DateTime(now.year, now.month, now.day, 8),
          takenTime: DateTime(now.year, now.month, now.day, 8, 15),
        ),
        MedDoseLog(
          medicationId: 'med_1',
          scheduledTime: DateTime(now.year, now.month, now.day, 20),
          // not taken
        ),
      ];
      final state = MedicationState(medications: meds, todayLogs: logs);
      expect(state.adherence, 0.5); // 1 of 2 taken
    });

    test('pendingDoses counts correctly', () {
      final now = DateTime.now();
      final logs = [
        MedDoseLog(
          medicationId: 'med_1',
          scheduledTime: DateTime(now.year, now.month, now.day, 8),
          takenTime: DateTime(now.year, now.month, now.day, 8, 15),
        ),
        MedDoseLog(
          medicationId: 'med_1',
          scheduledTime: DateTime(now.year, now.month, now.day, 14),
        ),
        MedDoseLog(
          medicationId: 'med_1',
          scheduledTime: DateTime(now.year, now.month, now.day, 20),
        ),
      ];
      final state = MedicationState(todayLogs: logs);
      expect(state.pendingDoses, 2);
      expect(state.takenDoses, 1);
    });

    test('copyWith preserves unchanged fields', () {
      const state = MedicationState(totalMedd: 40, isLoading: true);
      final updated = state.copyWith(isLoading: false);
      expect(updated.totalMedd, 40); // preserved
      expect(updated.isLoading, false); // updated
    });
  });

  group('MedicationNotifier', () {
    late MedicationNotifier notifier;

    setUp(() {
      notifier = MedicationNotifier();
    });

    test('loads mock data on init', () {
      expect(notifier.state.medications, isNotEmpty);
      expect(notifier.state.todayLogs, isNotEmpty);
      expect(notifier.state.isLoading, false);
      expect(notifier.state.totalMedd, greaterThan(0));
    });

    test('has 5 medications in mock data', () {
      expect(notifier.state.medications.length, 5);
    });

    test('mock data includes opioid and non-opioid medications', () {
      final opioids =
          notifier.state.medications.where((m) => m.isOpioid).toList();
      final nonOpioids =
          notifier.state.medications.where((m) => !m.isOpioid).toList();
      expect(opioids, isNotEmpty);
      expect(nonOpioids, isNotEmpty);
    });

    test('mock data includes scheduled and PRN medications', () {
      final scheduled = notifier.state.medications
          .where((m) => m.schedule == MedSchedule.scheduled)
          .toList();
      final prn = notifier.state.medications
          .where((m) => m.schedule == MedSchedule.prn)
          .toList();
      expect(scheduled, isNotEmpty);
      expect(prn, isNotEmpty);
    });

    test('markTaken updates the dose log', () {
      // Find a pending log
      final pendingLog =
          notifier.state.todayLogs.firstWhere((l) => l.isPending);
      notifier.markTaken(pendingLog.medicationId, pendingLog.scheduledTime);

      final updatedLog = notifier.state.todayLogs.firstWhere(
        (l) =>
            l.medicationId == pendingLog.medicationId &&
            l.scheduledTime == pendingLog.scheduledTime,
      );
      expect(updatedLog.isTaken, true);
      expect(updatedLog.takenTime, isNotNull);
    });

    test('markSkipped updates the dose log with reason', () {
      final pendingLog =
          notifier.state.todayLogs.firstWhere((l) => l.isPending);
      notifier.markSkipped(
        pendingLog.medicationId,
        pendingLog.scheduledTime,
        'nausea',
      );

      final updatedLog = notifier.state.todayLogs.firstWhere(
        (l) =>
            l.medicationId == pendingLog.medicationId &&
            l.scheduledTime == pendingLog.scheduledTime,
      );
      expect(updatedLog.skipped, true);
      expect(updatedLog.skipReason, 'nausea');
    });

    test('logPrnDose adds a new taken log entry', () {
      final initialCount = notifier.state.todayLogs.length;
      notifier.logPrnDose('med_3');
      expect(notifier.state.todayLogs.length, initialCount + 1);

      final newLog = notifier.state.todayLogs.last;
      expect(newLog.medicationId, 'med_3');
      expect(newLog.isTaken, true);
    });

    test('MEDD calculation sums opioid equivalents', () {
      // Morphine SR 30mg (factor 1) + Morphine IR 10mg (factor 1) = 40
      expect(notifier.state.totalMedd, 40);
    });
  });
}
