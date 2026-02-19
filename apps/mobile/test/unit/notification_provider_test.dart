import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/notifications/notification_provider.dart';

void main() {
  group('AppNotification', () {
    test('default status is unread', () {
      final notif = AppNotification(
        id: 'test',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.medication,
        titleEn: 'Test',
        titleHi: 'टेस्ट',
        bodyEn: 'Test body',
        bodyHi: 'टेस्ट बॉडी',
        timestamp: DateTime.now(),
      );
      expect(notif.status, NotificationStatus.unread);
      expect(notif.patientAction, isNull);
      expect(notif.actions, isEmpty);
    });

    test('copyWith updates status', () {
      final notif = AppNotification(
        id: 'test',
        priority: NotificationPriority.p0Critical,
        category: NotificationCategory.painFollowUp,
        titleEn: 'Pain Alert',
        titleHi: 'दर्द अलर्ट',
        bodyEn: 'Body',
        bodyHi: 'बॉडी',
        timestamp: DateTime.now(),
      );
      final updated = notif.copyWith(status: NotificationStatus.read);
      expect(updated.status, NotificationStatus.read);
      expect(updated.id, 'test'); // preserved
      expect(updated.priority, NotificationPriority.p0Critical); // preserved
    });
  });

  group('NotificationState', () {
    test('default state has empty notifications', () {
      const state = NotificationState();
      expect(state.notifications, isEmpty);
      expect(state.filterCategory, isNull);
      expect(state.showReadNotifications, true);
    });

    test('unreadCount counts correctly', () {
      final state = NotificationState(notifications: [
        AppNotification(
          id: '1',
          priority: NotificationPriority.p2Standard,
          category: NotificationCategory.medication,
          status: NotificationStatus.unread,
          titleEn: 'A',
          titleHi: 'ए',
          bodyEn: 'B',
          bodyHi: 'बी',
          timestamp: DateTime.now(),
        ),
        AppNotification(
          id: '2',
          priority: NotificationPriority.p3Low,
          category: NotificationCategory.education,
          status: NotificationStatus.read,
          titleEn: 'C',
          titleHi: 'सी',
          bodyEn: 'D',
          bodyHi: 'डी',
          timestamp: DateTime.now(),
        ),
        AppNotification(
          id: '3',
          priority: NotificationPriority.p0Critical,
          category: NotificationCategory.painFollowUp,
          status: NotificationStatus.unread,
          titleEn: 'E',
          titleHi: 'ई',
          bodyEn: 'F',
          bodyHi: 'एफ',
          timestamp: DateTime.now(),
        ),
      ]);
      expect(state.unreadCount, 2);
      expect(state.criticalCount, 1);
    });

    test('filteredNotifications sorts by priority then timestamp', () {
      final now = DateTime.now();
      final state = NotificationState(notifications: [
        AppNotification(
          id: '1',
          priority: NotificationPriority.p3Low,
          category: NotificationCategory.education,
          titleEn: 'Low',
          titleHi: 'लो',
          bodyEn: '',
          bodyHi: '',
          timestamp: now,
        ),
        AppNotification(
          id: '2',
          priority: NotificationPriority.p0Critical,
          category: NotificationCategory.painFollowUp,
          titleEn: 'Critical',
          titleHi: 'क्रिटिकल',
          bodyEn: '',
          bodyHi: '',
          timestamp: now.subtract(const Duration(hours: 1)),
        ),
      ]);

      final filtered = state.filteredNotifications;
      expect(filtered.first.id, '2'); // P0 first
      expect(filtered.last.id, '1'); // P3 last
    });

    test('category filter works', () {
      final state = NotificationState(
        filterCategory: NotificationCategory.medication,
        notifications: [
          AppNotification(
            id: '1',
            priority: NotificationPriority.p2Standard,
            category: NotificationCategory.medication,
            titleEn: 'Med',
            titleHi: 'दवा',
            bodyEn: '',
            bodyHi: '',
            timestamp: DateTime.now(),
          ),
          AppNotification(
            id: '2',
            priority: NotificationPriority.p2Standard,
            category: NotificationCategory.education,
            titleEn: 'Edu',
            titleHi: 'शिक्षा',
            bodyEn: '',
            bodyHi: '',
            timestamp: DateTime.now(),
          ),
        ],
      );
      expect(state.filteredNotifications.length, 1);
      expect(state.filteredNotifications.first.id, '1');
    });

    test('showReadNotifications toggle hides read notifications', () {
      final state = NotificationState(
        showReadNotifications: false,
        notifications: [
          AppNotification(
            id: '1',
            priority: NotificationPriority.p2Standard,
            category: NotificationCategory.medication,
            status: NotificationStatus.unread,
            titleEn: 'Unread',
            titleHi: '',
            bodyEn: '',
            bodyHi: '',
            timestamp: DateTime.now(),
          ),
          AppNotification(
            id: '2',
            priority: NotificationPriority.p2Standard,
            category: NotificationCategory.medication,
            status: NotificationStatus.read,
            titleEn: 'Read',
            titleHi: '',
            bodyEn: '',
            bodyHi: '',
            timestamp: DateTime.now(),
          ),
        ],
      );
      expect(state.filteredNotifications.length, 1);
      expect(state.filteredNotifications.first.id, '1');
    });
  });

  group('NotificationNotifier', () {
    late NotificationNotifier notifier;

    setUp(() {
      notifier = NotificationNotifier();
    });

    test('loads 15 mock notifications on init', () {
      expect(notifier.state.notifications.length, 15);
    });

    test('has critical, urgent, standard, and low priority notifications', () {
      final priorities =
          notifier.state.notifications.map((n) => n.priority).toSet();
      expect(priorities, contains(NotificationPriority.p0Critical));
      expect(priorities, contains(NotificationPriority.p1Urgent));
      expect(priorities, contains(NotificationPriority.p2Standard));
      expect(priorities, contains(NotificationPriority.p3Low));
    });

    test('markAsRead changes unread to read', () {
      // Find first unread
      final unread = notifier.state.notifications
          .firstWhere((n) => n.status == NotificationStatus.unread);
      final initialUnreadCount = notifier.state.unreadCount;

      notifier.markAsRead(unread.id);

      final updated = notifier.state.notifications
          .firstWhere((n) => n.id == unread.id);
      expect(updated.status, NotificationStatus.read);
      expect(notifier.state.unreadCount, initialUnreadCount - 1);
    });

    test('markAllAsRead clears all unread', () {
      expect(notifier.state.unreadCount, greaterThan(0));

      notifier.markAllAsRead();

      expect(notifier.state.unreadCount, 0);
    });

    test('dismissNotification sets status to dismissed', () {
      final first = notifier.state.notifications.first;
      notifier.dismissNotification(first.id);

      final updated = notifier.state.notifications
          .firstWhere((n) => n.id == first.id);
      expect(updated.status, NotificationStatus.dismissed);
    });

    test('performAction sets status to acted with action ID', () {
      final actionable = notifier.state.notifications
          .firstWhere((n) => n.actions.isNotEmpty);
      notifier.performAction(actionable.id, actionable.actions.first.id);

      final updated = notifier.state.notifications
          .firstWhere((n) => n.id == actionable.id);
      expect(updated.status, NotificationStatus.acted);
      expect(updated.patientAction, actionable.actions.first.id);
    });

    test('setFilter updates category filter', () {
      notifier.setFilter(NotificationCategory.medication);
      expect(
          notifier.state.filterCategory, NotificationCategory.medication);

      notifier.setFilter(null);
      expect(notifier.state.filterCategory, isNull);
    });

    test('toggleShowRead toggles visibility', () {
      expect(notifier.state.showReadNotifications, true);

      notifier.toggleShowRead();
      expect(notifier.state.showReadNotifications, false);

      notifier.toggleShowRead();
      expect(notifier.state.showReadNotifications, true);
    });

    test('todayNotifications returns only today items', () {
      final today = notifier.state.todayNotifications;
      final now = DateTime.now();
      for (final n in today) {
        expect(n.timestamp.day, now.day);
        expect(n.timestamp.month, now.month);
        expect(n.timestamp.year, now.year);
      }
    });

    test('earlierNotifications returns only non-today items', () {
      final earlier = notifier.state.earlierNotifications;
      final now = DateTime.now();
      for (final n in earlier) {
        final isToday = n.timestamp.day == now.day &&
            n.timestamp.month == now.month &&
            n.timestamp.year == now.year;
        expect(isToday, false);
      }
    });
  });
}
