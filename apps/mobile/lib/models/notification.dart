// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'notification.freezed.dart';
part 'notification.g.dart';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Notification type indicating the purpose and source of the notification.
enum NotificationType {
  @JsonValue('medication_reminder')
  medicationReminder,
  @JsonValue('logging_prompt')
  loggingPrompt,
  @JsonValue('breakthrough_followup')
  breakthroughFollowup,
  @JsonValue('education_unlock')
  educationUnlock,
  @JsonValue('goal_reminder')
  goalReminder,
  @JsonValue('wellness_tip')
  wellnessTip,
  @JsonValue('visit_reminder')
  visitReminder,
  @JsonValue('milestone')
  milestone,
  @JsonValue('patient_alert_high_pain')
  patientAlertHighPain,
  @JsonValue('patient_alert_missed_med')
  patientAlertMissedMed,
  @JsonValue('patient_alert_distress')
  patientAlertDistress,
  @JsonValue('caregiver_shift')
  caregiverShift,
  @JsonValue('caregiver_wellness')
  caregiverWellness,
  @JsonValue('clinical_critical')
  clinicalCritical,
  @JsonValue('clinical_warning')
  clinicalWarning,
  @JsonValue('clinical_info')
  clinicalInfo,
  @JsonValue('message_received')
  messageReceived,
  @JsonValue('report_ready')
  reportReady,
  @JsonValue('system')
  system,
}

/// Notification priority level.
/// - low: suppressible
/// - normal: standard delivery
/// - high: bypasses DND except quiet hours
/// - critical: bypasses everything
enum NotificationPriority {
  @JsonValue('low')
  low,
  @JsonValue('normal')
  normal,
  @JsonValue('high')
  high,
  @JsonValue('critical')
  critical,
}

/// Delivery channel for the notification.
enum NotificationChannel {
  @JsonValue('push')
  push,
  @JsonValue('in_app')
  inApp,
  @JsonValue('sms')
  sms,
  @JsonValue('whatsapp')
  whatsapp,
}

/// Notification sound.
enum NotificationSound {
  @JsonValue('default')
  defaultSound,
  @JsonValue('gentle_chime')
  gentleChime,
  @JsonValue('medication_bell')
  medicationBell,
  @JsonValue('soft_ping')
  softPing,
  @JsonValue('silent')
  silent,
}

/// Delivery status of the notification.
enum DeliveryStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('sent')
  sent,
  @JsonValue('delivered')
  delivered,
  @JsonValue('failed')
  failed,
  @JsonValue('suppressed')
  suppressed,
}

/// Reason a notification was suppressed.
enum SuppressionReason {
  @JsonValue('quiet_hours')
  quietHours,
  @JsonValue('dnd_mode')
  dndMode,
  @JsonValue('frequency_cap')
  frequencyCap,
  @JsonValue('user_disabled')
  userDisabled,
  @JsonValue('bad_day_suppression')
  badDaySuppression,
}

// ---------------------------------------------------------------------------
// Data Models
// ---------------------------------------------------------------------------

