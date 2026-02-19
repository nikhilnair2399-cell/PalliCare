import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// A white card with rounded corners that acts as either:
///  1. An **expandable** section (icon + bilingual title + rotating chevron)
///     when [onTap] is null, or
///  2. A **navigation row** (icon + bilingual title + static chevron right)
///     when [onTap] is provided.
///
/// Design spec:
///  - White card, 16dp radius
///  - Section header with icon + bilingual title + chevron
///  - Chevron rotates 180 degrees on expand/collapse
class SettingsSectionCard extends StatefulWidget {
  final String titleEn;
  final String titleHi;
  final IconData icon;
  final bool initiallyExpanded;
  final Widget child;
  final VoidCallback? onTap; // if non-null, navigate instead of expand

  const SettingsSectionCard({
    super.key,
    required this.titleEn,
    required this.titleHi,
    required this.icon,
    this.initiallyExpanded = false,
    required this.child,
    this.onTap,
  });

  @override
  State<SettingsSectionCard> createState() => _SettingsSectionCardState();
}

class _SettingsSectionCardState extends State<SettingsSectionCard>
    with SingleTickerProviderStateMixin {
  late bool _expanded;
  late AnimationController _chevronController;
  late Animation<double> _chevronTurns;

  @override
  void initState() {
    super.initState();
    _expanded = widget.onTap == null ? widget.initiallyExpanded : false;
    _chevronController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _chevronTurns = Tween<double>(begin: 0, end: 0.5).animate(
      CurvedAnimation(parent: _chevronController, curve: Curves.easeInOut),
    );
    if (_expanded) {
      _chevronController.value = 1.0;
    }
  }

  @override
  void dispose() {
    _chevronController.dispose();
    super.dispose();
  }

  void _handleTap() {
    if (widget.onTap != null) {
      widget.onTap!();
      return;
    }
    setState(() {
      _expanded = !_expanded;
      if (_expanded) {
        _chevronController.forward();
      } else {
        _chevronController.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isNavRow = widget.onTap != null;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // -- Header row --
          InkWell(
            onTap: _handleTap,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.cardPadding,
                vertical: AppSpacing.space3 + 2, // ~14dp vertical
              ),
              child: Row(
                children: [
                  // Icon
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withAlpha(25),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Icon(
                      widget.icon,
                      size: 20,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space3),
                  // Title column
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.titleEn,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 1),
                        Text(
                          widget.titleHi,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Chevron
                  if (isNavRow)
                    const Icon(
                      Icons.chevron_right,
                      size: 22,
                      color: AppColors.textTertiary,
                    )
                  else
                    RotationTransition(
                      turns: _chevronTurns,
                      child: const Icon(
                        Icons.expand_more,
                        size: 22,
                        color: AppColors.textTertiary,
                      ),
                    ),
                ],
              ),
            ),
          ),

          // -- Expandable content --
          if (!isNavRow)
            AnimatedCrossFade(
              firstChild: const SizedBox.shrink(),
              secondChild: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Divider(
                    color: AppColors.divider,
                    height: 1,
                    thickness: 1,
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.cardPadding,
                      AppSpacing.space3,
                      AppSpacing.cardPadding,
                      AppSpacing.cardPadding,
                    ),
                    child: widget.child,
                  ),
                ],
              ),
              crossFadeState: _expanded
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 200),
              sizeCurve: Curves.easeInOut,
            ),
        ],
      ),
    );
  }
}
