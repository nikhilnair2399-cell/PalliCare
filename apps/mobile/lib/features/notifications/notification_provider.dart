import 'package:flutter_riverpod/flutter_riverpod.dart';

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------

/// Notification priority levels (P0 = most critical).
enum NotificationPriority { p0Critical, p1Urgent, p2Standard, p3Low }

/// Notification category matching app feature areas.
enum NotificationCategory {
  medication,
  checkIn,
  painFollowUp,
  education,
  goal,
  wellness,
  visit,
  milestone,
  caregiver,
  system,
}

/// Lifecycle status of a notification.
enum NotificationStatus { unread, read, acted, dismissed }

// ---------------------------------------------------------------------------
// MODELS
// ---------------------------------------------------------------------------

/// An inline action button that can appear on a notification card.
class NotificationAction {
  final String id;
  final String labelEn;
  final String labelHi;

  const NotificationAction({
    required this.id,
    required this.labelEn,
    required this.labelHi,
  });
}

/// A single in-app notification.
class AppNotification {
  final String id;
  final NotificationPriority priority;
  final NotificationCategory category;
  final NotificationStatus status;
  final String titleEn;
  final String titleHi;
  final String bodyEn;
  final String bodyHi;
  final DateTime timestamp;
  final String? patientAction;
  final String? deepLink;
  final List<NotificationAction> actions;

  const AppNotification({
    required this.id,
    required this.priority,
    required this.category,
    this.status = NotificationStatus.unread,
    required this.titleEn,
    required this.titleHi,
    required this.bodyEn,
    required this.bodyHi,
    required this.timestamp,
    this.patientAction,
    this.deepLink,
    this.actions = const [],
  });

  AppNotification copyWith({
    NotificationStatus? status,
    String? patientAction,
  }) {
    return AppNotification(
      id: id,
      priority: priority,
      category: category,
      status: status ?? this.status,
      titleEn: titleEn,
      titleHi: titleHi,
      bodyEn: bodyEn,
      bodyHi: bodyHi,
      timestamp: timestamp,
      patientAction: patientAction ?? this.patientAction,
      deepLink: deepLink,
      actions: actions,
    );
  }
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

/// Immutable state for the notification center.
class NotificationState {
  final List<AppNotification> notifications;
  final NotificationCategory? filterCategory;
  final bool showReadNotifications;

  const NotificationState({
    this.notifications = const [],
    this.filterCategory,
    this.showReadNotifications = true,
  });

  NotificationState copyWith({
    List<AppNotification>? notifications,
    NotificationCategory? Function()? filterCategory,
    bool? showReadNotifications,
  }) {
    return NotificationState(
      notifications: notifications ?? this.notifications,
      filterCategory:
          filterCategory != null ? filterCategory() : this.filterCategory,
      showReadNotifications:
          showReadNotifications ?? this.showReadNotifications,
    );
  }

  // -- Computed getters -----------------------------------------------------

  /// Total unread notifications.
  int get unreadCount =>
      notifications.where((n) => n.status == NotificationStatus.unread).length;

  /// Count of P0 critical notifications that are still unread.
  int get criticalCount => notifications
      .where((n) =>
          n.priority == NotificationPriority.p0Critical &&
          n.status == NotificationStatus.unread)
      .length;

  /// Notifications after applying category filter and read toggle, sorted by
  /// priority (ascending enum index = higher priority) then timestamp desc.
  List<AppNotification> get filteredNotifications {
    var list = List<AppNotification>.from(notifications);

    // Category filter
    if (filterCategory != null) {
      list = list.where((n) => n.category == filterCategory).toList();
    }

    // Show / hide read
    if (!showReadNotifications) {
      list = list
          .where((n) =>
              n.status == NotificationStatus.unread ||
              n.status == NotificationStatus.acted)
          .toList();
    }

    // Sort: priority asc (P0 first), then timestamp desc
    list.sort((a, b) {
      final pCmp = a.priority.index.compareTo(b.priority.index);
      if (pCmp != 0) return pCmp;
      return b.timestamp.compareTo(a.timestamp);
    });

    return list;
  }

  /// Filtered notifications that occurred today.
  List<AppNotification> get todayNotifications {
    final now = DateTime.now();
    return filteredNotifications
        .where((n) =>
            n.timestamp.year == now.year &&
            n.timestamp.month == now.month &&
            n.timestamp.day == now.day)
        .toList();
  }

