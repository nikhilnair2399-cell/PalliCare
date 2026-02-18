import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'learn_provider.dart';
import 'learn_module_card.dart';

/// Expandable phase card showing a learning path and its modules.
///
/// Displays a collapsible header with phase title (bilingual), module count,
/// completion progress, and an expandable list of [LearnModuleCard] rows.
/// Locked phases show a lock notice with days until unlock. Sensitive phases
/// display a compassionate notice before module list.
class LearnPathCard extends StatefulWidget {
  final String phaseLabel;
  final String titleEn;
  final String titleHi;
  final List<LearnModule> modules;
  final Color accentColor;
  final bool isSensitive;
  final bool isUnlocked;
  final int daysUntilUnlock;
  final ValueChanged<LearnModule> onModuleTap;

  const LearnPathCard({
    super.key,
    required this.phaseLabel,
    required this.titleEn,
    required this.titleHi,
    required this.modules,
    required this.accentColor,
    this.isSensitive = false,
    this.isUnlocked = true,
    this.daysUntilUnlock = 0,
    required this.onModuleTap,
  });

  @override
  State<LearnPathCard> createState() => _LearnPathCardState();
}

class _LearnPathCardState extends State<LearnPathCard>
    with SingleTickerProviderStateMixin {
  bool _expanded = false;

  int get _completedCount =>
      widget.modules.where((m) => m.status == ModuleStatus.completed).length;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Header (always visible)
          InkWell(
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  // Phase indicator dot
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: widget.accentColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  // Titles
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${widget.phaseLabel}: ${widget.titleEn}',
                          style: AppTypography.heading4.copyWith(
                            color: AppColors.teal,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          widget.titleHi,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Completion count
                  Text(
                    '$_completedCount / ${widget.modules.length}',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: AppColors.charcoalLight,
                    size: 22,
                  ),
                ],
              ),
            ),
          ),

          // Expanded module list
          if (_expanded) ...[
            const Divider(height: 1, color: AppColors.divider),
            if (!widget.isUnlocked) _buildLockedNotice(),
            if (widget.isSensitive && widget.isUnlocked)
              _buildSensitiveNotice(),
            ...widget.modules.map(
              (m) => LearnModuleCard(
                module: m,
                isCompact: false,
                onTap: () => widget.onModuleTap(m),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // LOCKED NOTICE
  // ---------------------------------------------------------------------------

  Widget _buildLockedNotice() {
    return Container(
      margin: const EdgeInsets.fromLTRB(
          AppSpacing.md, AppSpacing.sm, AppSpacing.md, 0),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.accentHighlight.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
        border:
            Border.all(color: AppColors.accentHighlight.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.lock_outline,
              size: 18, color: AppColors.charcoalLight),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.daysUntilUnlock > 0
                  ? 'Unlocks in ${widget.daysUntilUnlock} days. '
                      'Keep going at your own pace.'
                  : 'This phase will unlock soon.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // SENSITIVE CONTENT NOTICE
  // ---------------------------------------------------------------------------

  Widget _buildSensitiveNotice() {
    return Container(
      margin: const EdgeInsets.fromLTRB(
          AppSpacing.md, AppSpacing.sm, AppSpacing.md, 0),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.lavenderLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
        border: Border.all(color: AppColors.lavender.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          const Icon(Icons.favorite_border,
              size: 18, color: AppColors.charcoalLight),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'These topics are personal. Take your time \u2014 there\'s no rush.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
