import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'caregiver_provider.dart';
import 'task_assignment_card.dart';

/// Care Coordination Screen — Task assignment between caregivers.
///
/// Allows creating, assigning, and tracking tasks between
/// multiple caregivers (e.g. siblings sharing care duties).
class CareCoordinationScreen extends ConsumerStatefulWidget {
  const CareCoordinationScreen({super.key});

  @override
  ConsumerState<CareCoordinationScreen> createState() =>
      _CareCoordinationScreenState();
}

class _CareCoordinationScreenState
    extends ConsumerState<CareCoordinationScreen> {
  final _titleController = TextEditingController();
  final _titleHiController = TextEditingController();
  final _assigneeController = TextEditingController();
  TaskPriority _priority = TaskPriority.medium;

  @override
  void dispose() {
    _titleController.dispose();
    _titleHiController.dispose();
    _assigneeController.dispose();
    super.dispose();
  }

  void _addTask() {
    final title = _titleController.text.trim();
    final assignee = _assigneeController.text.trim();
    if (title.isEmpty || assignee.isEmpty) return;

    final task = CareTask(
      id: 'ct_${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      titleHi: _titleHiController.text.trim().isEmpty
          ? title
          : _titleHiController.text.trim(),
      assignee: assignee,
      dueDate: DateTime.now().add(const Duration(days: 1)),
      priority: _priority,
    );

    ref.read(caregiverProvider.notifier).addTask(task);
    _titleController.clear();
    _titleHiController.clear();
    _assigneeController.clear();
    setState(() => _priority = TaskPriority.medium);
    Navigator.pop(context);
  }

  void _showAddTaskSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surfaceCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusHero),
        ),
      ),
      builder: (_) => Padding(
        padding: EdgeInsets.only(
          left: AppSpacing.md,
          right: AppSpacing.md,
          top: AppSpacing.md,
          bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.md,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'New Task',
              style: AppTypography.heading3.copyWith(color: AppColors.teal),
            ),
            Text(
              '\u0928\u092F\u093E \u0915\u093E\u0930\u094D\u092F',
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            _buildField(_titleController, 'Task title (English)'),
            const SizedBox(height: AppSpacing.sm),
            _buildField(
                _titleHiController, 'Task title (Hindi) \u2014 optional'),
            const SizedBox(height: AppSpacing.sm),
            _buildField(_assigneeController, 'Assign to'),
            const SizedBox(height: AppSpacing.sm),

            // Priority selector
            Text(
              'Priority',
              style: AppTypography.label.copyWith(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            Row(
              children: TaskPriority.values.map((p) {
                final selected = p == _priority;
                final color = _priorityColor(p);
                return Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(
                      right: p == TaskPriority.low ? 0 : 8,
                    ),
                    child: GestureDetector(
                      onTap: () => setState(() => _priority = p),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: selected
                              ? color.withValues(alpha: 0.15)
                              : AppColors.surface,
                          borderRadius: BorderRadius.circular(
                              AppSpacing.radiusBadge),
                          border: Border.all(
                            color: selected ? color : AppColors.border,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          _priorityLabel(p),
                          style: AppTypography.label.copyWith(
                            color: selected ? color : AppColors.charcoalLight,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.md),

            SizedBox(
              width: double.infinity,
              height: AppSpacing.buttonHeight,
              child: ElevatedButton(
                onPressed: _addTask,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentWarm,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusButton),
                  ),
                ),
                child: const Text(
                  'Add Task',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(TextEditingController c, String hint) {
    return TextField(
      controller: c,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle:
            AppTypography.bodyDefault.copyWith(color: AppColors.textTertiary),
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.accentWarm),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      ),
    );
  }

  Color _priorityColor(TaskPriority p) => switch (p) {
        TaskPriority.high => AppColors.accentAlert,
        TaskPriority.medium => AppColors.accentHighlight,
        TaskPriority.low => AppColors.sage,
      };

  String _priorityLabel(TaskPriority p) => switch (p) {
        TaskPriority.high => 'High',
        TaskPriority.medium => 'Medium',
        TaskPriority.low => 'Low',
      };

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(caregiverProvider);
    final pending = state.tasks.where((t) => !t.isCompleted).toList();
    final completed = state.tasks.where((t) => t.isCompleted).toList();

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.accentWarmDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Care Coordination',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0926\u0947\u0916\u092D\u093E\u0932 \u0938\u092E\u0928\u094D\u0935\u092F',
              style: AppTypography.caption.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddTaskSheet,
        backgroundColor: AppColors.accentWarm,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: state.tasks.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('\ud83d\udccb',
                      style: TextStyle(fontSize: 40)),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'No tasks assigned yet',
                    style: AppTypography.label.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  Text(
                    '\u0905\u092D\u0940 \u0915\u094B\u0908 \u0915\u093E\u0930\u094D\u092F \u0928\u0939\u0940\u0902',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ElevatedButton.icon(
                    onPressed: _showAddTaskSheet,
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Add First Task'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentWarm,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Pending
                  if (pending.isNotEmpty) ...[
                    Text(
                      'Pending (${pending.length})',
                      style: AppTypography.heading4.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                    Text(
                      '\u092C\u093E\u0915\u0940',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ...pending.map((t) => Padding(
                          padding:
                              const EdgeInsets.only(bottom: AppSpacing.sm),
                          child: Dismissible(
                            key: Key(t.id),
                            direction: DismissDirection.endToStart,
                            background: Container(
                              alignment: Alignment.centerRight,
                              padding:
                                  const EdgeInsets.only(right: AppSpacing.md),
                              decoration: BoxDecoration(
                                color: AppColors.accentAlert.withValues(
                                    alpha: 0.1),
                                borderRadius: BorderRadius.circular(
                                    AppSpacing.radiusCard),
                              ),
                              child: const Icon(Icons.delete,
                                  color: AppColors.accentAlert),
                            ),
                            onDismissed: (_) => ref
                                .read(caregiverProvider.notifier)
                                .deleteTask(t.id),
                            child: TaskAssignmentCard(
                              task: t,
                              onToggle: () => ref
                                  .read(caregiverProvider.notifier)
                                  .toggleTask(t.id),
                            ),
                          ),
                        )),
                  ],

                  // Completed
                  if (completed.isNotEmpty) ...[
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      'Completed (${completed.length})',
                      style: AppTypography.heading4.copyWith(
                        color: AppColors.sage,
                      ),
                    ),
                    Text(
                      '\u092A\u0942\u0930\u094D\u0923',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ...completed.map((t) => Padding(
                          padding:
                              const EdgeInsets.only(bottom: AppSpacing.sm),
                          child: TaskAssignmentCard(
                            task: t,
                            onToggle: () => ref
                                .read(caregiverProvider.notifier)
                                .toggleTask(t.id),
                          ),
                        )),
                  ],
                ],
              ),
            ),
    );
  }
}
