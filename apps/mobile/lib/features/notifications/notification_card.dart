import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import 'notification_provider.dart';

/// Individual notification card with priority bar, category icon,
/// bilingual text, action buttons, and swipe-to-dismiss.
class NotificationCard extends ConsumerWidget {
  final AppNotification notification;

  const NotificationCard({super.key, required this.notification});

  // -----------------------------------------------------------------------
  // Priority color mapping
  // -----------------------------------------------------------------------

  static const _priorityColors = <NotificationPriority, Color>{
    NotificationPriority.p0Critical: Color(0xFFC25A45),
    NotificationPriority.p1Urgent: Color(0xFFE8A838),
    NotificationPriority.p2Standard: Color(0xFF2A6B6B),
    NotificationPriority.p3Low: Color(0xFFCCCCCC),
  };

  // -----------------------------------------------------------------------
  // Category icon mapping
  // -----------------------------------------------------------------------

  static const _categoryIcons = <NotificationCategory, IconData>{
    NotificationCategory.medication: Icons.medication_rounded,
    NotificationCategory.checkIn: Icons.assignment_rounded,
    NotificationCategory.painFollowUp: Icons.monitor_heart_rounded,
    NotificationCategory.education: Icons.menu_book_rounded,
    NotificationCategory.goal: Icons.track_changes_rounded,
    NotificationCategory.wellness: Icons.favorite_rounded,
    NotificationCategory.visit: Icons.calendar_today_rounded,
    NotificationCategory.milestone: Icons.star_rounded,
    NotificationCategory.caregiver: Icons.people_rounded,
    NotificationCategory.system: Icons.notifications_rounded,
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifier = ref.read(notificationProvider.notifier);
    final priorityColor =
        _priorityColors[notification.priority] ?? AppColors.border;
    final isUnread = notification.status == NotificationStatus.unread;
    final isDismissed = notification.status == NotificationStatus.dismissed;
    final isActed = notification.status == NotificationStatus.acted;
    final showActions = notification.actions.isNotEmpty &&
        (notification.status == NotificationStatus.unread ||
            notification.status == NotificationStatus.read);

    return Dismissible(
      key: ValueKey(notification.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => notifier.dismissNotification(notification.id),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: AppSpacing.space6),
        decoration: BoxDecoration(
          color: AppColors.error.withAlpha(30),
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
        ),
        child: Icon(Icons.delete_outline_rounded,
            color: AppColors.error, size: 24),
      ),
      child: GestureDetector(
        onTap: () {
          // Mark as read on tap
          if (isUnread) {
            notifier.markAsRead(notification.id);
          }
          // Navigate to deep link if available
          if (notification.deepLink != null &&
              notification.deepLink!.isNotEmpty) {
            context.push(notification.deepLink!);
          }
        },
        child: Container(
          decoration: BoxDecoration(
            color: isUnread ? AppColors.surface : AppColors.surfaceCard,
            borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
            border: Border.all(color: AppColors.border.withAlpha(80)),
            boxShadow: [
              if (isUnread)
                BoxShadow(
                  color: priorityColor.withAlpha(20),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
            ],
          ),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ---- Priority vertical bar (4dp wide) -------------------
                Container(
                  width: 4,
                  decoration: BoxDecoration(
                    color: priorityColor,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(AppSpacing.radiusButton),
                      bottomLeft: Radius.circular(AppSpacing.radiusButton),
                    ),
                  ),
                ),

                // ---- Card body ------------------------------------------
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.space3,
                      AppSpacing.space3,
                      AppSpacing.space3,
                      AppSpacing.space3,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Top row: status dot + title + category icon
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Unread dot
                            if (isUnread)
                              Padding(
                                padding: const EdgeInsets.only(
                                    top: 5, right: AppSpacing.space2),
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppColors.primary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),

                            // Acted check icon
                            if (isActed)
                              Padding(
                                padding: const EdgeInsets.only(
                                    top: 2, right: AppSpacing.space2),
                                child: Icon(Icons.check_circle,
                                    size: 16, color: AppColors.success),
                              ),

                            // Title column
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Hindi title (bold)
                                  Text(
                                    notification.titleHi,
                                    style: AppTypography.bodyDefault.copyWith(
                                      fontWeight: FontWeight.w600,
                                      fontFamily:
                                          AppTypography.hindiFontFamily,
                                      decoration: isDismissed
                                          ? TextDecoration.lineThrough
                                          : null,
                                      color: isDismissed
                                          ? AppColors.textTertiary
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  // English title (small)
                                  Text(
                                    notification.titleEn,
                                    style: AppTypography.bodySmall.copyWith(
                                      decoration: isDismissed
                                          ? TextDecoration.lineThrough
                                          : null,
                                      color: isDismissed
                                          ? AppColors.textTertiary
                                          : AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Category icon (top-right)
                            Padding(
                              padding:
                                  const EdgeInsets.only(left: AppSpacing.space2),
                              child: Icon(
                                _categoryIcons[notification.category] ??
                                    Icons.notifications_rounded,
                                size: 16,
                                color: AppColors.textTertiary,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: AppSpacing.space2),

                        // Body text
                        Text(
                          notification.bodyEn,
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),

                        const SizedBox(height: AppSpacing.space1),

                        // Timestamp + patient action
                        Row(
                          children: [
                            Text(
                              _formatTimestamp(notification.timestamp),
                              style: AppTypography.caption,
                            ),
                            if (isActed &&
                                notification.patientAction != null) ...[
                              const SizedBox(width: AppSpacing.space2),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.success.withAlpha(25),
                                  borderRadius: BorderRadius.circular(
                                      AppSpacing.radiusBadge),
                                ),
                                child: Text(
                                  notification.patientAction!,
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.success,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),

                        // Action buttons
                        if (showActions) ...[
                          const SizedBox(height: AppSpacing.space3),
                          Wrap(
                            spacing: AppSpacing.space2,
                            runSpacing: AppSpacing.space2,
                            children: notification.actions
                                .asMap()
                                .entries
                                .map((entry) {
                              final isPrimary = entry.key == 0;
                              final action = entry.value;
                              return _ActionChip(
                                labelEn: action.labelEn,
                                labelHi: action.labelHi,
                                isPrimary: isPrimary,
                                onTap: () => notifier.performAction(
                                    notification.id, action.id),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Formats a [DateTime] into a human-friendly relative string.
  String _formatTimestamp(DateTime ts) {
    final now = DateTime.now();
    final diff = now.difference(ts);

    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays == 1) return 'Yesterday';
    return '${diff.inDays}d ago';
  }
}

// ---------------------------------------------------------------------------
// Private widgets
// ---------------------------------------------------------------------------

/// Small chip for notification inline actions.
class _ActionChip extends StatelessWidget {
  final String labelEn;
  final String labelHi;
  final bool isPrimary;
  final VoidCallback onTap;

  const _ActionChip({
    required this.labelEn,
    required this.labelHi,
    required this.isPrimary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isPrimary
                ? AppColors.primary.withAlpha(15)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
            border: Border.all(
              color: isPrimary ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Text(
            '$labelEn / $labelHi',
            style: AppTypography.caption.copyWith(
              color: isPrimary ? AppColors.primary : AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
