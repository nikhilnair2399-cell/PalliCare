import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

/// Dot-based progress indicator used in onboarding and logging flows.
class ProgressDots extends StatelessWidget {
  final int currentStep;
  final int totalSteps;
  final String? label;

  const ProgressDots({
    super.key,
    required this.currentStep,
    required this.totalSteps,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(totalSteps, (index) {
            final isCurrent = index == currentStep;
            final isDone = index < currentStep;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              width: isCurrent ? 10 : 8,
              height: isCurrent ? 10 : 8,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: (isDone || isCurrent)
                    ? AppColors.sageGreen
                    : Colors.grey.shade300,
              ),
            );
          }),
        ),
        if (label != null) ...[
          const SizedBox(height: 6),
          Text(
            label!,
            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
          ),
        ],
      ],
    );
  }
}
