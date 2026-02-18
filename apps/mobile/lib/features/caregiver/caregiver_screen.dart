import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/section_header.dart';
import 'caregiver_provider.dart';
import 'wellness_check_card.dart';
import 'care_medication_card.dart';
import 'care_schedule_card.dart';
import 'resource_directory.dart';

/// Main Caregiver Mode home screen (Screen 09).
///
/// Vertical-scroll layout with:
///  1. Patient Check-In Hero
///  2. Caregiver Wellness Check
///  3. Patient Medication Card
///  4. Quick Actions
///  5. Today's Summary
///  6. Care Schedule + Activity Feed
///  7. Caregiver Education
///  8. Caregiver Support Card
///  9. Resource Directory
class CaregiverScreen extends ConsumerWidget {
  const CaregiverScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(caregiverProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Caregiver Hub',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.white,
                fontFamily: 'Georgia',
              ),
            ),
            Text(
              '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E',
              style: TextStyle(
                fontSize: 12,
                color: Colors.white70,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: Colors.white),
            onPressed: () {
              // Notifications
            },
          ),
        ],
      ),
      body: state.isLoading
          ? const Center(
              child:
                  CircularProgressIndicator(color: AppColors.primary),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.screenPaddingHorizontal,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: AppSpacing.space4),

                  // --- Header ---
                  _buildHeader(state),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 1. Patient Check-In Hero ---
                  _PatientCheckInHero(state: state),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 2. Caregiver Wellness Check ---
                  const WellnessCheckCard(),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 3. Patient Medication Card ---
                  const CareMedicationCard(),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 4. Quick Actions ---
                  _buildQuickActions(),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 5. Today's Summary ---
                  _TodaySummary(summary: state.summary),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 6. Care Schedule + Activity Feed ---
                  const SectionHeader(
                    title: 'Care Coordination',
                    subtitle: '\u0926\u0947\u0916\u092D\u093E\u0932 \u0938\u092E\u0928\u094D\u0935\u092F',
                  ),
                  const CareScheduleCard(),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 7. Caregiver Education ---
                  const SectionHeader(
                    title: 'Learning for Caregivers',
                    subtitle:
                        '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u0936\u093F\u0915\u094D\u0937\u093E',
                  ),
                  _EducationModulesList(
                      modules: state.educationModules),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 8. Caregiver Support Card ---
                  _buildSupportCard(state),
                  const SizedBox(height: AppSpacing.cardGap),

                  // --- 9. Resource Directory ---
                  const SectionHeader(
                    title: 'Help & Support',
                    subtitle:
                        '\u0938\u0939\u093E\u092F\u0924\u093E \u0914\u0930 \u0938\u092E\u0930\u094D\u0925\u0928',
                  ),
                  const ResourceDirectory(),

                  const SizedBox(height: AppSpacing.space8),
                ],
              ),
            ),
    );
  }

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  Widget _buildHeader(CaregiverState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${state.patientName}\'s care \u00B7 Managed by ${state.caregiverName}',
          style: const TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: 'Georgia',
          ),
        ),
        const SizedBox(height: 2),
        Text(
          '${state.patientNameHindi} \u0915\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u00B7 ${state.caregiverNameHindi} \u0926\u094D\u0935\u093E\u0930\u093E',
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  // -------------------------------------------------------------------------
  // QUICK ACTIONS
  // -------------------------------------------------------------------------

  Widget _buildQuickActions() {
    const actions = [
      _QuickActionData(icon: Icons.medication, label: 'Meds'),
      _QuickActionData(icon: Icons.trending_up, label: 'Trends'),
      _QuickActionData(icon: Icons.group, label: 'Team'),
      _QuickActionData(icon: Icons.event_note, label: 'Pre-visit'),
    ];

    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: actions.map((a) => _QuickActionChip(data: a)).toList(),
    );
  }

  // -------------------------------------------------------------------------
  // SUPPORT CARD
  // -------------------------------------------------------------------------

  Widget _buildSupportCard(CaregiverState state) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.accentCalm.withAlpha(40),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.accentCalm.withAlpha(80)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.favorite,
                size: 20,
                color: AppColors.accentCalm,
              ),
              const SizedBox(width: 8),
              const Text(
                'For You, Caregiver',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space3),
          Text(
            'You are doing something incredibly brave and kind by being here for ${state.patientName}. '
            'Remember: you cannot pour from an empty cup. Take a moment for yourself today.',
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: AppSpacing.space3),
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              onPressed: () {
                // Navigate to self-care tip
              },
              icon: const Icon(Icons.spa, size: 16),
              label: const Text('Self-care tip'),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primaryDark,
                padding: EdgeInsets.zero,
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// PATIENT CHECK-IN HERO
// ---------------------------------------------------------------------------

