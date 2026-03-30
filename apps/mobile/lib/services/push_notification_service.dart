import 'dart:io';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/foundation.dart';

/// Manages FCM push notifications for PalliCare.
///
/// Handles token registration, foreground/background message display,
/// and notification tap routing.
class PushNotificationService {
  PushNotificationService._();
  static final PushNotificationService instance = PushNotificationService._();

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  String? _fcmToken;
  String? get fcmToken => _fcmToken;

  /// Android notification channels.
  static const _generalChannel = AndroidNotificationChannel(
    'general',
    'General Notifications',
    description: 'General PalliCare notifications',
    importance: Importance.defaultImportance,
  );

  static const _alertChannel = AndroidNotificationChannel(
    'clinical_alerts',
    'Clinical Alerts',
    description: 'Urgent clinical alerts requiring immediate attention',
    importance: Importance.high,
    playSound: true,
  );

  /// Initialize the notification service.
  Future<void> initialize() async {
    // Request permission (iOS + Android 13+)
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      criticalAlert: true, // For clinical alerts
    );

    if (settings.authorizationStatus == AuthorizationStatus.denied) {
      debugPrint('PushNotificationService: Permission denied');
      return;
    }

    // Create Android notification channels
    if (Platform.isAndroid) {
      final androidPlugin =
          _localNotifications.resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();
      await androidPlugin?.createNotificationChannel(_generalChannel);
      await androidPlugin?.createNotificationChannel(_alertChannel);
    }

    // Initialize local notifications for foreground display
    await _localNotifications.initialize(
      const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(
          requestAlertPermission: false, // Already requested above
          requestBadgePermission: false,
          requestSoundPermission: false,
        ),
      ),
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    // Get FCM token
    _fcmToken = await _messaging.getToken();
    debugPrint('PushNotificationService: FCM token: ${_fcmToken?.substring(0, 20)}...');

    // Listen for token refresh
    _messaging.onTokenRefresh.listen((newToken) {
      _fcmToken = newToken;
      // TODO: Re-register with API via POST /devices/register
      debugPrint('PushNotificationService: Token refreshed');
    });

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle notification taps when app is in background (not terminated)
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationOpen);

    // Handle notification tap that launched the app (from terminated state)
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationOpen(initialMessage);
    }

    // iOS foreground presentation options
    await _messaging.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  /// Display a foreground message as a local notification.
  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    final isHighPriority = message.data['priority'] == 'high' ||
        message.data['type'] == 'clinical_alert';

    _localNotifications.show(
      notification.hashCode,
      notification.title,
      notification.body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          isHighPriority ? _alertChannel.id : _generalChannel.id,
          isHighPriority ? _alertChannel.name : _generalChannel.name,
          channelDescription: isHighPriority
              ? _alertChannel.description
              : _generalChannel.description,
          importance:
              isHighPriority ? Importance.high : Importance.defaultImportance,
          priority: isHighPriority ? Priority.high : Priority.defaultPriority,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
          interruptionLevel: isHighPriority
              ? InterruptionLevel.timeSensitive
              : InterruptionLevel.active,
        ),
      ),
      payload: message.data['notificationId'],
    );
  }

  /// Handle notification tap (app in background).
  void _handleNotificationOpen(RemoteMessage message) {
    final type = message.data['type'];
    debugPrint('PushNotificationService: Opened notification type=$type');
    // TODO: Navigate to appropriate screen based on type
    // e.g., clinical_alert → alerts screen, medication_reminder → medication tracker
  }

  /// Handle local notification tap.
  void _onNotificationTap(NotificationResponse response) {
    debugPrint('PushNotificationService: Tapped notification id=${response.payload}');
    // TODO: Navigate based on payload (notificationId → fetch details → route)
  }

  /// Handle background message (called from top-level handler in main.dart).
  static void handleBackgroundMessage(RemoteMessage message) {
    debugPrint('PushNotificationService: Background message ${message.messageId}');
  }
}
