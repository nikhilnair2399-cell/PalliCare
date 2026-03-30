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
  static const String local = 'http://localhost:3001/api/v1';

  /// Environment from build flag: --dart-define=ENV=production
  static const String _env = String.fromEnvironment('ENV', defaultValue: 'local');

  /// Current base URL — selected automatically from build flag.
  /// Build commands:
  ///   Local:      flutter run
  ///   Staging:    flutter run --dart-define=ENV=staging
  ///   Production: flutter build apk --dart-define=ENV=production
  static String get baseUrl {
    switch (_env) {
      case 'production':
        return production;
      case 'staging':
        return staging;
      default:
        return local;
    }
  }

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

  static const String educationModules = '/learn/modules';

  /// Get a specific education module.
  static String educationModuleById(String moduleId) =>
      '/learn/modules/$moduleId';

  /// Get modules with my progress.
  static const String educationMyProgress = '/patients/me/learn';

  /// Get overall education progress.
  static const String educationOverview = '/patients/me/learn/overview';

  /// Update progress for a specific module.
  static String educationModuleProgress(String moduleId) =>
      '/patients/me/learn/$moduleId/progress';

  // ---------------------------------------------------------------------------
  // DISEASE LIBRARY (Psychoeducation)
  // ---------------------------------------------------------------------------

  /// Get all disease categories/classes.
  static const String diseaseLibraryCategories = '/learn/library/categories';

  /// Get diseases in a specific class.
  static String diseasesByClass(String className) =>
      '/learn/library/diseases?class=$className';

  /// Get a specific disease entry.
  static String diseaseById(String diseaseId) =>
      '/learn/library/diseases/$diseaseId';

  /// Search diseases across all content.
  static const String diseaseSearch = '/learn/library/search';

  /// Get patient bookmarks.
  static const String diseaseBookmarks = '/patients/me/learn/bookmarks';

  /// Toggle bookmark for a disease.
  static String diseaseBookmarkToggle(String diseaseId) =>
      '/patients/me/learn/bookmarks/$diseaseId';

  /// Get FAQs (optionally filtered by category).
  static const String faqs = '/learn/faqs';

  /// Get FAQs by category.
  static String faqsByCategory(String category) =>
      '/learn/faqs?category=$category';

  // ---------------------------------------------------------------------------
  // BREATHE
  // ---------------------------------------------------------------------------

  static const String breatheSessions = '/patients/me/breathe';
  static const String breatheStats = '/patients/me/breathe/stats';

  // ---------------------------------------------------------------------------
  // JOURNEY (Goals, Gratitude, Intentions, Milestones, Legacy)
  // ---------------------------------------------------------------------------

  static const String goals = '/patients/me/goals';

  /// Log progress toward a specific goal.
  static String goalLog(String goalId) => '/patients/me/goals/$goalId/log';

  static const String gratitude = '/patients/me/gratitude';
  static const String gratitudeToday = '/patients/me/gratitude/today';
  static const String gratitudeStreak = '/patients/me/gratitude/streak';
  static const String intentions = '/patients/me/intentions';
  static const String intentionToday = '/patients/me/intentions/today';

  /// Update intention completion status for a date.
  static String intentionStatus(String date) =>
      '/patients/me/intentions/$date/status';

  static const String milestones = '/patients/me/milestones';
  static const String milestonesUnseenCount = '/patients/me/milestones/unseen-count';

  /// Mark a specific milestone as seen.
  static String milestoneSeen(String id) => '/patients/me/milestones/$id/seen';
  static const String milestonesMarkAllSeen = '/patients/me/milestones/mark-all-seen';

  static const String wellnessSummary = '/patients/me/wellness/summary';
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
  // MESSAGES
  // ---------------------------------------------------------------------------

  static const String messages = '/messages';
  static const String messagesUnreadCount = '/messages/unread-count';

  /// Mark a message as read.
  static String messageRead(String id) => '/messages/$id/read';

  // ---------------------------------------------------------------------------
  // CONSENT (DPDPA 2023)
  // ---------------------------------------------------------------------------

  static const String consent = '/consent';
  static const String consentAll = '/consent/all';

  /// Grant consent.
  static String consentGrant = '/consent';

  /// Revoke consent by type.
  static String consentRevoke(String type) => '/consent/$type';

  // ---------------------------------------------------------------------------
  // DEVICES
  // ---------------------------------------------------------------------------

  static const String devices = '/devices';
  static const String deviceRegister = '/devices/register';

  // ---------------------------------------------------------------------------
  // FILES / UPLOADS
  // ---------------------------------------------------------------------------

  static const String uploadsPresign = '/uploads/presign';
  static const String uploadsPresignDownload = '/uploads/presign/download';

  // ---------------------------------------------------------------------------
  // MEDICATION DATABASE (Reference)
  // ---------------------------------------------------------------------------

  static const String medicationDbSearch = '/medication-db/search';
  static const String medicationDbPalliative = '/medication-db/palliative';
  static const String medicationDbOpioidRef = '/medication-db/opioid-reference';

  // ---------------------------------------------------------------------------
  // COMMUNITY FORUM
  // ---------------------------------------------------------------------------

  static const String communityChannels = '/community/channels';

  /// Get a specific channel's details.
  static String communityChannelById(String channelId) =>
      '/community/channels/$channelId';

  /// Posts within a channel.
  static String communityChannelPosts(String channelId) =>
      '/community/channels/$channelId/posts';

  /// Create a post in a channel.
  static String communityCreatePost(String channelId) =>
      '/community/channels/$channelId/posts';

  /// Single post detail.
  static String communityPostById(String postId) =>
      '/community/posts/$postId';

  /// Replies on a post.
  static String communityPostReplies(String postId) =>
      '/community/posts/$postId/replies';

  /// Toggle support reaction on a post.
  static String communityPostSupport(String postId) =>
      '/community/posts/$postId/support';

  /// Report a post.
  static String communityPostReport(String postId) =>
      '/community/posts/$postId/report';

  /// Comfort cards catalog.
  static const String communityComfortCards = '/community/comfort-cards';

  /// Moderation queue (clinician dashboard).
  static const String communityModerationQueue = '/community/moderation/queue';

  /// Approve / reject a flagged post.
  static String communityModeratePost(String postId) =>
      '/community/moderation/posts/$postId';

  /// Join / leave a channel.
  static String communityJoinChannel(String channelId) =>
      '/community/channels/$channelId/join';
  static String communityLeaveChannel(String channelId) =>
      '/community/channels/$channelId/leave';

  // ---------------------------------------------------------------------------
  // SYNC
  // ---------------------------------------------------------------------------

  static const String sync = '/sync';
}
