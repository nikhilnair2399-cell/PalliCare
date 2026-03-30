import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_typography.dart';
import '../../core/routing/app_router.dart';
import 'learn_provider.dart';
import 'learn_module_card.dart';
import 'learn_path_card.dart';
import 'learn_module_screen.dart';

/// Learn Home Screen — psychoeducation micro-learning hub.
///
/// Sections:
///  [A] Continue Where You Left Off  (hero gradient card)
///  [B] Recommended For You          (horizontal scroll, 3 compact cards)
///  [C] Learning Paths               (3 expandable phase cards)
///  [D] Browse All Topics            (outlined button + bottom sheet)
///
/// Spec: Sprint 2, Screen 06.
class LearnScreen extends ConsumerWidget {
  const LearnScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final learnState = ref.watch(learnProvider);

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          l.learnTitle,
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // [NEW] Disease Library Hero Card
              _DiseaseLibraryHeroCard(
                onTap: () => context.push(AppRoutes.learnLibrary),
                onSearchTap: () => context.push(AppRoutes.learnSearch),
              ),
              const SizedBox(height: AppSpacing.md),

              // [NEW] Quick links row (FAQ + Library)
              Row(
                children: [
                  Expanded(
                    child: _QuickLinkChip(
                      icon: Icons.question_answer_outlined,
                      label: l.learnFaqCorner,
                      onTap: () => context.push(AppRoutes.learnFaq),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: _QuickLinkChip(
                      icon: Icons.search,
                      label: l.learnSearchTopics,
                      onTap: () => context.push(AppRoutes.learnSearch),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // [A] Continue Where You Left Off
              if (learnState.continueModule != null)
                ContinueModuleCard(
                  module: learnState.continueModule!,
                  onTap: () =>
                      _openModule(context, ref, learnState.continueModule!),
                ),

              if (learnState.continueModule != null)
                const SizedBox(height: AppSpacing.lg),

              // [B] Recommended For You
              if (learnState.recommendedModules.isNotEmpty) ...[
                Text(
                  l.learnRecommended,
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                SizedBox(
                  height: 130,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: learnState.recommendedModules.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (context, index) {
                      final module = learnState.recommendedModules[index];
                      return LearnModuleCard(
                        module: module,
                        isCompact: true,
                        onTap: () => _openModule(context, ref, module),
                      );
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // [C] Learning Paths
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    l.learnPaths,
                    style: AppTypography.heading3.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  Text(
                    l.learnPathsDone(learnState.completedCount, learnState.totalCount),
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.sm),

              // Phase 1
              LearnPathCard(
                phaseLabel: 'Phase 1',
                titleEn: l.learnPhase1Title,
                modules: learnState.phase1Modules,
                accentColor: AppColors.sage,
                isUnlocked: learnState.isPhase1Unlocked,
                daysUntilUnlock: 0,
                onModuleTap: (module) => _handleModuleTap(context, ref, module),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Phase 2
              LearnPathCard(
                phaseLabel: 'Phase 2',
                titleEn: l.learnPhase2Title,
                modules: learnState.phase2Modules,
                accentColor: AppColors.teal,
                isUnlocked: learnState.isPhase2Unlocked,
                daysUntilUnlock: learnState.daysUntilPhase2,
                onModuleTap: (module) => _handleModuleTap(context, ref, module),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Phase 3
              LearnPathCard(
                phaseLabel: 'Phase 3',
                titleEn: l.learnPhase3Title,
                modules: learnState.phase3Modules,
                accentColor: AppColors.lavender,
                isSensitive: true,
                isUnlocked: learnState.isPhase3Unlocked,
                daysUntilUnlock: learnState.daysUntilPhase3,
                onModuleTap: (module) => _handleModuleTap(context, ref, module),
              ),

              const SizedBox(height: AppSpacing.lg),

              // [D] Browse All Topics
              Center(
                child: OutlinedButton.icon(
                  onPressed: () => _showBrowseAllSheet(context, ref,
                      learnState.modules
                          .where((m) => m.status != ModuleStatus.locked)
                          .toList()),
                  icon: const Icon(Icons.grid_view, size: 18),
                  label: Text(l.learnBrowseAll),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.teal,
                    side: const BorderSide(color: AppColors.teal),
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.lg,
                      vertical: AppSpacing.sm,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.lg),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // MODULE TAP HANDLER (with sensitive dialog gate)
  // ---------------------------------------------------------------------------

  void _handleModuleTap(
      BuildContext context, WidgetRef ref, LearnModule module) {
    if (module.status == ModuleStatus.locked) return;

    if (module.isSensitive) {
      _showSensitiveDialog(context, ref, module);
    } else {
      _openModule(context, ref, module);
    }
  }

  // ---------------------------------------------------------------------------
  // BROWSE ALL BOTTOM SHEET
  // ---------------------------------------------------------------------------

  void _showBrowseAllSheet(
    BuildContext context,
    WidgetRef ref,
    List<LearnModule> modules,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cream,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusHero),
        ),
      ),
      builder: (sheetContext) {
        return DraggableScrollableSheet(
          initialChildSize: 0.75,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (_, scrollController) {
            return Column(
              children: [
                // Handle bar
                const SizedBox(height: 12),
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  AppLocalizations.of(context).learnAllTopics,
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 12),
                const Divider(height: 1),
                Expanded(
                  child: ListView.builder(
                    controller: scrollController,
                    padding: const EdgeInsets.symmetric(
                        vertical: AppSpacing.sm),
                    itemCount: modules.length,
                    itemBuilder: (_, index) {
                      final module = modules[index];
                      return LearnModuleCard(
                        module: module,
                        isCompact: false,
                        onTap: () {
                          Navigator.pop(sheetContext);
                          _handleModuleTap(context, ref, module);
                        },
                      );
                    },
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// DISEASE LIBRARY HERO CARD
// ---------------------------------------------------------------------------

class _DiseaseLibraryHeroCard extends StatelessWidget {
  final VoidCallback onTap;
  final VoidCallback onSearchTap;

  const _DiseaseLibraryHeroCard({
    required this.onTap,
    required this.onSearchTap,
  });

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.teal.withValues(alpha: 0.12),
              AppColors.sage.withValues(alpha: 0.08),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
          border: Border.all(
            color: AppColors.teal.withValues(alpha: 0.2),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: AppColors.teal.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              alignment: Alignment.center,
              child: const Text('\ud83d\udcda',
                  style: TextStyle(fontSize: 28)),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l.learnLibrary,
                    style: AppTypography.heading3.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    l.learnLibraryDesc,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppColors.teal.withValues(alpha: 0.5),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// QUICK LINK CHIP
// ---------------------------------------------------------------------------

class _QuickLinkChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickLinkChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.teal, size: 18),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                label,
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.teal,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/// Opens the module detail screen, starting the module if it was available.
void _openModule(BuildContext context, WidgetRef ref, LearnModule module) {
  if (module.status == ModuleStatus.available) {
    ref.read(learnProvider.notifier).startModule(module.id);
  }
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (_) => LearnModuleScreen(moduleId: module.id),
    ),
  );
}

/// Shows a compassionate dialog before opening sensitive Phase 3 content.
void _showSensitiveDialog(
    BuildContext context, WidgetRef ref, LearnModule module) {
  final l = AppLocalizations.of(context);
  showDialog(
    context: context,
    builder: (ctx) => AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      backgroundColor: AppColors.surfaceCard,
      title: Row(
        children: [
          const Icon(Icons.favorite_border, color: AppColors.sage, size: 22),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              l.learnSensitiveTitle,
              style: AppTypography.heading3.copyWith(color: AppColors.teal),
            ),
          ),
        ],
      ),
      content: Text(
        l.learnSensitiveBody,
        style: AppTypography.bodyLarge.copyWith(
          color: AppColors.charcoalLight,
          height: 1.6,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(),
          child: Text(
            l.learnNotRightNow,
            style: AppTypography.label.copyWith(
              color: AppColors.charcoalLight,
            ),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            Navigator.of(ctx).pop();
            _openModule(context, ref, module);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.sage,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
            ),
          ),
          child: Text(l.learnImReady),
        ),
      ],
    ),
  );
}