class _PatientCheckInHero extends StatelessWidget {
  final CaregiverState state;

  const _PatientCheckInHero({required this.state});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding + 4),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'How is ${state.patientName} feeling?',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '${state.patientNameHindi} \u0915\u0948\u0938\u0947 \u092E\u0939\u0938\u0942\u0938 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?',
            style: TextStyle(
              fontSize: 13,
              color: Colors.white.withAlpha(180),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Last logged: ${state.lastLoggedInfo}',
            style: TextStyle(
              fontSize: 12,
              color: Colors.white.withAlpha(160),
            ),
          ),
          const SizedBox(height: AppSpacing.space4),
          SizedBox(
            height: AppSpacing.buttonHeight,
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                // Navigate to symptom logger in caregiver mode
              },
              icon: const Icon(Icons.edit_note, size: 20),
              label: const Text(
                'Log on their behalf',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withAlpha(50),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// TODAY'S SUMMARY
// ---------------------------------------------------------------------------

class _TodaySummary extends StatelessWidget {
  final PatientSummary summary;

  const _TodaySummary({required this.summary});

  @override
  Widget build(BuildContext context) {
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
          const Text(
            'Today\'s Summary',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            '\u0906\u091C \u0915\u093E \u0938\u093E\u0930\u093E\u0902\u0936',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.space4),
          Row(
            children: [
              _SummaryMetric(
                icon: Icons.whatshot,
                label: 'Pain',
                value: '${summary.painScore}/10',
                color: _painColor(summary.painScore),
              ),
              const SizedBox(width: 2),
              _verticalDivider(),
              const SizedBox(width: 2),
              _SummaryMetric(
                icon: Icons.mood,
                label: 'Mood',
                value: summary.mood,
                color: AppColors.accentHighlight,
              ),
              const SizedBox(width: 2),
              _verticalDivider(),
              const SizedBox(width: 2),
              _SummaryMetric(
                icon: Icons.medication,
                label: 'Meds',
                value: '${summary.medsGiven}/${summary.medsTotal} given',
                color: AppColors.primary,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _verticalDivider() {
    return Container(
      width: 1,
      height: 40,
      color: AppColors.divider,
    );
  }

  Color _painColor(int score) {
    if (score <= 3) return AppColors.primary;
    if (score <= 6) return AppColors.warning;
    return AppColors.accentAlert;
  }
}

/// A single metric in the summary row.
class _SummaryMetric extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _SummaryMetric({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, size: 22, color: color),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textTertiary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: color,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// QUICK ACTION CHIP
// ---------------------------------------------------------------------------

class _QuickActionData {
  final IconData icon;
  final String label;

  const _QuickActionData({required this.icon, required this.label});
}

class _QuickActionChip extends StatelessWidget {
  final _QuickActionData data;

  const _QuickActionChip({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(data.icon, size: 18, color: AppColors.primary),
      label: Text(
        data.label,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      ),
      onPressed: () {
        // Navigate based on label
      },
      backgroundColor: AppColors.surfaceCard,
      side: BorderSide(color: AppColors.primary.withAlpha(80)),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    );
  }
}

// ---------------------------------------------------------------------------
// EDUCATION MODULES LIST
// ---------------------------------------------------------------------------

class _EducationModulesList extends StatelessWidget {
  final List<CaregiverEducationModule> modules;

  const _EducationModulesList({required this.modules});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: modules.asMap().entries.map((entry) {
          final index = entry.key;
          final module = entry.value;
          return Column(
            children: [
              if (index > 0)
                const Divider(color: AppColors.divider, height: 16),
              _EducationModuleRow(module: module),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class _EducationModuleRow extends StatelessWidget {
  final CaregiverEducationModule module;

  const _EducationModuleRow({required this.module});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        // Navigate to education module detail
      },
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            // Module ID badge
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: module.isCompleted
                    ? AppColors.primary.withAlpha(20)
                    : AppColors.primaryDark.withAlpha(15),
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: Text(
                module.id,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: module.isCompleted
                      ? AppColors.primary
                      : AppColors.primaryDark,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    module.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  if (module.titleHindi.isNotEmpty)
                    Text(
                      module.titleHindi,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  const SizedBox(height: 2),
                  Text(
                    module.description,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textTertiary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(
              module.isCompleted ? Icons.check_circle : Icons.arrow_forward_ios,
              size: module.isCompleted ? 20 : 14,
              color: module.isCompleted
                  ? AppColors.primary
                  : AppColors.textTertiary,
            ),
          ],
        ),
      ),
    );
  }
}
