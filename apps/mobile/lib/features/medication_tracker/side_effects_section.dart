import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'medication_provider.dart';

/// Side effects watchlist aggregated from all current medications.
class SideEffectsSection extends StatelessWidget {
  final List<Medication> medications;
  const SideEffectsSection({super.key, required this.medications});

  static const _sideEffectInfo = {
    'constipation': _SEInfo(
      'Constipation',
      'कब्ज',
      '🫤',
      'Very common with opioids. Drink plenty of water, eat fiber.',
    ),
    'nausea': _SEInfo(
      'Nausea',
      'मिचली',
      '🤢',
      'Usually improves after a few days. Take with food.',
    ),
    'drowsiness': _SEInfo(
      'Drowsiness',
      'नींद आना',
      '😴',
      'Common when starting opioids. Usually temporary.',
    ),
    'dizziness': _SEInfo(
      'Dizziness',
      'चक्कर',
      '😵',
      'Get up slowly. Report if persistent.',
    ),
    'dry_mouth': _SEInfo(
      'Dry Mouth',
      'मुँह सूखना',
      '💧',
      'Sip water frequently. Sugar-free lozenges may help.',
    ),
    'itching': _SEInfo(
      'Itching',
      'खुजली',
      '🤲',
      'May occur with opioids. Antihistamines may help.',
    ),
  };

  @override
  Widget build(BuildContext context) {
    // Collect unique side effects across all meds
    final effectSet = <String>{};
    final effectSources = <String, List<String>>{};

    for (final med in medications) {
      for (final se in med.sideEffects) {
        effectSet.add(se);
        effectSources.putIfAbsent(se, () => []).add(med.name);
      }
    }

    if (effectSet.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            const Icon(Icons.check_circle, color: AppColors.primary, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'No known side effects to watch for',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: effectSet.map((effect) {
        final info = _sideEffectInfo[effect];
        final sources = effectSources[effect] ?? [];

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                info?.emoji ?? '⚠️',
                style: const TextStyle(fontSize: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          info?.label ?? _formatName(effect),
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          info?.hindi ?? '',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      info?.advice ?? 'Report to your doctor if persistent.',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade600,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'From: ${sources.join(", ")}',
                      style: TextStyle(
                        fontSize: 11,
                        fontStyle: FontStyle.italic,
                        color: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  String _formatName(String s) {
    return s.replaceAll('_', ' ').split(' ').map((w) {
      if (w.isEmpty) return w;
      return w[0].toUpperCase() + w.substring(1);
    }).join(' ');
  }
}

class _SEInfo {
  final String label;
  final String hindi;
  final String emoji;
  final String advice;
  const _SEInfo(this.label, this.hindi, this.emoji, this.advice);
}
