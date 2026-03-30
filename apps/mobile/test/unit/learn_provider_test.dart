import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/learn/learn_provider.dart';

void main() {
  // ---------------------------------------------------------------------------
  // LearnState
  // ---------------------------------------------------------------------------

  group('LearnState', () {
    // Helper: create a state with known modules for getter tests.
    LearnState _stateWith({
      required List<LearnModule> modules,
      DateTime? installDate,
    }) {
      return LearnState(
        modules: modules,
        appInstallDate: installDate ?? DateTime.now(),
      );
    }

    final sampleModules = [
      const LearnModule(
        id: 'a',
        number: '1.1',
        titleEn: 'A',
        titleHi: '',
        durationMinutes: 2,
        phase: ContentPhase.phase1,
        status: ModuleStatus.completed,
        progress: 1.0,
      ),
      const LearnModule(
        id: 'b',
        number: '2.1',
        titleEn: 'B',
        titleHi: '',
        durationMinutes: 3,
        phase: ContentPhase.phase2,
        status: ModuleStatus.inProgress,
        progress: 0.5,
      ),
      const LearnModule(
        id: 'c',
        number: '2.2',
        titleEn: 'C',
        titleHi: '',
        durationMinutes: 3,
        phase: ContentPhase.phase2,
        status: ModuleStatus.available,
      ),
      const LearnModule(
        id: 'd',
        number: '3.1',
        titleEn: 'D',
        titleHi: '',
        durationMinutes: 4,
        phase: ContentPhase.phase3,
        status: ModuleStatus.locked,
      ),
    ];

    test('phase modules filter by ContentPhase correctly', () {
      final state = _stateWith(modules: sampleModules);
      expect(state.phase1Modules.length, 1);
      expect(state.phase2Modules.length, 2);
      expect(state.phase3Modules.length, 1);
    });

    test('completedCount counts only completed modules', () {
      final state = _stateWith(modules: sampleModules);
      expect(state.completedCount, 1);
    });

    test('totalCount returns all modules', () {
      final state = _stateWith(modules: sampleModules);
      expect(state.totalCount, 4);
    });

    test('phase 1 is always unlocked', () {
      // Even with install date far in the future
      final state = _stateWith(
        modules: [],
        installDate: DateTime.now().add(const Duration(days: 100)),
      );
      expect(state.isPhase1Unlocked, true);
    });

    test('phase 2 unlocks after 14 days', () {
      final locked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 13)),
      );
      expect(locked.isPhase2Unlocked, false);

      final unlocked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 14)),
      );
      expect(unlocked.isPhase2Unlocked, true);
    });

    test('phase 3 unlocks after 42 days', () {
      final locked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 41)),
      );
      expect(locked.isPhase3Unlocked, false);

      final unlocked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 42)),
      );
      expect(unlocked.isPhase3Unlocked, true);
    });

    test('daysUntilPhase2 returns correct countdown', () {
      final state = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 10)),
      );
      expect(state.daysUntilPhase2, 4); // 14 - 10

      final unlocked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 20)),
      );
      expect(unlocked.daysUntilPhase2, 0);
    });

    test('daysUntilPhase3 returns correct countdown', () {
      final state = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 30)),
      );
      expect(state.daysUntilPhase3, 12); // 42 - 30

      final unlocked = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 50)),
      );
      expect(unlocked.daysUntilPhase3, 0);
    });

    test('continueModule returns first inProgress module', () {
      final state = _stateWith(modules: sampleModules);
      expect(state.continueModule, isNotNull);
      expect(state.continueModule!.id, 'b');
    });

    test('continueModule returns null when none in progress', () {
      final state = _stateWith(modules: [
        const LearnModule(
          id: 'x',
          number: '1.1',
          titleEn: 'X',
          titleHi: '',
          durationMinutes: 2,
          phase: ContentPhase.phase1,
          status: ModuleStatus.completed,
          progress: 1.0,
        ),
      ]);
      expect(state.continueModule, isNull);
    });

    test('recommendedModules returns available modules (max 3)', () {
      final state = _stateWith(modules: sampleModules);
      final recommended = state.recommendedModules;
      // Only module 'c' is available in our sample set
      expect(recommended.length, 1);
      expect(recommended.first.id, 'c');
    });

    test('isPhaseUnlocked dispatches to correct phase', () {
      final state = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 20)),
      );
      expect(state.isPhaseUnlocked(ContentPhase.phase1), true);
      expect(state.isPhaseUnlocked(ContentPhase.phase2), true);
      expect(state.isPhaseUnlocked(ContentPhase.phase3), false);
    });

    test('daysUntilPhaseUnlock dispatches to correct phase', () {
      final state = _stateWith(
        modules: [],
        installDate: DateTime.now().subtract(const Duration(days: 20)),
      );
      expect(state.daysUntilPhaseUnlock(ContentPhase.phase1), 0);
      expect(state.daysUntilPhaseUnlock(ContentPhase.phase2), 0);
      expect(state.daysUntilPhaseUnlock(ContentPhase.phase3), 22); // 42 - 20
    });
  });

  // ---------------------------------------------------------------------------
  // LearnNotifier
  // ---------------------------------------------------------------------------

  group('LearnNotifier', () {
    late LearnNotifier notifier;

    setUp(() {
      notifier = LearnNotifier();
    });

    test('initial state has 33 modules loaded', () {
      expect(notifier.state.modules.length, 33);
    });

    test('initial state has phase1=8, phase2=12, phase3=13', () {
      expect(notifier.state.phase1Modules.length, 8);
      expect(notifier.state.phase2Modules.length, 12);
      expect(notifier.state.phase3Modules.length, 13);
    });

    test('phase 3 modules are locked on init (install 20 days ago)', () {
      final phase3 = notifier.state.phase3Modules;
      for (final m in phase3) {
        expect(m.status, ModuleStatus.locked);
      }
    });

    test('selectModule sets currentModuleId', () {
      notifier.selectModule('p1_01');
      expect(notifier.state.currentModuleId, 'p1_01');
      expect(notifier.state.currentModule, isNotNull);
      expect(notifier.state.currentModule!.id, 'p1_01');
    });

    test('startModule changes status from available to inProgress', () {
      // p1_04 should be available
      final before =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_04');
      expect(before.status, ModuleStatus.available);

      notifier.startModule('p1_04');

      final after =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_04');
      expect(after.status, ModuleStatus.inProgress);
      expect(after.progress, 0.1);
      expect(notifier.state.currentModuleId, 'p1_04');
    });

    test('startModule does nothing for locked modules', () {
      // Phase 3 modules should be locked
      final lockedModule = notifier.state.phase3Modules.first;
      expect(lockedModule.status, ModuleStatus.locked);

      notifier.startModule(lockedModule.id);

      final after =
          notifier.state.modules.firstWhere((m) => m.id == lockedModule.id);
      expect(after.status, ModuleStatus.locked); // unchanged
    });

    test('updateProgress updates module progress value', () {
      notifier.startModule('p1_04');
      notifier.updateProgress('p1_04', 0.7);

      final module =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_04');
      expect(module.progress, 0.7);
      expect(module.status, ModuleStatus.inProgress);
    });

    test('updateProgress with 1.0 sets status to completed', () {
      notifier.startModule('p1_04');
      notifier.updateProgress('p1_04', 1.0);

      final module =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_04');
      expect(module.status, ModuleStatus.completed);
      expect(module.progress, 1.0);
    });

    test('completeModule sets status to completed and progress to 1.0', () {
      notifier.startModule('p1_05');
      notifier.completeModule('p1_05');

      final module =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_05');
      expect(module.status, ModuleStatus.completed);
      expect(module.progress, 1.0);
    });

    test('submitFeedback records feedback on module', () {
      notifier.submitFeedback('p1_01', FeedbackResponse.helpful);

      final module =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_01');
      expect(module.feedback, FeedbackResponse.helpful);
    });

    test('submitFeedback with skipped', () {
      notifier.submitFeedback('p1_02', FeedbackResponse.skipped);

      final module =
          notifier.state.modules.firstWhere((m) => m.id == 'p1_02');
      expect(module.feedback, FeedbackResponse.skipped);
    });

    test('nextModule returns next available module after given module', () {
      // p1_01 (completed) -> p1_02 (completed) -> p1_03 (inProgress) ...
      final next = notifier.nextModule('p1_01');
      expect(next, isNotNull);
      expect(next!.id, 'p1_02');
    });

    test('nextModule returns null for last module', () {
      final lastModule = notifier.state.modules.last;
      final next = notifier.nextModule(lastModule.id);
      expect(next, isNull);
    });

    test('nextModule returns null when next module is locked', () {
      // The last phase2 module should be followed by a locked phase3 module
      final lastPhase2 = notifier.state.phase2Modules.last;
      final next = notifier.nextModule(lastPhase2.id);
      // The next module (first phase3) is locked, so should return null
      expect(next, isNull);
    });

    test('completedCount reflects initial mock data', () {
      // p1_01 and p1_02 are completed in mock data
      expect(notifier.state.completedCount, 2);
    });
  });
}
