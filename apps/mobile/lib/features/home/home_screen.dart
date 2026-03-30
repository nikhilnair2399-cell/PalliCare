import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/routing/app_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../widgets/connectivity_banner.dart';
import '../caregiver/caregiver_mode_provider.dart';

/// Patient Home Screen — "Today, You Matter"
///
/// Mode-aware: when caregiver mode is active, redirects to CaregiverHomeScreen.
/// Spec: 02_Screen_Home.md
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final modeState = ref.watch(caregiverModeProvider);
    final l = AppLocalizations.of(context);

    // If caregiver mode is active, redirect to caregiver home
    if (modeState.isCaregiverMode) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.go(AppRoutes.caregiverHome);
      });
      return const Scaffold(
        backgroundColor: AppColors.surface,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.accentWarm),
        ),
      );
    }
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          children: [
            // Connectivity / sync status banner
            const ConnectivityBanner(),
            Expanded(
              child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              _buildGreetingHeader(context, l),
              const SizedBox(height: AppSpacing.md),

              // Hero Card — "How are you feeling?"
              _buildHeroCard(context, l),
              const SizedBox(height: AppSpacing.md),

              // Medication Strip
              _buildMedicationStrip(context, l),
              const SizedBox(height: AppSpacing.md),

              // Community Card
              _buildCommunityCard(context, l),
              const SizedBox(height: AppSpacing.md),

              // Comfort Card
              _buildComfortCard(context, l),
            ],
          ),
        ),
            ),
          ],
        ),
      ),

      // Quick-log FAB
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.symptomLogger),
        backgroundColor: AppColors.sage,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: Text(l.navLogSymptom),
      ),

      // Bottom Navigation
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.sage,
        unselectedItemColor: AppColors.charcoalLight,
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              break; // already on Home
            case 1:
              context.push(AppRoutes.symptomLogger);
            case 2:
              context.push(AppRoutes.medicationTracker);
            case 3:
              context.push(AppRoutes.learn);
            case 4:
              _showMoreSheet(context, l);
          }
        },
        items: [
          BottomNavigationBarItem(icon: const Icon(Icons.home), label: l.navToday),
          BottomNavigationBarItem(icon: const Icon(Icons.edit_note), label: l.navLogSymptom),
          BottomNavigationBarItem(icon: const Icon(Icons.medication), label: l.navMeds),
          BottomNavigationBarItem(icon: const Icon(Icons.school), label: l.navLearn),
          BottomNavigationBarItem(icon: const Icon(Icons.more_horiz), label: l.navMore),
        ],
      ),
    );
  }

  void _showMoreSheet(BuildContext context, AppLocalizations l) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.lg,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              _MoreItem(
                icon: Icons.mic,
                label: l.moreVoiceComfort,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.voice);
                },
              ),
              _MoreItem(
                icon: Icons.self_improvement,
                label: l.moreBreatheComfort,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.breathe);
                },
              ),
              _MoreItem(
                icon: Icons.timeline,
                label: l.navJourney,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.journey);
                },
              ),
              _MoreItem(
                icon: Icons.people,
                label: l.communityTitle,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.community);
                },
              ),
              _MoreItem(
                icon: Icons.local_library,
                label: l.moreDiseaseLibrary,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.learnLibrary);
                },
              ),
              _MoreItem(
                icon: Icons.book,
                label: l.morePainDiary,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.painDiary);
                },
              ),
              _MoreItem(
                icon: Icons.family_restroom,
                label: l.moreCaregiverHub,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.caregiver);
                },
              ),
              _MoreItem(
                icon: Icons.settings,
                label: l.navSettings,
                onTap: () {
                  Navigator.pop(context);
                  context.push(AppRoutes.settings);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreetingHeader(BuildContext context, AppLocalizations l) {
    final hour = DateTime.now().hour;
    String greeting;
    if (hour < 12) {
      greeting = l.homeGreetingMorning;
    } else if (hour < 17) {
      greeting = l.homeGreetingAfternoon;
    } else {
      greeting = l.homeGreetingEvening;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          l.homeGreetingUser(greeting, 'Ramesh'),
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: AppColors.teal,
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 4),
        Text(
          l.appTagline,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.charcoalLight,
                fontStyle: FontStyle.italic,
              ),
        ),
      ],
    );
  }

  Widget _buildHeroCard(BuildContext context, AppLocalizations l) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.sage, AppColors.teal],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l.homeHeroTitle,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            l.homeHeroSubtitle('3 hrs ago', 4),
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.8),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.push(AppRoutes.symptomLogger),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(l.homeLogNow),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationStrip(BuildContext context, AppLocalizations l) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l.homeMedTitle,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.sage,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              GestureDetector(
                onTap: () => context.push(AppRoutes.medicationTracker),
                child: Text(
                  l.commonViewAll,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.teal,
                      ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildMedRow(l, 'Morphine SR 30mg', '6:00 PM', false),
          const Divider(height: 16),
          _buildMedRow(l, 'Gabapentin 300mg', '6:00 PM', true),
          const Divider(height: 16),
          _buildMedRow(l, 'Dulcolax 5mg', '9:00 PM', false),
        ],
      ),
    );
  }

  Widget _buildMedRow(AppLocalizations l, String name, String time, bool taken) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
              Text(time, style: TextStyle(fontSize: 12, color: AppColors.charcoalLight)),
            ],
          ),
        ),
        if (taken)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.sage,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(l.medTaken, style: const TextStyle(color: Colors.white, fontSize: 12)),
          )
        else
          OutlinedButton(
            onPressed: () {},
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: AppColors.sage.withValues(alpha: 0.5)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              minimumSize: Size.zero,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(l.medTake, style: const TextStyle(fontSize: 12)),
          ),
      ],
    );
  }

  Widget _buildCommunityCard(BuildContext context, AppLocalizations l) {
    return GestureDetector(
      onTap: () => context.push(AppRoutes.community),
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
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.teal.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.teal.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: const Text('\ud83e\udd1d', style: TextStyle(fontSize: 24)),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l.communityTitle,
                    style: const TextStyle(
                      color: AppColors.teal,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    l.communitySubtitle,
                    style: TextStyle(
                      color: AppColors.charcoalLight.withValues(alpha: 0.8),
                      fontSize: 12,
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

  Widget _buildComfortCard(BuildContext context, AppLocalizations l) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.lavenderLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.lavender.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '"${l.homeComfortQuote}"',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.charcoalLight,
                        fontStyle: FontStyle.italic,
                      ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () => context.push(AppRoutes.breathe),
                  child: Text(l.homeTryBreathing,
                      style: const TextStyle(color: AppColors.sage)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Single row in the "More" bottom sheet.
class _MoreItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MoreItem({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.teal, size: 24),
      title: Text(
        label,
        style: const TextStyle(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textTertiary, size: 20),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onTap: onTap,
    );
  }
}
