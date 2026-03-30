import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/l10n/app_localizations.dart';
import '../caregiver/caregiver_mode_provider.dart';
import 'settings_provider.dart';
import 'settings_toggle_row.dart';
import 'settings_section_card.dart';

/// Settings & Profile screen (Screen 11).
///
/// Vertical scroll with sections A-J as per design specification.
class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  // -------------------------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------------------------

  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final minute = time.minute.toString().padLeft(2, '0');
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  Future<void> _pickTime(
    BuildContext context,
    TimeOfDay current,
    ValueChanged<TimeOfDay> onPicked,
  ) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: current,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
                  primary: AppColors.primary,
                  onPrimary: Colors.white,
                  surface: AppColors.surfaceCard,
                ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      onPicked(picked);
    }
  }

  // -------------------------------------------------------------------------
  // BUILD
  // -------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surfaceCard,
        elevation: 0.5,
        scrolledUnderElevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        title: Text(
          l.settingsTitle,
          style: AppTypography.heading3.copyWith(fontSize: 17),
        ),
        actions: [
          if (settings.hasChanges)
            TextButton(
              onPressed: () {
                notifier.markSaved();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(l.settingsSaved),
                    backgroundColor: AppColors.primary,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusButton),
                    ),
                  ),
                );
              },
              child: Text(
                l.commonDone,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
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
            const SizedBox(height: AppSpacing.cardGap),

            // [A] Profile Summary Card
            _buildProfileCard(),
            const SizedBox(height: AppSpacing.cardGap),

            // [B] Language Section
            _buildLanguageSection(settings, notifier),
            const SizedBox(height: AppSpacing.cardGap),

            // [C] Notification Preferences
            _buildNotificationSection(settings, notifier),
            const SizedBox(height: AppSpacing.cardGap),

            // [D] Privacy & Data
            SettingsSectionCard(
              titleEn: l.settingsPrivacy,
              titleHi: l.settingsPrivacy,
              icon: Icons.shield_outlined,
              onTap: () {
                // Placeholder navigation
                _showPlaceholder(context, l.settingsPrivacy);
              },
              child: const SizedBox.shrink(),
            ),
            const SizedBox(height: AppSpacing.cardGap),

            // [E] Caregiver Management — Mode Switch
            _buildCaregiverModeCard(ref),
            const SizedBox(height: AppSpacing.cardGap),

            // [F] Accessibility
            _buildAccessibilitySection(settings, notifier),
            const SizedBox(height: AppSpacing.cardGap),

            // [G] App Preferences
            _buildAppPreferencesSection(settings, notifier),
            const SizedBox(height: AppSpacing.cardGap),

            // [H] Medical Info
            _buildMedicalInfoCard(),
            const SizedBox(height: AppSpacing.cardGap),

            // [I] About & Legal
            _buildAboutLegalCard(),
            const SizedBox(height: AppSpacing.cardGap),

            // [J] Account Actions
            _buildAccountActions(context),

            const SizedBox(height: AppSpacing.space8),
          ],
        ),
      ),
    );
  }

  // =========================================================================
  // [A] PROFILE SUMMARY CARD
  // =========================================================================

  Widget _buildProfileCard() {
    final l = AppLocalizations.of(context);
    const profile = mockProfile;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Avatar
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, AppColors.primaryDark],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  border: Border.all(
                    color: AppColors.primaryLight.withAlpha(100),
                    width: 2,
                  ),
                ),
                alignment: Alignment.center,
                child: Text(
                  profile.initials,
                  style: const TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space4),

              // Name & details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      profile.name,
                      style: const TextStyle(
                        fontFamily: AppTypography.headingFontFamily,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      profile.nameHi,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${profile.age} yrs \u00B7 ${profile.gender}',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      profile.diagnosis,
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
            ],
          ),
          const SizedBox(height: AppSpacing.space3),
          const Divider(color: AppColors.divider, height: 1),
          const SizedBox(height: AppSpacing.space3),

          // ABHA status + View Full Profile
          Row(
            children: [
              // ABHA badge
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: profile.abhaLinked
                      ? AppColors.primary.withAlpha(20)
                      : AppColors.warning.withAlpha(20),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusBadge),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      profile.abhaLinked
                          ? Icons.verified_outlined
                          : Icons.link_off,
                      size: 14,
                      color: profile.abhaLinked
                          ? AppColors.primary
                          : AppColors.warning,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      profile.abhaLinked ? 'ABHA Linked' : 'ABHA Not Linked',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: profile.abhaLinked
                            ? AppColors.primary
                            : AppColors.warning,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),

              // View Full Profile link
              GestureDetector(
                onTap: () {
                  _showPlaceholder(context, l.settingsProfile);
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      l.settingsProfile,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(
                      Icons.arrow_forward_ios,
                      size: 12,
                      color: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // [E] CAREGIVER MODE SWITCH
  // =========================================================================

  Widget _buildCaregiverModeCard(WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final modeState = ref.watch(caregiverModeProvider);
    final modeNotifier = ref.read(caregiverModeProvider.notifier);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: modeState.isCaregiverMode
              ? AppColors.accentWarm.withAlpha(80)
              : AppColors.border,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section header
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: modeState.isCaregiverMode
                      ? AppColors.accentWarm.withAlpha(25)
                      : AppColors.primaryDark.withAlpha(15),
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Icon(
                  Icons.people_outline,
                  size: 20,
                  color: modeState.isCaregiverMode
                      ? AppColors.accentWarm
                      : AppColors.primaryDark,
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l.caregiverTitle,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),

          // Mode switch row
          Container(
            padding: const EdgeInsets.all(AppSpacing.space3),
            decoration: BoxDecoration(
              color: modeState.isCaregiverMode
                  ? AppColors.accentWarm.withAlpha(12)
                  : AppColors.surface,
              borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
              border: Border.all(
                color: modeState.isCaregiverMode
                    ? AppColors.accentWarm.withAlpha(40)
                    : AppColors.border,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  modeState.isCaregiverMode
                      ? Icons.toggle_on
                      : Icons.toggle_off_outlined,
                  size: 32,
                  color: modeState.isCaregiverMode
                      ? AppColors.accentWarm
                      : AppColors.textTertiary,
                ),
                const SizedBox(width: AppSpacing.space3),
                Expanded(
                  child: Text(
                    l.caregiverModeLabel,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: modeState.isCaregiverMode
                          ? AppColors.accentWarm
                          : AppColors.textPrimary,
                    ),
                  ),
                ),
                Switch(
                  value: modeState.isCaregiverMode,
                  onChanged: (_) => modeNotifier.toggleMode(),
                  activeColor: AppColors.accentWarm,
                ),
              ],
            ),
          ),

          if (modeState.isCaregiverMode) ...[
            const SizedBox(height: AppSpacing.space3),
            Text(
              'Interface switches to caregiver-optimized layout with warm amber theme, task coordination, burnout monitoring, and care tools.',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textTertiary,
                height: 1.4,
              ),
            ),
          ],
        ],
      ),
    );
  }

  // =========================================================================
  // [B] LANGUAGE SECTION
  // =========================================================================

  Widget _buildLanguageSection(SettingsState s, SettingsNotifier n) {
    final l = AppLocalizations.of(context);
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
          Text(
            l.settingsLanguageLabel,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space4),

          // Segmented toggle: Hindi / English
          Row(
            children: [
              Expanded(
                child: _LanguageButton(
                  label: '\u0939\u093F\u0928\u094D\u0926\u0940',
                  sublabel: 'Hindi',
                  isSelected: s.language == 'hi',
                  onTap: () => n.setLanguage('hi'),
                ),
              ),
              const SizedBox(width: AppSpacing.space2),
              Expanded(
                child: _LanguageButton(
                  label: 'English',
                  sublabel: '\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940',
                  isSelected: s.language == 'en',
                  onTap: () => n.setLanguage('en'),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.space4),

          // Dual-language toggle
          SettingsToggleRow(
            titleEn: l.settingsDualLanguageLabel,
            titleHi: l.settingsDualLanguageLabel,
            subtitleEn: l.settingsDualLanguageHint,
            value: s.dualLanguage,
            onChanged: n.toggleDualLanguage,
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // [C] NOTIFICATION PREFERENCES
  // =========================================================================

  Widget _buildNotificationSection(SettingsState s, SettingsNotifier n) {
    final l = AppLocalizations.of(context);
    return SettingsSectionCard(
      titleEn: l.settingsNotificationsLabel,
      titleHi: l.settingsNotificationsLabel,
      icon: Icons.notifications_outlined,
      initiallyExpanded: false,
      child: Column(
        children: [
          SettingsToggleRow(
            titleEn: l.settingsMedRemindersLabel,
            titleHi: l.settingsMedRemindersLabel,
            value: s.medReminders,
            onChanged: n.toggleMedReminders,
          ),
          const Divider(color: AppColors.divider, height: 1),

          // Morning check-in
          SettingsToggleRow(
            titleEn: l.settingsMorningCheckinLabel,
            titleHi: l.settingsMorningCheckinLabel,
            value: s.morningCheckin,
            onChanged: n.toggleMorningCheckin,
          ),
          if (s.morningCheckin)
            _buildTimePicker(
              label: 'Morning time',
              time: s.morningCheckinTime,
              onPicked: n.setMorningCheckinTime,
            ),
          const Divider(color: AppColors.divider, height: 1),

          // Evening check-in
          SettingsToggleRow(
            titleEn: l.settingsEveningCheckin,
            titleHi: l.settingsEveningCheckin,
            value: s.eveningCheckin,
            onChanged: n.toggleEveningCheckin,
          ),
          if (s.eveningCheckin)
            _buildTimePicker(
              label: 'Evening time',
              time: s.eveningCheckinTime,
              onPicked: n.setEveningCheckinTime,
            ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsEducationNudges,
            titleHi: l.settingsEducationNudges,
            value: s.educationNudges,
            onChanged: n.toggleEducationNudges,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsGoalReminders,
            titleHi: l.settingsGoalReminders,
            value: s.goalReminders,
            onChanged: n.toggleGoalReminders,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsWellnessTips,
            titleHi: l.settingsWellnessTips,
            value: s.wellnessTips,
            onChanged: n.toggleWellnessTips,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsVisitReminders,
            titleHi: l.settingsVisitReminders,
            value: s.visitReminders,
            onChanged: n.toggleVisitReminders,
          ),
          const Divider(color: AppColors.divider, height: 8),

          // Quiet hours
          SettingsToggleRow(
            titleEn: l.settingsQuietHours,
            titleHi: l.settingsQuietHours,
            subtitleEn: s.quietHoursEnabled
                ? '${_formatTime(s.quietHoursStart)} \u2013 ${_formatTime(s.quietHoursEnd)}'
                : null,
            value: s.quietHoursEnabled,
            onChanged: n.toggleQuietHours,
          ),
          if (s.quietHoursEnabled) ...[
            _buildTimePicker(
              label: 'Start',
              time: s.quietHoursStart,
              onPicked: n.setQuietHoursStart,
            ),
            _buildTimePicker(
              label: 'End',
              time: s.quietHoursEnd,
              onPicked: n.setQuietHoursEnd,
            ),
          ],
        ],
      ),
    );
  }

  // =========================================================================
  // [F] ACCESSIBILITY
  // =========================================================================

  Widget _buildAccessibilitySection(SettingsState s, SettingsNotifier n) {
    final l = AppLocalizations.of(context);
    return SettingsSectionCard(
      titleEn: l.settingsAccessibility,
      titleHi: l.settingsAccessibility,
      icon: Icons.accessibility_new,
      initiallyExpanded: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Text size slider
          Text(
            l.settingsTextSize,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          Row(
            children: [
              const Text(
                'A',
                style: TextStyle(fontSize: 12, color: AppColors.textTertiary),
              ),
              Expanded(
                child: SliderTheme(
                  data: SliderTheme.of(context).copyWith(
                    activeTrackColor: AppColors.primary,
                    inactiveTrackColor: AppColors.border,
                    thumbColor: AppColors.primary,
                    overlayColor: AppColors.primary.withAlpha(40),
                    trackHeight: 4,
                    thumbShape: const RoundSliderThumbShape(
                      enabledThumbRadius: 8,
                    ),
                  ),
                  child: Slider(
                    value: s.textSizeIndex.toDouble(),
                    min: 0,
                    max: 3,
                    divisions: 3,
                    label: s.textSizeLabel,
                    onChanged: (v) => n.setTextSizeIndex(v.round()),
                  ),
                ),
              ),
              const Text(
                'A',
                style: TextStyle(fontSize: 22, color: AppColors.textTertiary),
              ),
            ],
          ),
          Text(
            s.textSizeLabel,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsHighContrast,
            titleHi: l.settingsHighContrast,
            value: s.highContrast,
            onChanged: n.toggleHighContrast,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsReduceMotion,
            titleHi: l.settingsReduceMotion,
            value: s.reduceMotion,
            onChanged: n.toggleReduceMotion,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsVoiceInput,
            titleHi: l.settingsVoiceInput,
            value: s.voiceInput,
            onChanged: n.toggleVoiceInput,
          ),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsHapticFeedback,
            titleHi: l.settingsHapticFeedback,
            value: s.hapticFeedback,
            onChanged: n.toggleHapticFeedback,
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // [G] APP PREFERENCES
  // =========================================================================

  Widget _buildAppPreferencesSection(SettingsState s, SettingsNotifier n) {
    final l = AppLocalizations.of(context);
    return SettingsSectionCard(
      titleEn: l.settingsAppearance,
      titleHi: l.settingsAppearance,
      icon: Icons.tune,
      initiallyExpanded: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logging mode radio
          Text(
            l.settingsLoggingMode,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          _buildRadioRow<String>(
            value: 'quick',
            groupValue: s.loggingMode,
            labelEn: l.settingsLoggingQuick,
            labelHi: l.settingsLoggingQuick,
            onChanged: (v) => n.setLoggingMode(v!),
          ),
          _buildRadioRow<String>(
            value: 'full',
            groupValue: s.loggingMode,
            labelEn: l.settingsLoggingFull,
            labelHi: l.settingsLoggingFull,
            onChanged: (v) => n.setLoggingMode(v!),
          ),

          const SizedBox(height: AppSpacing.space2),
          const Divider(color: AppColors.divider, height: 1),
          const SizedBox(height: AppSpacing.space2),

          // Dark mode radio
          Text(
            l.settingsDarkMode,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          _buildRadioRow<String>(
            value: 'off',
            groupValue: s.darkModePreference,
            labelEn: l.settingsDarkModeOff,
            labelHi: l.settingsDarkModeOff,
            onChanged: (v) => n.setDarkModePreference(v!),
          ),
          _buildRadioRow<String>(
            value: 'on',
            groupValue: s.darkModePreference,
            labelEn: l.settingsDarkModeOn,
            labelHi: l.settingsDarkModeOn,
            onChanged: (v) => n.setDarkModePreference(v!),
          ),
          _buildRadioRow<String>(
            value: 'auto',
            groupValue: s.darkModePreference,
            labelEn: l.settingsDarkModeAuto,
            labelHi: l.settingsDarkModeAuto,
            onChanged: (v) => n.setDarkModePreference(v!),
          ),

          const SizedBox(height: AppSpacing.space2),
          const Divider(color: AppColors.divider, height: 1),

          SettingsToggleRow(
            titleEn: l.settingsAppSounds,
            titleHi: l.settingsAppSounds,
            value: s.appSounds,
            onChanged: n.toggleAppSounds,
          ),
          const Divider(color: AppColors.divider, height: 1),
          const SizedBox(height: AppSpacing.space3),

          // Data & Storage info
          Container(
            padding: const EdgeInsets.all(AppSpacing.space3),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
            ),
            child: Row(
              children: [
                const Icon(Icons.storage, size: 18, color: AppColors.textTertiary),
                const SizedBox(width: AppSpacing.space2),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Data & Storage',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Local data: 24 MB \u00B7 Last sync: Today 2:30 PM',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // [H] MEDICAL INFO (Read-only)
  // =========================================================================

  Widget _buildMedicalInfoCard() {
    final l = AppLocalizations.of(context);
    const profile = mockProfile;

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
          // Section header
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.info.withAlpha(25),
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.medical_information_outlined,
                  size: 20,
                  color: AppColors.info,
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Text(
                  l.settingsProfile,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),

          _buildInfoRow(
            Icons.local_hospital,
            'Diagnosis',
            profile.diagnosis,
          ),
          const SizedBox(height: AppSpacing.space3),
          _buildInfoRow(
            Icons.person,
            'Care Team',
            profile.doctor,
          ),
          const SizedBox(height: AppSpacing.space3),
          _buildInfoRow(
            Icons.business,
            'Hospital',
            profile.hospital,
          ),
          const SizedBox(height: AppSpacing.space3),
          _buildInfoRow(
            Icons.event,
            'Next Visit',
            'March 5, 2026 \u00B7 10:00 AM',
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppColors.textTertiary),
        const SizedBox(width: AppSpacing.space2),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // =========================================================================
  // [I] ABOUT & LEGAL
  // =========================================================================

  Widget _buildAboutLegalCard() {
    final l = AppLocalizations.of(context);
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
          // Section header
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.primaryDark.withAlpha(20),
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.info_outline,
                  size: 20,
                  color: AppColors.primaryDark,
                ),
              ),
              const SizedBox(width: AppSpacing.space3),
              Expanded(
                child: Text(
                  l.settingsAbout,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),

          // App version
          Center(
            child: Column(
              children: [
                Text(
                  l.appName,
                  style: const TextStyle(
                    fontFamily: AppTypography.headingFontFamily,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryDark,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'Version 0.1.0 (Build 1)',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textTertiary,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'AIIMS Bhopal Palliative Care',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.space4),
          const Divider(color: AppColors.divider, height: 1),

          // Links
          _buildLinkRow(Icons.description_outlined, 'Terms of Service',
              '\u0938\u0947\u0935\u093E \u0915\u0940 \u0936\u0930\u094D\u0924\u0947\u0902'),
          const Divider(color: AppColors.divider, height: 1),
          _buildLinkRow(Icons.privacy_tip_outlined, 'Privacy Policy',
              '\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0928\u0940\u0924\u093F'),
          const Divider(color: AppColors.divider, height: 1),
          _buildLinkRow(Icons.security_outlined, 'DPDPA Compliance',
              'DPDPA \u0905\u0928\u0941\u092A\u093E\u0932\u0928'),
          const Divider(color: AppColors.divider, height: 1),

          // Emergency contacts
          const SizedBox(height: AppSpacing.space3),
          Container(
            padding: const EdgeInsets.all(AppSpacing.space3),
            decoration: BoxDecoration(
              color: AppColors.accentAlert.withAlpha(12),
              borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
              border: Border.all(color: AppColors.accentAlert.withAlpha(40)),
            ),
            child: const Row(
              children: [
                Icon(Icons.emergency, size: 18, color: AppColors.accentAlert),
                SizedBox(width: AppSpacing.space2),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Emergency: 112',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.accentAlert,
                        ),
                      ),
                      SizedBox(height: 1),
                      Text(
                        'AIIMS Palliative Helpline: 011-2658-8500',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLinkRow(IconData icon, String titleEn, String titleHi) {
    return InkWell(
      onTap: () {
        _showPlaceholder(context, titleEn);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.space3),
        child: Row(
          children: [
            Icon(icon, size: 18, color: AppColors.textSecondary),
            const SizedBox(width: AppSpacing.space3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titleEn,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    titleHi,
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right,
              size: 18,
              color: AppColors.textTertiary,
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================================
  // [J] ACCOUNT ACTIONS
  // =========================================================================

  Widget _buildAccountActions(BuildContext ctx) {
    final l = AppLocalizations.of(ctx);
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Switch Profile
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: OutlinedButton.icon(
              onPressed: () {
                _showPlaceholder(ctx, l.settingsProfile);
              },
              icon: const Icon(Icons.swap_horiz, size: 20),
              label: Text(
                l.settingsProfile,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primaryDark,
                side: const BorderSide(color: AppColors.border),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space3),

          // Logout
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: OutlinedButton.icon(
              onPressed: () {
                _showLogoutDialog(ctx);
              },
              icon: const Icon(Icons.logout, size: 20),
              label: Text(
                l.settingsLogout,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.accentAlert,
                side: const BorderSide(color: AppColors.accentAlert),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space3),

          // Delete Account
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: TextButton(
              onPressed: () {
                _showDeleteDialog(ctx);
              },
              style: TextButton.styleFrom(
                foregroundColor: AppColors.textTertiary,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                ),
              ),
              child: Text(
                l.settingsDataDelete,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w400),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // SHARED HELPER WIDGETS
  // =========================================================================

  Widget _buildTimePicker({
    required String label,
    required TimeOfDay time,
    required ValueChanged<TimeOfDay> onPicked,
  }) {
    return Padding(
      padding: const EdgeInsets.only(
        left: AppSpacing.space4,
        bottom: AppSpacing.space2,
      ),
      child: InkWell(
        onTap: () => _pickTime(context, time, onPicked),
        borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              const Icon(
                Icons.access_time,
                size: 16,
                color: AppColors.textTertiary,
              ),
              const SizedBox(width: 8),
              Text(
                '$label: ${_formatTime(time)}',
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Spacer(),
              const Icon(
                Icons.edit,
                size: 14,
                color: AppColors.textTertiary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRadioRow<T>({
    required T value,
    required T groupValue,
    required String labelEn,
    required String labelHi,
    required ValueChanged<T?> onChanged,
  }) {
    final selected = value == groupValue;
    return InkWell(
      onTap: () => onChanged(value),
      borderRadius: BorderRadius.circular(AppSpacing.radiusPainButton),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Radio<T>(
              value: value,
              groupValue: groupValue,
              onChanged: onChanged,
              activeColor: AppColors.primary,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              visualDensity: VisualDensity.compact,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    labelEn,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
                      color: selected
                          ? AppColors.textPrimary
                          : AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    labelHi,
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
      ),
    );
  }

  // =========================================================================
  // DIALOGS
  // =========================================================================

  void _showPlaceholder(BuildContext ctx, String title) {
    ScaffoldMessenger.of(ctx).showSnackBar(
      SnackBar(
        content: Text('$title \u2014 Coming soon'),
        backgroundColor: AppColors.primaryDark,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showLogoutDialog(BuildContext ctx) {
    final l = AppLocalizations.of(ctx);
    showDialog(
      context: ctx,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        ),
        title: Text('${l.settingsLogout}?'),
        content: const Text(
          'Your data is saved locally and will be available when you log back in.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              l.commonCancel,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Would navigate to login screen
            },
            child: Text(
              l.settingsLogout,
              style: const TextStyle(color: AppColors.accentAlert),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext ctx) {
    final l = AppLocalizations.of(ctx);
    showDialog(
      context: ctx,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        ),
        title: Text('${l.settingsDataDelete}?'),
        content: const Text(
          'This action is permanent. All your data including symptom logs, '
          'pain diary entries, and settings will be permanently deleted. '
          'This cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              l.commonCancel,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Would delete account
            },
            child: Text(
              l.commonDelete,
              style: const TextStyle(color: AppColors.accentAlert),
            ),
          ),
        ],
      ),
    );
  }
}

// ===========================================================================
// LANGUAGE BUTTON (used in Section B)
// ===========================================================================

class _LanguageButton extends StatelessWidget {
  final String label;
  final String sublabel;
  final bool isSelected;
  final VoidCallback onTap;

  const _LanguageButton({
    required this.label,
    required this.sublabel,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 56,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          border: Border.all(
            color: isSelected
                ? AppColors.primary
                : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 1),
            Text(
              sublabel,
              style: TextStyle(
                fontSize: 11,
                color: isSelected
                    ? Colors.white.withAlpha(180)
                    : AppColors.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
