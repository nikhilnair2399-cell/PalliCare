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
    // -----------------------------------------------------------------------
    // Phase 1: Understanding Your Pain (8 modules)
    // -----------------------------------------------------------------------
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
    const LearnModule(
      id: 'p1_06',
      number: '1.6',
      titleEn: 'Understanding Your Illness',
      titleHi: '\u0905\u092A\u0928\u0940 \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u094B \u0938\u092E\u091D\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase1,
      contentBody:
          'When a doctor tells you about your illness, the words can feel '
          'overwhelming. Medical terms are hard to understand, and it is '
          'completely normal to feel confused or frightened.\n\n'
          'Let us start with some basics. Doctors use precise words because '
          'medicine requires precision \u2014 but that does not mean you cannot '
          'understand your own condition. You have every right to ask your '
          'doctor to explain in simple language, and to ask as many times as '
          'you need.\n\n'
          'There is an important difference between a chronic illness and a '
          'terminal illness. Chronic means long-lasting \u2014 it can often be '
          'managed for many years. Terminal means the illness is expected to '
          'shorten life, but it does not tell you exactly when or how. Many '
          'people live meaningful months and years after a terminal diagnosis.\n\n'
          'The word "palliative" simply means focused on comfort and quality '
          'of life. Palliative care is not about giving up \u2014 it is about '
          'living as well as possible, for as long as possible.\n\n'
          'In India, families often learn the diagnosis before the patient. '
          'This comes from a place of love and protection. But research shows '
          'that most patients want to know the truth about their condition. '
          'Knowing helps you make informed choices about your care and your life.\n\n'
          'Here are some questions you can ask your doctor:\n'
          '\u2022 What is the name of my condition in simple words?\n'
          '\u2022 What does this mean for my daily life?\n'
          '\u2022 What treatments are available, and what are the side effects?\n'
          '\u2022 What can I do to feel better day to day?\n\n'
          'You do not have to understand everything at once. Take it one step '
          'at a time, and remember \u2014 asking questions is not a burden. '
          'It is your right.',
    ),
    const LearnModule(
      id: 'p1_07',
      number: '1.7',
      titleEn: 'Your Care Team',
      titleHi: '\u0906\u092A\u0915\u0940 \u0926\u0947\u0916\u092D\u093E\u0932 \u091F\u0940\u092E',
      durationMinutes: 3,
      phase: ContentPhase.phase1,
      contentBody:
          'Palliative care is not delivered by one person alone. A whole team '
          'works together to support you and your family. Understanding who '
          'does what can help you get the most from your care.\n\n'
          'Your palliative medicine doctor focuses on managing your symptoms '
          '\u2014 pain, breathlessness, nausea, and more. They coordinate your '
          'overall care plan and communicate with your other specialists.\n\n'
          'Your nurse is often the person you will see most frequently. They '
          'monitor your symptoms, give medications, help with wound care, and '
          'are a vital link between you and the doctor.\n\n'
          'A social worker helps with practical challenges: navigating '
          'government schemes like Ayushman Bharat, arranging financial '
          'assistance, and connecting you with community resources.\n\n'
          'A counselor or psychologist provides emotional support. Talking '
          'to a trained professional is not a sign of weakness \u2014 it is a '
          'wise step toward coping better.\n\n'
          'A physiotherapist helps you maintain mobility and function, '
          'preventing complications like bedsores and stiffness. A '
          'nutritionist guides your diet to maintain strength and manage '
          'side effects. A spiritual care provider \u2014 of any faith or '
          'none \u2014 supports your inner peace.\n\n'
          'In Indian government hospitals, ASHA workers and community health '
          'workers may visit you at home between hospital appointments. They '
          'are a valuable bridge between you and your hospital team.\n\n'
          'Your family is also part of your care team. In India, family '
          'members often provide most of the day-to-day care. Their well-being '
          'matters too, and the palliative care team supports them as well.\n\n'
          'Helpful questions for your care team:\n'
          '\u2022 Who should I call if my symptoms get worse at night?\n'
          '\u2022 How often will I have follow-up visits?\n'
          '\u2022 Is there a helpline number I can reach in an emergency?\n'
          '\u2022 Can someone visit me at home if I cannot travel?',
    ),
    const LearnModule(
      id: 'p1_08',
      number: '1.8',
      titleEn: 'Your Rights as a Patient',
      titleHi: '\u0930\u094B\u0917\u0940 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0906\u092A\u0915\u0947 \u0905\u0927\u093F\u0915\u093E\u0930',
      durationMinutes: 3,
      phase: ContentPhase.phase1,
      contentBody:
          'As a patient, you have important rights. Knowing them empowers you '
          'to participate actively in your care and to speak up when something '
          'does not feel right.\n\n'
          'Your right to pain relief: The Indian Supreme Court and the '
          'National Human Rights Commission recognize that access to pain '
          'relief is a fundamental right. No one should have to suffer '
          'unbearable pain when treatment is available. If your pain is not '
          'being managed, you have the right to ask for better treatment.\n\n'
          'Your right to informed consent: Before any procedure or treatment, '
          'your doctor must explain what will be done, why, and what the risks '
          'are \u2014 in a language you understand. You must agree before any '
          'treatment begins.\n\n'
          'Your right to refuse treatment: You can say no to any treatment, '
          'even if your doctor recommends it. This includes the right to stop '
          'a treatment that is not helping or is causing too much suffering.\n\n'
          'Your right to a second opinion: If you are unsure about a '
          'diagnosis or treatment plan, you are entitled to seek another '
          'doctor\'s opinion. No doctor should feel offended by this request.\n\n'
          'Your right to know your diagnosis: You have the right to know what '
          'is happening in your own body. While family members may want to '
          'protect you, the final choice of what to know belongs to you.\n\n'
          'Your right to palliative care: The National Programme for '
          'Palliative Care (NPPC 2012) recognizes palliative care as an '
          'essential part of healthcare. You are entitled to symptom '
          'management, psychosocial support, and end-of-life care.\n\n'
          'Your right to die with dignity: This means being treated with '
          'respect, having your wishes honored, and being free from '
          'unnecessary suffering in your final days.\n\n'
          'The Patient Rights Charter of India outlines these and other '
          'protections. If you feel your rights are not being respected, '
          'speak to the hospital\'s patient welfare officer or social worker. '
          'You are not being difficult \u2014 you are being your own best advocate.',
    ),

    // -----------------------------------------------------------------------
    // Phase 2: Tools for Your Journey (12 modules)
    // -----------------------------------------------------------------------
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
    const LearnModule(
      id: 'p2_08',
      number: '2.8',
      titleEn: 'Nutrition When You Are Unwell',
      titleHi: '\u092C\u0940\u092E\u093E\u0930\u0940 \u092E\u0947\u0902 \u092A\u094B\u0937\u0923',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      actionLink: '/learn/library',
      contentBody:
          'When you are unwell, eating well becomes both more important and '
          'more difficult. Your body needs nutrition to maintain strength, '
          'heal, and fight infection \u2014 but illness and treatments can '
          'steal your appetite and change how food tastes.\n\n'
          'Indian comfort foods can be your best friends during illness. '
          'Khichdi \u2014 soft, warm, and easy to digest \u2014 is one of the '
          'most nourishing meals you can have. Dal-chawal with a little ghee '
          'provides protein and energy in a familiar, comforting form.\n\n'
          'Focus on protein to maintain your strength: paneer, dahi, eggs, '
          'dal, and soy are excellent sources. Add calories through ghee, '
          'dry fruits, and mashed bananas when appetite is low.\n\n'
          'When food tastes different or metallic:\n'
          '\u2022 Try nimbu pani (lemon water) before meals to freshen your palate\n'
          '\u2022 Jeera water and saunf water can settle the stomach\n'
          '\u2022 Cold or room-temperature foods may taste better than hot ones\n'
          '\u2022 Use plastic utensils if you notice a metallic taste\n\n'
          'Eat small, frequent meals \u2014 five or six small portions are easier '
          'than three large ones. Do not force yourself to eat full meals if '
          'you cannot. Even a few spoonfuls of dahi or a handful of dry fruits '
          'count.\n\n'
          'Traditional remedies like haldi doodh (turmeric milk) and tulsi '
          'tea can be soothing and may have mild anti-inflammatory benefits. '
          'However, always tell your doctor about any home remedies, as some '
          'can interact with medications.\n\n'
          'If you are losing weight rapidly or cannot eat for more than a day '
          'or two, ask your care team about seeing a dietitian. Nutritional '
          'supplements may also be helpful.',
    ),
    const LearnModule(
      id: 'p2_09',
      number: '2.9',
      titleEn: 'Moving Your Body Gently',
      titleHi: '\u0936\u0930\u0940\u0930 \u0915\u094B \u0927\u0940\u0930\u0947 \u0938\u0947 \u0939\u093F\u0932\u093E\u0928\u093E',
      durationMinutes: 2,
      phase: ContentPhase.phase2,
      actionLink: '/breathe',
      contentBody:
          'When you are unwell, the idea of exercise might feel impossible '
          '\u2014 and that is okay. This is not about fitness or pushing your '
          'body. It is about gentle movement to help you feel a little better.\n\n'
          'Even small movements have real benefits. They help your digestion, '
          'improve your mood, keep your joints from stiffening, and prevent '
          'complications like bedsores if you spend a lot of time in bed.\n\n'
          'Gentle movements you can try:\n'
          '\u2022 Ankle circles and toe wiggles while sitting or lying down\n'
          '\u2022 Gentle neck rolls \u2014 slowly turn your head side to side\n'
          '\u2022 Chair yoga \u2014 simple stretches while seated\n'
          '\u2022 Short walks around your room or to the balcony\n'
          '\u2022 Stretching your arms overhead while in bed\n\n'
          'Modified pranayama (breathing exercises) can also count as gentle '
          'movement. Try simple anulom-vilom (alternate nostril breathing) '
          'for two to three minutes. It calms the mind and gently exercises '
          'your respiratory muscles.\n\n'
          'Important warning signs to stop and rest:\n'
          '\u2022 Sharp or sudden increase in pain\n'
          '\u2022 Dizziness or feeling faint\n'
          '\u2022 Severe breathlessness\n'
          '\u2022 Chest discomfort\n\n'
          'Ask your physiotherapist to design a gentle routine suited to '
          'your specific needs. Even five minutes a day can make a difference.',
    ),
    const LearnModule(
      id: 'p2_10',
      number: '2.10',
      titleEn: 'Managing Nausea & Appetite',
      titleHi: '\u092E\u093F\u091A\u0932\u0940 \u0914\u0930 \u092D\u0942\u0916 \u0915\u093E \u092A\u094D\u0930\u092C\u0902\u0927\u0928',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Nausea and loss of appetite are among the most common and '
          'distressing symptoms during serious illness. They can be caused '
          'by medications, the illness itself, or even anxiety. The good news '
          'is that there are many practical ways to manage them beyond '
          'medication alone.\n\n'
          'For nausea:\n'
          '\u2022 Ginger (adrak) is a time-tested remedy \u2014 try adrak chai, '
          'ginger chews, or a small piece of fresh ginger with salt\n'
          '\u2022 Saunf (fennel seeds) after meals can settle the stomach\n'
          '\u2022 Cold or room-temperature foods often trigger less nausea '
          'than hot, strong-smelling dishes\n'
          '\u2022 Eat something bland (dry toast, plain biscuits) before taking '
          'medications that cause nausea\n'
          '\u2022 Avoid lying flat right after eating \u2014 sit upright for at '
          'least 30 minutes\n'
          '\u2022 Strong cooking smells can trigger nausea; if possible, stay '
          'in a different room while food is being prepared\n\n'
          'For appetite loss:\n'
          '\u2022 Do not force large meals. Your body may genuinely need less '
          'food right now, and that is okay\n'
          '\u2022 Eat your favorite foods when you feel like eating \u2014 this is '
          'not the time for strict diets\n'
          '\u2022 High-calorie small portions work well: a spoonful of ghee on '
          'dal, dry fruit laddoos, protein-rich shakes\n'
          '\u2022 Eating together with family, even a little, can make meals '
          'more appealing\n\n'
          'Near the end of life, appetite naturally decreases. This can be '
          'very distressing for families who express love through food. It is '
          'important to understand that forcing food at this stage can '
          'actually cause discomfort. Small sips of water, ice chips, or '
          'moistening the lips may be all that is needed.\n\n'
          'Always tell your care team about persistent nausea or vomiting. '
          'There are effective anti-nausea medications that can help '
          'significantly.',
    ),
    const LearnModule(
      id: 'p2_11',
      number: '2.11',
      titleEn: 'Navigating the Hospital',
      titleHi: '\u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u092E\u0947\u0902 \u0930\u093E\u0938\u094D\u0924\u093E \u0916\u094B\u091C\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Hospitals can feel overwhelming, especially when you are unwell. '
          'Understanding how the system works can reduce anxiety and help '
          'you get better care.\n\n'
          'OPD (Out-Patient Department) is where you go for scheduled '
          'appointments, follow-ups, and consultations. You do not stay '
          'overnight. IPD (In-Patient Department) is where you are admitted '
          'for treatment that requires staying in the hospital. Know which '
          'one you need before you arrive.\n\n'
          'What to bring for hospital visits:\n'
          '\u2022 All previous reports, prescriptions, and discharge summaries '
          '\u2014 keep them in a folder in date order\n'
          '\u2022 A list of all current medications with doses\n'
          '\u2022 Your Ayushman Bharat card or insurance documents\n'
          '\u2022 A notebook and pen to write down what the doctor says\n'
          '\u2022 A trusted family member who can help you remember information\n\n'
          'Before your appointment, write down your questions. It is easy '
          'to forget what you wanted to ask when you are face-to-face with '
          'the doctor. Even two or three written questions can make your '
          'visit much more productive.\n\n'
          'Understanding prescriptions: Ask your doctor or pharmacist to '
          'explain each medicine \u2014 what it is for, when to take it, and '
          'what side effects to watch for. If you cannot read the '
          'prescription, ask someone to help.\n\n'
          'Getting referrals: If you need to see a specialist, ask your '
          'current doctor for a referral letter. This speeds up the process '
          'and helps the new doctor understand your history.\n\n'
          'The hospital social worker is your ally. They can help you:\n'
          '\u2022 Apply for government schemes and financial assistance\n'
          '\u2022 Navigate the hospital system\n'
          '\u2022 Connect with support groups and community resources\n'
          '\u2022 Arrange home care if needed\n\n'
          'In government hospitals, the process may take more time, but '
          'the quality of palliative care can be excellent. Be patient, '
          'be polite, and do not hesitate to ask for what you need.',
    ),
    const LearnModule(
      id: 'p2_12',
      number: '2.12',
      titleEn: 'Complementary Approaches',
      titleHi: '\u092A\u0942\u0930\u0915 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923',
      durationMinutes: 3,
      phase: ContentPhase.phase2,
      contentBody:
          'Complementary approaches are therapies used alongside \u2014 not '
          'instead of \u2014 your regular medical treatment. When used safely, '
          'they can improve comfort, reduce stress, and give you a greater '
          'sense of control over your well-being.\n\n'
          'Yoga and pranayama have strong evidence for reducing pain, '
          'anxiety, and improving sleep. Even gentle chair-based yoga or '
          'simple breathing exercises like anulom-vilom and bhramari can '
          'make a meaningful difference. You do not need to be flexible or '
          'fit \u2014 modified versions work well.\n\n'
          'Meditation and dhyana help calm the mind. Even five minutes of '
          'sitting quietly, focusing on your breath or a mantra, can reduce '
          'the suffering that comes with pain. Regular practice, even if '
          'brief, is more helpful than occasional long sessions.\n\n'
          'Ayurvedic approaches to symptom management can be helpful when '
          'guided by an AYUSH-certified practitioner. Some herbs and '
          'formulations may ease specific symptoms. However, it is crucial '
          'to tell both your allopathic doctor and your AYUSH practitioner '
          'about all treatments you are receiving.\n\n'
          'Acupressure \u2014 applying gentle pressure to specific points on '
          'the body \u2014 can help with nausea, headache, and general '
          'discomfort. The P6 point on the inner wrist is well-studied for '
          'nausea relief.\n\n'
          'Music therapy \u2014 listening to bhajans, ragas, or any music you '
          'find soothing \u2014 can reduce pain perception, lower anxiety, and '
          'improve sleep.\n\n'
          'Important warnings:\n'
          '\u2022 Never replace your prescribed medication with any '
          'complementary therapy\n'
          '\u2022 Some herbal supplements can interact dangerously with '
          'chemotherapy and other drugs\n'
          '\u2022 Always inform your doctor about everything you are taking, '
          'including herbal remedies\n'
          '\u2022 Be wary of practitioners who promise a cure or ask you to '
          'stop your medical treatment\n\n'
          'India\'s AYUSH system (Ayurveda, Yoga, Unani, Siddha, '
          'Homeopathy) has a rich tradition. The key is integration \u2014 '
          'using the best of all systems together, safely and wisely.',
    ),

    // -----------------------------------------------------------------------
    // Phase 3: Living with Purpose (13 modules)
    // -----------------------------------------------------------------------
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
    const LearnModule(
      id: 'p3_08',
      number: '3.8',
      titleEn: 'Talking to Children About Illness',
      titleHi: '\u092C\u091A\u094D\u091A\u094B\u0902 \u0938\u0947 \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092C\u093E\u0924 \u0915\u0930\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'One of the hardest parts of serious illness is knowing how to talk '
          'to the children in your life. In Indian families, the instinct is '
          'often to protect children from difficult truths. But children are '
          'more aware than we think \u2014 they sense when something is wrong, '
          'and silence can be more frightening than the truth.\n\n'
          'For toddlers (ages 2 to 5): Keep it very simple. "Nani is not '
          'feeling well. The doctor is helping her." Young children understand '
          'feelings more than facts. Maintain their routine as much as '
          'possible \u2014 regular mealtimes, bedtime stories, and play. They '
          'need to feel that their world is still safe.\n\n'
          'For school-age children (ages 6 to 12): Be honest in age-'
          'appropriate language. "Papa has a sickness in his tummy that the '
          'doctors are trying to help with. It is a serious sickness, and '
          'sometimes Papa feels very tired or has pain." Allow questions '
          '\u2014 even the ones that are hard to answer. "I do not know" is '
          'an honest and acceptable answer.\n\n'
          'For teenagers: They deserve to be treated as young adults. Share '
          'what is happening and give them space to react in their own way. '
          'Anger, withdrawal, or seeming indifference are normal responses '
          '\u2014 these are their ways of processing difficult emotions.\n\n'
          'Practical suggestions:\n'
          '\u2022 Let the child know they did not cause the illness\n'
          '\u2022 Reassure them that they will be taken care of\n'
          '\u2022 Involve grandparents or a trusted aunt/uncle for support\n'
          '\u2022 Allow them to help in small ways \u2014 bringing water, '
          'drawing a picture \u2014 this reduces helplessness\n'
          '\u2022 Watch for changes in behavior, school performance, or sleep\n\n'
          'It is okay to cry in front of children. It teaches them that '
          'feelings are natural and that it is safe to express them. What '
          'matters most is that they feel loved, included, and not alone.',
    ),
    const LearnModule(
      id: 'p3_09',
      number: '3.9',
      titleEn: 'Spirituality and Comfort',
      titleHi: '\u0906\u0927\u094D\u092F\u093E\u0924\u094D\u092E\u093F\u0915\u0924\u093E \u0914\u0930 \u0936\u093E\u0902\u0924\u093F',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      actionLink: '/voice/comfort-audio',
      contentBody:
          'Serious illness often brings spiritual questions to the surface. '
          'Why is this happening? Is there meaning in suffering? What happens '
          'after? These questions are deeply human, and there is no single '
          'right answer.\n\n'
          'India is a land of many faiths, and each tradition offers its own '
          'sources of comfort during difficult times.\n\n'
          'In Hindu traditions, the Bhagavad Gita speaks of the soul as '
          'eternal and unchanging. Many find comfort in prayer (puja), '
          'listening to bhajans, chanting the Hanuman Chalisa, or simply '
          'sitting quietly with a mala. The idea that the atma continues '
          'beyond the body brings peace to many.\n\n'
          'In Muslim traditions, dua (supplication) and recitation of the '
          'Quran provide solace. The concept of sabr (patience in suffering) '
          'is valued, and many find strength in the belief that hardship '
          'brings closeness to Allah.\n\n'
          'In Christian traditions, prayer, reading of psalms, and pastoral '
          'visits offer comfort. The presence of a caring community and '
          'faith in God\'s love can sustain hope even in suffering.\n\n'
          'In Sikh traditions, listening to Gurbani, the practice of seva '
          '(selfless service by those around you), and the principle of '
          'accepting hukam (divine will) bring comfort and strength.\n\n'
          'In Buddhist traditions, mindfulness practice and the teaching '
          'of impermanence can help one face illness with equanimity '
          'and peace.\n\n'
          'Spiritual distress is also real. You may feel abandoned by God, '
          'angry at your faith, or question everything you once believed. '
          'This is not a failure of faith \u2014 it is a natural part of '
          'suffering. A spiritual care provider or trusted religious leader '
          'can help you sit with these difficult feelings.\n\n'
          'Whatever your faith or none at all, finding inner peace matters. '
          'It may come through prayer, through nature, through music, '
          'through the presence of loved ones, or through quiet reflection. '
          'There is no wrong way to seek comfort for your soul.',
    ),
    const LearnModule(
      id: 'p3_10',
      number: '3.10',
      titleEn: 'When Treatment Decisions Are Difficult',
      titleHi: '\u091C\u092C \u0909\u092A\u091A\u093E\u0930 \u0915\u0947 \u092B\u0948\u0938\u0932\u0947 \u0915\u0920\u093F\u0928 \u0939\u094B\u0902',
      durationMinutes: 4,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'There may come a time when your care team presents you with '
          'choices that feel impossible. Continue aggressive treatment or '
          'focus on comfort? Try another round of chemotherapy or spend '
          'energy on what matters most? These are among the hardest '
          'decisions anyone can face.\n\n'
          'Understanding "goals of care" can help. This is a conversation '
          'with your doctor about what you are hoping to achieve. In the '
          'early stages of illness, the goal may be cure. As illness '
          'progresses, the goal may shift to prolonging life, maintaining '
          'function, or prioritizing comfort. All of these are valid goals, '
          'and they can change over time.\n\n'
          'What "doing everything" really means: When families say "do '
          'everything possible," they usually mean "do not let my loved one '
          'suffer." But in medicine, "everything" sometimes includes '
          'treatments that may cause more suffering than benefit. It is '
          'important to understand what each treatment will actually involve '
          '\u2014 the side effects, the time in hospital, the likely outcome '
          '\u2014 and whether it aligns with what matters most to you.\n\n'
          'Hope and realism can coexist. You can hope for more time while '
          'also preparing for the possibility that time is limited. Hope '
          'can shift too \u2014 from hoping for cure to hoping for one more '
          'good festival, one more family gathering, one more peaceful day.\n\n'
          'Family disagreements are common and painful. In Indian families, '
          'where decisions are often collective, different members may have '
          'very different views. A son may want aggressive treatment while '
          'a daughter advocates for comfort care. These disagreements come '
          'from love, but the patient\'s own voice must be at the center.\n\n'
          'A framework for difficult decisions:\n'
          '\u2022 What do I value most in my daily life?\n'
          '\u2022 What would I gain from this treatment? What would I lose?\n'
          '\u2022 What does a good day look like for me?\n'
          '\u2022 If I could not speak for myself, what would I want my family '
          'to know about my wishes?\n\n'
          'You do not have to decide alone. Your palliative care team can '
          'guide these conversations with compassion and honesty. There is '
          'no wrong answer \u2014 only what is right for you.',
    ),
    const LearnModule(
      id: 'p3_11',
      number: '3.11',
      titleEn: 'Sexuality, Intimacy & Illness',
      titleHi: '\u092F\u094C\u0928 \u0938\u0902\u092C\u0902\u0927, \u0928\u093F\u0915\u091F\u0924\u093E \u0914\u0930 \u092C\u0940\u092E\u093E\u0930\u0940',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'This is a topic that is rarely discussed, especially in Indian '
          'families, but it matters deeply to many patients and their '
          'partners. Illness changes your body, your energy, and your '
          'sense of self \u2014 and all of these affect intimacy.\n\n'
          'First, a broader view of intimacy. Physical closeness is not '
          'only about sexual activity. Holding hands, a gentle head massage '
          '(champi), lying close together, a hug, or simply sitting side '
          'by side in comfortable silence \u2014 these are all forms of '
          'intimacy that nourish the soul.\n\n'
          'How illness affects desire: Many medications \u2014 including '
          'painkillers, antidepressants, and hormonal treatments \u2014 can '
          'reduce libido. Fatigue, pain, and changes in body image also '
          'play a role. If you notice changes, know that this is extremely '
          'common and not a reflection of your feelings for your partner.\n\n'
          'For the patient: You may feel that your body has let you down, '
          'or that you are no longer attractive. These feelings are '
          'understandable but not the full truth. Your worth and your '
          'lovability are not defined by what your body can or cannot do.\n\n'
          'For the caregiver-spouse: When you become a caregiver, the '
          'relationship dynamic shifts. It can be hard to feel like a '
          'romantic partner when you are also managing medications and '
          'appointments. Both of you need permission to acknowledge this '
          'change and find new ways to connect.\n\n'
          'Communication is everything:\n'
          '\u2022 Talk honestly about what feels good and what does not\n'
          '\u2022 Explore what forms of closeness feel right now\n'
          '\u2022 Be patient with each other \u2014 needs may change day to day\n'
          '\u2022 It is okay to grieve the intimacy you used to have\n\n'
          'You have permission to bring this up with your care team. '
          'Palliative care doctors and counselors are trained to discuss '
          'these sensitive topics without judgment. You deserve support in '
          'all dimensions of your life \u2014 including this one.',
    ),
    const LearnModule(
      id: 'p3_12',
      number: '3.12',
      titleEn: 'Financial Planning During Illness',
      titleHi: '\u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u0935\u093F\u0924\u094D\u0924\u0940\u092F \u092F\u094B\u091C\u0928\u093E',
      durationMinutes: 3,
      phase: ContentPhase.phase3,
      isSensitive: true,
      contentBody:
          'Serious illness brings financial stress on top of everything else. '
          'Medical bills, loss of income, travel for treatment \u2014 the '
          'costs add up quickly. But there are resources and strategies that '
          'can help ease the burden.\n\n'
          'Government schemes you should know about:\n'
          '\u2022 Ayushman Bharat (PM-JAY): Provides up to 5 lakh rupees per '
          'family per year for hospitalization. Check eligibility at your '
          'nearest Common Service Centre or hospital help desk. You need '
          'your Aadhaar card and ration card.\n'
          '\u2022 Rashtriya Arogya Nidhi (RAN): Financial assistance for BPL '
          'patients receiving treatment at government hospitals.\n'
          '\u2022 State-specific schemes: Many states have their own health '
          'coverage programs. Ask your hospital social worker about schemes '
          'available in your state.\n\n'
          'If you have health insurance, file claims promptly. Keep all '
          'original bills, discharge summaries, and prescriptions. If a '
          'claim is rejected, you can appeal \u2014 your hospital\'s TPA desk '
          'or insurance ombudsman can help.\n\n'
          'Medicines can be a major expense. Ask your doctor about generic '
          'alternatives \u2014 they contain the same active ingredient at a '
          'fraction of the cost. Government-run Jan Aushadhi Kendras sell '
          'quality generic medicines at very affordable prices.\n\n'
          'Planning for your family\'s future:\n'
          '\u2022 Making a will is important, especially in joint families '
          'where property and asset distribution can become complicated. '
          'A simple will can be written on plain paper with two witnesses.\n'
          '\u2022 Check nominations on bank accounts, fixed deposits, and '
          'insurance policies. Update them if needed.\n'
          '\u2022 Ensure your spouse or a trusted family member knows about '
          'all bank accounts, investments, and important documents.\n\n'
          'Asking for financial help is not shameful. Many NGOs, religious '
          'organizations, and community groups provide assistance for '
          'medical treatment. Your hospital social worker can connect you '
          'with these resources.\n\n'
          'Taking control of financial matters, even in small steps, '
          'can reduce anxiety and give you peace of mind knowing your '
          'family will be looked after.',
    ),
    const LearnModule(
      id: 'p3_13',
      number: '3.13',
      titleEn: 'A Letter to Your Loved Ones',
      titleHi: '\u0905\u092A\u0928\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u092A\u0924\u094D\u0930',
      durationMinutes: 4,
      phase: ContentPhase.phase3,
      isSensitive: true,
      actionLink: '/voice/journal',
      contentBody:
          'There are things we carry in our hearts that are hard to say out '
          'loud. Words of love, gratitude, regret, hope \u2014 they sit '
          'inside us, waiting for the right moment. But sometimes the right '
          'moment does not come on its own. Sometimes, we need to create it.\n\n'
          'Writing a letter to someone you love is one of the most powerful '
          'things you can do. It does not have to be long or perfect. It '
          'does not have to be a goodbye. It is simply a way of putting '
          'your heart on paper.\n\n'
          'Why letters matter: When we speak, we sometimes get interrupted, '
          'lose our words, or hold back because we see the other person\'s '
          'tears. A letter lets you say everything you need to say, in your '
          'own time, in your own way. And it becomes a keepsake \u2014 '
          'something your loved ones can hold, read, and treasure.\n\n'
          'Prompts to help you start:\n'
          '\u2022 "What I want you to know is..."\n'
          '\u2022 "My favorite memory with you is..."\n'
          '\u2022 "What I hope for you is..."\n'
          '\u2022 "The advice I want to leave you is..."\n'
          '\u2022 "I am grateful to you because..."\n'
          '\u2022 "If I could tell you one thing, it would be..."\n\n'
          'You can write as many letters as you want \u2014 to your spouse, '
          'your children, your parents, a dear friend, or even to yourself.\n\n'
          'Options for creating your letter:\n'
          '\u2022 Write on paper \u2014 your handwriting is part of the gift\n'
          '\u2022 Use the voice journal in this app to record your words\n'
          '\u2022 Record a video message on your phone\n'
          '\u2022 Ask a family member to write as you dictate\n\n'
          'In some Indian families, writing such a letter may feel like '
          'accepting the worst \u2014 like a bad omen. But think of it this '
          'way: this is not about saying goodbye. It is about saying what '
          'matters. It is an act of love, not of surrender.\n\n'
          'You do not have to share your letter now. You can seal it and '
          'decide later. You can keep it with your important papers, or '
          'give it to someone you trust. The act of writing itself can '
          'bring a surprising sense of peace.\n\n'
          'Your words are a gift. They cost nothing, but they are priceless.',
    ),
  ];
}

// ---------------------------------------------------------------------------
// PROVIDERS
// ---------------------------------------------------------------------------

final learnProvider = StateNotifierProvider<LearnNotifier, LearnState>(
  (ref) => LearnNotifier(),
);
