/**
 * PalliCare Notification
 *
 * Schema for push notifications, in-app notifications, and clinical alerts.
 *
 * Generated from: schemas/notification.schema.json
 */

// ---------------------------------------------------------------------------
// Enums (as union types)
// ---------------------------------------------------------------------------

/** Notification type / category */
export type NotificationType =
  | 'medication_reminder'
  | 'logging_prompt'
  | 'breakthrough_followup'
  | 'education_unlock'
  | 'goal_reminder'
  | 'wellness_tip'
  | 'visit_reminder'
  | 'milestone'
  | 'patient_alert_high_pain'
  | 'patient_alert_missed_med'
  | 'patient_alert_distress'
  | 'caregiver_shift'
  | 'caregiver_wellness'
  | 'clinical_critical'
  | 'clinical_warning'
  | 'clinical_info'
  | 'message_received'
  | 'report_ready'
  | 'system';

/**
 * Notification priority.
 * low = suppressible, normal = standard, high = bypasses DND except quiet hours,
 * critical = bypasses everything.
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

/** Delivery channel */
export type NotificationChannel = 'push' | 'in_app' | 'sms' | 'whatsapp';

/** Notification sound */
export type NotificationSound =
  | 'default'
  | 'gentle_chime'
  | 'medication_bell'
  | 'soft_ping'
  | 'silent';

/** Delivery status */
export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'suppressed';

/** Reason a notification was suppressed */
export type SuppressionReason =
  | 'quiet_hours'
  | 'dnd_mode'
  | 'frequency_cap'
  | 'user_disabled'
  | 'bad_day_suppression';

// ---------------------------------------------------------------------------
// Nested interfaces
// ---------------------------------------------------------------------------

/** Quick action button shown on the notification */
export interface NotificationActionButton {
  label_en?: string;
  label_hi?: string | null;
  /** Action identifier (e.g., "mark_taken", "snooze_15", "dismiss", "log_now") */
  action?: string;
}

/** Escalation chain for critical alerts */
export interface NotificationEscalation {
  /** Escalation level: 0=patient, 1=caregiver, 2=nurse, 3=physician */
  escalation_level?: number;
  escalated_at?: string | null;
  escalated_to?: string | null;
  acknowledged?: boolean;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
}

/** Additional context metadata for the notification */
export interface NotificationMetadata {
  medication_id?: string | null;
  log_id?: string | null;
  module_id?: string | null;
  alert_id?: string | null;
  pain_score?: number | null;
  trigger_rule?: string | null;
}

// ---------------------------------------------------------------------------
// Root interface
// ---------------------------------------------------------------------------

/**
 * A push notification, in-app notification, or clinical alert
 * targeting a specific user.
 */
export interface Notification {
  id: string;
  /** Target user for this notification */
  user_id: string;
  /** Associated patient (relevant for caregiver/clinician notifications) */
  patient_id?: string | null;
  type: NotificationType;
  /** Notification priority level */
  priority: NotificationPriority;
  title_en: string;
  title_hi?: string | null;
  body_en: string;
  body_hi?: string | null;
  /** In-app route to navigate to when notification is tapped */
  deep_link?: string | null;
  /** Quick action buttons (max 2) */
  action_buttons?: NotificationActionButton[];
  channel?: NotificationChannel;
  sound?: NotificationSound;
  /** When this notification should be delivered (null = immediately) */
  scheduled_at?: string | null;
  sent_at?: string | null;
  read?: boolean;
  read_at?: string | null;
  dismissed?: boolean;
  /** Firebase Cloud Messaging delivery ID */
  fcm_message_id?: string | null;
  delivery_status?: DeliveryStatus;
  suppression_reason?: SuppressionReason | null;
  /** Escalation chain for critical alerts */
  escalation?: NotificationEscalation;
  /** Additional context metadata */
  metadata?: NotificationMetadata;
  created_at?: string;
  /** Notification auto-expires after this time */
  expires_at?: string | null;
}
