import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'medication_provider.dart';

/// A single scheduled medication with its dose timeline.
class MedicationRow extends ConsumerWidget {
  final Medication medication;
  final List<MedDoseLog> logs;

  const MedicationRow({
    super.key,
    required this.medication,
    required this.logs,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Med name + dose
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: medication.isOpioid
                      ? AppColors.warning.withAlpha(30)
                      : AppColors.primary.withAlpha(20),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.medication,
                  size: 20,
                  color:
                      medication.isOpioid ? AppColors.warning : AppColors.primary,
                ),
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
                            medication.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        if (medication.isOpioid) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.warning.withAlpha(30),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'Opioid',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: AppColors.warning,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    Text(
                      '${medication.dose} · ${medication.route} · ${medication.nameHindi}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Dose timeline
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: logs.map((log) {
              return _DoseChip(
                time: _formatTime(log.scheduledTime),
                isTaken: log.isTaken,
                isSkipped: log.skipped,
                onTake: log.isPending
                    ? () => ref.read(medicationProvider.notifier).markTaken(
                          medication.id,
                          log.scheduledTime,
                        )
                    : null,
                onSkip: log.isPending
                    ? () => ref.read(medicationProvider.notifier).markSkipped(
                          medication.id,
                          log.scheduledTime,
                          'Skipped by patient',
                        )
                    : null,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return '$hour:$min';
  }
}

/// Individual dose chip: pending / taken / skipped.
class _DoseChip extends StatelessWidget {
  final String time;
  final bool isTaken;
  final bool isSkipped;
  final VoidCallback? onTake;
  final VoidCallback? onSkip;

  const _DoseChip({
    required this.time,
    required this.isTaken,
    required this.isSkipped,
    this.onTake,
    this.onSkip,
  });

  @override
  Widget build(BuildContext context) {
    final isPending = !isTaken && !isSkipped;

    final bgColor = isTaken
        ? AppColors.primary.withAlpha(20)
        : isSkipped
            ? AppColors.error.withAlpha(15)
            : Colors.grey.shade50;
    final borderColor = isTaken
        ? AppColors.primary
        : isSkipped
            ? AppColors.error
            : Colors.grey.shade300;
    final icon = isTaken
        ? Icons.check_circle
        : isSkipped
            ? Icons.cancel
            : Icons.schedule;
    final iconColor = isTaken
        ? AppColors.primary
        : isSkipped
            ? AppColors.error
            : Colors.grey.shade400;

    return GestureDetector(
      onTap: isPending ? onTake : null,
      onLongPress: isPending ? onSkip : null,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(color: borderColor, width: isTaken ? 2 : 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: iconColor),
            const SizedBox(width: 6),
            Text(
              time,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            if (isTaken) ...[
              const SizedBox(width: 4),
              Text(
                '✓',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary),
              ),
            ],
            if (isPending) ...[
              const SizedBox(width: 6),
              Text(
                'Tap to take',
                style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
