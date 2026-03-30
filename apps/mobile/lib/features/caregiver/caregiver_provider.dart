import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'task_assignment_card.dart';

// ---------------------------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------------------------

/// Wellness check response options.
enum WellnessResponse { fine, tired, stressed, needHelp }

/// Mood tags for caregiver journal entries.
enum JournalMood { relieved, stressed, grateful, overwhelmed, hopeful }

/// A single caregiver journal entry.
class JournalEntry {
  final String id;
  final String text;
  final JournalMood mood;
  final DateTime dateTime;

  const JournalEntry({
    required this.id,
    required this.text,
    required this.mood,
    required this.dateTime,
  });
}

/// A single visitor log entry.
class VisitorLogEntry {
  final String id;
  final String visitorName;
  final String purpose;
  final DateTime dateTime;
  final String notes;

  const VisitorLogEntry({
    required this.id,
    required this.visitorName,
    required this.purpose,
    required this.dateTime,
    this.notes = '',
  });
}

/// A single Zarit Burden Interview question.
class BurnoutQuestion {
  final String id;
  final String textEn;
  final String textHi;

  const BurnoutQuestion({
    required this.id,
    required this.textEn,
    required this.textHi,
  });
}

/// Adapted Zarit Burden Interview — 12 key questions.
const List<BurnoutQuestion> zbiQuestions = [
  BurnoutQuestion(
    id: 'zbi_1',
    textEn: 'Do you feel your relative asks for more help than needed?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0906\u092A\u0915\u093E \u0930\u093F\u0936\u094D\u0924\u0947\u0926\u093E\u0930 \u091C\u0930\u0942\u0930\u0924 \u0938\u0947 \u0905\u0927\u093F\u0915 \u092E\u0926\u0926 \u092E\u093E\u0901\u0917\u0924\u093E \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_2',
    textEn: 'Do you feel you don\'t have enough time for yourself?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0906\u092A\u0915\u0947 \u092A\u093E\u0938 \u0905\u092A\u0928\u0947 \u0932\u093F\u090F \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0938\u092E\u092F \u0928\u0939\u0940\u0902 \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_3',
    textEn:
        'Do you feel stressed between caregiving and other responsibilities?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A \u0926\u0947\u0916\u092D\u093E\u0932 \u0914\u0930 \u0905\u0928\u094D\u092F \u091C\u093F\u092E\u094D\u092E\u0947\u0926\u093E\u0930\u093F\u092F\u094B\u0902 \u0915\u0947 \u092C\u0940\u091A \u0924\u0928\u093E\u0935 \u092E\u0939\u0938\u0942\u0938 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902?',
  ),
  BurnoutQuestion(
    id: 'zbi_4',
    textEn:
        'Do you feel embarrassed by your relative\'s behavior?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0905\u092A\u0928\u0947 \u0930\u093F\u0936\u094D\u0924\u0947\u0926\u093E\u0930 \u0915\u0947 \u0935\u094D\u092F\u0935\u0939\u093E\u0930 \u0938\u0947 \u0936\u0930\u094D\u092E\u093F\u0902\u0926\u0917\u0940 \u0939\u094B\u0924\u0940 \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_5',
    textEn: 'Do you feel angry when you are around your relative?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0905\u092A\u0928\u0947 \u0930\u093F\u0936\u094D\u0924\u0947\u0926\u093E\u0930 \u0915\u0947 \u092A\u093E\u0938 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0917\u0941\u0938\u094D\u0938\u093E \u0906\u0924\u093E \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_6',
    textEn:
        'Do you feel your health has suffered because of caregiving?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0926\u0947\u0916\u092D\u093E\u0932 \u0938\u0947 \u0906\u092A\u0915\u0947 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u092A\u0930 \u0905\u0938\u0930 \u092A\u0921\u093C\u093E \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_7',
    textEn:
        'Do you feel you don\'t have enough privacy because of caregiving?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0926\u0947\u0916\u092D\u093E\u0932 \u0915\u0947 \u0915\u093E\u0930\u0923 \u0906\u092A\u0915\u0940 \u0928\u093F\u091C\u0924\u093E \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0939\u094B\u0924\u0940 \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_8',
    textEn:
        'Do you feel your social life has suffered because of caregiving?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0926\u0947\u0916\u092D\u093E\u0932 \u0938\u0947 \u0906\u092A\u0915\u093E \u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u091C\u0940\u0935\u0928 \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0939\u0941\u0906 \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_9',
    textEn:
        'Do you feel you have lost control of your life since your relative\'s illness?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u0947 \u092C\u093E\u0926 \u0938\u0947 \u0906\u092A\u0928\u0947 \u0905\u092A\u0928\u0947 \u091C\u0940\u0935\u0928 \u092A\u0930 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 \u0916\u094B \u0926\u093F\u092F\u093E \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_10',
    textEn:
        'Do you feel uncertain about what to do for your relative?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0905\u092A\u0928\u0947 \u0930\u093F\u0936\u094D\u0924\u0947\u0926\u093E\u0930 \u0915\u0947 \u0932\u093F\u090F \u0915\u094D\u092F\u093E \u0915\u0930\u0928\u093E \u0939\u0948 \u092F\u0939 \u0905\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0932\u0917\u0924\u093E \u0939\u0948?',
  ),
  BurnoutQuestion(
    id: 'zbi_11',
    textEn:
        'Do you feel you should be doing more for your relative?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0906\u092A\u0915\u094B \u0905\u092A\u0928\u0947 \u0930\u093F\u0936\u094D\u0924\u0947\u0926\u093E\u0930 \u0915\u0947 \u0932\u093F\u090F \u0914\u0930 \u0905\u0927\u093F\u0915 \u0915\u0930\u0928\u093E \u091A\u093E\u0939\u093F\u090F?',
  ),
  BurnoutQuestion(
    id: 'zbi_12',
    textEn:
        'Do you feel you could do a better job of caregiving?',
    textHi:
        '\u0915\u094D\u092F\u093E \u0906\u092A\u0915\u094B \u0932\u0917\u0924\u093E \u0939\u0948 \u0915\u093F \u0906\u092A \u0926\u0947\u0916\u092D\u093E\u0932 \u0915\u093E \u0915\u093E\u092E \u092C\u0947\u0939\u0924\u0930 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902?',
  ),
];

