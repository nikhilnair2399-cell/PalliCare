import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'pain_diary_provider.dart';

/// Report generation screen for doctor visits.
class ReportGeneratorScreen extends ConsumerWidget {
  const ReportGeneratorScreen({super.key});

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
          'Pain Report · रिपोर्ट',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: 'Georgia',
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.screenPaddingHorizontal),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Report period selector
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Report Period',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'रिपोर्ट अवधि',
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _PeriodButton(
                        label: 'Last 7 days',
                        isSelected: diary.range == DiaryRange.week,
                        onTap: () => ref
                            .read(painDiaryProvider.notifier)
                            .setRange(DiaryRange.week),
                      ),
                      const SizedBox(width: 8),
                      _PeriodButton(
                        label: 'Last 30 days',
                        isSelected: diary.range == DiaryRange.month,
                        onTap: () => ref
                            .read(painDiaryProvider.notifier)
                            .setRange(DiaryRange.month),
                      ),
                      const SizedBox(width: 8),
                      _PeriodButton(
                        label: '3 months',
                        isSelected: diary.range == DiaryRange.threeMonths,
                        onTap: () => ref
                            .read(painDiaryProvider.notifier)
                            .setRange(DiaryRange.threeMonths),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Report preview
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.description,
                          color: AppColors.primaryDark, size: 24),
                      const SizedBox(width: 8),
                      const Text(
                        'Report Summary',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  _ReportRow(
                    label: 'Average Pain',
                    value: '${diary.averagePain.toStringAsFixed(1)}/10',
                    valueColor:
                        PainBadge.painColor(diary.averagePain.round()),
                  ),
                  _ReportRow(
                    label: 'Peak Pain',
                    value: '${diary.peakPain}/10',
                    valueColor: PainBadge.painColor(diary.peakPain),
                  ),
                  _ReportRow(
                    label: 'Total Logs',
                    value: '${diary.totalLogs}',
                    valueColor: AppColors.info,
                  ),
                  _ReportRow(
                    label: 'Trend',
                    value: diary.trend > 0.5
                        ? 'Increasing ↑'
                        : diary.trend < -0.5
                            ? 'Improving ↓'
                            : 'Stable →',
                    valueColor: diary.trend > 0.5
                        ? AppColors.error
                        : diary.trend < -0.5
                            ? AppColors.primary
                            : AppColors.warning,
                  ),
                  _ReportRow(
                    label: 'Days Logged',
                    value: '${diary.entries.length}',
                    valueColor: AppColors.textPrimary,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Share actions
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(10),
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
              ),
              child: Column(
                children: [
                  const Icon(Icons.share, color: AppColors.primary, size: 32),
                  const SizedBox(height: 12),
                  const Text(
                    'Share with your doctor',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'अपने डॉक्टर के साथ साझा करें',
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _ShareButton(
                          icon: Icons.picture_as_pdf,
                          label: 'PDF',
                          onTap: () {
                            // TODO: Generate PDF report
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content: Text('PDF generation coming soon')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ShareButton(
                          icon: Icons.chat,
                          label: 'WhatsApp',
                          onTap: () {
                            // TODO: Share via WhatsApp
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content:
                                      Text('WhatsApp sharing coming soon')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ShareButton(
                          icon: Icons.cloud_upload,
                          label: 'Send to\nClinic',
                          onTap: () {
                            // TODO: Send to clinic dashboard
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content:
                                      Text('Clinic sync coming soon')),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _PeriodButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _PeriodButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.grey.shade100,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

class _ReportRow extends StatelessWidget {
  final String label;
  final String value;
  final Color valueColor;

  const _ReportRow({
    required this.label,
    required this.value,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style:
                  const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _ShareButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ShareButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 24),
            const SizedBox(height: 6),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