  /// Filtered notifications from before today.
  List<AppNotification> get earlierNotifications {
    final now = DateTime.now();
    return filteredNotifications
        .where((n) =>
            n.timestamp.year != now.year ||
            n.timestamp.month != now.month ||
            n.timestamp.day != now.day)
        .toList();
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class NotificationNotifier extends StateNotifier<NotificationState> {
  NotificationNotifier() : super(const NotificationState()) {
    _loadMockData();
  }

  /// Mark a single notification as read.
  void markAsRead(String id) {
    final updated = state.notifications.map((n) {
      if (n.id == id && n.status == NotificationStatus.unread) {
        return n.copyWith(status: NotificationStatus.read);
      }
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  /// Mark every unread notification as read.
  void markAllAsRead() {
    final updated = state.notifications.map((n) {
      if (n.status == NotificationStatus.unread) {
        return n.copyWith(status: NotificationStatus.read);
      }
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  /// Dismiss (soft-delete) a notification.
  void dismissNotification(String id) {
    final updated = state.notifications.map((n) {
      if (n.id == id) {
        return n.copyWith(status: NotificationStatus.dismissed);
      }
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  /// Perform an inline action on a notification (e.g. "taken", "later").
  void performAction(String notificationId, String actionId) {
    final updated = state.notifications.map((n) {
      if (n.id == notificationId) {
        return n.copyWith(
          status: NotificationStatus.acted,
          patientAction: actionId,
        );
      }
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  /// Set or clear the category filter. Pass null to show all.
  void setFilter(NotificationCategory? category) {
    state = state.copyWith(filterCategory: () => category);
  }

  /// Toggle visibility of already-read notifications.
  void toggleShowRead() {
    state =
        state.copyWith(showReadNotifications: !state.showReadNotifications);
  }

  // -- Mock data ------------------------------------------------------------

  void _loadMockData() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));

    final mocks = <AppNotification>[
      // 1. P0 Critical — pain spike
      AppNotification(
        id: 'notif_01',
        priority: NotificationPriority.p0Critical,
        category: NotificationCategory.painFollowUp,
        titleEn: 'Pain 9/10 sustained',
        titleHi: 'दर्द 9/10 बना हुआ है',
        bodyEn:
            'Your pain has been at 9/10 for over 2 hours. Please consider contacting your care team.',
        bodyHi:
            'आपका दर्द 2 घंटे से 9/10 पर बना हुआ है। कृपया अपनी देखभाल टीम से संपर्क करें।',
        timestamp: now.subtract(const Duration(hours: 2)),
        deepLink: '/pain-diary',
        actions: const [
          NotificationAction(
              id: 'call', labelEn: 'Call team', labelHi: 'टीम को कॉल करें'),
          NotificationAction(
              id: 'log', labelEn: 'Log update', labelHi: 'अपडेट दर्ज करें'),
        ],
      ),

      // 2. P1 Urgent — med due
      AppNotification(
        id: 'notif_02',
        priority: NotificationPriority.p1Urgent,
        category: NotificationCategory.medication,
        titleEn: 'Morphine SR 30mg — evening dose due',
        titleHi: 'मॉर्फीन एसआर 30mg — शाम की खुराक',
        bodyEn: 'Your scheduled evening dose is due now.',
        bodyHi: 'आपकी शाम की निर्धारित खुराक का समय हो गया है।',
        timestamp: now.subtract(const Duration(minutes: 30)),
        deepLink: '/medication-tracker',
        actions: const [
          NotificationAction(
              id: 'taken', labelEn: 'Taken', labelHi: 'ले ली'),
          NotificationAction(
              id: 'later', labelEn: 'Later', labelHi: 'बाद में'),
        ],
      ),

      // 3. P1 Urgent — missed med
      AppNotification(
        id: 'notif_03',
        priority: NotificationPriority.p1Urgent,
        category: NotificationCategory.medication,
        titleEn: 'Missed medication: Gabapentin 300mg',
        titleHi: 'छूटी दवा: गैबापेंटिन 300mg',
        bodyEn: 'Your afternoon Gabapentin dose was missed 1 hour ago.',
        bodyHi: 'आपकी दोपहर की गैबापेंटिन खुराक 1 घंटे पहले छूट गई।',
        timestamp: now.subtract(const Duration(hours: 1)),
        deepLink: '/medication-tracker',
        actions: const [
          NotificationAction(
              id: 'taken', labelEn: 'Take now', labelHi: 'अभी लें'),
          NotificationAction(
              id: 'skip', labelEn: 'Skip', labelHi: 'छोड़ दें'),
        ],
      ),

      // 4. P2 Standard — morning check-in
      AppNotification(
        id: 'notif_04',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.checkIn,
        titleEn: 'Morning check-in',
        titleHi: 'सुबह की जाँच',
        bodyEn: 'How are you feeling this morning? A quick log helps your care team.',
        bodyHi: 'आज सुबह आप कैसा महसूस कर रहे हैं? एक त्वरित लॉग आपकी देखभाल टीम की मदद करता है।',
        timestamp: now.subtract(const Duration(hours: 3)),
        deepLink: '/symptom-logger',
        actions: const [
          NotificationAction(
              id: 'log', labelEn: 'Log now', labelHi: 'अभी लॉग करें'),
          NotificationAction(
              id: 'later', labelEn: 'Not now', labelHi: 'अभी नहीं'),
        ],
      ),

      // 5. P2 Standard — pain follow-up
      AppNotification(
        id: 'notif_05',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.painFollowUp,
        titleEn: 'Pain follow-up: How is the pain after medication?',
        titleHi: 'दर्द फॉलो-अप: दवा के बाद दर्द कैसा है?',
        bodyEn:
            'You took Morphine IR 45 minutes ago. Rate your current pain level.',
        bodyHi:
            'आपने 45 मिनट पहले मॉर्फीन आईआर ली थी। अपने वर्तमान दर्द का स्तर बताएं।',
        timestamp: now.subtract(const Duration(hours: 4)),
        deepLink: '/symptom-logger',
        actions: const [
          NotificationAction(
              id: 'better', labelEn: 'Better', labelHi: 'बेहतर'),
          NotificationAction(
              id: 'same', labelEn: 'Same', labelHi: 'वैसा ही'),
          NotificationAction(
              id: 'worse', labelEn: 'Worse', labelHi: 'बदतर'),
        ],
      ),

      // 6. P2 Standard — visit reminder
      AppNotification(
        id: 'notif_06',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.visit,
        titleEn: 'Dr. Sharma visit tomorrow at 10 AM',
        titleHi: 'डॉ. शर्मा से कल सुबह 10 बजे मिलना है',
        bodyEn:
            'Prepare your pain diary and medication log for the appointment.',
        bodyHi:
            'अपॉइंटमेंट के लिए अपनी दर्द डायरी और दवा लॉग तैयार रखें।',
        timestamp: now.subtract(const Duration(hours: 5)),
        actions: const [
          NotificationAction(
              id: 'prepare', labelEn: 'Prepare', labelHi: 'तैयारी करें'),
          NotificationAction(
              id: 'view', labelEn: 'View report', labelHi: 'रिपोर्ट देखें'),
        ],
      ),

      // 7. P3 Low — education module
      AppNotification(
        id: 'notif_07',
        priority: NotificationPriority.p3Low,
        category: NotificationCategory.education,
        titleEn: 'New module unlocked: Understanding Side Effects',
        titleHi: 'नया मॉड्यूल: दुष्प्रभावों को समझना',
        bodyEn: 'Learn about common opioid side effects and how to manage them.',
        bodyHi: 'सामान्य ओपिओइड दुष्प्रभावों और उन्हें प्रबंधित करने के बारे में जानें।',
        timestamp: now.subtract(const Duration(hours: 6)),
        deepLink: '/learn',
        actions: const [
          NotificationAction(
              id: 'read', labelEn: 'Read now', labelHi: 'अभी पढ़ें'),
          NotificationAction(
              id: 'later', labelEn: 'Later', labelHi: 'बाद में'),
        ],
      ),

      // 8. P3 Low — daily intention / goal
      AppNotification(
        id: 'notif_08',
        priority: NotificationPriority.p3Low,
        category: NotificationCategory.goal,
        titleEn: "Today's intention: What's your small goal?",
        titleHi: 'आज का इरादा: आपका छोटा लक्ष्य क्या है?',
        bodyEn: 'Setting a small daily goal helps maintain a sense of purpose.',
        bodyHi: 'एक छोटा दैनिक लक्ष्य तय करने से उद्देश्य की भावना बनी रहती है।',
        timestamp: now.subtract(const Duration(hours: 7)),
        deepLink: '/journey',
        actions: const [
          NotificationAction(
              id: 'set', labelEn: 'Set goal', labelHi: 'लक्ष्य तय करें'),
        ],
      ),

      // 9. P3 Low — milestone (yesterday)
      AppNotification(
        id: 'notif_09',
        priority: NotificationPriority.p3Low,
        category: NotificationCategory.milestone,
        titleEn: '7-day streak! One week together',
        titleHi: '7 दिन की लगातार! एक सप्ताह साथ',
        bodyEn:
            'You have logged your symptoms for 7 days in a row. Keep it up!',
        bodyHi:
            'आपने लगातार 7 दिनों तक अपने लक्षण दर्ज किए हैं। जारी रखें!',
        timestamp: yesterday.add(const Duration(hours: 18)),
        actions: const [
          NotificationAction(
              id: 'thanks',
              labelEn: 'Thank you',
              labelHi: 'धन्यवाद'),
        ],
      ),

      // 10. P2 Standard — evening check-in (yesterday, read)
      AppNotification(
        id: 'notif_10',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.checkIn,
        status: NotificationStatus.read,
        titleEn: 'Evening check-in',
        titleHi: 'शाम की जाँच',
        bodyEn: 'How was your day? Log your evening symptoms.',
        bodyHi: 'आपका दिन कैसा रहा? शाम के लक्षण दर्ज करें।',
        timestamp: yesterday.add(const Duration(hours: 20)),
        deepLink: '/symptom-logger',
      ),

      // 11. P2 Standard — med taken (yesterday, acted)
      AppNotification(
        id: 'notif_11',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.medication,
        status: NotificationStatus.acted,
        titleEn: 'Medication time: Lactulose 15ml',
        titleHi: 'दवा का समय: लैक्टुलोज 15ml',
        bodyEn: 'Your morning Lactulose dose is scheduled.',
        bodyHi: 'आपकी सुबह की लैक्टुलोज खुराक निर्धारित है।',
        timestamp: yesterday.add(const Duration(hours: 8)),
        patientAction: 'taken',
        deepLink: '/medication-tracker',
      ),

      // 12. P3 Low — wellness tip (yesterday, dismissed)
      AppNotification(
        id: 'notif_12',
        priority: NotificationPriority.p3Low,
        category: NotificationCategory.wellness,
        status: NotificationStatus.dismissed,
        titleEn: 'Wellness tip: Try the 20-20-20 rule',
        titleHi: 'स्वास्थ्य सुझाव: 20-20-20 नियम आज़माएं',
        bodyEn:
            'Every 20 minutes, look at something 20 feet away for 20 seconds.',
        bodyHi:
            'हर 20 मिनट में, 20 फीट दूर किसी चीज़ को 20 सेकंड तक देखें।',
        timestamp: yesterday.add(const Duration(hours: 12)),
      ),

      // 13. P2 Standard — caregiver note (today)
      AppNotification(
        id: 'notif_13',
        priority: NotificationPriority.p2Standard,
        category: NotificationCategory.caregiver,
        titleEn: 'Caregiver update shared with Priya',
        titleHi: 'प्रिया को केयरगिवर अपडेट भेजा गया',
        bodyEn:
            'Your daily summary has been shared with your caregiver.',
        bodyHi:
            'आपका दैनिक सारांश आपके केयरगिवर के साथ साझा किया गया है।',
        timestamp: now.subtract(const Duration(hours: 1, minutes: 30)),
        deepLink: '/caregiver',
      ),

      // 14. P3 Low — breathe reminder
      AppNotification(
        id: 'notif_14',
        priority: NotificationPriority.p3Low,
        category: NotificationCategory.wellness,
        titleEn: 'Time for a breathing exercise',
        titleHi: 'साँस के व्यायाम का समय',
        bodyEn:
            'A 3-minute calm breathing session can help manage discomfort.',
        bodyHi:
            '3 मिनट का शांत साँस सत्र असुविधा को प्रबंधित करने में मदद कर सकता है।',
        timestamp: now.subtract(const Duration(hours: 5, minutes: 30)),
        deepLink: '/breathe',
        actions: const [
          NotificationAction(
              id: 'start', labelEn: 'Start', labelHi: 'शुरू करें'),
          NotificationAction(
              id: 'later', labelEn: 'Later', labelHi: 'बाद में'),
        ],
      ),

      // 15. P1 Urgent — system alert (low battery / sync)
      AppNotification(
        id: 'notif_15',
        priority: NotificationPriority.p1Urgent,
        category: NotificationCategory.system,
        titleEn: 'Data not synced for 24 hours',
        titleHi: '24 घंटे से डेटा सिंक नहीं हुआ',
        bodyEn:
            'Please connect to the internet so your care team can see your latest logs.',
        bodyHi:
            'कृपया इंटरनेट से कनेक्ट करें ताकि आपकी देखभाल टीम आपके नवीनतम लॉग देख सके।',
        timestamp: now.subtract(const Duration(hours: 2, minutes: 45)),
      ),
    ];

    state = state.copyWith(notifications: mocks);
  }
}

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final notificationProvider =
    StateNotifierProvider<NotificationNotifier, NotificationState>(
  (ref) => NotificationNotifier(),
);
