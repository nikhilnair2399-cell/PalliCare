import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/section_header.dart';
import 'journey_provider.dart';
import 'intention_card.dart';
import 'gratitude_card.dart';
import 'goal_card.dart';
import 'milestone_timeline.dart';

/// My Journey screen — goals, gratitude, milestones, and legacy.
/// Spec: 08_Screen_My_Journey.md
class JourneyScreen extends ConsumerWidget {
  const JourneyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final journey = ref.watch(journeyProvider);
    final l = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primaryDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          l.journeyTitle,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: 'Georgia',
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.screenPaddingHorizontal,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: AppSpacing.space2),

            // ---------------------------------------------------------------
            // 1. TODAY'S INTENTION
            // ---------------------------------------------------------------
            const IntentionCard(),

            // ---------------------------------------------------------------
            // 2. GRATITUDE JOURNAL
            // ---------------------------------------------------------------
            SectionHeader(
              title: l.journeyGratitudeJournal,
            ),
            const GratitudeCard(),

            // ---------------------------------------------------------------
            // 3. MY GOALS
            // ---------------------------------------------------------------
            SectionHeader(
              title: l.journeyMyGoals,
            ),
            ...journey.activeGoals.map(
              (goal) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.space3),
                child: GoalCard(goal: goal),
              ),
            ),
            const AddGoalButton(),

            // ---------------------------------------------------------------
            // 4. MILESTONES TIMELINE
            // ---------------------------------------------------------------
            SectionHeader(
              title: l.journeyMilestones,
            ),
            MilestoneTimeline(milestones: journey.milestones),

            // ---------------------------------------------------------------
            // 5. LEGACY & MEANING (opt-in, gated)
            // ---------------------------------------------------------------
            const SizedBox(height: AppSpacing.space5),
            if (!journey.legacyDismissed) _LegacySection(journey: journey),

            const SizedBox(height: AppSpacing.space8),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// LEGACY & MEANING SECTION
// ---------------------------------------------------------------------------

/// Gated Legacy & Meaning section — shows consent prompt first, then content.
class _LegacySection extends ConsumerWidget {
  final JourneyState journey;
  const _LegacySection({required this.journey});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);

    // Consent gate
    if (!journey.legacyEnabled) {
      return _LegacyGate(
        onEnable: () => ref.read(journeyProvider.notifier).enableLegacy(),
        onDismiss: () => ref.read(journeyProvider.notifier).dismissLegacy(),
      );
    }

    // Content once enabled
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          title: l.journeyLegacy,
        ),
        Container(
          padding: const EdgeInsets.all(AppSpacing.cardPadding),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _LegacySubSection(
                icon: Icons.favorite,
                title: l.journeyMyValues,
                description: l.journeyMyValuesDesc,
              ),
              const Divider(height: 24, color: AppColors.divider),
              _LegacySubSection(
                icon: Icons.mail_outline,
                title: l.journeyMessages,
                description: l.journeyMessagesDesc,
              ),
              const Divider(height: 24, color: AppColors.divider),
              _LegacySubSection(
                icon: Icons.auto_stories,
                title: l.journeyLifeStory,
                description: l.journeyLifeStoryDesc,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Sensitive content consent gate for Legacy & Meaning.
class _LegacyGate extends StatelessWidget {
  final VoidCallback onEnable;
  final VoidCallback onDismiss;

  const _LegacyGate({required this.onEnable, required this.onDismiss});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.accentCalm),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.accentCalm.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.auto_stories,
                    color: AppColors.primaryDark, size: 20),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Text(
                  l.journeyLegacy,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryDark,
                    fontFamily: 'Georgia',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),
          Container(
            padding: const EdgeInsets.all(AppSpacing.space3),
            decoration: BoxDecoration(
              color: AppColors.accentCalm.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(AppSpacing.radiusInput),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline,
                    size: 18, color: AppColors.primaryDark),
                const SizedBox(width: AppSpacing.space2),
                Expanded(
                  child: Text(
                    l.journeyLegacyDesc,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.space4),
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: AppSpacing.textButtonHeight,
                  child: ElevatedButton(
                    onPressed: onEnable,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryDark,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                    ),
                    child: Text(
                      l.journeyImReady,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: SizedBox(
                  height: AppSpacing.textButtonHeight,
                  child: OutlinedButton(
                    onPressed: onDismiss,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textSecondary,
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                    ),
                    child: Text(
                      l.journeyNotRightNow,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// A single sub-section row inside the Legacy content area.
class _LegacySubSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _LegacySubSection({
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 22, color: AppColors.primaryDark),
        const SizedBox(width: AppSpacing.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: AppSpacing.space2),
              GestureDetector(
                onTap: () {
                  // TODO: Navigate to specific legacy sub-section
                },
                child: Text(
                  l.journeyStartWriting,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
