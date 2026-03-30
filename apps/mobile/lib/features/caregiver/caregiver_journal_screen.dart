import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'caregiver_provider.dart';

/// Caregiver personal journal / diary screen.
///
/// Allows caregivers to write private reflections tagged with mood.
/// Entries are stored locally and never shared.
class CaregiverJournalScreen extends ConsumerStatefulWidget {
  const CaregiverJournalScreen({super.key});

  @override
  ConsumerState<CaregiverJournalScreen> createState() =>
      _CaregiverJournalScreenState();
}

class _CaregiverJournalScreenState
    extends ConsumerState<CaregiverJournalScreen> {
  final _controller = TextEditingController();
  JournalMood _selectedMood = JournalMood.grateful;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _save() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    ref.read(caregiverProvider.notifier).addJournalEntry(text, _selectedMood);
    _controller.clear();
    setState(() => _selectedMood = JournalMood.grateful);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Journal entry saved'),
        backgroundColor: AppColors.sage,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(caregiverProvider);

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
              'My Journal',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u092E\u0947\u0930\u0940 \u0921\u093E\u092F\u0930\u0940',
              style: AppTypography.caption.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Compose section
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            color: AppColors.surfaceCard,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'How are you feeling right now?',
                  style: AppTypography.label.copyWith(color: AppColors.teal),
                ),
                Text(
                  '\u0906\u092A \u0905\u092D\u0940 \u0915\u0948\u0938\u093E \u092E\u0939\u0938\u0942\u0938 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Mood tags
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: JournalMood.values.map((m) {
                    final selected = m == _selectedMood;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedMood = m),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: selected
                              ? _moodColor(m).withValues(alpha: 0.15)
                              : AppColors.surface,
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusBadge),
                          border: Border.all(
                            color: selected
                                ? _moodColor(m)
                                : AppColors.border,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(_moodEmoji(m), style: const TextStyle(fontSize: 14)),
                            const SizedBox(width: 4),
                            Text(
                              _moodLabel(m),
                              style: AppTypography.labelSmall.copyWith(
                                color: selected ? _moodColor(m) : AppColors.charcoalLight,
                                fontWeight:
                                    selected ? FontWeight.w600 : FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Text field
                TextField(
                  controller: _controller,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Write your thoughts...',
                    hintStyle: AppTypography.bodyDefault.copyWith(
                      color: AppColors.textTertiary,
                    ),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                      borderSide: const BorderSide(color: AppColors.accentWarm),
                    ),
                    contentPadding: const EdgeInsets.all(12),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Save button
                SizedBox(
                  width: double.infinity,
                  height: AppSpacing.buttonHeight,
                  child: ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentWarm,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                    ),
                    child: const Text(
                      'Save Entry',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.border),

          // Entries list
          Expanded(
            child: state.journalEntries.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('\ud83d\udcd3',
                            style: TextStyle(fontSize: 40)),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'Your journal is empty',
                          style: AppTypography.label.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                        Text(
                          '\u0906\u092A\u0915\u0940 \u0921\u093E\u092F\u0930\u0940 \u0916\u093E\u0932\u0940 \u0939\u0948',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textTertiary,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: state.journalEntries.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(height: AppSpacing.sm),
                    itemBuilder: (_, index) {
                      final entry = state.journalEntries[index];
                      return _JournalEntryCard(
                        entry: entry,
                        onDelete: () => ref
                            .read(caregiverProvider.notifier)
                            .deleteJournalEntry(entry.id),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  String _moodEmoji(JournalMood mood) => switch (mood) {
        JournalMood.relieved => '\ud83d\ude0c',
        JournalMood.stressed => '\ud83d\ude23',
        JournalMood.grateful => '\ud83d\ude4f',
        JournalMood.overwhelmed => '\ud83d\ude30',
        JournalMood.hopeful => '\u2728',
      };

  String _moodLabel(JournalMood mood) => switch (mood) {
        JournalMood.relieved => 'Relieved',
        JournalMood.stressed => 'Stressed',
        JournalMood.grateful => 'Grateful',
        JournalMood.overwhelmed => 'Overwhelmed',
        JournalMood.hopeful => 'Hopeful',
      };

  Color _moodColor(JournalMood mood) => switch (mood) {
        JournalMood.relieved => AppColors.sage,
        JournalMood.stressed => AppColors.accentAlert,
        JournalMood.grateful => AppColors.accentHighlight,
        JournalMood.overwhelmed => AppColors.accentWarm,
        JournalMood.hopeful => AppColors.lavender,
      };
}

// ---------------------------------------------------------------------------
// JOURNAL ENTRY CARD
// ---------------------------------------------------------------------------

class _JournalEntryCard extends StatelessWidget {
  final JournalEntry entry;
  final VoidCallback onDelete;

  const _JournalEntryCard({required this.entry, required this.onDelete});

  String _formatDate(DateTime dt) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final period = dt.hour >= 12 ? 'PM' : 'AM';
    return '${months[dt.month - 1]} ${dt.day} \u00B7 $hour:${dt.minute.toString().padLeft(2, '0')} $period';
  }

  String _moodEmoji(JournalMood mood) => switch (mood) {
        JournalMood.relieved => '\ud83d\ude0c',
        JournalMood.stressed => '\ud83d\ude23',
        JournalMood.grateful => '\ud83d\ude4f',
        JournalMood.overwhelmed => '\ud83d\ude30',
        JournalMood.hopeful => '\u2728',
      };

  String _moodLabel(JournalMood mood) => switch (mood) {
        JournalMood.relieved => 'Relieved',
        JournalMood.stressed => 'Stressed',
        JournalMood.grateful => 'Grateful',
        JournalMood.overwhelmed => 'Overwhelmed',
        JournalMood.hopeful => 'Hopeful',
      };

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(_moodEmoji(entry.mood),
                  style: const TextStyle(fontSize: 16)),
              const SizedBox(width: 6),
              Text(
                _moodLabel(entry.mood),
                style: AppTypography.labelSmall.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              Text(
                _formatDate(entry.dateTime),
                style: AppTypography.caption.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(width: 4),
              GestureDetector(
                onTap: onDelete,
                child: const Icon(Icons.close, size: 16, color: AppColors.textTertiary),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            entry.text,
            style: AppTypography.bodyDefault.copyWith(
              color: AppColors.textPrimary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
