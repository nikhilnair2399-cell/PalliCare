import 'package:flutter_riverpod/flutter_riverpod.dart';

// ---------------------------------------------------------------------------
// MODELS
// ---------------------------------------------------------------------------

enum ModuleStatus { locked, available, inProgress, completed }

enum ContentPhase { phase1, phase2, phase3 }

enum FeedbackResponse { helpful, somewhat, skipped }

class LearnModule {
  final String id;
  final String number; // e.g. "1.1"
  final String titleEn;
  final String titleHi;
  final int durationMinutes;
  final ContentPhase phase;
  final ModuleStatus status;
  final double progress; // 0.0 to 1.0
  final bool hasAudio;
  final bool isSensitive; // Phase 3 gating
  final String? actionLink; // Link to Breathe module etc.
  final String contentBody; // Markdown-like body text
  final FeedbackResponse? feedback;

  const LearnModule({
    required this.id,
    required this.number,
    required this.titleEn,
    required this.titleHi,
    required this.durationMinutes,
    required this.phase,
    this.status = ModuleStatus.available,
    this.progress = 0.0,
    this.hasAudio = true,
    this.isSensitive = false,
    this.actionLink,
    this.contentBody = '',
    this.feedback,
  });

  LearnModule copyWith({
    ModuleStatus? status,
    double? progress,
    FeedbackResponse? feedback,
  }) {
    return LearnModule(
      id: id,
      number: number,
      titleEn: titleEn,
      titleHi: titleHi,
      durationMinutes: durationMinutes,
      phase: phase,
      status: status ?? this.status,
      progress: progress ?? this.progress,
      hasAudio: hasAudio,
      isSensitive: isSensitive,
      actionLink: actionLink,
      contentBody: contentBody,
      feedback: feedback ?? this.feedback,
    );
  }
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

class LearnState {
  final List<LearnModule> modules;
  final String? currentModuleId;
  final bool isLoading;
  final DateTime appInstallDate;

  const LearnState({
    this.modules = const [],
    this.currentModuleId,
    this.isLoading = false,
    required this.appInstallDate,
  });

  LearnState copyWith({
    List<LearnModule>? modules,
    String? currentModuleId,
    bool? isLoading,
    DateTime? appInstallDate,
  }) {
    return LearnState(
      modules: modules ?? this.modules,
      currentModuleId: currentModuleId ?? this.currentModuleId,
      isLoading: isLoading ?? this.isLoading,
      appInstallDate: appInstallDate ?? this.appInstallDate,
    );
  }

  LearnModule? get currentModule {
    if (currentModuleId == null) return null;
    try {
      return modules.firstWhere((m) => m.id == currentModuleId);
    } catch (_) {
      return null;
    }
  }

  List<LearnModule> get phase1Modules =>
      modules.where((m) => m.phase == ContentPhase.phase1).toList();

  List<LearnModule> get phase2Modules =>
      modules.where((m) => m.phase == ContentPhase.phase2).toList();

  List<LearnModule> get phase3Modules =>
      modules.where((m) => m.phase == ContentPhase.phase3).toList();

  LearnModule? get continueModule {
    try {
      return modules.firstWhere((m) => m.status == ModuleStatus.inProgress);
    } catch (_) {
      return null;
    }
  }

  List<LearnModule> get recommendedModules =>
      modules.where((m) => m.status == ModuleStatus.available).take(3).toList();

  int get completedCount =>
      modules.where((m) => m.status == ModuleStatus.completed).length;

  int get totalCount => modules.length;

  // Phase unlock logic based on days since install
  int get daysSinceInstall =>
      DateTime.now().difference(appInstallDate).inDays;

  bool get isPhase1Unlocked => true; // always unlocked
  bool get isPhase2Unlocked => daysSinceInstall >= 14;
  bool get isPhase3Unlocked => daysSinceInstall >= 42;

  int get daysUntilPhase2 =>
      isPhase2Unlocked ? 0 : 14 - daysSinceInstall;
  int get daysUntilPhase3 =>
      isPhase3Unlocked ? 0 : 42 - daysSinceInstall;

  bool isPhaseUnlocked(ContentPhase phase) {
    switch (phase) {
      case ContentPhase.phase1:
        return isPhase1Unlocked;
      case ContentPhase.phase2:
        return isPhase2Unlocked;
      case ContentPhase.phase3:
        return isPhase3Unlocked;
    }
  }