/// A single caregiver medication entry (caregiver perspective).
class CaregiverMedication {
  final String id;
  final String name;
  final String nameHindi;
  final String dose;
  final String time;
  final bool isOpioid;
  final bool given;

  const CaregiverMedication({
    required this.id,
    required this.name,
    this.nameHindi = '',
    required this.dose,
    required this.time,
    this.isOpioid = false,
    this.given = false,
  });

  CaregiverMedication copyWith({bool? given}) {
    return CaregiverMedication(
      id: id,
      name: name,
      nameHindi: nameHindi,
      dose: dose,
      time: time,
      isOpioid: isOpioid,
      given: given ?? this.given,
    );
  }
}

/// A care schedule entry (which caregiver is on duty when).
class CareScheduleEntry {
  final String caregiverName;
  final String timeSlot;
  final String timeRange;
  final bool isCurrent;

  const CareScheduleEntry({
    required this.caregiverName,
    required this.timeSlot,
    required this.timeRange,
    this.isCurrent = false,
  });
}

/// A single entry in the activity feed.
class ActivityFeedEntry {
  final String actor;
  final String action;
  final String timestamp;

  const ActivityFeedEntry({
    required this.actor,
    required this.action,
    required this.timestamp,
  });
}

/// Education module for caregivers.
class CaregiverEducationModule {
  final String id;
  final String title;
  final String titleHindi;
  final String description;
  final String icon;
  final bool isCompleted;

  const CaregiverEducationModule({
    required this.id,
    required this.title,
    this.titleHindi = '',
    required this.description,
    this.icon = 'book',
    this.isCompleted = false,
  });
}

/// Resource directory entry.
class ResourceEntry {
  final String name;
  final String nameHindi;
  final String phone;
  final String description;

  const ResourceEntry({
    required this.name,
    this.nameHindi = '',
    required this.phone,
    required this.description,
  });
}

