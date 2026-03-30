import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'symptom_log_provider.dart';

/// Mood + sleep quality + hours card.
class MoodSleepCard extends ConsumerWidget {
  const MoodSleepCard({super.key});

  static const _moods = [
    _MoodOption('peaceful', 'Peaceful', 'शांत', '😌'),
    _MoodOption('okay', 'Okay', 'ठीक', '🙂'),
    _MoodOption('worried', 'Worried', 'चिंतित', '😟'),
    _MoodOption('sad', 'Sad', 'उदास', '😢'),
    _MoodOption('frustrated', 'Frustrated', 'निराश', '😤'),
  ];

  static const _sleepQualities = [
    _SleepOption('good', 'Good', 'अच्छी', '😴'),
    _SleepOption('fair', 'Fair', 'ठीक', '😐'),
    _SleepOption('poor', 'Poor', 'खराब', '😫'),
    _SleepOption('none', 'Couldn\'t sleep', 'नींद नहीं आई', '🥱'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final entry = ref.watch(symptomLogProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Mood section
          Text(
            l.moodQuestion,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'आपका मन कैसा है?',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: _moods.map((mood) {
              final isSelected = entry.mood == mood.id;
              return GestureDetector(
                onTap: () =>
                    ref.read(symptomLogProvider.notifier).setMood(mood.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: AppSpacing.emotionButtonSize,
                  height: AppSpacing.emotionButtonSize + 24,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.accentCalm.withAlpha(60)
                        : Colors.white,
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primaryDark
                          : Colors.grey.shade200,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(mood.emoji,
                          style: const TextStyle(fontSize: 28)),
                      const SizedBox(height: 4),
                      Text(
                        mood.label,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: isSelected
                              ? FontWeight.w700
                              : FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 32),

          // Sleep quality
          Text(
            l.sleepQualityQuestion,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'कल रात की नींद कैसी थी?',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),

          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _sleepQualities.map((sq) {
              final isSelected = entry.sleepQuality == sq.id;
              return GestureDetector(
                onTap: () => ref
                    .read(symptomLogProvider.notifier)
                    .setSleepQuality(sq.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.accentCalm.withAlpha(40)
                        : Colors.white,
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusChip),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primaryDark
                          : Colors.grey.shade300,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(sq.emoji, style: const TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Text(
                        sq.label,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: isSelected
                              ? FontWeight.w700
                              : FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 28),

          // Sleep hours
          Text(
            l.sleepHoursLabel,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'नींद के घंटे',
            style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
          ),
          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(13, (i) {
              final isSelected = entry.sleepHours == i;
              return GestureDetector(
                onTap: () => ref
                    .read(symptomLogProvider.notifier)
                    .setSleepHours(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  width: 28,
                  height: 36,
                  margin: const EdgeInsets.symmetric(horizontal: 1),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryDark
                        : (i <= (entry.sleepHours ?? -1)
                            ? AppColors.accentCalm.withAlpha(40)
                            : Colors.grey.shade100),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '$i',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isSelected
                          ? Colors.white
                          : AppColors.textSecondary,
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _MoodOption {
  final String id;
  final String label;
  final String hindi;
  final String emoji;
  const _MoodOption(this.id, this.label, this.hindi, this.emoji);
}

class _SleepOption {
  final String id;
  final String label;
  final String hindi;
  final String emoji;
  const _SleepOption(this.id, this.label, this.hindi, this.emoji);
}