/// A push notification, in-app notification, or clinical alert
/// delivered to a user within the PalliCare app.
@freezed
class AppNotification with _$AppNotification {
  const factory AppNotification({
    /// Unique notification identifier.
    required String id,

    /// Target user for this notification.
    @JsonKey(name: 'user_id') required String userId,

    /// Notification type.
    required NotificationType type,

    /// Priority level.
    required NotificationPriority priority,

    /// English title (max 100 chars).
    @JsonKey(name: 'title_en') required String titleEn,

    /// English body text (max 500 chars).
    @JsonKey(name: 'body_en') required String bodyEn,

    /// Associated patient (relevant for caregiver/clinician notifications).
    @JsonKey(name: 'patient_id') String? patientId,

    /// Hindi title.
    @JsonKey(name: 'title_hi') String? titleHi,

    /// Hindi body text.
    @JsonKey(name: 'body_hi') String? bodyHi,

    /// In-app route to navigate to when tapped.
    @JsonKey(name: 'deep_link') String? deepLink,

    /// Quick action buttons shown on the notification (max 2).
    @JsonKey(name: 'action_buttons') List<NotificationAction>? actionButtons,

    /// Delivery channel.
    @Default(NotificationChannel.push) NotificationChannel? channel,

    /// Notification sound.
    @Default(NotificationSound.gentleChime) NotificationSound? sound,

    /// When this notification should be delivered (null = immediately).
    @JsonKey(name: 'scheduled_at') DateTime? scheduledAt,

    /// When the notification was actually sent.
    @JsonKey(name: 'sent_at') DateTime? sentAt,

    /// Whether the notification has been read.
    @Default(false) bool read,

    /// When the notification was read.
    @JsonKey(name: 'read_at') DateTime? readAt,

    /// Whether the notification has been dismissed.
    @Default(false) bool dismissed,

    /// Firebase Cloud Messaging delivery ID.
    @JsonKey(name: 'fcm_message_id') String? fcmMessageId,

    /// Current delivery status.
    @JsonKey(name: 'delivery_status') @Default(DeliveryStatus.pending) DeliveryStatus deliveryStatus,

    /// Reason the notification was suppressed.
    @JsonKey(name: 'suppression_reason') SuppressionReason? suppressionReason,

    /// Escalation chain for critical alerts.
    NotificationEscalation? escalation,

    /// Additional context metadata.
    NotificationMetadata? metadata,

    /// Record creation timestamp.
    @JsonKey(name: 'created_at') DateTime? createdAt,

    /// When the notification auto-expires.
    @JsonKey(name: 'expires_at') DateTime? expiresAt,
  }) = _AppNotification;

  factory AppNotification.fromJson(Map<String, dynamic> json) =>
      _$AppNotificationFromJson(json);
}

/// A quick action button displayed on a notification.
@freezed
class NotificationAction with _$NotificationAction {
  const factory NotificationAction({
    /// English label for the button.
    @JsonKey(name: 'label_en') String? labelEn,

    /// Hindi label for the button.
    @JsonKey(name: 'label_hi') String? labelHi,

    /// Action identifier (e.g., 'mark_taken', 'snooze_15', 'dismiss').
    String? action,
  }) = _NotificationAction;

  factory NotificationAction.fromJson(Map<String, dynamic> json) =>
      _$NotificationActionFromJson(json);
}

/// Escalation chain for critical alerts.
/// Level: 0=patient, 1=caregiver, 2=nurse, 3=physician.
@freezed
class NotificationEscalation with _$NotificationEscalation {
  const factory NotificationEscalation({
    /// Current escalation level (0-3).
    @JsonKey(name: 'escalation_level') int? escalationLevel,

    /// When the escalation occurred.
    @JsonKey(name: 'escalated_at') DateTime? escalatedAt,

    /// User the alert was escalated to.
    @JsonKey(name: 'escalated_to') String? escalatedTo,

    /// Whether the escalation has been acknowledged.
    @Default(false) bool acknowledged,

    /// Who acknowledged the escalation.
    @JsonKey(name: 'acknowledged_by') String? acknowledgedBy,

    /// When the escalation was acknowledged.
    @JsonKey(name: 'acknowledged_at') DateTime? acknowledgedAt,
  }) = _NotificationEscalation;

  factory NotificationEscalation.fromJson(Map<String, dynamic> json) =>
      _$NotificationEscalationFromJson(json);
}

/// Additional context metadata attached to a notification.
@freezed
class NotificationMetadata with _$NotificationMetadata {
  const factory NotificationMetadata({
    /// Related medication identifier.
    @JsonKey(name: 'medication_id') String? medicationId,

    /// Related symptom log identifier.
    @JsonKey(name: 'log_id') String? logId,

    /// Related education module identifier.
    @JsonKey(name: 'module_id') String? moduleId,

    /// Related clinical alert identifier.
    @JsonKey(name: 'alert_id') String? alertId,

    /// Pain score that triggered the notification.
    @JsonKey(name: 'pain_score') int? painScore,

    /// The rule that triggered the notification.
    @JsonKey(name: 'trigger_rule') String? triggerRule,
  }) = _NotificationMetadata;

  factory NotificationMetadata.fromJson(Map<String, dynamic> json) =>
      _$NotificationMetadataFromJson(json);
}