/// Today's patient summary.
class PatientSummary {
  final int painScore;
  final String mood;
  final int medsGiven;
  final int medsTotal;

  const PatientSummary({
    required this.painScore,
    required this.mood,
    required this.medsGiven,
    required this.medsTotal,
  });
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

class CaregiverState {
  // Patient info
  final String patientName;
  final String patientNameHindi;

  // Caregiver info
  final String caregiverName;
  final String caregiverNameHindi;
  final String relationship;

  // Wellness check
  final WellnessResponse? todayWellness;
  final int consecutiveTiredCount;
  final bool showWellnessFollowUp;

  // Medications (caregiver view)
  final List<CaregiverMedication> medications;
  final String medicationTimeLabel;

  // Today's summary
  final PatientSummary summary;

  // Care schedule
  final List<CareScheduleEntry> schedule;

  // Activity feed
  final List<ActivityFeedEntry> activityFeed;

  // Education modules
  final List<CaregiverEducationModule> educationModules;

  // Resources
  final List<ResourceEntry> resources;

  // Last logged info
  final String lastLoggedInfo;

  // Journal
  final List<JournalEntry> journalEntries;

  // Burnout assessment
  final List<int> burnoutResponses; // 12 items, 0-4 each
  final int? lastBurnoutScore;
  final DateTime? lastBurnoutDate;

  // Task coordination
  final List<CareTask> tasks;

  // Visitor log
  final List<VisitorLogEntry> visitorLog;

  final bool isLoading;

