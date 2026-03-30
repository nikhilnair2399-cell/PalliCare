import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'breathe_provider.dart';

/// Program card widget — shows a condition-specific program with 3 sessions.
class BreatheProgramCard extends StatefulWidget {
  final BreatheProgram program;
  final List<BreatheExercise> exercises;
  final ValueChanged<int> onSessionTap;

  const BreatheProgramCard({
    super.key,
    required this.program,
    required this.exercises,
    required this.onSessionTap,
  });

  @override
  State<BreatheProgramCard> createState() => _BreatheProgramCardState();
}

class _BreatheProgramCardState extends State<BreatheProgramCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final p = widget.program;
    final color = _conditionColor(p.condition);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: color.withValues(alpha: 0.25),
        ),
      ),
      child: Column(
        children: [
          // Header
          InkWell(
            onTap: () => setState(() => _expanded = !_expanded),
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  // Emoji avatar
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Text(p.emoji, style: const TextStyle(fontSize: 24)),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          p.nameEn,
                          style: AppTypography.label.copyWith(
                            color: AppColors.teal,
                          ),
                        ),
                        Text(
                          p.nameHi,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Progress bar
                        Row(
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: p.progress,
                                  backgroundColor:
                                      color.withValues(alpha: 0.12),
                                  valueColor:
                                      AlwaysStoppedAnimation<Color>(color),
                                  minHeight: 4,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${p.completedSessions}/${p.totalSessions}',
                              style: AppTypography.caption.copyWith(
                                color: color,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (p.isComplete)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.sage.withValues(alpha: 0.12),
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusBadge),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.check_circle,
                              color: AppColors.sage, size: 14),
                          const SizedBox(width: 3),
                          Text(
                            'Done',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.sage,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(width: 4),
                  AnimatedRotation(
                    turns: _expanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Icon(
                      Icons.expand_more,
                      color: AppColors.charcoalLight,
                      size: 22,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Expandable sessions
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.md,
                0,
                AppSpacing.md,
                AppSpacing.md,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(height: 1),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    p.descriptionEn,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                      height: 1.4,
                    ),
                  ),
                  Text(
                    p.descriptionHi,
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  // Session list
                  ...List.generate(p.totalSessions, (i) {
                    final isCompleted = i < p.completedSessions;
                    final isNext = i == p.completedSessions;
                    final isLocked = i > p.completedSessions;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: GestureDetector(
                        onTap: isLocked ? null : () => widget.onSessionTap(i),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.sm,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: isNext
                                ? color.withValues(alpha: 0.06)
                                : AppColors.cream,
                            borderRadius: BorderRadius.circular(
                                AppSpacing.radiusButton),
                            border: isNext
                                ? Border.all(
                                    color: color.withValues(alpha: 0.3))
                                : null,
                          ),
                          child: Row(
                            children: [
                              // Status icon
                              Icon(
                                isCompleted
                                    ? Icons.check_circle
                                    : isNext
                                        ? Icons.play_circle_fill
                                        : Icons.lock,
                                color: isCompleted
                                    ? AppColors.sage
                                    : isNext
                                        ? color
                                        : AppColors.charcoalLight
                                            .withValues(alpha: 0.4),
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Session ${i + 1}: ${p.sessionLabelsEn[i]}',
                                      style: AppTypography.labelSmall.copyWith(
                                        color: isLocked
                                            ? AppColors.charcoalLight
                                                .withValues(alpha: 0.5)
                                            : AppColors.teal,
                                        fontWeight:
                                            isNext ? FontWeight.w600 : null,
                                      ),
                                    ),
                                    Text(
                                      p.sessionLabelsHi[i],
                                      style: AppTypography.caption.copyWith(
                                        color: isLocked
                                            ? AppColors.textTertiary
                                            : AppColors.charcoalLight,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (isNext)
                                Text(
                                  'Start \u2192',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: color,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
            crossFadeState: _expanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

Color _conditionColor(ProgramCondition condition) {
  switch (condition) {
    case ProgramCondition.pain:
      return AppColors.lavender;
    case ProgramCondition.anxiety:
      return AppColors.accentWarm;
    case ProgramCondition.sleep:
      return AppColors.teal;
    case ProgramCondition.breathlessness:
      return AppColors.sage;
  }
}
