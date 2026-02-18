import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'caregiver_provider.dart';

/// Medication card from the caregiver perspective.
/// Uses "Given" / "Later" instead of "Taken" / "Skip".
class CareMedicationCard extends ConsumerWidget {
  const CareMedicationCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(caregiverProvider);
    final meds = state.medications;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.primary.withAlpha(20),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.medication,
                  size: 18,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${state.patientName}\'s ${state.medicationTimeLabel} medications',
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${state.patientNameHindi} \u0915\u0940 ${state.medicationTimeLabel == 'evening' ? '\u0936\u093E\u092E' : '\u0938\u0941\u092C\u0939'} \u0915\u0940 \u0926\u0935\u093E\u0907\u092F\u093E\u0901',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              // Count badge
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withAlpha(15),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
                ),
                child: Text(
                  '${meds.where((m) => m.given).length}/${meds.length}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.space4),

          // Medication list
          ...meds.map((med) => _CaregiverMedRow(medication: med)),
        ],
      ),
    );
  }
}

/// A single medication row with "Given" / "Later" buttons.
class _CaregiverMedRow extends ConsumerWidget {
  final CaregiverMedication medication;

  const _CaregiverMedRow({required this.medication});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          // Opioid indicator dot
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: medication.given
                  ? AppColors.primary
                  : medication.isOpioid
                      ? AppColors.warning
                      : AppColors.border,
            ),
          ),
          const SizedBox(width: 12),

          // Med info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      medication.name,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: medication.given
                            ? AppColors.textSecondary
                            : AppColors.textPrimary,
                        decoration: medication.given
                            ? TextDecoration.lineThrough
                            : null,
                      ),
                    ),
                    if (medication.isOpioid) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 5, vertical: 1),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withAlpha(25),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'Opioid',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w600,
                            color: AppColors.warning,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  '${medication.dose} \u00B7 ${medication.time} \u00B7 ${medication.nameHindi}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),

          // Action buttons
          if (medication.given)
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check, size: 14, color: Colors.white),
                  SizedBox(width: 4),
                  Text(
                    'Given',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            )
          else
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Given button
                SizedBox(
                  height: 32,
                  child: ElevatedButton(
                    onPressed: () {
                      ref
                          .read(caregiverProvider.notifier)
                          .markMedicationGiven(medication.id);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Given',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Later button
                SizedBox(
                  height: 32,
                  child: OutlinedButton(
                    onPressed: () {
                      ref
                          .read(caregiverProvider.notifier)
                          .markMedicationLater(medication.id);
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textSecondary,
                      side: const BorderSide(color: AppColors.border),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Later',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
