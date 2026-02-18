import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'journey_provider.dart';

/// Individual goal card with category icon, progress bar, and action buttons.
class GoalCard extends ConsumerWidget {
  final Goal goal;
  const GoalCard({super.key, required this.goal});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final percentage = (goal.progress * 100).round();

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category icon + title
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  goal.category.icon,
                  size: 20,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      goal.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      goal.titleHi,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ),
              // Category label
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.divider,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
                ),
                child: Text(
                  goal.category.label,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.space3),

          // Progress bar
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: goal.progress,
                    minHeight: 8,
                    backgroundColor: AppColors.border,
                    valueColor:
                        const AlwaysStoppedAnimation<Color>(AppColors.primary),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Text(
                '$percentage%',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),

          const SizedBox(height: 4),

          // Progress detail
          Text(
            '${goal.completedDays} of ${goal.targetDays} days completed',
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textTertiary,
            ),
          ),

          const SizedBox(height: AppSpacing.space3),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: AppSpacing.textButtonHeight,
                  child: ElevatedButton.icon(
                    onPressed: () =>
                        ref.read(journeyProvider.notifier).markGoalToday(goal.id),
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Did it today'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      textStyle: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                      padding: EdgeInsets.zero,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space2),
              SizedBox(
                height: AppSpacing.textButtonHeight,
                child: OutlinedButton(
                  onPressed: () => _showAdjustSheet(context, ref),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.textSecondary,
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: const Text(
                    'Adjust',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showAdjustSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusHero)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(AppSpacing.space6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.space5),
            Text(
              'Adjust: ${goal.title}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.primaryDark,
                fontFamily: 'Georgia',
              ),
            ),
            const SizedBox(height: AppSpacing.space5),
            _AdjustOption(
              label: 'Extend by 7 days',
              icon: Icons.add_circle_outline,
              onTap: () {
                ref.read(journeyProvider.notifier).adjustGoal(
                      goal.id,
                      targetDays: goal.targetDays + 7,
                    );
                Navigator.pop(context);
              },
            ),
            _AdjustOption(
              label: 'Reduce by 7 days',
              icon: Icons.remove_circle_outline,
              onTap: () {
                if (goal.targetDays > 7) {
                  ref.read(journeyProvider.notifier).adjustGoal(
                        goal.id,
                        targetDays: goal.targetDays - 7,
                      );
                }
                Navigator.pop(context);
              },
            ),
            _AdjustOption(
              label: 'Remove this goal',
              icon: Icons.delete_outline,
              color: AppColors.accentAlert,
              onTap: () {
                ref.read(journeyProvider.notifier).removeGoal(goal.id);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: AppSpacing.space4),
          ],
        ),
      ),
    );
  }
}

/// A single option row in the adjust bottom sheet.
class _AdjustOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color? color;
  final VoidCallback onTap;

  const _AdjustOption({
    required this.label,
    required this.icon,
    this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.textPrimary;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
          children: [
            Icon(icon, size: 22, color: c),
            const SizedBox(width: AppSpacing.space3),
            Text(
              label,
              style: TextStyle(
                  fontSize: 15, fontWeight: FontWeight.w500, color: c),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// ADD GOAL BOTTOM SHEET
// ---------------------------------------------------------------------------

/// "Add new goal" button that opens the add-goal bottom sheet.
class AddGoalButton extends ConsumerWidget {
  const AddGoalButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final journey = ref.watch(journeyProvider);
    final canAdd = journey.activeGoals.length < 3;

    return GestureDetector(
      onTap: canAdd ? () => _showAddGoalSheet(context, ref) : null,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: canAdd ? AppColors.primary : AppColors.border,
            style: BorderStyle.solid,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.add_circle_outline,
              size: 20,
              color: canAdd ? AppColors.primary : AppColors.textTertiary,
            ),
            const SizedBox(width: AppSpacing.space2),
            Text(
              canAdd ? 'Add new goal' : 'Maximum 3 goals reached',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: canAdd ? AppColors.primary : AppColors.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddGoalSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusHero)),
      ),
      builder: (_) => const _AddGoalSheet(),
    );
  }
}

