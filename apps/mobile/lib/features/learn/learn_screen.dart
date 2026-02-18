import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
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
          'Learn / \u0938\u0940\u0916\u0947\u0902',
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
                  'Recommended For You',
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '\u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0938\u0941\u091D\u093E\u0935',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
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
                    'Learning Paths',
                    style: AppTypography.heading3.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  Text(
                    '${learnState.completedCount} / ${learnState.totalCount} done',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                '\u0938\u0940\u0916\u0928\u0947 \u0915\u093E \u0915\u094D\u0930\u092E',
                style: AppTypography.caption.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Phase 1
              LearnPathCard(
                phaseLabel: 'Phase 1',
                titleEn: 'Understanding Your Pain',
                titleHi:
                    '\u0926\u0930\u094D\u0926 \u0915\u094B \u0938\u092E\u091D\u0928\u093E',
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
                titleEn: 'Tools for Your Journey',
                titleHi:
                    '\u0906\u092A\u0915\u0940 \u092F\u093E\u0924\u094D\u0930\u093E \u0915\u0947 \u0938\u093E\u0927\u0928',
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
                titleEn: 'Living with Purpose',
                titleHi:
                    '\u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F \u0915\u0947 \u0938\u093E\u0925 \u091C\u0940\u0928\u093E',
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
                  label: const Text('Browse All Topics'),
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
                  'All Topics',
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '\u0938\u092D\u0940 \u0935\u093F\u0937\u092F',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
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
              'A Gentle Note',
              style: AppTypography.heading3.copyWith(color: AppColors.teal),
            ),
          ),
        ],
      ),
      content: Text(
        'This topic covers sensitive themes. You can come back '
        'to this any time you feel ready.\n\n'
        'Would you like to continue?',
        style: AppTypography.bodyLarge.copyWith(
          color: AppColors.charcoalLight,
          height: 1.6,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(),
          child: Text(
            'Not right now',
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
          child: const Text("Yes, I'm ready"),
        ),
      ],
    ),
  );
}
