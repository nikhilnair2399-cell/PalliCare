import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'notification_provider.dart';

/// A reusable badge overlay that shows the unread notification count.
///
/// Wraps any [child] widget (typically an icon) and positions a small red
/// circle with the count in the top-right corner when there are unread
/// notifications.
///
/// Usage:
/// ```dart
/// NotificationBadge(
///   child: Icon(Icons.notifications_outlined),
/// )
/// ```
class NotificationBadge extends ConsumerWidget {
  /// The widget to overlay the badge on (e.g. an icon button).
  final Widget child;

  const NotificationBadge({super.key, required this.child});

  static const Color _badgeColor = Color(0xFFC25A45);
  static const double _badgeSize = 18.0;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unreadCount = ref.watch(
      notificationProvider.select((s) => s.unreadCount),
    );

    return Stack(
      clipBehavior: Clip.none,
      children: [
        child,
        if (unreadCount > 0)
          Positioned(
            top: -4,
            right: -4,
            child: Container(
              width: _badgeSize,
              height: _badgeSize,
              decoration: const BoxDecoration(
                color: _badgeColor,
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(
                unreadCount > 99 ? '99+' : '$unreadCount',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  height: 1,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
