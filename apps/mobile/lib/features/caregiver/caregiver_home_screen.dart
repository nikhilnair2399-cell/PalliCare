import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/l10n/app_localizations.dart';
import '../../core/routing/app_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'caregiver_mode_provider.dart';
import 'caregiver_provider.dart';
import 'patient_status_dashboard.dart';
import 'task_assignment_card.dart';
import 'wellness_check_card.dart';

/// Caregiver Home Screen — the primary hub when caregiver mode is active.
///
/// Layout:
///  1. Caregiver Mode Header (amber)
///  2. Patient Status Dashboard (24h at-a-glance)
///  3. Caregiver Wellness Check ("How are YOU?")
///  4. Quick Actions (Journal, Burnout, Tasks, Emergency)
///  5. Task Board (assigned tasks between caregivers)
///  6. Community Quick Link (caregiver channel)
///  7. Resources (Financial, Respite, Grief)
class CaregiverHomeScreen extends ConsumerWidget {
  const CaregiverHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final modeState = ref.watch(caregiverModeProvider);
    final cgState = ref.watch(caregiverProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.accentWarmDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          l.caregiverHome,
          style: AppTypography.heading3.copyWith(
            color: Colors.white,
            fontFamily: AppTypography.headingFontFamily,
          ),
        ),
        actions: [
          // Mode pill badge
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.sm),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.people, size: 14, color: Colors.white),
                const SizedBox(width: 4),
                Text(
                  l.caregiverBadge,
                  style: AppTypography.caption.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.screenPaddingHorizontal,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: AppSpacing.md),

            // --- Header ---
            Text(
              l.caregiverCareLabel(modeState.patientName, modeState.caregiverName),
              style: AppTypography.heading4.copyWith(
                color: AppColors.accentWarmDark,
              ),
            ),
            Text(
              l.caregiverModeLabel,
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // --- 1. Patient Status Dashboard ---
            PatientStatusDashboard(
              patientName: cgState.patientName,
              lastPainScore: cgState.summary.painScore,
              lastMood: cgState.summary.mood,
              medsGiven: cgState.summary.medsGiven,
              medsTotal: cgState.summary.medsTotal,
            ),
            const SizedBox(height: AppSpacing.md),

            // --- 2. Caregiver Wellness Check ---
            const WellnessCheckCard(),
            const SizedBox(height: AppSpacing.md),

            // --- 3. Quick Actions ---
            Text(l.caregiverQuickActions, style: AppTypography.heading4.copyWith(color: AppColors.teal)),
            const SizedBox(height: AppSpacing.sm),
            _QuickActionsGrid(onAction: (route) {
              context.push(route);
            }),
            const SizedBox(height: AppSpacing.md),

            // --- 4. Medication Proxy ---
            _buildMedProxyCard(context, cgState, l),
            const SizedBox(height: AppSpacing.md),

            // --- 5. Task Board ---
            Text(l.caregiverTaskBoard, style: AppTypography.heading4.copyWith(color: AppColors.teal)),
            const SizedBox(height: AppSpacing.sm),
            _TaskBoardSection(
              tasks: cgState.tasks,
              onToggle: (id) => ref.read(caregiverProvider.notifier).toggleTask(id),
              onViewAll: () => context.push(AppRoutes.caregiverTasks),
            ),
            const SizedBox(height: AppSpacing.md),

            // --- 6. Community Quick Link ---
            _buildCommunityLink(context, l),
            const SizedBox(height: AppSpacing.md),

            // --- 7. Resources ---
            Text(l.caregiverResourcesLabel, style: AppTypography.heading4.copyWith(color: AppColors.teal)),
            const SizedBox(height: AppSpacing.sm),
            _ResourceCardsRow(onTap: (route) => context.push(route)),

            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }

  Widget _buildMedProxyCard(BuildContext context, CaregiverState state, AppLocalizations l) {
    final given = state.summary.medsGiven;
    final total = state.summary.medsTotal;
    return GestureDetector(
      onTap: () => context.push(AppRoutes.medicationTracker),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.sage.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Text('\ud83d\udc8a', style: TextStyle(fontSize: 20)),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                l.caregiverMedManagement,
                style: AppTypography.label.copyWith(color: AppColors.teal),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: given == total
                    ? AppColors.sage.withValues(alpha: 0.12)
                    : AppColors.accentHighlight.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
              ),
              child: Text(
                l.caregiverMedsGiven(given, total),
                style: AppTypography.caption.copyWith(
                  color: given == total ? AppColors.sage : AppColors.accentHighlight,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.chevron_right, size: 18, color: AppColors.charcoalLight),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunityLink(BuildContext context, AppLocalizations l) {
    return GestureDetector(
      onTap: () => context.push(AppRoutes.community),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.accentWarm.withValues(alpha: 0.12),
              AppColors.teal.withValues(alpha: 0.06),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.accentWarm.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.accentWarm.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Text('\ud83e\udd1d', style: TextStyle(fontSize: 20)),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                l.caregiverCommunity,
                style: AppTypography.label.copyWith(color: AppColors.accentWarmDark),
              ),
            ),
            const Icon(Icons.chevron_right, size: 18, color: AppColors.charcoalLight),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// QUICK ACTIONS GRID
// ---------------------------------------------------------------------------

class _QA {
  final IconData icon;
  final String Function(AppLocalizations l) labelFn;
  final Color color;
  final String route;

  const _QA(this.icon, this.labelFn, this.color, this.route);
}

class _QuickActionsGrid extends StatelessWidget {
  final ValueChanged<String> onAction;

  const _QuickActionsGrid({required this.onAction});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final actions = [
      _QA(Icons.book, (l) => l.caregiverJournal, AppColors.lavender, AppRoutes.caregiverJournal),
      _QA(Icons.psychology, (l) => l.caregiverBurnout, AppColors.accentAlert, AppRoutes.caregiverBurnout),
      _QA(Icons.checklist, (l) => l.caregiverTasks, AppColors.accentHighlight, AppRoutes.caregiverTasks),
      _QA(Icons.emergency, (l) => l.caregiverEmergency, AppColors.error, AppRoutes.caregiverEmergency),
    ];

    return Row(
      children: actions.map((a) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: a == actions.last ? 0 : AppSpacing.sm,
            ),
            child: GestureDetector(
              onTap: () => onAction(a.route),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: a.color.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                  border: Border.all(color: a.color.withValues(alpha: 0.2)),
                ),
                child: Column(
                  children: [
                    Icon(a.icon, size: 24, color: a.color),
                    const SizedBox(height: 6),
                    Text(
                      a.labelFn(l),
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// TASK BOARD SECTION
// ---------------------------------------------------------------------------

class _TaskBoardSection extends StatelessWidget {
  final List<CareTask> tasks;
  final ValueChanged<String> onToggle;
  final VoidCallback onViewAll;

  const _TaskBoardSection({
    required this.tasks,
    required this.onToggle,
    required this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    if (tasks.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            const Text('\u2705', style: TextStyle(fontSize: 28)),
            const SizedBox(height: AppSpacing.sm),
            Text(
              l.caregiverNoTasks,
              style: AppTypography.label.copyWith(color: AppColors.charcoalLight),
            ),
            const SizedBox(height: AppSpacing.sm),
            TextButton(
              onPressed: onViewAll,
              child: Text(
                l.caregiverAddTasks,
                style: AppTypography.label.copyWith(color: AppColors.accentWarm),
              ),
            ),
          ],
        ),
      );
    }

    final displayTasks = tasks.take(3).toList();
    return Column(
      children: [
        ...displayTasks.map((t) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: TaskAssignmentCard(
                task: t,
                onToggle: () => onToggle(t.id),
              ),
            )),
        if (tasks.length > 3)
          TextButton(
            onPressed: onViewAll,
            child: Text(
              l.caregiverViewAllTasks(tasks.length),
              style: AppTypography.label.copyWith(color: AppColors.accentWarm),
            ),
          ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// RESOURCE CARDS ROW
// ---------------------------------------------------------------------------

class _ResItem {
  final IconData icon;
  final String Function(AppLocalizations l) labelFn;
  final Color color;
  final String route;

  const _ResItem(this.icon, this.labelFn, this.color, this.route);
}

class _ResourceCardsRow extends StatelessWidget {
  final ValueChanged<String> onTap;

  const _ResourceCardsRow({required this.onTap});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final items = [
      _ResItem(Icons.account_balance, (l) => l.caregiverFinancial, AppColors.accentHighlight, AppRoutes.caregiverFinancial),
      _ResItem(Icons.spa, (l) => l.caregiverRespite, AppColors.sage, AppRoutes.caregiverRespite),
      _ResItem(Icons.favorite, (l) => l.caregiverGrief, AppColors.lavender, AppRoutes.caregiverGrief),
    ];

    return Row(
      children: items.map((r) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: r == items.last ? 0 : AppSpacing.sm,
            ),
            child: GestureDetector(
              onTap: () => onTap(r.route),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
                decoration: BoxDecoration(
                  color: r.color.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                  border: Border.all(color: r.color.withValues(alpha: 0.2)),
                ),
                child: Column(
                  children: [
                    Icon(r.icon, size: 24, color: r.color),
                    const SizedBox(height: 6),
                    Text(
                      r.labelFn(l),
                      style: AppTypography.label.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