  const CaregiverState({
    this.patientName = 'Ramesh',
    this.patientNameHindi = '\u0930\u092E\u0947\u0936',
    this.caregiverName = 'Priya',
    this.caregiverNameHindi = '\u092A\u094D\u0930\u093F\u092F\u093E',
    this.relationship = 'daughter',
    this.todayWellness,
    this.consecutiveTiredCount = 0,
    this.showWellnessFollowUp = false,
    this.medications = const [],
    this.medicationTimeLabel = 'evening',
    this.summary = const PatientSummary(
      painScore: 4,
      mood: 'Okay',
      medsGiven: 2,
      medsTotal: 3,
    ),
    this.schedule = const [],
    this.activityFeed = const [],
    this.educationModules = const [],
    this.resources = const [],
    this.lastLoggedInfo = '3 hrs ago',
    this.journalEntries = const [],
    this.burnoutResponses = const [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    this.lastBurnoutScore,
    this.lastBurnoutDate,
    this.tasks = const [],
    this.visitorLog = const [],
    this.isLoading = false,
  });

  /// Computed burnout total from current responses.
  int get burnoutTotal => burnoutResponses.fold(0, (a, b) => a + b);

  CaregiverState copyWith({
    String? patientName,
    String? patientNameHindi,
    String? caregiverName,
    String? caregiverNameHindi,
    String? relationship,
    WellnessResponse? todayWellness,
    int? consecutiveTiredCount,
    bool? showWellnessFollowUp,
    List<CaregiverMedication>? medications,
    String? medicationTimeLabel,
    PatientSummary? summary,
    List<CareScheduleEntry>? schedule,
    List<ActivityFeedEntry>? activityFeed,
    List<CaregiverEducationModule>? educationModules,
    List<ResourceEntry>? resources,
    String? lastLoggedInfo,
    List<JournalEntry>? journalEntries,
    List<int>? burnoutResponses,
    int? lastBurnoutScore,
    DateTime? lastBurnoutDate,
    List<CareTask>? tasks,
    List<VisitorLogEntry>? visitorLog,
    bool? isLoading,
  }) {
    return CaregiverState(
      patientName: patientName ?? this.patientName,
      patientNameHindi: patientNameHindi ?? this.patientNameHindi,
      caregiverName: caregiverName ?? this.caregiverName,
      caregiverNameHindi: caregiverNameHindi ?? this.caregiverNameHindi,
      relationship: relationship ?? this.relationship,
      todayWellness: todayWellness ?? this.todayWellness,
      consecutiveTiredCount:
          consecutiveTiredCount ?? this.consecutiveTiredCount,
      showWellnessFollowUp:
          showWellnessFollowUp ?? this.showWellnessFollowUp,
      medications: medications ?? this.medications,
      medicationTimeLabel: medicationTimeLabel ?? this.medicationTimeLabel,
      summary: summary ?? this.summary,
      schedule: schedule ?? this.schedule,
      activityFeed: activityFeed ?? this.activityFeed,
      educationModules: educationModules ?? this.educationModules,
      resources: resources ?? this.resources,
      lastLoggedInfo: lastLoggedInfo ?? this.lastLoggedInfo,
      journalEntries: journalEntries ?? this.journalEntries,
      burnoutResponses: burnoutResponses ?? this.burnoutResponses,
      lastBurnoutScore: lastBurnoutScore ?? this.lastBurnoutScore,
      lastBurnoutDate: lastBurnoutDate ?? this.lastBurnoutDate,
      tasks: tasks ?? this.tasks,
      visitorLog: visitorLog ?? this.visitorLog,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class CaregiverNotifier extends StateNotifier<CaregiverState> {
  CaregiverNotifier() : super(const CaregiverState()) {
    _loadMockData();
  }

  void _loadMockData() {
    state = state.copyWith(isLoading: true);

    final meds = [
      const CaregiverMedication(
        id: 'cm_1',
        name: 'Morphine SR',
        nameHindi: '\u092E\u0949\u0930\u094D\u092B\u0940\u0928 \u090F\u0938\u0906\u0930',
        dose: '30mg',
        time: '8:00 PM',
        isOpioid: true,
        given: false,
      ),
      const CaregiverMedication(
        id: 'cm_2',
        name: 'Paracetamol',
        nameHindi: '\u092A\u0948\u0930\u093E\u0938\u093F\u091F\u093E\u092E\u094B\u0932',
        dose: '500mg',
        time: '8:00 PM',
        given: true,
      ),
      const CaregiverMedication(
        id: 'cm_3',
        name: 'Lactulose',
        nameHindi: '\u0932\u0948\u0915\u094D\u091F\u0941\u0932\u094B\u091C',
        dose: '15ml',
        time: '8:00 PM',
        given: false,
      ),
    ];

    final schedule = [
      const CareScheduleEntry(
        caregiverName: 'Priya',
        timeSlot: 'Morning',
        timeRange: '6 AM - 2 PM',
        isCurrent: true,
      ),
      const CareScheduleEntry(
        caregiverName: 'Rahul',
        timeSlot: 'Afternoon',
        timeRange: '2 PM - 10 PM',
      ),
      const CareScheduleEntry(
        caregiverName: 'Night Nurse',
        timeSlot: 'Night',
        timeRange: '10 PM - 6 AM',
      ),
    ];

    final feed = [
      const ActivityFeedEntry(
        actor: 'Priya',
        action: 'logged pain score 4/10',
        timestamp: '9:15 AM',
      ),
      const ActivityFeedEntry(
        actor: 'Priya',
        action: 'gave Paracetamol 500mg',
        timestamp: '8:10 AM',
      ),
      const ActivityFeedEntry(
        actor: 'Rahul',
        action: 'updated mood to Okay',
        timestamp: 'Yesterday 4:30 PM',
      ),
      const ActivityFeedEntry(
        actor: 'Dr. Sharma',
        action: 'reviewed medication chart',
        timestamp: 'Yesterday 11:00 AM',
      ),
    ];

    final modules = const [
      CaregiverEducationModule(
        id: 'C.1',
        title: 'Understanding Their Pain',
        titleHindi: '\u0909\u0928\u0915\u0947 \u0926\u0930\u094D\u0926 \u0915\u094B \u0938\u092E\u091D\u0928\u093E',
        description: 'Learn how to recognize and assess pain in your loved one.',
      ),
      CaregiverEducationModule(
        id: 'C.2',
        title: 'Medication Safety',
        titleHindi: '\u0926\u0935\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093E',
        description: 'Safe handling, storage, and administration of medications.',
      ),
      CaregiverEducationModule(
        id: 'C.3',
        title: 'Opioid Truth',
        titleHindi: '\u0913\u092A\u093F\u0913\u0907\u0921 \u0938\u091A',
        description: 'Facts vs myths about opioid medications in palliative care.',
      ),
      CaregiverEducationModule(
        id: 'C.4',
        title: 'Caregiver Burnout',
        titleHindi: '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E \u0925\u0915\u093E\u0928',
        description: 'Recognizing and preventing exhaustion in yourself.',
      ),
      CaregiverEducationModule(
        id: 'C.5',
        title: 'Hard Conversations',
        titleHindi: '\u0915\u0920\u093F\u0928 \u092C\u093E\u0924\u091A\u0940\u0924',
        description: 'How to talk about prognosis, wishes, and end-of-life plans.',
      ),
      CaregiverEducationModule(
        id: 'C.6',
        title: 'Asking for Help',
        titleHindi: '\u092E\u0926\u0926 \u092E\u093E\u0901\u0917\u0928\u093E',
        description: 'Building your support network and sharing responsibilities.',
      ),
      CaregiverEducationModule(
        id: 'C.7',
        title: 'When Pain Can\'t Be Controlled',
        titleHindi: '\u091C\u092C \u0926\u0930\u094D\u0926 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0928 \u0939\u094B',
        description: 'Understanding refractory symptoms and next steps.',
      ),
      CaregiverEducationModule(
        id: 'C.8',
        title: 'Grief and Preparation',
        titleHindi: '\u0936\u094B\u0915 \u0914\u0930 \u0924\u0948\u092F\u093E\u0930\u0940',
        description: 'Anticipatory grief and preparing for what lies ahead.',
      ),
    ];

    final resources = const [
      ResourceEntry(
        name: 'AIIMS Palliative Care Helpline',
        nameHindi: '\u090F\u092E\u094D\u0938 \u092A\u0948\u0932\u093F\u090F\u091F\u093F\u0935 \u0915\u0947\u092F\u0930 \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928',
        phone: '011-2658-8500',
        description: 'Mon-Fri 9 AM - 5 PM',
      ),
      ResourceEntry(
        name: 'Emergency',
        nameHindi: '\u0906\u092A\u093E\u0924\u0915\u093E\u0932',
        phone: '112',
        description: 'National Emergency Number',
      ),
      ResourceEntry(
        name: 'Caregiver Support Group',
        nameHindi: '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E \u0938\u0939\u093E\u092F\u0924\u093E \u0938\u092E\u0942\u0939',
        phone: '1800-599-0019',
        description: 'Toll-free, 24/7',
      ),
      ResourceEntry(
        name: 'iCall (TISS)',
        nameHindi: '\u0906\u0908\u0915\u0949\u0932 \u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F',
        phone: '9152987821',
        description: 'Mental health counselling, Mon-Sat 8 AM - 10 PM',
      ),
      ResourceEntry(
        name: 'Vandrevala Foundation',
        nameHindi: '\u0935\u0902\u0926\u094D\u0930\u0947\u0935\u093E\u0932\u093E \u092B\u093E\u0909\u0902\u0921\u0947\u0936\u0928',
        phone: '1860-2662-345',
        description: 'Mental health helpline, 24/7',
      ),
    ];

    state = state.copyWith(
      medications: meds,
      schedule: schedule,
      activityFeed: feed,
      educationModules: modules,
      resources: resources,
      isLoading: false,
    );
  }

  // -----------------------------------------------------------------------
  // WELLNESS CHECK
  // -----------------------------------------------------------------------

  void recordWellness(WellnessResponse response) {
    int tiredCount = state.consecutiveTiredCount;
    bool showFollowUp = false;

    switch (response) {
      case WellnessResponse.fine:
        tiredCount = 0;
        // Record silently
        break;
      case WellnessResponse.tired:
        tiredCount++;
        if (tiredCount >= 3) {
          showFollowUp = true; // show self-care resource card
        }
        break;
      case WellnessResponse.stressed:
        tiredCount = 0;
        showFollowUp = true; // show "Would you like to talk?"
        break;
      case WellnessResponse.needHelp:
        tiredCount = 0;
        showFollowUp = true; // show care team + helpline
        break;
    }

    state = state.copyWith(
      todayWellness: response,
      consecutiveTiredCount: tiredCount,
      showWellnessFollowUp: showFollowUp,
    );
  }

  void skipWellnessCheck() {
    state = state.copyWith(
      todayWellness: WellnessResponse.fine,
      showWellnessFollowUp: false,
    );
  }

  void dismissWellnessFollowUp() {
    state = state.copyWith(showWellnessFollowUp: false);
  }

  // -----------------------------------------------------------------------
  // MEDICATIONS
  // -----------------------------------------------------------------------

  void markMedicationGiven(String medicationId) {
    final meds = state.medications.map((m) {
      if (m.id == medicationId) return m.copyWith(given: true);
      return m;
    }).toList();

    final givenCount = meds.where((m) => m.given).length;

    state = state.copyWith(
      medications: meds,
      summary: PatientSummary(
        painScore: state.summary.painScore,
        mood: state.summary.mood,
        medsGiven: givenCount,
        medsTotal: meds.length,
      ),
    );
  }

  void markMedicationLater(String medicationId) {
    // No-op for now; medication stays in pending state
  }

  // -----------------------------------------------------------------------
  // JOURNAL
  // -----------------------------------------------------------------------

  void addJournalEntry(String text, JournalMood mood) {
    final entry = JournalEntry(
      id: 'j_${DateTime.now().millisecondsSinceEpoch}',
      text: text,
      mood: mood,
      dateTime: DateTime.now(),
    );
    state = state.copyWith(
      journalEntries: [entry, ...state.journalEntries],
    );
  }

  void deleteJournalEntry(String entryId) {
    state = state.copyWith(
      journalEntries:
          state.journalEntries.where((e) => e.id != entryId).toList(),
    );
  }

  // -----------------------------------------------------------------------
  // BURNOUT ASSESSMENT
  // -----------------------------------------------------------------------

  void setBurnoutResponse(int questionIndex, int value) {
    final responses = List<int>.from(state.burnoutResponses);
    responses[questionIndex] = value.clamp(0, 4);
    state = state.copyWith(burnoutResponses: responses);
  }

  void submitBurnoutAssessment() {
    final total = state.burnoutResponses.fold<int>(0, (a, b) => a + b);
    state = state.copyWith(
      lastBurnoutScore: total,
      lastBurnoutDate: DateTime.now(),
    );
  }

  void resetBurnoutResponses() {
    state = state.copyWith(
      burnoutResponses: List.filled(12, 0),
    );
  }

  // -----------------------------------------------------------------------
  // TASK COORDINATION
  // -----------------------------------------------------------------------

  void addTask(CareTask task) {
    state = state.copyWith(tasks: [...state.tasks, task]);
  }

  void toggleTask(String taskId) {
    final tasks = state.tasks.map((t) {
      if (t.id == taskId) return t.copyWith(isCompleted: !t.isCompleted);
      return t;
    }).toList();
    state = state.copyWith(tasks: tasks);
  }

  void deleteTask(String taskId) {
    state = state.copyWith(
      tasks: state.tasks.where((t) => t.id != taskId).toList(),
    );
  }

  // -----------------------------------------------------------------------
  // VISITOR LOG
  // -----------------------------------------------------------------------

  void addVisitorEntry(String name, String purpose, {String notes = ''}) {
    final entry = VisitorLogEntry(
      id: 'v_${DateTime.now().millisecondsSinceEpoch}',
      visitorName: name,
      purpose: purpose,
      dateTime: DateTime.now(),
      notes: notes,
    );
    state = state.copyWith(
      visitorLog: [entry, ...state.visitorLog],
    );
  }

  void deleteVisitorEntry(String entryId) {
    state = state.copyWith(
      visitorLog:
          state.visitorLog.where((e) => e.id != entryId).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final caregiverProvider =
    StateNotifierProvider<CaregiverNotifier, CaregiverState>(
  (ref) => CaregiverNotifier(),
);
