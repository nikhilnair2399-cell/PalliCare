import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/sync_provider.dart';

/// Medication schedule type.
enum MedSchedule { scheduled, prn }

/// A single medication entry.
class Medication {
  final String id;
  final String name;
  final String nameHindi;
  final String dose;
  final String route;
  final MedSchedule schedule;
  final List<String> times; // scheduled times e.g. ["08:00", "20:00"]
  final String? prnInstruction;
  final bool isOpioid;
  final double? meddMgEquivalent;
  final List<String> sideEffects;
  final DateTime startDate;

  const Medication({
    required this.id,
    required this.name,
    this.nameHindi = '',
    required this.dose,
    this.route = 'oral',
    this.schedule = MedSchedule.scheduled,
    this.times = const [],
    this.prnInstruction,
    this.isOpioid = false,
    this.meddMgEquivalent,
    this.sideEffects = const [],
    required this.startDate,
  });
}

/// Medication dose log entry.
class MedDoseLog {
  final String medicationId;
  final DateTime scheduledTime;
  final DateTime? takenTime;
  final bool skipped;
  final String? skipReason;

  const MedDoseLog({
    required this.medicationId,
    required this.scheduledTime,
    this.takenTime,
    this.skipped = false,
    this.skipReason,
  });

  bool get isTaken => takenTime != null;
  bool get isPending => !isTaken && !skipped;
}

/// State for medication tracker screen.
class MedicationState {
  final List<Medication> medications;
  final List<MedDoseLog> todayLogs;
  final bool isLoading;
  final double totalMedd;

  const MedicationState({
    this.medications = const [],
    this.todayLogs = const [],
    this.isLoading = false,
    this.totalMedd = 0,
  });

  MedicationState copyWith({
    List<Medication>? medications,
    List<MedDoseLog>? todayLogs,
    bool? isLoading,
    double? totalMedd,
  }) {
    return MedicationState(
      medications: medications ?? this.medications,
      todayLogs: todayLogs ?? this.todayLogs,
      isLoading: isLoading ?? this.isLoading,
      totalMedd: totalMedd ?? this.totalMedd,
    );
  }

  /// Today's adherence as 0.0-1.0.
  double get adherence {
    final scheduled = todayLogs.where(
        (l) => medications.any((m) => m.id == l.medicationId && m.schedule == MedSchedule.scheduled));
    if (scheduled.isEmpty) return 1.0;
    final taken = scheduled.where((l) => l.isTaken).length;
    return taken / scheduled.length;
  }

  /// Count of pending doses today.
  int get pendingDoses {
    return todayLogs.where((l) => l.isPending).length;
  }

  /// Count of taken doses today.
  int get takenDoses {
    return todayLogs.where((l) => l.isTaken).length;
  }
}

class MedicationNotifier extends StateNotifier<MedicationState> {
  final Ref _ref;

  MedicationNotifier(this._ref) : super(const MedicationState()) {
    _loadMockData();
  }

