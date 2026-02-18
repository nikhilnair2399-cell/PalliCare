import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'medication_provider.dart';

/// PRN (as-needed) medications section with quick-log buttons.
class PrnSection extends ConsumerWidget {
  final List<Medication> medications;
  final List<MedDoseLog> logs;

  const PrnSection({
    super.key,
    required this.medications,
    required this.logs,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: medications.map((med) {
        final medLogs = logs.where((l) => l.medicationId == med.id).toList();
        final todayCount = medLogs.where((l) => l.isTaken).length;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              // Med info
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.accentWarm.withAlpha(25),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.medication_liquid,
                    size: 22, color: AppColors.accentWarm),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            '${med.name} ${med.dose}',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        if (med.isOpioid) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.warning.withAlpha(30),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'Opioid',
                              style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.warning),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      med.prnInstruction ?? 'As needed',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                    if (todayCount > 0) ...[
                      const SizedBox(height: 4),
                      Text(
                        'Taken $todayCount time(s) today',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              // Quick log button
              GestureDetector(
                onTap: () {
                  ref.read(medicationProvider.notifier).logPrnDose(med.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${med.name} dose logged'),
                      backgroundColor: AppColors.primary,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.accentWarm,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                  ),
                  child: const Text(
                    'Log\nDose',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
