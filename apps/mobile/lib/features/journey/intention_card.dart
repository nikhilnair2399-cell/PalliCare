import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'journey_provider.dart';

/// Today's Intention card — lavender-tinted background with quick-select
/// suggestions and yesterday's completed intention.
class IntentionCard extends ConsumerStatefulWidget {
  const IntentionCard({super.key});

  @override
  ConsumerState<IntentionCard> createState() => _IntentionCardState();
}

class _IntentionCardState extends ConsumerState<IntentionCard> {
  final _controller = TextEditingController();
  bool _showInput = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submitCustomIntention() {
    final text = _controller.text.trim();
    if (text.isNotEmpty) {
      ref.read(journeyProvider.notifier).setIntention(text);
      _controller.clear();
      setState(() => _showInput = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final journey = ref.watch(journeyProvider);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.lavenderLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              const Icon(Icons.wb_sunny_outlined,
                  color: AppColors.primaryDark, size: 22),
              const SizedBox(width: AppSpacing.space2),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Today's Intention",
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                        fontFamily: 'Georgia',
                      ),
                    ),
                    Text(
                      'आज का इरादा',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              if (journey.intentionCompleted)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
                  ),
                  child: const Text(
                    'Done',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(height: AppSpacing.space4),

          // Active intention display
          if (journey.todayIntention != null &&
              !journey.intentionCompleted) ...[
            Container(
              padding: const EdgeInsets.all(AppSpacing.space3),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.7),
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusInput),
              ),
              child: Row(
                children: [
                  const Icon(Icons.flag_outlined,
                      color: AppColors.primaryDark, size: 20),
                  const SizedBox(width: AppSpacing.space2),
                  Expanded(
                    child: Text(
                      journey.todayIntention!,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () =>
                        ref.read(journeyProvider.notifier).completeIntention(),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text(
                      'Done',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ]

          // No intention yet — show suggestions
          else if (journey.todayIntention == null) ...[
            const Text(
              'What would you like to focus on today?',
              style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
            ),
            const SizedBox(height: AppSpacing.space3),

            // Suggestion chips
            Wrap(
              spacing: AppSpacing.space2,
              runSpacing: AppSpacing.space2,
              children: [
                ...intentionSuggestions.map(
                  (s) => _SuggestionChip(
                    label: s.text,
                    icon: s.icon,
                    onTap: () => ref
                        .read(journeyProvider.notifier)
                        .selectSuggestion(s.text),
                  ),
                ),
                // "Write your own" chip
                _SuggestionChip(
                  label: 'Write your own',
                  icon: Icons.edit,
                  onTap: () => setState(() => _showInput = true),
                ),
              ],
            ),

            // Custom input field
            if (_showInput) ...[
              const SizedBox(height: AppSpacing.space3),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textCapitalization: TextCapitalization.sentences,
                      style: const TextStyle(fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'My intention for today...',
                        hintStyle: const TextStyle(
                            color: AppColors.textTertiary, fontSize: 14),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.7),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusInput),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _submitCustomIntention(),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space2),
                  IconButton(
                    onPressed: _submitCustomIntention,
                    icon: const Icon(Icons.check_circle,
                        color: AppColors.primary, size: 28),
                  ),
                ],
              ),
            ],
          ]

          // Completed state
          else ...[
            Container(
              padding: const EdgeInsets.all(AppSpacing.space3),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusInput),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle,
                      color: AppColors.primary, size: 20),
                  const SizedBox(width: AppSpacing.space2),
                  Expanded(
                    child: Text(
                      journey.todayIntention!,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                        decoration: TextDecoration.lineThrough,
                        decorationColor: AppColors.textTertiary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],

          // Yesterday's intention
          if (journey.yesterdayIntention != null) ...[
            const SizedBox(height: AppSpacing.space3),
            Row(
              children: [
                Icon(
                  journey.yesterdayCompleted
                      ? Icons.check_circle_outline
                      : Icons.radio_button_unchecked,
                  size: 16,
                  color: journey.yesterdayCompleted
                      ? AppColors.primary
                      : AppColors.textTertiary,
                ),
                const SizedBox(width: AppSpacing.space1),
                Text(
                  'Yesterday: ${journey.yesterdayIntention}',
                  style: TextStyle(
                    fontSize: 12,
                    color: journey.yesterdayCompleted
                        ? AppColors.textSecondary
                        : AppColors.textTertiary,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                if (journey.yesterdayCompleted) ...[
                  const SizedBox(width: 4),
                  const Text(
                    '(completed)',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }
}

/// A single tappable suggestion chip.
class _SuggestionChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _SuggestionChip({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.7),
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(color: AppColors.accentCalm),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: AppColors.primaryDark),
            const SizedBox(width: 6),
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