  void _loadMockData() {
    state = state.copyWith(isLoading: true);

    final now = DateTime.now();
    final meds = [
      Medication(
        id: 'med_1',
        name: 'Morphine SR',
        nameHindi: 'मॉर्फीन एसआर',
        dose: '30mg',
        route: 'oral',
        times: ['08:00', '20:00'],
        isOpioid: true,
        meddMgEquivalent: 30,
        sideEffects: ['constipation', 'nausea', 'drowsiness'],
        startDate: now.subtract(const Duration(days: 14)),
      ),
      Medication(
        id: 'med_2',
        name: 'Paracetamol',
        nameHindi: 'पैरासिटामोल',
        dose: '500mg',
        route: 'oral',
        times: ['08:00', '14:00', '20:00'],
        startDate: now.subtract(const Duration(days: 30)),
      ),
      Medication(
        id: 'med_3',
        name: 'Morphine IR',
        nameHindi: 'मॉर्फीन आईआर',
        dose: '10mg',
        route: 'oral',
        schedule: MedSchedule.prn,
        prnInstruction: 'For breakthrough pain, max 4x/day',
        isOpioid: true,
        meddMgEquivalent: 10,
        startDate: now.subtract(const Duration(days: 14)),
      ),
      Medication(
        id: 'med_4',
        name: 'Lactulose',
        nameHindi: 'लैक्टुलोज',
        dose: '15ml',
        route: 'oral',
        times: ['08:00', '20:00'],
        startDate: now.subtract(const Duration(days: 10)),
      ),
      Medication(
        id: 'med_5',
        name: 'Ondansetron',
        nameHindi: 'ऑन्डैनसेट्रॉन',
        dose: '4mg',
        route: 'oral',
        schedule: MedSchedule.prn,
        prnInstruction: 'For nausea, max 3x/day',
        startDate: now.subtract(const Duration(days: 10)),
      ),
    ];

    final logs = <MedDoseLog>[
      MedDoseLog(
        medicationId: 'med_1',
        scheduledTime: DateTime(now.year, now.month, now.day, 8),
        takenTime: DateTime(now.year, now.month, now.day, 8, 15),
      ),
      MedDoseLog(
        medicationId: 'med_1',
        scheduledTime: DateTime(now.year, now.month, now.day, 20),
      ),
      MedDoseLog(
        medicationId: 'med_2',
        scheduledTime: DateTime(now.year, now.month, now.day, 8),
        takenTime: DateTime(now.year, now.month, now.day, 8, 10),
      ),
      MedDoseLog(
        medicationId: 'med_2',
        scheduledTime: DateTime(now.year, now.month, now.day, 14),
      ),
      MedDoseLog(
        medicationId: 'med_2',
        scheduledTime: DateTime(now.year, now.month, now.day, 20),
      ),
      MedDoseLog(
        medicationId: 'med_4',
        scheduledTime: DateTime(now.year, now.month, now.day, 8),
        takenTime: DateTime(now.year, now.month, now.day, 8, 5),
      ),
      MedDoseLog(
        medicationId: 'med_4',
        scheduledTime: DateTime(now.year, now.month, now.day, 20),
      ),
    ];

    // Calculate MEDD
    final medd = meds
        .where((m) => m.isOpioid)
        .fold<double>(0, (sum, m) => sum + (m.meddMgEquivalent ?? 0));

    state = state.copyWith(
      medications: meds,
      todayLogs: logs,
      isLoading: false,
      totalMedd: medd,
    );
  }

  void markTaken(String medicationId, DateTime scheduledTime) {
    final now = DateTime.now();
    final logs = List<MedDoseLog>.from(state.todayLogs);
    final index = logs.indexWhere(
      (l) => l.medicationId == medicationId && l.scheduledTime == scheduledTime,
    );
    if (index != -1) {
      logs[index] = MedDoseLog(
        medicationId: medicationId,
        scheduledTime: scheduledTime,
        takenTime: now,
      );
      state = state.copyWith(todayLogs: logs);

      // Queue for offline-first sync
      _ref.read(syncProvider.notifier).queueMedicationLog({
        'medication_id': medicationId,
        'scheduled_time': scheduledTime.toIso8601String(),
        'taken_time': now.toIso8601String(),
        'status': 'taken',
      });
    }
  }

  void markSkipped(String medicationId, DateTime scheduledTime, String reason) {
    final logs = List<MedDoseLog>.from(state.todayLogs);
    final index = logs.indexWhere(
      (l) => l.medicationId == medicationId && l.scheduledTime == scheduledTime,
    );
    if (index != -1) {
      logs[index] = MedDoseLog(
        medicationId: medicationId,
        scheduledTime: scheduledTime,
        skipped: true,
        skipReason: reason,
      );
      state = state.copyWith(todayLogs: logs);

      // Queue for offline-first sync
      _ref.read(syncProvider.notifier).queueMedicationLog({
        'medication_id': medicationId,
        'scheduled_time': scheduledTime.toIso8601String(),
        'status': 'skipped',
        'skip_reason': reason,
      });
    }
  }

  void logPrnDose(String medicationId) {
    final now = DateTime.now();
    final logs = List<MedDoseLog>.from(state.todayLogs);
    logs.add(MedDoseLog(
      medicationId: medicationId,
      scheduledTime: now,
      takenTime: now,
    ));
    state = state.copyWith(todayLogs: logs);

    // Queue PRN dose for offline-first sync
    _ref.read(syncProvider.notifier).queueMedicationLog({
      'medication_id': medicationId,
      'scheduled_time': now.toIso8601String(),
      'taken_time': now.toIso8601String(),
      'status': 'taken',
      'is_prn': true,
    });
  }
}

final medicationProvider =
    StateNotifierProvider<MedicationNotifier, MedicationState>(
  (ref) => MedicationNotifier(ref),
);
