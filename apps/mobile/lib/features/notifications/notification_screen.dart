import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import 'notification_provider.dart';
import 'notification_card.dart';

/// In-app notification center (Screen 12).
class NotificationScreen extends ConsumerStatefulWidget {
  const NotificationScreen({super.key});

  @override
  ConsumerState<NotificationScreen> createState() =>
      _NotificationScreenState();
}

class _NotificationScreenState extends ConsumerState<NotificationScreen> {
  // -----------------------------------------------------------------------
  // Category chip data
  // -----------------------------------------------------------------------

  static const _categoryChips = <_ChipData>[
    _ChipData(null, 'All', 'सभी'),
    _ChipData(NotificationCategory.medication, 'Medication', 'दवा'),
    _ChipData(NotificationCategory.checkIn, 'Check-in', 'जाँच'),
    _ChipData(NotificationCategory.education, 'Education', 'शिक्षा'),
    _ChipData(NotificationCategory.goal, 'Goals', 'लक्ष्य'),
    _ChipData(NotificationCategory.wellness, 'Wellness', 'स्वास्थ्य'),
    _ChipData(NotificationCategory.visit, 'Visit', 'विजिट'),
  ];

  @override
  Widget build(BuildContext context) {
    final notifState = ref.watch(notificationProvider);
    final notifier = ref.read(notificationProvider.notifier);

    final todayItems = notifState.todayNotifications;
    final earlierItems = notifState.earlierNotifications;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primaryDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Notifications \u00b7 \u0938\u0942\u091a\u0928\u093e\u090f\u0901',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryDark,
            fontFamily: AppTypography.headingFontFamily,
          ),
        ),
        centerTitle: true,
        actions: [
          if (notifState.unreadCount > 0)
            TextButton(
              onPressed: () => notifier.markAllAsRead(),
              child: Text(
                'Mark all read',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ----- Category filter chips -----------------------------------
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.screenPaddingHorizontal,
                vertical: AppSpacing.space1,
              ),
              itemCount: _categoryChips.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(width: AppSpacing.space2),
              itemBuilder: (context, index) {
                final chip = _categoryChips[index];
                final isActive = notifState.filterCategory == chip.category;

                return GestureDetector(
                  onTap: () => notifier.setFilter(chip.category),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isActive ? AppColors.primary : Colors.white,
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusChip),
                      border: Border.all(
                        color:
                            isActive ? AppColors.primary : AppColors.border,
                      ),
                    ),
                    child: Text(
                      '${chip.labelEn} / ${chip.labelHi}',
                      style: AppTypography.labelSmall.copyWith(
                        color: isActive
                            ? Colors.white
                            : AppColors.textSecondary,
                        fontWeight:
                            isActive ? FontWeight.w600 : FontWeight.w500,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // ----- Unread count banner -------------------------------------
          if (notifState.unreadCount > 0)
            Container(
              margin: const EdgeInsets.symmetric(
                horizontal: AppSpacing.screenPaddingHorizontal,
                vertical: AppSpacing.space2,
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.space4,
                vertical: AppSpacing.space2,
              ),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(20),
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusButton),
              ),
              child: Row(
                children: [
                  Icon(Icons.circle_notifications_outlined,
                      size: 18, color: AppColors.primary),
                  const SizedBox(width: AppSpacing.space2),
                  Expanded(
                    child: Text(
                      '${notifState.unreadCount} unread \u00b7 ${notifState.unreadCount} \u0905\u092a\u0920\u093f\u0924',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // ----- Notification list (grouped) -----------------------------
          Expanded(
            child: todayItems.isEmpty && earlierItems.isEmpty
                ? _EmptyState()
                : ListView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.screenPaddingHorizontal,
                    ),
                    children: [
                      // Today group
                      if (todayItems.isNotEmpty) ...[
                        _SectionLabel(
                          label:
                              'Today \u00b7 \u0906\u091c',
                        ),
                        const SizedBox(height: AppSpacing.space2),
                        ...todayItems.map(
                          (n) => Padding(
                            padding: const EdgeInsets.only(
                                bottom: AppSpacing.space3),
                            child: NotificationCard(notification: n),
                          ),
                        ),
                      ],

                      // Earlier group
                      if (earlierItems.isNotEmpty) ...[
                        _SectionLabel(
                          label:
                              'Earlier \u00b7 \u092a\u0939\u0932\u0947',
                        ),
                        const SizedBox(height: AppSpacing.space2),
                        ...earlierItems.map(
                          (n) => Padding(
                            padding: const EdgeInsets.only(
                                bottom: AppSpacing.space3),
                            child: NotificationCard(notification: n),
                          ),
                        ),
                      ],

                      const SizedBox(height: AppSpacing.space7),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

class _ChipData {
  final NotificationCategory? category;
  final String labelEn;
  final String labelHi;
  const _ChipData(this.category, this.labelEn, this.labelHi);
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.space3),
      child: Text(
        label,
        style: AppTypography.heading4.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.notifications_none_rounded,
                size: 56, color: AppColors.border),
            const SizedBox(height: AppSpacing.space4),
            Text(
              'No notifications',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.space1),
            Text(
              '\u0915\u094b\u0908 \u0938\u0942\u091a\u0928\u093e \u0928\u0939\u0940\u0902',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
