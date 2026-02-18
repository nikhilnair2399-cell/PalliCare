import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'symptom_log_provider.dart';

/// Free-text notes card — final step before submission.
class NotesCard extends ConsumerStatefulWidget {
  const NotesCard({super.key});

  @override
  ConsumerState<NotesCard> createState() => _NotesCardState();
}

class _NotesCardState extends ConsumerState<NotesCard> {
  late TextEditingController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = TextEditingController(
      text: ref.read(symptomLogProvider).notes ?? '',
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Anything else to share?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
              fontFamily: 'Georgia',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'कुछ और बताना चाहेंगे?',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 24),

          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: TextField(
              controller: _ctrl,
              maxLines: 6,
              maxLength: 500,
              onChanged: (val) =>
                  ref.read(symptomLogProvider.notifier).setNotes(val),
              style: const TextStyle(
                fontSize: 16,
                height: 1.5,
                color: AppColors.textPrimary,
              ),
              decoration: InputDecoration(
                hintText: 'e.g. Pain woke me at 3 AM, took extra dose...',
                hintStyle: TextStyle(
                  fontSize: 15,
                  color: Colors.grey.shade400,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.all(16),
                counterStyle:
                    TextStyle(fontSize: 12, color: Colors.grey.shade400),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Quick-add prompts
          Text(
            'Quick prompts:',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _promptChip('Pain woke me up'),
              _promptChip('Took extra medicine'),
              _promptChip('Feeling better today'),
              _promptChip('Side effects noticed'),
              _promptChip('Need to talk to doctor'),
            ],
          ),

          const SizedBox(height: 24),

          // Summary
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withAlpha(15),
              borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            ),
            child: Row(
              children: [
                const Icon(Icons.check_circle_outline,
                    color: AppColors.primary, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Tap Done to save your check-in',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryDark,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _promptChip(String text) {
    return GestureDetector(
      onTap: () {
        final current = _ctrl.text;
        final separator = current.isEmpty ? '' : '. ';
        _ctrl.text = '$current$separator$text';
        _ctrl.selection =
            TextSelection.collapsed(offset: _ctrl.text.length);
        ref.read(symptomLogProvider.notifier).setNotes(_ctrl.text);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Text(
          '+ $text',
          style: TextStyle(
            fontSize: 13,
            color: AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
