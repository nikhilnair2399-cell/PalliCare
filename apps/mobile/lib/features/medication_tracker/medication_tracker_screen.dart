import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/section_header.dart';
import 'medication_provider.dart';
import 'medication_row.dart';
import 'prn_section.dart';
import 'medd_display.dart';
import 'side_effects_section.dart';

/// Main medication tracker screen.
class MedicationTrackerScreen extends ConsumerWidget {
  const MedicationTrackerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final medState = ref.watch(medicationProvider);

    final scheduled = medState.medications
        .where((m) => m.schedule == MedSchedule.scheduled)
        .toList();
    final prn = medState.medications
        .where((m) => m.schedule == MedSchedule.prn)
        .toList();

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
          'Medications · दवाइयाँ',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: 'Georgia',
          ),
        ),
        centerTitle: true,
      ),
      body: medState.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.screenPaddingHorizontal,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Adherence summary
                  _AdherenceBanner(state: medState),

                  const SizedBox(height: 8),

                  // MEDD display
                  if (medState.totalMedd > 0)
                    MeddDisplay(medd: medState.totalMedd),

                  // Scheduled meds
                  const SectionHeader(
                    title: 'Scheduled',
                    subtitle: 'नियमित दवाइयाँ',
                  ),
                  ...scheduled.map((med) => MedicationRow(
                        medication: med,
                        logs: medState.todayLogs
                            .where((l) => l.medicationId == med.id)
                            .toList(),
                      )),

                  // PRN meds
                  if (prn.isNotEmpty) ...[
                    const SectionHeader(
                      title: 'As Needed (PRN)',
                      subtitle: 'ज़रूरत के अनुसार',
                    ),
                    PrnSection(medications: prn, logs: medState.todayLogs),
                  ],

                  // Side effects
                  const SectionHeader(
                    title: 'Side Effects Watch',
                    subtitle: 'दुष्प्रभावों पर नज़र',
                  ),
                  SideEffectsSection(medications: medState.medications),

                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }
}

/// Top banner showing today's adherence progress.
class _AdherenceBanner extends StatelessWidget {
  final MedicationState state;
  const _AdherenceBanner({required this.state});

  @override
  Widget build(BuildContext context) {
    final pct = (state.adherence * 100).round();
    final color = pct >= 80
        ? AppColors.primary
        : pct >= 50
            ? AppColors.warning
            : AppColors.error;

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withAlpha(15),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: color.withAlpha(40)),
      ),
      child: Row(
        children: [
          // Circular progress
          SizedBox(
            width: 52,
            height: 52,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: state.adherence,
                  strokeWidth: 5,
                  backgroundColor: Colors.grey.shade200,
                  valueColor: AlwaysStoppedAnimation(color),
                ),
                Text(
                  '$pct%',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Today\'s Adherence',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${state.takenDoses} taken · ${state.pendingDoses} pending',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
