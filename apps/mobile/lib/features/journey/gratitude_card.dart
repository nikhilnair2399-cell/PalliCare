import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'journey_provider.dart';

/// Gratitude journal card — input field, recent entries, and total count.
class GratitudeCard extends ConsumerStatefulWidget {
  const GratitudeCard({super.key});

  @override
  ConsumerState<GratitudeCard> createState() => _GratitudeCardState();
}

class _GratitudeCardState extends ConsumerState<GratitudeCard> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _submit() {
    final text = _controller.text.trim();
    if (text.isNotEmpty) {
      ref.read(journeyProvider.notifier).addGratitude(text);
      _controller.clear();
      _focusNode.unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final journey = ref.watch(journeyProvider);
    final recent = journey.recentGratitude;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with count badge
          Row(
            children: [
              const Icon(Icons.favorite_outline,
                  color: AppColors.accentWarm, size: 22),
              const SizedBox(width: AppSpacing.space2),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Gratitude Journal',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryDark,
                        fontFamily: 'Georgia',
                      ),
                    ),
                    Text(
                      'कृतज्ञता पत्रिका',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentWarm.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
                ),
                child: Text(
                  '${journey.gratitudeCount} entries',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.accentWarm,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.space4),

          // Input
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  focusNode: _focusNode,
                  textCapitalization: TextCapitalization.sentences,
                  maxLines: 2,
                  minLines: 1,
                  style: const TextStyle(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'What are you grateful for today?',
                    hintStyle: const TextStyle(
                        color: AppColors.textTertiary, fontSize: 14),
                    filled: true,
                    fillColor: AppColors.divider,
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusInput),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onSubmitted: (_) => _submit(),
                ),
              ),
              const SizedBox(width: AppSpacing.space2),
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: IconButton(
                  onPressed: _submit,
                  icon: const Icon(Icons.send_rounded,
                      color: AppColors.primary, size: 24),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    minimumSize: const Size(
                        AppSpacing.minTouchTarget, AppSpacing.minTouchTarget),
                  ),
                ),
              ),
            ],
          ),

          // Recent entries
          if (recent.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space4),
            const Text(
              'Recent',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.space2),
            ...recent.map((entry) => _GratitudeEntryRow(entry: entry)),
          ],
        ],
      ),
    );
  }
}

/// A single recent gratitude entry row.
class _GratitudeEntryRow extends StatelessWidget {
  final GratitudeEntry entry;
  const _GratitudeEntryRow({required this.entry});

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inDays == 0) return 'Today';
    if (diff.inDays == 1) return 'Yesterday';
    return '${diff.inDays} days ago';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.space2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: AppColors.accentWarm,
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.space2),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.text,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _formatDate(entry.date),
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
