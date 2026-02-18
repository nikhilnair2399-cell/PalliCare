import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'caregiver_provider.dart';

/// "How are YOU doing?" wellness check card with 4 emoji buttons.
class WellnessCheckCard extends ConsumerWidget {
  const WellnessCheckCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(caregiverProvider);
    final selected = state.todayWellness;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            'How are YOU doing, ${state.caregiverName}?',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '${state.caregiverNameHindi}, \u0906\u092A \u0915\u0948\u0938\u0940 \u0939\u0948\u0902?',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.space4),

          // Emoji row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _WellnessEmoji(
                emoji: '\uD83D\uDE0A',
                label: 'Fine',
                response: WellnessResponse.fine,
                isSelected: selected == WellnessResponse.fine,
              ),
              _WellnessEmoji(
                emoji: '\uD83D\uDE10',
                label: 'Tired',
                response: WellnessResponse.tired,
                isSelected: selected == WellnessResponse.tired,
              ),
              _WellnessEmoji(
                emoji: '\uD83D\uDE14',
                label: 'Stressed',
                response: WellnessResponse.stressed,
                isSelected: selected == WellnessResponse.stressed,
              ),
              _WellnessEmoji(
                emoji: '\uD83D\uDE30',
                label: 'Need Help',
                response: WellnessResponse.needHelp,
                isSelected: selected == WellnessResponse.needHelp,
              ),
            ],
          ),

          // Skip button
          if (selected == null) ...[
            const SizedBox(height: AppSpacing.space3),
            Center(
              child: TextButton(
                onPressed: () {
                  ref.read(caregiverProvider.notifier).skipWellnessCheck();
                },
                child: const Text(
                  'Skip',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          ],

          // Follow-up response
          if (state.showWellnessFollowUp && selected != null) ...[
            const SizedBox(height: AppSpacing.space4),
            _WellnessFollowUp(response: selected),
          ],
        ],
      ),
    );
  }
}

/// A single emoji wellness button.
class _WellnessEmoji extends ConsumerWidget {
  final String emoji;
  final String label;
  final WellnessResponse response;
  final bool isSelected;

  const _WellnessEmoji({
    required this.emoji,
    required this.label,
    required this.response,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () {
        ref.read(caregiverProvider.notifier).recordWellness(response);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: AppSpacing.emotionButtonSize,
        height: AppSpacing.emotionButtonSize + 20,
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withAlpha(20)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              emoji,
              style: const TextStyle(fontSize: 28),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected
                    ? AppColors.primary
                    : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Follow-up card shown after certain wellness responses.
class _WellnessFollowUp extends ConsumerWidget {
  final WellnessResponse response;

  const _WellnessFollowUp({required this.response});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    switch (response) {
      case WellnessResponse.tired:
        return _buildFollowUpCard(
          ref: ref,
          icon: Icons.self_improvement,
          iconColor: AppColors.accentWarm,
          bgColor: AppColors.accentWarm.withAlpha(15),
          borderColor: AppColors.accentWarm.withAlpha(40),
          title: 'You deserve rest too',
          titleHindi: '\u0906\u092A\u0915\u094B \u092D\u0940 \u0906\u0930\u093E\u092E \u0915\u0940 \u091C\u0930\u0942\u0930\u0924 \u0939\u0948',
          body:
              'Caring is hard work. Here is a self-care tip: take 5 minutes to step outside and breathe fresh air.',
          actionLabel: 'Self-care tip',
          actionIcon: Icons.spa,
        );
      case WellnessResponse.stressed:
        return _buildFollowUpCard(
          ref: ref,
          icon: Icons.favorite,
          iconColor: AppColors.accentCalm,
          bgColor: AppColors.accentCalm.withAlpha(25),
          borderColor: AppColors.accentCalm.withAlpha(60),
          title: 'Would you like to talk to someone?',
          titleHindi: '\u0915\u094D\u092F\u093E \u0906\u092A \u0915\u093F\u0938\u0940 \u0938\u0947 \u092C\u093E\u0924 \u0915\u0930\u0928\u093E \u091A\u093E\u0939\u0947\u0902\u0917\u0947?',
          body:
              'It is okay to feel stressed. Your wellbeing matters as much as theirs.',
          actionLabel: 'Try breathing exercise',
          actionIcon: Icons.air,
        );
      case WellnessResponse.needHelp:
        return _buildFollowUpCard(
          ref: ref,
          icon: Icons.emergency,
          iconColor: AppColors.accentAlert,
          bgColor: AppColors.accentAlert.withAlpha(12),
          borderColor: AppColors.accentAlert.withAlpha(40),
          title: 'Help is available',
          titleHindi: '\u092E\u0926\u0926 \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u0948',
          body:
              'Contact your care team or call the helplines below. You are not alone.',
          actionLabel: 'View helplines',
          actionIcon: Icons.phone,
        );
      case WellnessResponse.fine:
        return const SizedBox.shrink();
    }
  }

  Widget _buildFollowUpCard({
    required WidgetRef ref,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required Color borderColor,
    required String title,
    required String titleHindi,
    required String body,
    required String actionLabel,
    required IconData actionIcon,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.space3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: iconColor),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      titleHindi,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              // Dismiss
              GestureDetector(
                onTap: () {
                  ref
                      .read(caregiverProvider.notifier)
                      .dismissWellnessFollowUp();
                },
                child: const Icon(
                  Icons.close,
                  size: 18,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            body,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: AppSpacing.space3),
          SizedBox(
            height: 36,
            child: OutlinedButton.icon(
              onPressed: () {
                // Navigate to respective resource
              },
              icon: Icon(actionIcon, size: 16),
              label: Text(actionLabel, style: const TextStyle(fontSize: 13)),
              style: OutlinedButton.styleFrom(
                foregroundColor: iconColor,
                side: BorderSide(color: iconColor.withAlpha(100)),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
