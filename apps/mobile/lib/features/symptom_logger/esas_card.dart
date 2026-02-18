import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'symptom_log_provider.dart';

/// Edmonton Symptom Assessment Scale (ESAS-r) — 9 symptoms, 0-10 each.
class EsasCard extends ConsumerWidget {
  const EsasCard({super.key});

  static const _symptoms = [
    _EsasSymptom('tiredness', 'Tiredness', 'थकान', '😴'),
    _EsasSymptom('nausea', 'Nausea', 'मिचली', '🤢'),
    _EsasSymptom('appetite', 'Lack of Appetite', 'भूख न लगना', '🍽️'),
    _EsasSymptom('shortness_of_breath', 'Shortness of Breath', 'साँस फूलना', '😮‍💨'),
    _EsasSymptom('depression', 'Depression', 'उदासी', '😞'),
    _EsasSymptom('anxiety', 'Anxiety', 'चिंता', '😟'),
    _EsasSymptom('drowsiness', 'Drowsiness', 'नींद आना', '😪'),
    _EsasSymptom('wellbeing', 'Wellbeing', 'सामान्य स्वास्थ्य', '💚'),
    _EsasSymptom('constipation', 'Constipation', 'कब्ज', '🫤'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scores = ref.watch(symptomLogProvider).esasScores;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'How are these symptoms?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'ये लक्षण कैसे हैं? (0 = नहीं, 10 = सबसे बुरा)',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 20),

          ...List.generate(_symptoms.length, (index) {
            final symptom = _symptoms[index];
            final score = scores[symptom.id] ?? 0;

            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(symptom.emoji,
                          style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              symptom.label,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              symptom.hindi,
                              style: TextStyle(
                                  fontSize: 12, color: Colors.grey.shade500),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 36,
                        height: 28,
                        decoration: BoxDecoration(
                          color: _scoreColor(score).withAlpha(30),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '$score',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: _scoreColor(score),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: _scoreColor(score),
                      inactiveTrackColor: Colors.grey.shade200,
                      thumbColor: _scoreColor(score),
                      trackHeight: 6,
                      thumbShape:
                          const RoundSliderThumbShape(enabledThumbRadius: 10),
                      overlayShape:
                          const RoundSliderOverlayShape(overlayRadius: 18),
                    ),
                    child: Slider(
                      value: score.toDouble(),
                      min: 0,
                      max: 10,
                      divisions: 10,
                      onChanged: (val) => ref
                          .read(symptomLogProvider.notifier)
                          .setEsasScore(symptom.id, val.round()),
                    ),
                  ),
                  if (index < _symptoms.length - 1)
                    Divider(color: Colors.grey.shade100, height: 1),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Color _scoreColor(int score) {
    if (score <= 3) return AppColors.primary;
    if (score <= 6) return AppColors.warning;
    return AppColors.error;
  }
}

class _EsasSymptom {
  final String id;
  final String label;
  final String hindi;
  final String emoji;
  const _EsasSymptom(this.id, this.label, this.hindi, this.emoji);
}
