import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_spacing.dart';

/// A full-width tappable card used for single/multi selection throughout
/// onboarding, logging, and settings flows.
class SelectionCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;
  final String? emoji;
  final Color accentColor;
  final bool isSelected;
  final VoidCallback onTap;
  final double height;

  const SelectionCard({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.emoji,
    this.accentColor = AppColors.sageGreen,
    this.isSelected = false,
    required this.onTap,
    this.height = 80,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: height,
        margin: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? accentColor.withAlpha(20) : Colors.white,
          border: Border(
            left: BorderSide(
              color: isSelected ? accentColor : Colors.transparent,
              width: 4,
            ),
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(isSelected ? 18 : 10),
              blurRadius: isSelected ? 10 : 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              if (emoji != null) ...[
                Text(emoji!, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 14),
              ] else if (icon != null) ...[
                Icon(icon, size: 28, color: accentColor),
                const SizedBox(width: 14),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF2D2D2D),
                      ),
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        subtitle!,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (isSelected)
                Icon(Icons.check_circle, color: accentColor, size: 24),
            ],
          ),
        ),
      ),
    );
  }
}
