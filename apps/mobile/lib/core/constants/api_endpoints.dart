/// PalliCare API endpoint constants.
///
/// Base URLs and path constants derived from openapi.yaml (v1.0.0).
/// Server: https://api.pallicare.aiims.edu/v1
class ApiEndpoints {
  ApiEndpoints._();

  // ---------------------------------------------------------------------------
  // BASE URLs
  // ---------------------------------------------------------------------------

  static const String production = 'https://api.pallicare.aiims.edu/v1';
  static const String staging = 'https://staging-api.pallicare.aiims.edu/v1';
  static const String local = 'http://localhost:8000/v1';

  // ---------------------------------------------------------------------------
  // AUTH
  // ---------------------------------------------------------------------------

  static const String authOtpRequest = '/auth/otp/request';
  static const String authOtpVerify = '/auth/otp/verify';
  static const String authTokenRefresh = '/auth/token/refresh';
  static const String authLogout = '/auth/logout';

  // ---------------------------------------------------------------------------
  // PATIENTS
  // ---------------------------------------------------------------------------

  static const String patientMe = '/patients/me';
  static const String patientOnboarding = '/patients/me/onboarding';

  // ---------------------------------------------------------------------------
  // SYMPTOM LOGS
  // ---------------------------------------------------------------------------

  static const String logs = '/patients/me/logs';

  /// Use: `'${ApiEndpoints.logs}/$logId'`
  static String logById(String logId) => '/patients/me/logs/$logId';

  static const String logsSummaryDaily = '/patients/me/logs/summary/daily';
  static const String logsTrendsWeekly = '/patients/me/logs/trends/weekly';
  static const String logsCorrelations = '/patients/me/logs/correlations';

  // ---------------------------------------------------------------------------
  // MEDICATIONS
  // ---------------------------------------------------------------------------

  static const String medications = '/patients/me/medications';

  /// Use: `ApiEndpoints.medicationById(medId)`
  static String medicationById(String medId) =>
      '/patients/me/medications/$medId';

  /// Medication adherence logs for a specific medication.
  static String medicationLogs(String medId) =>
      '/patients/me/medications/$medId/logs';

  static const String medicationsScheduleToday =
      '/patients/me/medications/schedule/today';

  static const String medicationsMedd = '/patients/me/medications/medd';

  // ---------------------------------------------------------------------------
  // EDUCATION (Learn Module)
  // ---------------------------------------------------------------------------

  static const String educationModules = '/education/modules';

  /// Progress for a specific education module.
  static String educationModuleProgress(String moduleId) =>
      '/education/modules/$moduleId/progress';

  // ---------------------------------------------------------------------------
  // BREATHE
  // ---------------------------------------------------------------------------

  static const String breatheSessions = '/patients/me/breathe/sessions';

  // ---------------------------------------------------------------------------
  // JOURNEY (Goals, Gratitude, Intentions, Milestones, Legacy)
  // ---------------------------------------------------------------------------

  static const String goals = '/patients/me/goals';

  /// Log progress toward a specific goal.
  static String goalLog(String goalId) => '/patients/me/goals/$goalId/log';

  static const String gratitude = '/patients/me/gratitude';
  static const String intentions = '/patients/me/intentions';
  static const String milestones = '/patients/me/milestones';
  static const String legacy = '/patients/me/legacy';

  // ---------------------------------------------------------------------------
  // CAREGIVERS
  // ---------------------------------------------------------------------------

  static const String caregivers = '/patients/me/caregivers';

  /// Permissions for a specific caregiver.
  static String caregiverPermissions(String caregiverId) =>
      '/patients/me/caregivers/$caregiverId/permissions';

  /// Caregiver view: patient schedule.
  static String caregiverPatientSchedule(String patientId) =>
      '/caregivers/me/patients/$patientId/schedule';

  /// Caregiver wellness check-in.
  static const String caregiverWellness = '/caregivers/me/wellness';

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS
  // ---------------------------------------------------------------------------

  static const String notifications = '/notifications';

  /// Mark a notification as read.
  static String notificationRead(String notifId) =>
      '/notifications/$notifId/read';

  static const String notificationPreferences = '/notifications/preferences';
  static const String notificationDevice = '/notifications/device';

  // ---------------------------------------------------------------------------
  // REPORTS
  // ---------------------------------------------------------------------------

  static const String reportDoctor = '/patients/me/reports/doctor';

  /// Get a specific generated report.
  static String reportById(String reportId) =>
      '/patients/me/reports/$reportId';

  /// Share a report with care team.
  static String reportShare(String reportId) =>
      '/patients/me/reports/$reportId/share';

  // ---------------------------------------------------------------------------
  // FILES
  // ---------------------------------------------------------------------------

  static const String filesUpload = '/files/upload';

  // ---------------------------------------------------------------------------
  // SYNC
  // ---------------------------------------------------------------------------

  static const String sync = '/sync';
}
