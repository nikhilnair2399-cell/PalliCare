import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Priority level for caregiver tasks.
enum TaskPriority { high, medium, low }

/// A caregiver coordination task.
class CareTask {
  final String id;
  final String title;
  final String titleHi;
  final String assignee;
  final DateTime? dueDate;
  final TaskPriority priority;
  final bool isCompleted;

  const CareTask({
    required this.id,
    required this.title,
    required this.titleHi,
    required this.assignee,
    this.dueDate,
    this.priority = TaskPriority.medium,
    this.isCompleted = false,
  });

  CareTask copyWith({bool? isCompleted}) {
    return CareTask(
      id: id,
      title: title,
      titleHi: titleHi,
      assignee: assignee,
      dueDate: dueDate,
      priority: priority,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

/// Task assignment card widget for the care coordination screen.
class TaskAssignmentCard extends StatelessWidget {
  final CareTask task;
  final VoidCallback? onToggle;

  const TaskAssignmentCard({
    super.key,
    required this.task,
    this.onToggle,
  });

  Color _priorityColor(TaskPriority priority) {
    return switch (priority) {
      TaskPriority.high => AppColors.accentAlert,
      TaskPriority.medium => AppColors.accentHighlight,
      TaskPriority.low => AppColors.sage,
    };
  }

  String _priorityLabel(TaskPriority priority) {
    return switch (priority) {
      TaskPriority.high => 'High',
      TaskPriority.medium => 'Med',
      TaskPriority.low => 'Low',
    };
  }

  String _formatDueDate(DateTime? date) {
    if (date == null) return '';
    final diff = date.difference(DateTime.now());
    if (diff.isNegative) return 'Overdue';
    if (diff.inHours < 24) return 'Today';
    if (diff.inDays == 1) return 'Tomorrow';
    return 'In ${diff.inDays}d';
  }

  @override
  Widget build(BuildContext context) {
    final pColor = _priorityColor(task.priority);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: task.isCompleted
            ? AppColors.sage.withValues(alpha: 0.04)
            : AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: task.isCompleted
              ? AppColors.sage.withValues(alpha: 0.2)
              : AppColors.border,
        ),
      ),
      child: Row(
        children: [
          // Checkbox
          GestureDetector(
            onTap: onToggle,
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: task.isCompleted
                    ? AppColors.sage.withValues(alpha: 0.15)
                    : Colors.transparent,
                border: Border.all(
                  color: task.isCompleted ? AppColors.sage : AppColors.border,
                  width: 2,
                ),
              ),
              child: task.isCompleted
                  ? const Icon(Icons.check, color: AppColors.sage, size: 16)
                  : null,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task.title,
                  style: AppTypography.label.copyWith(
                    color: task.isCompleted
                        ? AppColors.charcoalLight
                        : AppColors.teal,
                    decoration: task.isCompleted
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
                Text(
                  task.titleHi,
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    // Assignee
                    Icon(Icons.person_outline,
                        size: 14, color: AppColors.charcoalLight),
                    const SizedBox(width: 3),
                    Text(
                      task.assignee,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    if (task.dueDate != null) ...[
                      const SizedBox(width: AppSpacing.sm),
                      Icon(Icons.schedule,
                          size: 14, color: AppColors.charcoalLight),
                      const SizedBox(width: 3),
                      Text(
                        _formatDueDate(task.dueDate),
                        style: AppTypography.caption.copyWith(
                          color: _formatDueDate(task.dueDate) == 'Overdue'
                              ? AppColors.accentAlert
                              : AppColors.charcoalLight,
                          fontWeight:
                              _formatDueDate(task.dueDate) == 'Overdue'
                                  ? FontWeight.w600
                                  : null,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // Priority badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: pColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
            ),
            child: Text(
              _priorityLabel(task.priority),
              style: AppTypography.caption.copyWith(
                color: pColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
