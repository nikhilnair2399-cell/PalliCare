import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/symptom_logger/symptom_log_provider.dart';

void main() {
  group('SymptomLogEntry', () {
    test('default state has expected values', () {
      const entry = SymptomLogEntry();
      expect(entry.mode, LogMode.full);
      expect(entry.currentCard, 0);
      expect(entry.painIntensity, isNull);
      expect(entry.painLocations, isEmpty);
      expect(entry.painQualities, isEmpty);
      expect(entry.aggravators, isEmpty);
      expect(entry.relievers, isEmpty);
      expect(entry.esasScores, isEmpty);
      expect(entry.mood, isNull);
      expect(entry.sleepQuality, isNull);
      expect(entry.sleepHours, isNull);
      expect(entry.notes, isNull);
    });

    test('totalCards returns correct count per mode', () {
      expect(const SymptomLogEntry(mode: LogMode.quick).totalCards, 3);
      expect(const SymptomLogEntry(mode: LogMode.full).totalCards, 7);
      expect(const SymptomLogEntry(mode: LogMode.breakthrough).totalCards, 1);
    });

    test('copyWith preserves unchanged fields', () {
      const entry = SymptomLogEntry(painIntensity: 5, mood: 'happy');
      final updated = entry.copyWith(painIntensity: 7);
      expect(updated.painIntensity, 7);
      expect(updated.mood, 'happy'); // unchanged
    });
  });

  group('SymptomLogNotifier', () {
    late SymptomLogNotifier notifier;

    setUp(() {
      notifier = SymptomLogNotifier();
    });

    test('initial state is default SymptomLogEntry', () {
      expect(notifier.state.mode, LogMode.full);
      expect(notifier.state.currentCard, 0);
    });

    test('startLog sets mode and resets state', () {
      notifier.setPainIntensity(8);
      notifier.startLog(LogMode.quick);
      expect(notifier.state.mode, LogMode.quick);
      expect(notifier.state.painIntensity, isNull); // reset
      expect(notifier.state.currentCard, 0);
    });

    test('setPainIntensity updates pain intensity', () {
      notifier.setPainIntensity(6);
      expect(notifier.state.painIntensity, 6);
    });

    test('togglePainLocation adds and removes locations', () {
      notifier.togglePainLocation('head', 5);
      expect(notifier.state.painLocations, {'head': 5});

      notifier.togglePainLocation('chest', 3);
      expect(notifier.state.painLocations, {'head': 5, 'chest': 3});

      notifier.togglePainLocation('head', 5); // remove
      expect(notifier.state.painLocations, {'chest': 3});
    });

    test('togglePainQuality adds and removes qualities', () {
      notifier.togglePainQuality('burning');
      expect(notifier.state.painQualities, ['burning']);

      notifier.togglePainQuality('sharp');
      expect(notifier.state.painQualities, ['burning', 'sharp']);

      notifier.togglePainQuality('burning'); // remove
      expect(notifier.state.painQualities, ['sharp']);
    });

    test('toggleAggravator adds and removes aggravators', () {
      notifier.toggleAggravator('movement');
      expect(notifier.state.aggravators, ['movement']);

      notifier.toggleAggravator('movement'); // remove
      expect(notifier.state.aggravators, isEmpty);
    });

    test('toggleReliever adds and removes relievers', () {
      notifier.toggleReliever('rest');
      expect(notifier.state.relievers, ['rest']);

      notifier.toggleReliever('rest'); // remove
      expect(notifier.state.relievers, isEmpty);
    });

    test('setEsasScore adds and updates ESAS scores', () {
      notifier.setEsasScore('pain', 7);
      notifier.setEsasScore('nausea', 3);
      expect(notifier.state.esasScores, {'pain': 7, 'nausea': 3});

      notifier.setEsasScore('pain', 5); // update
      expect(notifier.state.esasScores['pain'], 5);
    });

    test('setMood updates mood', () {
      notifier.setMood('calm');
      expect(notifier.state.mood, 'calm');
    });

    test('setSleepQuality updates sleep quality', () {
      notifier.setSleepQuality('good');
      expect(notifier.state.sleepQuality, 'good');
    });

    test('setSleepHours updates sleep hours', () {
      notifier.setSleepHours(7);
      expect(notifier.state.sleepHours, 7);
    });

    test('setNotes updates notes', () {
      notifier.setNotes('Feeling better today');
      expect(notifier.state.notes, 'Feeling better today');
    });

    test('nextCard increments currentCard', () {
      notifier.nextCard();
      expect(notifier.state.currentCard, 1);
      notifier.nextCard();
      expect(notifier.state.currentCard, 2);
    });

    test('prevCard decrements currentCard but not below 0', () {
      notifier.nextCard(); // 1
      notifier.nextCard(); // 2
      notifier.prevCard(); // 1
      expect(notifier.state.currentCard, 1);

      notifier.prevCard(); // 0
      notifier.prevCard(); // stays 0
      expect(notifier.state.currentCard, 0);
    });

    test('reset returns to default state', () {
      notifier.setPainIntensity(8);
      notifier.setMood('sad');
      notifier.nextCard();
      notifier.reset();
      expect(notifier.state.painIntensity, isNull);
      expect(notifier.state.mood, isNull);
      expect(notifier.state.currentCard, 0);
    });
  });
}