/// Bottom sheet for adding a new goal.
class _AddGoalSheet extends ConsumerStatefulWidget {
  const _AddGoalSheet();

  @override
  ConsumerState<_AddGoalSheet> createState() => _AddGoalSheetState();
}

class _AddGoalSheetState extends ConsumerState<_AddGoalSheet> {
  final _titleCtrl = TextEditingController();
  final _titleHiCtrl = TextEditingController();
  GoalCategory _category = GoalCategory.physical;
  GoalFrequency _frequency = GoalFrequency.daily;
  int _targetDays = 30;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _titleHiCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    final title = _titleCtrl.text.trim();
    if (title.isEmpty) return;

    final goal = Goal(
      id: 'g_${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      titleHi: _titleHiCtrl.text.trim().isNotEmpty
          ? _titleHiCtrl.text.trim()
          : title,
      category: _category,
      frequency: _frequency,
      targetDays: _targetDays,
    );

    ref.read(journeyProvider.notifier).addGoal(goal);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.space6,
        AppSpacing.space6,
        AppSpacing.space6,
        MediaQuery.of(context).viewInsets.bottom + AppSpacing.space6,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space5),
          const Text(
            'Add New Goal',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const Text(
            'नया लक्ष्य जोड़ें',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),

          const SizedBox(height: AppSpacing.space5),

          // Title input
          TextField(
            controller: _titleCtrl,
            textCapitalization: TextCapitalization.sentences,
            decoration: InputDecoration(
              labelText: 'Goal title',
              hintText: 'e.g., Walk 10 minutes daily',
              hintStyle:
                  const TextStyle(color: AppColors.textTertiary, fontSize: 14),
              filled: true,
              fillColor: AppColors.divider,
              border: OutlineInputBorder(
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusInput),
                borderSide: BorderSide.none,
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.space3),

          // Hindi title input (optional)
          TextField(
            controller: _titleHiCtrl,
            decoration: InputDecoration(
              labelText: 'Hindi title (optional)',
              hintText: 'हिंदी में लक्ष्य',
              hintStyle:
                  const TextStyle(color: AppColors.textTertiary, fontSize: 14),
              filled: true,
              fillColor: AppColors.divider,
              border: OutlineInputBorder(
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusInput),
                borderSide: BorderSide.none,
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.space4),

          // Category selector
          const Text(
            'Category',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          Wrap(
            spacing: AppSpacing.space2,
            runSpacing: AppSpacing.space2,
            children: GoalCategory.values.map((cat) {
              final selected = cat == _category;
              return ChoiceChip(
                label: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(cat.icon,
                        size: 16,
                        color: selected ? Colors.white : AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Text(cat.label),
                  ],
                ),
                selected: selected,
                selectedColor: AppColors.primary,
                backgroundColor: Colors.white,
                labelStyle: TextStyle(
                  fontSize: 13,
                  color: selected ? Colors.white : AppColors.textPrimary,
                ),
                side: BorderSide(
                  color: selected ? AppColors.primary : AppColors.border,
                ),
                onSelected: (_) => setState(() => _category = cat),
              );
            }).toList(),
          ),

          const SizedBox(height: AppSpacing.space4),

          // Duration selector
          Row(
            children: [
              const Text(
                'Duration: ',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(width: AppSpacing.space2),
              _DurationChip(
                  label: '14 days',
                  selected: _targetDays == 14,
                  onTap: () => setState(() => _targetDays = 14)),
              const SizedBox(width: AppSpacing.space2),
              _DurationChip(
                  label: '30 days',
                  selected: _targetDays == 30,
                  onTap: () => setState(() => _targetDays = 30)),
              const SizedBox(width: AppSpacing.space2),
              _DurationChip(
                  label: '60 days',
                  selected: _targetDays == 60,
                  onTap: () => setState(() => _targetDays = 60)),
            ],
          ),

          const SizedBox(height: AppSpacing.space6),

          // Submit button
          SizedBox(
            height: AppSpacing.buttonHeight,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
              child: const Text(
                'Add Goal',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.space2),
        ],
      ),
    );
  }
}

class _DurationChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _DurationChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(
              color: selected ? AppColors.primary : AppColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: selected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
