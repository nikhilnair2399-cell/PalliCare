import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/section_header.dart';
import 'pain_diary_provider.dart';
import 'metric_cards.dart';
import 'pain_week_chart.dart';
import 'pain_month_heatmap.dart';
import 'daily_entry_card.dart';

/// Main pain diary screen with charts, metrics, and daily entries.
class PainDiaryScreen extends ConsumerWidget {
  const PainDiaryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final diary = ref.watch(painDiaryProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primaryDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Pain Diary · दर्द डायरी',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: 'Georgia',
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.description_outlined,
                color: AppColors.primaryDark),
            onPressed: () {
              // TODO: Navigate to report generator
            },
            tooltip: 'Generate Report',
          ),
        ],
      ),
      body: diary.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.screenPaddingHorizontal,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 8),

                  // Range selector
                  _RangeSelector(
                    current: diary.range,
                    onChanged: (r) =>
                        ref.read(painDiaryProvider.notifier).setRange(r),
                  ),

                  const SizedBox(height: 16),

                  // Metric summary cards
                  MetricCards(diary: diary),

                  // Chart section
                  const SectionHeader(
                    title: 'Pain Trend',
                    subtitle: 'दर्द का रुझान',
                  ),
                  if (diary.range == DiaryRange.week)
                    PainWeekChart(entries: diary.entries)
                  else
                    PainMonthHeatmap(entries: diary.entries),

                  // Daily entries
                  const SectionHeader(
                    title: 'Daily Log',
                    subtitle: 'दैनिक रिकॉर्ड',
                  ),
                  ...diary.entries.reversed.take(14).map(
                        (entry) => DailyEntryCard(
                          entry: entry,
                          isSelected: diary.selectedDate != null &&
                              entry.date.year == diary.selectedDate!.year &&
                              entry.date.month == diary.selectedDate!.month &&
                              entry.date.day == diary.selectedDate!.day,
                          onTap: () => ref
                              .read(painDiaryProvider.notifier)
                              .selectDate(entry.date),
                        ),
                      ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }
}

/// Segmented range picker: Week / Month / 3 Months.
class _RangeSelector extends StatelessWidget {
  final DiaryRange current;
  final ValueChanged<DiaryRange> onChanged;

  const _RangeSelector({required this.current, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: DiaryRange.values.map((range) {
          final isSelected = range == current;
          final label = switch (range) {
            DiaryRange.week => '7 Days',
            DiaryRange.month => '30 Days',
            DiaryRange.threeMonths => '3 Months',
          };
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(range),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard - 1),
                ),
                child: Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
