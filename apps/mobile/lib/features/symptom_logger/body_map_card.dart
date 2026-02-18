import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'symptom_log_provider.dart';

/// Body map for marking pain locations.
/// Uses a simplified zone grid until custom SVG body is available.
class BodyMapCard extends ConsumerWidget {
  const BodyMapCard({super.key});

  static const _zones = [
    _BodyZone('head', 'Head / सिर', Icons.face),
    _BodyZone('neck', 'Neck / गर्दन', Icons.accessibility_new),
    _BodyZone('chest', 'Chest / छाती', Icons.favorite_border),
    _BodyZone('abdomen', 'Abdomen / पेट', Icons.circle_outlined),
    _BodyZone('upper_back', 'Upper Back / ऊपरी पीठ', Icons.arrow_upward),
    _BodyZone('lower_back', 'Lower Back / कमर', Icons.arrow_downward),
    _BodyZone('left_arm', 'Left Arm / बायाँ हाथ', Icons.back_hand_outlined),
    _BodyZone('right_arm', 'Right Arm / दायाँ हाथ', Icons.back_hand_outlined),
    _BodyZone('left_leg', 'Left Leg / बायाँ पैर', Icons.directions_walk),
    _BodyZone('right_leg', 'Right Leg / दायाँ पैर', Icons.directions_walk),
    _BodyZone('pelvis', 'Pelvis / श्रोणि', Icons.airline_seat_legroom_normal),
    _BodyZone('whole_body', 'Whole Body / पूरा शरीर', Icons.person),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final entry = ref.watch(symptomLogProvider);
    final locations = entry.painLocations;
    final currentIntensity = entry.painIntensity ?? 5;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Where does it hurt?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'दर्द कहाँ हो रहा है? (एक या अधिक चुनें)',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 20),

          // Zone grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              childAspectRatio: 1.0,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: _zones.length,
            itemBuilder: (context, index) {
              final zone = _zones[index];
              final isSelected = locations.containsKey(zone.id);
              final zoneIntensity = locations[zone.id] ?? currentIntensity;
              final color = isSelected
                  ? PainBadge.painColor(zoneIntensity)
                  : Colors.grey.shade200;

              return GestureDetector(
                onTap: () => ref
                    .read(symptomLogProvider.notifier)
                    .togglePainLocation(zone.id, currentIntensity),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  decoration: BoxDecoration(
                    color: isSelected ? color.withAlpha(30) : Colors.white,
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(
                      color: isSelected ? color : Colors.grey.shade300,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        zone.icon,
                        size: 28,
                        color: isSelected ? color : Colors.grey.shade400,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        zone.label.split(' / ')[0],
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight:
                              isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected
                              ? AppColors.textPrimary
                              : Colors.grey.shade600,
                        ),
                      ),
                      if (isSelected)
                        Padding(
                          padding: const EdgeInsets.only(top: 2),
                          child: PainBadge(score: zoneIntensity, size: 20),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),

          const SizedBox(height: 16),
          if (locations.isNotEmpty)
            Text(
              '${locations.length} location(s) selected',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
        ],
      ),
    );
  }
}

class _BodyZone {
  final String id;
  final String label;
  final IconData icon;
  const _BodyZone(this.id, this.label, this.icon);
}