  int daysUntilPhaseUnlock(ContentPhase phase) {
    switch (phase) {
      case ContentPhase.phase1:
        return 0;
      case ContentPhase.phase2:
        return daysUntilPhase2;
      case ContentPhase.phase3:
        return daysUntilPhase3;
    }
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class LearnNotifier extends StateNotifier<LearnState> {
  LearnNotifier()
      : super(LearnState(
          // Mock install date: 20 days ago so Phase 2 is unlocked, Phase 3 is locked
          appInstallDate: DateTime.now().subtract(const Duration(days: 20)),
        )) {
    _loadModules();
  }

  void _loadModules() {
    final modules = _mockModules.map((m) {
      // Apply phase locking
      if (!state.isPhaseUnlocked(m.phase) &&
          m.status != ModuleStatus.completed) {
        return m.copyWith(status: ModuleStatus.locked);
      }
      return m;
    }).toList();

    state = state.copyWith(
      modules: modules,
      isLoading: false,
    );
  }

  void selectModule(String moduleId) {
    state = state.copyWith(currentModuleId: moduleId);
  }

  void startModule(String moduleId) {
    final updated = state.modules.map((m) {
      if (m.id == moduleId && m.status != ModuleStatus.locked) {
        return m.copyWith(status: ModuleStatus.inProgress, progress: 0.1);
      }
      return m;
    }).toList();
    state = state.copyWith(modules: updated, currentModuleId: moduleId);
  }

  void updateProgress(String moduleId, double progress) {
    final updated = state.modules.map((m) {
      if (m.id == moduleId) {
        final newStatus =
            progress >= 1.0 ? ModuleStatus.completed : ModuleStatus.inProgress;
        return m.copyWith(
            status: newStatus, progress: progress.clamp(0.0, 1.0));
      }
      return m;
    }).toList();
    state = state.copyWith(modules: updated);
  }

  void completeModule(String moduleId) {
    updateProgress(moduleId, 1.0);
  }

  void submitFeedback(String moduleId, FeedbackResponse feedback) {
    final updated = state.modules.map((m) {
      if (m.id == moduleId) {
        return m.copyWith(feedback: feedback);
      }
      return m;
    }).toList();
    state = state.copyWith(modules: updated);
  }

  /// Returns the next module after the given [moduleId], or null if it is
  /// the last module in the list.
  LearnModule? nextModule(String moduleId) {
    final idx = state.modules.indexWhere((m) => m.id == moduleId);
    if (idx < 0 || idx >= state.modules.length - 1) return null;
    final next = state.modules[idx + 1];
    if (next.status == ModuleStatus.locked) return null;
    return next;
  }

  // -------------------------------------------------------------------------
  // MOCK DATA
  // -------------------------------------------------------------------------

  static final List<LearnModule> _mockModules = [
    // Phase 1: Understanding Your Pain
    const LearnModule(
      id: 'p1_01',
      number: '1.1',
      titleEn: 'What is Pain?',
      titleHi: '\u0926\u0930\u094D\u0926 \u0915\u094D\u092F\u093E \u0939\u0948?',
      durationMinutes: 2,
      phase: ContentPhase.phase1,
      status: ModuleStatus.completed,
      progress: 1.0,
      contentBody:
          'Pain is your body\'s way of telling you something needs attention. '
          'But pain in serious illness is different from everyday pain.\n\n'
          'When you have a serious illness, pain can come from many sources: '
          'the illness itself, treatments, or even worry and stress.\n\n'
          'Understanding your pain is the first step to managing it. '
          'You deserve to have your pain taken seriously, and there are many '
          'ways to help.\n\n'
          'Remember: Reporting your pain honestly helps your care team help you better.',
    ),
    const LearnModule(
      id: 'p1_02',
      number: '1.2',
      titleEn: 'Pain is Not Just Physical',
      titleHi:
          '\u0926\u0930\u094D\u0926 \u0938\u093F\u0930\u094D\u092B\u093C \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0928\u0939\u0940\u0902 \u0939\u0948',
      durationMinutes: 3,
      phase: ContentPhase.phase1,
      status: ModuleStatus.completed,
      progress: 1.0,
      contentBody:
          'Pain affects your whole being, not just your body. Dame Cicely Saunders '
          'called this "total pain" \u2014 it includes physical, emotional, social, '
          'and spiritual dimensions.\n\n'
          'You might notice that when you feel sad or anxious, your pain feels '
          'worse. This is not imagined \u2014 it is real. Your emotions and your '
          'body are deeply connected.\n\n'
          'Addressing all aspects of pain \u2014 not just the physical part \u2014 '
          'can help you feel more comfortable overall.',
    ),
    const LearnModule(
      id: 'p1_03',
      number: '1.3',
      titleEn: 'The Pain-Sleep Triangle',
      titleHi:
          '\u0926\u0930\u094D\u0926-\u0928\u0940\u0902\u0926-\u092E\u0928 \u0915\u093E \u0930\u093F\u0936\u094D\u0924\u093E',
      durationMinutes: 2,
      phase: ContentPhase.phase1,
      status: ModuleStatus.inProgress,
      progress: 0.6,
      actionLink: '/breathe',
      contentBody:
          'Pain, sleep, and mood form a triangle \u2014 each one affects the other two.\n\n'
          'When pain keeps you awake at night, poor sleep makes your pain worse '
          'the next day. And when you are tired and hurting, your mood drops, '
          'which can make everything feel harder.\n\n'
          'The good news: improving any one side of the triangle can help the '
          'other two. Even small improvements in sleep or mood can reduce how '
          'much pain bothers you.\n\n'
          'Try a gentle breathing exercise before bed to start breaking the cycle.',
    ),
    const LearnModule(
      id: 'p1_04',
      number: '1.4',
      titleEn: 'Why Pain Changes Day to Day',
      titleHi:
          '\u0926\u0930\u094D\u0926 \u0939\u0930 \u0926\u093F\u0928 \u0915\u094D\u092F\u094B\u0902 \u092C\u0926\u0932\u0924\u093E \u0939\u0948',
      durationMinutes: 2,
      phase: ContentPhase.phase1,
      contentBody:
          'You may notice your pain is different from day to day, or even hour '
          'to hour. This is completely normal.\n\n'
          'Many things affect pain levels: how well you slept, what you ate, '
          'your activity level, the weather, your emotions, and even the time of day.\n\n'
          'Tracking your pain patterns can help you and your care team identify '
          'what makes your pain better or worse. Over time, this knowledge '
          'gives you more control.',
    ),
    const LearnModule(
      id: 'p1_05',
      number: '1.5',
      titleEn: 'You Are Not Your Pain',
      titleHi:
          '\u0906\u092A \u0905\u092A\u0928\u0947 \u0926\u0930\u094D\u0926 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902',
      durationMinutes: 3,
      phase: ContentPhase.phase1,
      contentBody:
          'When pain is constant, it can start to feel like it defines who you are. '
          'But you are so much more than your pain.\n\n'
          'You are still the person your family loves. You still have thoughts, '
          'dreams, and things that bring you joy. Pain is something you experience '
          '\u2014 it is not who you are.\n\n'
          'Learning to separate yourself from your pain, even a little, '
          'can create space for comfort and peace.',
    ),

    // Phase 2: Tools for Your Journey
    const LearnModule(
      id: 'p2_01',
      number: '2.1',
      titleEn: 'Breathing Through Pain',
      titleHi:
          '\u0926\u0930\u094D\u0926 \u092E\u0947\u0902 \u0938\u093E\u0901\u0938 \u0915\u0940 \u0924\u093E\u0915\u093C\u0924',
      durationMinutes: 2,
      phase: ContentPhase.phase2,
      actionLink: '/breathe',
      contentBody:
          'When pain flares, your body tenses up and your breathing becomes '
          'shallow. This actually makes pain worse.\n\n'
          'Slow, deep breathing activates your body\'s natural calming system. '
          'It won\'t take the pain away completely, but it can turn down the '
          'volume.\n\n'
          'Try this: Breathe in slowly for 4 counts, hold gently for 4 counts, '
          'then breathe out slowly for 6 counts. Even 3 rounds can help.\n\n'
          'Use the Breathe tool in this app for a guided experience.',
    ),
    const LearnModule(
      id: 'p2_02',
      number: '2.2',
      titleEn: 'The Worry Cycle',
      titleHi:
          '\u091A\u093F\u0902\u0924\u093E \u0915\u093E \u091A\u0915\u094D\u0930',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Worry about pain can create a cycle: you worry about pain getting worse, '
          'so you tense up, which makes pain worse, which makes you worry more.\n\n'
          'Recognizing this cycle is the first step to breaking it. You cannot '
          'stop all worry, but you can learn to notice when it is happening.\n\n'
          'When you notice the worry cycle starting, try naming it: "I am in the '
          'worry cycle right now." Just this simple act of recognition can help '
          'you step back and choose a different response.',
    ),
    const LearnModule(
      id: 'p2_03',
      number: '2.3',
      titleEn: 'Rest is Not Laziness',
      titleHi:
          '\u0906\u0930\u093E\u092E \u0906\u0932\u0938 \u0928\u0939\u0940\u0902 \u0939\u0948',
      durationMinutes: 2,
      phase: ContentPhase.phase2,
      contentBody:
          'Many people feel guilty about resting, especially when others are '
          'taking care of them. But rest is not laziness \u2014 it is medicine.\n\n'
          'Your body needs rest to manage pain, heal, and maintain its strength. '
          'Pushing through pain without rest often makes things worse.\n\n'
          'Give yourself permission to rest. It is one of the most important '
          'things you can do for yourself right now.',
    ),
    const LearnModule(
      id: 'p2_04',
      number: '2.4',
      titleEn: 'Talking About Your Pain',
      titleHi:
          '\u0905\u092A\u0928\u0947 \u0926\u0930\u094D\u0926 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092C\u093E\u0924 \u0915\u0930\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Talking about your pain can be hard. You might not want to worry '
          'your family, or you might feel that no one truly understands.\n\n'
          'But keeping pain to yourself can make it feel bigger and lonelier. '
          'Sharing what you feel \u2014 even a little \u2014 can lighten the burden.\n\n'
          'Tips for talking about pain:\n'
          '\u2022 Use a 0-10 scale to describe intensity\n'
          '\u2022 Describe what it feels like (sharp, dull, burning)\n'
          '\u2022 Share what makes it better or worse\n'
          '\u2022 Tell your doctor if your pain is not controlled',
    ),
    const LearnModule(
      id: 'p2_05',
      number: '2.5',
      titleEn: 'Medication Myths',
      titleHi:
          '\u0926\u0935\u093E \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092D\u094D\u0930\u092E',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Many people have fears about pain medication. Let us address some '
          'common myths.\n\n'
          'Myth: "If I take strong medicine now, it won\'t work later."\n'
          'Fact: Your doctor can adjust doses. Taking medicine now does not '
          'mean it will stop working.\n\n'
          'Myth: "Strong pain medicine means I am dying."\n'
          'Fact: Strong medicine means your pain needs stronger treatment. '
          'It is about comfort, not prognosis.\n\n'
          'Myth: "I will become addicted."\n'
          'Fact: When taken as prescribed for pain, addiction is very rare. '
          'Your comfort matters.',
    ),
    const LearnModule(
      id: 'p2_06',
      number: '2.6',
      titleEn: 'Activity Pacing',
      titleHi:
          '\u0915\u093E\u092E \u0914\u0930 \u0906\u0930\u093E\u092E \u0915\u093E \u0938\u0902\u0924\u0941\u0932\u0928',
      durationMinutes: 2,
      phase: ContentPhase.phase2,
      contentBody:
          'On good days, it is tempting to do everything at once. But this '
          'often leads to a "boom and bust" pattern \u2014 doing too much, '
          'then crashing.\n\n'
          'Activity pacing means spreading your activities throughout the day '
          'with planned rest breaks in between.\n\n'
          'Tips for pacing:\n'
          '\u2022 Break tasks into smaller steps\n'
          '\u2022 Rest before you feel exhausted\n'
          '\u2022 Alternate between sitting and standing activities\n'
          '\u2022 It is okay to say "I will do the rest tomorrow"',
    ),
    const LearnModule(
      id: 'p2_07',
      number: '2.7',
      titleEn: 'Asking for Help',
      titleHi:
          '\u092E\u0926\u0926 \u092E\u093E\u0901\u0917\u0928\u093E \u0920\u0940\u0915 \u0939\u0948',
      durationMinutes: 2,
      phase: ContentPhase.phase2,
      contentBody:
          'Asking for help is a sign of strength, not weakness. Everyone needs '
          'help sometimes, and allowing others to support you can strengthen '
          'your relationships.\n\n'
          'Many people around you want to help but do not know how. Giving '
          'them specific tasks can make it easier for everyone.\n\n'
          'Instead of "I need help," try:\n'
          '\u2022 "Could you bring me a glass of water?"\n'
          '\u2022 "Would you sit with me for 10 minutes?"\n'
          '\u2022 "Can you help me get to my appointment?"',
    ),

    // Phase 3: Living with Purpose
    const LearnModule(
      id: 'p3_01',
      number: '3.1',
      titleEn: 'Finding Meaning',
      titleHi: '\u0905\u0930\u094D\u0925 \u0916\u094B\u091C\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Even in the midst of illness and pain, many people find moments of '
          'meaning and purpose.\n\n'
          'Meaning can come from small things: a conversation with a loved one, '
          'watching the sunrise, teaching something to a grandchild, or simply '
          'being present.\n\n'
          'You do not need to do great things to have a meaningful day. '
          'Sometimes, the most meaningful thing is just being here.',
    ),
    const LearnModule(
      id: 'p3_02',
      number: '3.2',
      titleEn: 'Acceptance is Not Giving Up',
      titleHi:
          '\u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0928\u093E \u0939\u093E\u0930 \u0928\u0939\u0940\u0902 \u0939\u0948',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Acceptance does not mean giving up or losing hope. It means '
          'acknowledging your situation so you can focus your energy on what '
          'matters most.\n\n'
          'Fighting against reality takes enormous energy. Acceptance frees '
          'that energy for living, loving, and finding comfort.\n\n'
          'Acceptance and hope can exist together. You can accept where you '
          'are and still hope for good days, peaceful moments, and connection.',
    ),
    const LearnModule(
      id: 'p3_03',
      number: '3.3',
      titleEn: 'Grief is Normal',
      titleHi:
          '\u0936\u094B\u0915 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'It is natural to grieve for the things illness has taken from you: '
          'your independence, your plans, the way things used to be.\n\n'
          'Grief is not weakness. It is love with nowhere to go. Allow yourself '
          'to feel it when it comes, without judgment.\n\n'
          'There is no right way to grieve. Some days will be harder than '
          'others, and that is okay.',
    ),
    const LearnModule(
      id: 'p3_04',
      number: '3.4',
      titleEn: 'Your Strength Story',
      titleHi:
          '\u0906\u092A\u0915\u0940 \u0924\u093E\u0915\u093C\u0924 \u0915\u0940 \u0915\u0939\u093E\u0928\u0940',
      durationMinutes: 2,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Think about all you have been through and how you have managed so far. '
          'That takes incredible strength.\n\n'
          'Your strength story is not about never struggling. It is about '
          'continuing forward, one day at a time, even when things are hard.\n\n'
          'What strengths have helped you through difficult times before? '
          'Those same strengths are available to you now.',
    ),
    const LearnModule(
      id: 'p3_05',
      number: '3.5',
      titleEn: 'Planning Ahead',
      titleHi:
          '\u0906\u0917\u0947 \u0915\u0940 \u0924\u0948\u092F\u093E\u0930\u0940',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Planning ahead can feel daunting, but it is actually an act of love '
          'and care \u2014 for yourself and for your family.\n\n'
          'Having conversations about your wishes and preferences means your '
          'care team and family can support you the way you want.\n\n'
          'You do not have to plan everything at once. Start with one small '
          'conversation and build from there.',
    ),
    const LearnModule(
      id: 'p3_06',
      number: '3.6',
      titleEn: 'What Matters Most',
      titleHi:
          '\u0938\u092C\u0938\u0947 \u091C\u093C\u0930\u0942\u0930\u0940 \u0915\u094D\u092F\u093E \u0939\u0948',
      durationMinutes: 2,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'When life feels uncertain, it can help to get very clear about what '
          'matters most to you.\n\n'
          'Is it time with family? Comfort? Being at home? Spiritual peace? '
          'There is no wrong answer.\n\n'
          'When you know what matters most, it becomes easier to make decisions '
          'and to communicate your wishes to others.',
    ),
    const LearnModule(
      id: 'p3_07',
      number: '3.7',
      titleEn: 'Legacy and Love',
      titleHi:
          '\u0935\u093F\u0930\u093E\u0938\u0924 \u0914\u0930 \u092A\u094D\u092F\u093E\u0930',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Legacy is not about grand gestures. It is about the love you have '
          'shared, the lessons you have taught, and the memories you have created.\n\n'
          'Your legacy lives in the people whose lives you have touched: your '
          'children, your friends, your community.\n\n'
          'Some people find comfort in writing letters, recording messages, '
          'or simply telling loved ones what they mean to them. There is no '
          'wrong way to leave your mark of love.',
    ),
  ];
}

// ---------------------------------------------------------------------------
// PROVIDERS
// ---------------------------------------------------------------------------

final learnProvider = StateNotifierProvider<LearnNotifier, LearnState>(
  (ref) => LearnNotifier(),
);
