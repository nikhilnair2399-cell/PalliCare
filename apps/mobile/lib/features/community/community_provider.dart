import 'package:flutter_riverpod/flutter_riverpod.dart';

// ─────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────

enum DiseasePhase {
  newlyDiagnosed,
  activeTreatment,
  chronicPain,
  endOfLife,
  survivorship,
  caregiverSupport,
}

enum PostType {
  text,
  comfortCard,
  poll,
  milestone,
}

enum ModerationStatus {
  pending,
  approved,
  rejected,
  flagged,
  autoApproved,
}

enum ReportReason {
  harassment,
  misinformation,
  spam,
  selfHarm,
  inappropriateContent,
  medicalAdvice,
  other,
}

enum CommunityView {
  channels,
  channelFeed,
  postDetail,
  compose,
}

enum ComfortCategory {
  encouragement,
  empathy,
  strength,
  peace,
}

enum SyncStatus {
  synced,
  pending,
  failed,
}

// ─────────────────────────────────────────────────────────
// Data Models
// ─────────────────────────────────────────────────────────

class CommunityChannel {
  final String id;
  final DiseasePhase phase;
  final String nameEn;
  final String nameHi;
  final String descriptionEn;
  final String descriptionHi;
  final String emoji;
  final int memberCount;
  final int postCount;
  final String? lastActivityAt;
  final bool isJoined;

  const CommunityChannel({
    required this.id,
    required this.phase,
    required this.nameEn,
    required this.nameHi,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.emoji,
    this.memberCount = 0,
    this.postCount = 0,
    this.lastActivityAt,
    this.isJoined = false,
  });

  CommunityChannel copyWith({
    int? memberCount,
    int? postCount,
    String? lastActivityAt,
    bool? isJoined,
  }) {
    return CommunityChannel(
      id: id,
      phase: phase,
      nameEn: nameEn,
      nameHi: nameHi,
      descriptionEn: descriptionEn,
      descriptionHi: descriptionHi,
      emoji: emoji,
      memberCount: memberCount ?? this.memberCount,
      postCount: postCount ?? this.postCount,
      lastActivityAt: lastActivityAt ?? this.lastActivityAt,
      isJoined: isJoined ?? this.isJoined,
    );
  }
}

class CommunityPost {
  final String id;
  final String channelId;
  final String authorId;
  final String authorNameEn;
  final String authorNameHi;
  final PostType type;
  final String contentEn;
  final String contentHi;
  final String? comfortCardId;
  final bool isAnonymous;
  final int supportCount;
  final int replyCount;
  final bool hasSupportedByMe;
  final ModerationStatus moderationStatus;
  final String createdAt;
  final String? editedAt;
  final SyncStatus syncStatus;
  final List<PostReply> replies;

  const CommunityPost({
    required this.id,
    required this.channelId,
    required this.authorId,
    required this.authorNameEn,
    required this.authorNameHi,
    required this.type,
    required this.contentEn,
    required this.contentHi,
    this.comfortCardId,
    this.isAnonymous = false,
    this.supportCount = 0,
    this.replyCount = 0,
    this.hasSupportedByMe = false,
    this.moderationStatus = ModerationStatus.pending,
    required this.createdAt,
    this.editedAt,
    this.syncStatus = SyncStatus.synced,
    this.replies = const [],
  });

  CommunityPost copyWith({
    int? supportCount,
    int? replyCount,
    bool? hasSupportedByMe,
    ModerationStatus? moderationStatus,
    String? editedAt,
    SyncStatus? syncStatus,
    List<PostReply>? replies,
  }) {
    return CommunityPost(
      id: id,
      channelId: channelId,
      authorId: authorId,
      authorNameEn: authorNameEn,
      authorNameHi: authorNameHi,
      type: type,
      contentEn: contentEn,
      contentHi: contentHi,
      comfortCardId: comfortCardId,
      isAnonymous: isAnonymous,
      supportCount: supportCount ?? this.supportCount,
      replyCount: replyCount ?? this.replyCount,
      hasSupportedByMe: hasSupportedByMe ?? this.hasSupportedByMe,
      moderationStatus: moderationStatus ?? this.moderationStatus,
      createdAt: createdAt,
      editedAt: editedAt ?? this.editedAt,
      syncStatus: syncStatus ?? this.syncStatus,
      replies: replies ?? this.replies,
    );
  }
}

class PostReply {
  final String id;
  final String postId;
  final String authorId;
  final String authorNameEn;
  final String authorNameHi;
  final String contentEn;
  final String contentHi;
  final String? comfortCardId;
  final bool isAnonymous;
  final int supportCount;
  final bool hasSupportedByMe;
  final ModerationStatus moderationStatus;
  final String createdAt;
  final SyncStatus syncStatus;

  const PostReply({
    required this.id,
    required this.postId,
    required this.authorId,
    required this.authorNameEn,
    required this.authorNameHi,
    required this.contentEn,
    required this.contentHi,
    this.comfortCardId,
    this.isAnonymous = false,
    this.supportCount = 0,
    this.hasSupportedByMe = false,
    this.moderationStatus = ModerationStatus.pending,
    required this.createdAt,
    this.syncStatus = SyncStatus.synced,
  });

  PostReply copyWith({
    int? supportCount,
    bool? hasSupportedByMe,
    ModerationStatus? moderationStatus,
    SyncStatus? syncStatus,
  }) {
    return PostReply(
      id: id,
      postId: postId,
      authorId: authorId,
      authorNameEn: authorNameEn,
      authorNameHi: authorNameHi,
      contentEn: contentEn,
      contentHi: contentHi,
      comfortCardId: comfortCardId,
      isAnonymous: isAnonymous,
      supportCount: supportCount ?? this.supportCount,
      hasSupportedByMe: hasSupportedByMe ?? this.hasSupportedByMe,
      moderationStatus: moderationStatus ?? this.moderationStatus,
      createdAt: createdAt,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }
}

class ComfortCard {
  final String id;
  final ComfortCategory category;
  final String messageEn;
  final String messageHi;
  final String emoji;

  const ComfortCard({
    required this.id,
    required this.category,
    required this.messageEn,
    required this.messageHi,
    required this.emoji,
  });
}

class PinnedResource {
  final String id;
  final String titleEn;
  final String titleHi;
  final String descriptionEn;
  final String descriptionHi;
  final String url;
  final String emoji;

  const PinnedResource({
    required this.id,
    required this.titleEn,
    required this.titleHi,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.url,
    required this.emoji,
  });
}

class ModerationResult {
  final bool isClean;
  final bool hasProfanity;
  final bool hasCrisisKeyword;
  final bool hasMedicalAdvice;
  final bool hasThreateningLanguage;
  final List<String> flaggedTerms;

  const ModerationResult({
    this.isClean = true,
    this.hasProfanity = false,
    this.hasCrisisKeyword = false,
    this.hasMedicalAdvice = false,
    this.hasThreateningLanguage = false,
    this.flaggedTerms = const [],
  });
}

// ─────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────

class CommunityState {
  final List<CommunityChannel> channels;
  final List<CommunityPost> posts;
  final List<ComfortCard> comfortCards;
  final List<PinnedResource> pinnedResources;
  final CommunityView currentView;
  final String? selectedChannelId;
  final String? selectedPostId;
  final bool isLoading;
  final bool isPostingInProgress;
  final String? errorMessage;
  final bool showCrisisDialog;
  final String? crisisDialogMessage;
  final bool isAnonymousMode;
  final int postsThisHour;
  final DateTime? lastPostTime;
  final List<CommunityPost> offlineQueue;
  final int userTrustScore;

  const CommunityState({
    this.channels = const [],
    this.posts = const [],
    this.comfortCards = const [],
    this.pinnedResources = const [],
    this.currentView = CommunityView.channels,
    this.selectedChannelId,
    this.selectedPostId,
    this.isLoading = false,
    this.isPostingInProgress = false,
    this.errorMessage,
    this.showCrisisDialog = false,
    this.crisisDialogMessage,
    this.isAnonymousMode = false,
    this.postsThisHour = 0,
    this.lastPostTime,
    this.offlineQueue = const [],
    this.userTrustScore = 0,
  });

  // ── Computed getters ──

  CommunityChannel? get selectedChannel {
    if (selectedChannelId == null) return null;
    try {
      return channels.firstWhere((c) => c.id == selectedChannelId);
    } catch (_) {
      return null;
    }
  }

  CommunityPost? get selectedPost {
    if (selectedPostId == null) return null;
    try {
      return posts.firstWhere((p) => p.id == selectedPostId);
    } catch (_) {
      return null;
    }
  }

  List<CommunityPost> get channelPosts {
    if (selectedChannelId == null) return [];
    return posts
        .where((p) =>
            p.channelId == selectedChannelId &&
            (p.moderationStatus == ModerationStatus.approved ||
             p.moderationStatus == ModerationStatus.autoApproved))
        .toList();
  }

  List<CommunityPost> get pendingOfflinePosts {
    return offlineQueue.where((p) => p.syncStatus == SyncStatus.pending).toList();
  }

  bool get isRateLimited => postsThisHour >= 5;

  bool get isAutoApproved => userTrustScore >= 10;

  List<ComfortCard> comfortCardsByCategory(ComfortCategory category) {
    return comfortCards.where((c) => c.category == category).toList();
  }

  CommunityState copyWith({
    List<CommunityChannel>? channels,
    List<CommunityPost>? posts,
    List<ComfortCard>? comfortCards,
    List<PinnedResource>? pinnedResources,
    CommunityView? currentView,
    String? selectedChannelId,
    String? selectedPostId,
    bool? isLoading,
    bool? isPostingInProgress,
    String? errorMessage,
    bool? showCrisisDialog,
    String? crisisDialogMessage,
    bool? isAnonymousMode,
    int? postsThisHour,
    DateTime? lastPostTime,
    List<CommunityPost>? offlineQueue,
    int? userTrustScore,
    bool clearSelectedChannel = false,
    bool clearSelectedPost = false,
    bool clearError = false,
    bool clearCrisisMessage = false,
  }) {
    return CommunityState(
      channels: channels ?? this.channels,
      posts: posts ?? this.posts,
      comfortCards: comfortCards ?? this.comfortCards,
      pinnedResources: pinnedResources ?? this.pinnedResources,
      currentView: currentView ?? this.currentView,
      selectedChannelId: clearSelectedChannel ? null : (selectedChannelId ?? this.selectedChannelId),
      selectedPostId: clearSelectedPost ? null : (selectedPostId ?? this.selectedPostId),
      isLoading: isLoading ?? this.isLoading,
      isPostingInProgress: isPostingInProgress ?? this.isPostingInProgress,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      showCrisisDialog: showCrisisDialog ?? this.showCrisisDialog,
      crisisDialogMessage: clearCrisisMessage ? null : (crisisDialogMessage ?? this.crisisDialogMessage),
      isAnonymousMode: isAnonymousMode ?? this.isAnonymousMode,
      postsThisHour: postsThisHour ?? this.postsThisHour,
      lastPostTime: lastPostTime ?? this.lastPostTime,
      offlineQueue: offlineQueue ?? this.offlineQueue,
      userTrustScore: userTrustScore ?? this.userTrustScore,
    );
  }
}

// ─────────────────────────────────────────────────────────
// Content Moderation Engine
// ─────────────────────────────────────────────────────────

class _ContentModerator {
  // English profanity word list (common terms + healthcare-context abusive words)
  static const List<String> _profanityEn = [
    'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'damn',
    'crap', 'dick', 'piss', 'slut', 'whore', 'cunt',
    'idiot', 'moron', 'stupid', 'retard', 'dumb',
  ];

  // Hindi profanity word list (Devanagari — common abusive terms)
  static const List<String> _profanityHi = [
    '\u092E\u093E\u0926\u0930\u091A\u094B\u0926',   // madarchod
    '\u092C\u0939\u0928\u091A\u094B\u0926',           // behenchod
    '\u091A\u0942\u0924\u093F\u092F\u093E',           // chutiya
    '\u0917\u093E\u0902\u0921\u0942',                 // gaandu
    '\u0939\u0930\u093E\u092E\u0940',                 // harami
    '\u0915\u092E\u0940\u0928\u093E',                 // kameena
    '\u0915\u0941\u0924\u094D\u0924\u093E',           // kutta
    '\u0938\u093E\u0932\u093E',                       // saala
    '\u0930\u0902\u0921\u0940',                       // randi
    '\u091A\u0942\u0938',                             // chus
    '\u092D\u094B\u0938\u0921\u0940',                 // bhosdi
    '\u0932\u094C\u0921\u093E',                       // lauda
  ];

  // Crisis keywords — trigger immediate helpline dialog
  static const List<String> _crisisKeywordsEn = [
    'suicide', 'kill myself', 'want to die', 'end my life',
    'self harm', 'self-harm', 'cutting myself', 'hurt myself',
    'no reason to live', 'better off dead', 'give up on life',
    'overdose', 'slit my wrists',
  ];

  static const List<String> _crisisKeywordsHi = [
    '\u0906\u0924\u094D\u092E\u0939\u0924\u094D\u092F\u093E',           // aatmahatya (suicide)
    '\u092E\u0930\u0928\u093E \u091A\u093E\u0939\u0924\u093E',         // marna chahta (want to die)
    '\u091C\u0940\u0928\u093E \u0928\u0939\u0940\u0902',               // jeena nahi (don't want to live)
    '\u0916\u0941\u0926 \u0915\u094B \u092E\u093E\u0930',               // khud ko maar (kill myself)
    '\u091C\u0940\u0935\u0928 \u0938\u092E\u093E\u092A\u094D\u0924',   // jeevan samapt (end life)
  ];

  // Medical advice phrases — flag for clinician review
  static const List<String> _medicalAdviceEn = [
    'stop your medication', 'stop taking medicine',
    'don\'t take your pills', 'throw away your meds',
    'try this cure', 'this will cure you',
    'doctors are wrong', 'don\'t trust doctors',
    'alternative cure', 'miracle treatment',
    'stop chemotherapy', 'stop radiation',
  ];

  static const List<String> _medicalAdviceHi = [
    '\u0926\u0935\u093E\u0908 \u092C\u0902\u0926 \u0915\u0930\u094B',     // dawai band karo (stop medicine)
    '\u0921\u0949\u0915\u094D\u091F\u0930 \u092A\u0930 \u092D\u0930\u094B\u0938\u093E', // doctor par bharosa (don't trust doctor)
    '\u0907\u0932\u093E\u091C \u091B\u094B\u0921\u094B',                   // ilaaj chodo (stop treatment)
  ];

  // Threatening language patterns
  static const List<String> _threateningEn = [
    'i will kill', 'i\'ll kill', 'gonna kill',
    'i will hurt', 'i\'ll hurt', 'beat you',
    'come find you', 'know where you live',
    'you deserve to die', 'hope you die',
    'threat', 'attack you',
  ];

  static const List<String> _threateningHi = [
    '\u092E\u093E\u0930 \u0921\u093E\u0932\u0942\u0902\u0917\u093E',     // maar dalunga (will kill)
    '\u0924\u0941\u091D\u0947 \u0926\u0947\u0916 \u0932\u0942\u0902\u0917\u093E', // tujhe dekh lunga (will get you)
  ];

  /// Scans text for profanity, crisis keywords, medical advice, and threats.
  /// Returns a [ModerationResult] indicating what was found.
  static ModerationResult scan(String text) {
    final lower = text.toLowerCase().trim();
    final flagged = <String>[];

    bool profanity = false;
    bool crisis = false;
    bool medical = false;
    bool threatening = false;

    // Check English profanity
    for (final word in _profanityEn) {
      if (lower.contains(word)) {
        profanity = true;
        flagged.add(word);
      }
    }

    // Check Hindi profanity
    for (final word in _profanityHi) {
      if (text.contains(word)) {
        profanity = true;
        flagged.add(word);
      }
    }

    // Check English crisis keywords
    for (final phrase in _crisisKeywordsEn) {
      if (lower.contains(phrase)) {
        crisis = true;
        flagged.add('[crisis] $phrase');
      }
    }

    // Check Hindi crisis keywords
    for (final phrase in _crisisKeywordsHi) {
      if (text.contains(phrase)) {
        crisis = true;
        flagged.add('[crisis] $phrase');
      }
    }

    // Check medical advice phrases
    for (final phrase in _medicalAdviceEn) {
      if (lower.contains(phrase)) {
        medical = true;
        flagged.add('[medical] $phrase');
      }
    }

    for (final phrase in _medicalAdviceHi) {
      if (text.contains(phrase)) {
        medical = true;
        flagged.add('[medical] $phrase');
      }
    }

    // Check threatening language
    for (final phrase in _threateningEn) {
      if (lower.contains(phrase)) {
        threatening = true;
        flagged.add('[threat] $phrase');
      }
    }

    for (final phrase in _threateningHi) {
      if (text.contains(phrase)) {
        threatening = true;
        flagged.add('[threat] $phrase');
      }
    }

    return ModerationResult(
      isClean: !profanity && !crisis && !medical && !threatening,
      hasProfanity: profanity,
      hasCrisisKeyword: crisis,
      hasMedicalAdvice: medical,
      hasThreateningLanguage: threatening,
      flaggedTerms: flagged,
    );
  }
}

// ─────────────────────────────────────────────────────────
// Notifier
// ─────────────────────────────────────────────────────────

class CommunityNotifier extends StateNotifier<CommunityState> {
  CommunityNotifier() : super(const CommunityState()) {
    _loadInitialData();
  }

  // ── Initialization ──

  void _loadInitialData() {
    state = state.copyWith(
      channels: _mockChannels,
      comfortCards: _comfortCards,
      pinnedResources: _pinnedResources,
      posts: _mockPosts,
      isLoading: false,
    );
  }

  // ── Navigation ──

  void selectChannel(String channelId) {
    state = state.copyWith(
      selectedChannelId: channelId,
      currentView: CommunityView.channelFeed,
      clearSelectedPost: true,
    );
  }

  void selectPost(String postId) {
    state = state.copyWith(
      selectedPostId: postId,
      currentView: CommunityView.postDetail,
    );
  }

  void openCompose() {
    state = state.copyWith(currentView: CommunityView.compose);
  }

  void goBack() {
    switch (state.currentView) {
      case CommunityView.compose:
      case CommunityView.postDetail:
        state = state.copyWith(
          currentView: CommunityView.channelFeed,
          clearSelectedPost: true,
        );
        break;
      case CommunityView.channelFeed:
        state = state.copyWith(
          currentView: CommunityView.channels,
          clearSelectedChannel: true,
        );
        break;
      case CommunityView.channels:
        break;
    }
  }

  // ── Channel Actions ──

  void joinChannel(String channelId) {
    final updated = state.channels.map((c) {
      if (c.id == channelId) {
        return c.copyWith(
          isJoined: true,
          memberCount: c.memberCount + 1,
        );
      }
      return c;
    }).toList();
    state = state.copyWith(channels: updated);
  }

  void leaveChannel(String channelId) {
    final updated = state.channels.map((c) {
      if (c.id == channelId) {
        return c.copyWith(
          isJoined: false,
          memberCount: c.memberCount > 0 ? c.memberCount - 1 : 0,
        );
      }
      return c;
    }).toList();
    state = state.copyWith(channels: updated);
  }

  // ── Toggle Anonymous ──

  void toggleAnonymous() {
    state = state.copyWith(isAnonymousMode: !state.isAnonymousMode);
  }

  // ── Post Creation ──

  /// Validates, moderates, and creates a new post.
  /// Returns `true` if the post was accepted, `false` if rejected.
  bool createPost({
    required String contentEn,
    required String contentHi,
    PostType type = PostType.text,
    String? comfortCardId,
  }) {
    // Rate limiting: max 5 posts per hour
    if (state.isRateLimited) {
      state = state.copyWith(
        errorMessage: 'You can post up to 5 times per hour. Please wait.',
      );
      return false;
    }

    if (state.selectedChannelId == null) return false;

    // Content moderation scan
    final moderationEn = _ContentModerator.scan(contentEn);
    final moderationHi = _ContentModerator.scan(contentHi);

    // Crisis keyword detection — show helpline dialog immediately
    if (moderationEn.hasCrisisKeyword || moderationHi.hasCrisisKeyword) {
      state = state.copyWith(
        showCrisisDialog: true,
        crisisDialogMessage: _buildCrisisMessage(),
      );
      // Still allow the post after showing resources, but flag for review
    }

    // Profanity or threatening → reject
    if (moderationEn.hasProfanity || moderationHi.hasProfanity ||
        moderationEn.hasThreateningLanguage || moderationHi.hasThreateningLanguage) {
      state = state.copyWith(
        errorMessage: 'Your message contains inappropriate language. Please revise.',
      );
      return false;
    }

    // Determine moderation status
    ModerationStatus modStatus;
    if (moderationEn.hasMedicalAdvice || moderationHi.hasMedicalAdvice) {
      modStatus = ModerationStatus.flagged; // Needs clinician review
    } else if (state.isAutoApproved) {
      modStatus = ModerationStatus.autoApproved; // Trusted user
    } else {
      modStatus = ModerationStatus.pending; // Standard review
    }

    // For comfort cards, auto-approve always (pre-written safe content)
    if (type == PostType.comfortCard) {
      modStatus = ModerationStatus.autoApproved;
    }

    final now = DateTime.now();
    final postId = 'post_${now.millisecondsSinceEpoch}';

    final newPost = CommunityPost(
      id: postId,
      channelId: state.selectedChannelId!,
      authorId: 'current_user',
      authorNameEn: state.isAnonymousMode ? 'Anonymous' : 'You',
      authorNameHi: state.isAnonymousMode
          ? '\u0905\u091C\u094D\u091E\u093E\u0924'   // Ajgyaat (Anonymous)
          : '\u0906\u092A',                            // Aap (You)
      type: type,
      contentEn: contentEn,
      contentHi: contentHi,
      comfortCardId: comfortCardId,
      isAnonymous: state.isAnonymousMode,
      moderationStatus: modStatus,
      createdAt: now.toIso8601String(),
      syncStatus: SyncStatus.pending, // Start as pending, sync when online
    );

    // Add to posts and offline queue
    final updatedPosts = [newPost, ...state.posts];
    final updatedQueue = [...state.offlineQueue, newPost];

    state = state.copyWith(
      posts: updatedPosts,
      offlineQueue: updatedQueue,
      postsThisHour: state.postsThisHour + 1,
      lastPostTime: now,
      currentView: CommunityView.channelFeed,
      clearError: true,
    );

    return true;
  }

  /// Creates a reply on a post.
  bool createReply({
    required String postId,
    required String contentEn,
    required String contentHi,
    String? comfortCardId,
  }) {
    if (state.isRateLimited) {
      state = state.copyWith(
        errorMessage: 'You can post up to 5 times per hour. Please wait.',
      );
      return false;
    }

    // Moderation scan
    final moderationEn = _ContentModerator.scan(contentEn);
    final moderationHi = _ContentModerator.scan(contentHi);

    if (moderationEn.hasCrisisKeyword || moderationHi.hasCrisisKeyword) {
      state = state.copyWith(
        showCrisisDialog: true,
        crisisDialogMessage: _buildCrisisMessage(),
      );
    }

    if (moderationEn.hasProfanity || moderationHi.hasProfanity ||
        moderationEn.hasThreateningLanguage || moderationHi.hasThreateningLanguage) {
      state = state.copyWith(
        errorMessage: 'Your reply contains inappropriate language. Please revise.',
      );
      return false;
    }

    ModerationStatus modStatus;
    if (moderationEn.hasMedicalAdvice || moderationHi.hasMedicalAdvice) {
      modStatus = ModerationStatus.flagged;
    } else if (state.isAutoApproved) {
      modStatus = ModerationStatus.autoApproved;
    } else {
      modStatus = ModerationStatus.pending;
    }

    if (comfortCardId != null) {
      modStatus = ModerationStatus.autoApproved;
    }

    final now = DateTime.now();
    final replyId = 'reply_${now.millisecondsSinceEpoch}';

    final newReply = PostReply(
      id: replyId,
      postId: postId,
      authorId: 'current_user',
      authorNameEn: state.isAnonymousMode ? 'Anonymous' : 'You',
      authorNameHi: state.isAnonymousMode
          ? '\u0905\u091C\u094D\u091E\u093E\u0924'
          : '\u0906\u092A',
      contentEn: contentEn,
      contentHi: contentHi,
      comfortCardId: comfortCardId,
      isAnonymous: state.isAnonymousMode,
      moderationStatus: modStatus,
      createdAt: now.toIso8601String(),
      syncStatus: SyncStatus.pending,
    );

    final updatedPosts = state.posts.map((p) {
      if (p.id == postId) {
        return p.copyWith(
          replies: [...p.replies, newReply],
          replyCount: p.replyCount + 1,
        );
      }
      return p;
    }).toList();

    state = state.copyWith(
      posts: updatedPosts,
      postsThisHour: state.postsThisHour + 1,
      lastPostTime: now,
      clearError: true,
    );

    return true;
  }

  // ── Support (Hug Reaction) ──

  void toggleSupport(String postId) {
    final updatedPosts = state.posts.map((p) {
      if (p.id == postId) {
        return p.copyWith(
          hasSupportedByMe: !p.hasSupportedByMe,
          supportCount: p.hasSupportedByMe
              ? p.supportCount - 1
              : p.supportCount + 1,
        );
      }
      return p;
    }).toList();
    state = state.copyWith(posts: updatedPosts);
  }

  void toggleReplySupport(String postId, String replyId) {
    final updatedPosts = state.posts.map((p) {
      if (p.id == postId) {
        final updatedReplies = p.replies.map((r) {
          if (r.id == replyId) {
            return r.copyWith(
              hasSupportedByMe: !r.hasSupportedByMe,
              supportCount: r.hasSupportedByMe
                  ? r.supportCount - 1
                  : r.supportCount + 1,
            );
          }
          return r;
        }).toList();
        return p.copyWith(replies: updatedReplies);
      }
      return p;
    }).toList();
    state = state.copyWith(posts: updatedPosts);
  }

  // ── Report ──

  void reportPost(String postId, ReportReason reason, {String? details}) {
    final updatedPosts = state.posts.map((p) {
      if (p.id == postId) {
        return p.copyWith(moderationStatus: ModerationStatus.flagged);
      }
      return p;
    }).toList();
    state = state.copyWith(posts: updatedPosts);
    // TODO: Send report to API for clinician review
  }

  // ── Crisis Dialog ──

  void dismissCrisisDialog() {
    state = state.copyWith(
      showCrisisDialog: false,
      clearCrisisMessage: true,
    );
  }

  String _buildCrisisMessage() {
    return 'crisis_resources'; // Signal for UI to show the full crisis dialog
  }

  // ── Error Handling ──

  void clearError() {
    state = state.copyWith(clearError: true);
  }

  // ── Offline Sync ──

  void syncOfflineQueue() {
    if (state.offlineQueue.isEmpty) return;

    // Mark all pending posts as synced (in real app, this calls API)
    final syncedPosts = state.posts.map((p) {
      if (p.syncStatus == SyncStatus.pending) {
        return p.copyWith(syncStatus: SyncStatus.synced);
      }
      return p;
    }).toList();

    state = state.copyWith(
      posts: syncedPosts,
      offlineQueue: [],
    );
  }

  void retryFailedSync(String postId) {
    final updatedQueue = state.offlineQueue.map((p) {
      if (p.id == postId && p.syncStatus == SyncStatus.failed) {
        return p.copyWith(syncStatus: SyncStatus.pending);
      }
      return p;
    }).toList();
    state = state.copyWith(offlineQueue: updatedQueue);
  }

  // ── Rate Limit Reset ──

  void resetRateLimitIfNeeded() {
    if (state.lastPostTime == null) return;
    final elapsed = DateTime.now().difference(state.lastPostTime!);
    if (elapsed.inMinutes >= 60) {
      state = state.copyWith(postsThisHour: 0);
    }
  }
}

// ─────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────

final communityProvider = StateNotifierProvider<CommunityNotifier, CommunityState>(
  (ref) => CommunityNotifier(),
);

// ─────────────────────────────────────────────────────────
// Static Data — Channels (6 disease-phase channels)
// ─────────────────────────────────────────────────────────

const List<CommunityChannel> _mockChannels = [
  CommunityChannel(
    id: 'ch_newly_diagnosed',
    phase: DiseasePhase.newlyDiagnosed,
    nameEn: 'Newly Diagnosed',
    nameHi: '\u0928\u0908 \u0924\u0936\u094D\u0916\u0940\u0938',  // Nai Tashkhees
    descriptionEn: 'A safe space for those recently diagnosed. Share your feelings, ask questions, and find comfort from others who understand.',
    descriptionHi: '\u0939\u093E\u0932 \u0939\u0940 \u092E\u0947\u0902 \u0928\u093F\u0926\u093E\u0928 \u092A\u093E\u0928\u0947 \u0935\u093E\u0932\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0938\u094D\u0925\u093E\u0928\u0964 \u0905\u092A\u0928\u0940 \u092D\u093E\u0935\u0928\u093E\u090F\u0902 \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902\u0964',
    emoji: '\ud83c\udf31',
    memberCount: 142,
    postCount: 87,
    lastActivityAt: '2026-02-26T09:30:00',
  ),
  CommunityChannel(
    id: 'ch_active_treatment',
    phase: DiseasePhase.activeTreatment,
    nameEn: 'Active Treatment',
    nameHi: '\u0938\u0915\u094D\u0930\u093F\u092F \u0909\u092A\u091A\u093E\u0930',  // Sakriya Upchar
    descriptionEn: 'For patients currently undergoing treatment. Share experiences, side effects management tips, and encouragement.',
    descriptionHi: '\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0947\u0902 \u0909\u092A\u091A\u093E\u0930 \u0915\u0930\u093E \u0930\u0939\u0947 \u0930\u094B\u0917\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F\u0964 \u0905\u0928\u0941\u092D\u0935 \u0914\u0930 \u0938\u0941\u091D\u093E\u0935 \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902\u0964',
    emoji: '\ud83d\udcaa',
    memberCount: 238,
    postCount: 312,
    lastActivityAt: '2026-02-26T10:15:00',
  ),
  CommunityChannel(
    id: 'ch_chronic_pain',
    phase: DiseasePhase.chronicPain,
    nameEn: 'Chronic Pain Management',
    nameHi: '\u0926\u0940\u0930\u094D\u0918\u0915\u093E\u0932\u093F\u0915 \u0926\u0930\u094D\u0926 \u092A\u094D\u0930\u092C\u0902\u0927\u0928',  // Deerghakalik Dard Prabandhan
    descriptionEn: 'Living with chronic pain is a daily journey. Connect with others who truly understand what you are going through.',
    descriptionHi: '\u092A\u0941\u0930\u093E\u0928\u0947 \u0926\u0930\u094D\u0926 \u0915\u0947 \u0938\u093E\u0925 \u091C\u0940\u0928\u093E \u090F\u0915 \u0926\u0948\u0928\u093F\u0915 \u092F\u093E\u0924\u094D\u0930\u093E \u0939\u0948\u0964 \u0909\u0928 \u0932\u094B\u0917\u094B\u0902 \u0938\u0947 \u091C\u0941\u0921\u093C\u0947\u0902 \u091C\u094B \u0938\u091A\u092E\u0941\u091A \u0938\u092E\u091D\u0924\u0947 \u0939\u0948\u0902\u0964',
    emoji: '\ud83e\ude79',
    memberCount: 195,
    postCount: 256,
    lastActivityAt: '2026-02-26T08:45:00',
  ),
  CommunityChannel(
    id: 'ch_end_of_life',
    phase: DiseasePhase.endOfLife,
    nameEn: 'End of Life Care',
    nameHi: '\u091C\u0940\u0935\u0928 \u0915\u0947 \u0905\u0902\u0924\u093F\u092E \u091A\u0930\u0923 \u0915\u0940 \u0926\u0947\u0916\u092D\u093E\u0932',  // Jeevan ke Antim Charan ki Dekhbhaal
    descriptionEn: 'A gentle, compassionate space for patients and families navigating end-of-life care. You are not alone.',
    descriptionHi: '\u091C\u0940\u0935\u0928 \u0915\u0947 \u0905\u0902\u0924\u093F\u092E \u091A\u0930\u0923 \u092E\u0947\u0902 \u0930\u094B\u0917\u093F\u092F\u094B\u0902 \u0914\u0930 \u092A\u0930\u093F\u0935\u093E\u0930\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0938\u0902\u0935\u0947\u0926\u0928\u0936\u0940\u0932 \u0938\u094D\u0925\u093E\u0928\u0964 \u0906\u092A \u0905\u0915\u0947\u0932\u0947 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902\u0964',
    emoji: '\ud83d\udd4a\ufe0f',
    memberCount: 76,
    postCount: 45,
    lastActivityAt: '2026-02-25T22:10:00',
  ),
  CommunityChannel(
    id: 'ch_survivorship',
    phase: DiseasePhase.survivorship,
    nameEn: 'Survivorship',
    nameHi: '\u091C\u0940\u0935\u0928 \u0915\u0947 \u092C\u093E\u0926',  // Jeevan ke Baad (After Life / Survivorship)
    descriptionEn: 'For those in remission or recovery. Celebrate milestones, share coping strategies, and support each other.',
    descriptionHi: '\u091C\u094B \u0930\u094B\u0917 \u0938\u0947 \u0909\u092D\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902 \u0909\u0928\u0915\u0947 \u0932\u093F\u090F\u0964 \u0909\u092A\u0932\u092C\u094D\u0927\u093F\u092F\u093E\u0902 \u092E\u0928\u093E\u090F\u0902 \u0914\u0930 \u090F\u0915-\u0926\u0942\u0938\u0930\u0947 \u0915\u093E \u0938\u093E\u0925 \u0926\u0947\u0902\u0964',
    emoji: '\u2728',
    memberCount: 113,
    postCount: 178,
    lastActivityAt: '2026-02-26T07:20:00',
  ),
  CommunityChannel(
    id: 'ch_caregiver_support',
    phase: DiseasePhase.caregiverSupport,
    nameEn: 'Caregiver Support',
    nameHi: '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E \u0938\u0939\u093E\u092F\u0924\u093E',  // Dekhbhalkarta Sahayata
    descriptionEn: 'Dedicated to caregivers. Share the emotional weight, find practical advice, and remember to care for yourself too.',
    descriptionHi: '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u0938\u092E\u0930\u094D\u092A\u093F\u0924\u0964 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u092C\u094B\u091D \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902 \u0914\u0930 \u0905\u092A\u0928\u093E \u092D\u0940 \u0916\u094D\u092F\u093E\u0932 \u0930\u0916\u0947\u0902\u0964',
    emoji: '\ud83e\udec2',
    memberCount: 164,
    postCount: 201,
    lastActivityAt: '2026-02-26T11:00:00',
  ),
];

// ─────────────────────────────────────────────────────────
// Static Data — 16 Comfort Cards (4 categories × 4 cards)
// ─────────────────────────────────────────────────────────

const List<ComfortCard> _comfortCards = [
  // ── Encouragement ──
  ComfortCard(
    id: 'comfort_enc_1',
    category: ComfortCategory.encouragement,
    messageEn: 'You are braver than you believe. One day at a time.',
    messageHi: '\u0906\u092A \u0905\u092A\u0928\u0940 \u0938\u094B\u091A \u0938\u0947 \u0915\u0939\u0940\u0902 \u0905\u0927\u093F\u0915 \u092C\u0939\u093E\u0926\u0941\u0930 \u0939\u0948\u0902\u0964 \u090F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u090F\u0915 \u0926\u093F\u0928\u0964',
    emoji: '\ud83c\udf1f',
  ),
  ComfortCard(
    id: 'comfort_enc_2',
    category: ComfortCategory.encouragement,
    messageEn: 'Every small step forward is a victory. Keep going.',
    messageHi: '\u0939\u0930 \u091B\u094B\u091F\u093E \u0915\u0926\u092E \u0906\u0917\u0947 \u090F\u0915 \u091C\u0940\u0924 \u0939\u0948\u0964 \u091A\u0932\u0924\u0947 \u0930\u0939\u094B\u0964',
    emoji: '\ud83d\udc63',
  ),
  ComfortCard(
    id: 'comfort_enc_3',
    category: ComfortCategory.encouragement,
    messageEn: 'Your strength inspires everyone around you.',
    messageHi: '\u0906\u092A\u0915\u0940 \u0924\u093E\u0915\u0924 \u0906\u092A\u0915\u0947 \u0906\u0938\u092A\u093E\u0938 \u0938\u092C\u0915\u094B \u092A\u094D\u0930\u0947\u0930\u093F\u0924 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964',
    emoji: '\ud83d\udcab',
  ),
  ComfortCard(
    id: 'comfort_enc_4',
    category: ComfortCategory.encouragement,
    messageEn: 'Tomorrow holds new possibilities. Hold on.',
    messageHi: '\u0915\u0932 \u0928\u0908 \u0938\u0902\u092D\u093E\u0935\u0928\u093E\u090F\u0902 \u0932\u0947\u0915\u0930 \u0906\u090F\u0917\u093E\u0964 \u0939\u093F\u092E\u094D\u092E\u0924 \u0930\u0916\u094B\u0964',
    emoji: '\ud83c\udf05',
  ),

  // ── Empathy ──
  ComfortCard(
    id: 'comfort_emp_1',
    category: ComfortCategory.empathy,
    messageEn: 'I understand your pain. You are not alone in this.',
    messageHi: '\u092E\u0948\u0902 \u0906\u092A\u0915\u093E \u0926\u0930\u094D\u0926 \u0938\u092E\u091D\u0924\u093E/\u0938\u092E\u091D\u0924\u0940 \u0939\u0942\u0901\u0964 \u0906\u092A \u0907\u0938\u092E\u0947\u0902 \u0905\u0915\u0947\u0932\u0947 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902\u0964',
    emoji: '\ud83e\udec2',
  ),
  ComfortCard(
    id: 'comfort_emp_2',
    category: ComfortCategory.empathy,
    messageEn: 'It is okay to have hard days. We are here with you.',
    messageHi: '\u0915\u0920\u093F\u0928 \u0926\u093F\u0928 \u0906\u0928\u093E \u0920\u0940\u0915 \u0939\u0948\u0964 \u0939\u092E \u0906\u092A\u0915\u0947 \u0938\u093E\u0925 \u0939\u0948\u0902\u0964',
    emoji: '\ud83e\udd17',
  ),
  ComfortCard(
    id: 'comfort_emp_3',
    category: ComfortCategory.empathy,
    messageEn: 'Your feelings are valid. Take all the time you need.',
    messageHi: '\u0906\u092A\u0915\u0940 \u092D\u093E\u0935\u0928\u093E\u090F\u0902 \u0938\u0939\u0940 \u0939\u0948\u0902\u0964 \u091C\u093F\u0924\u0928\u093E \u0938\u092E\u092F \u091A\u093E\u0939\u093F\u090F \u0932\u0947\u0902\u0964',
    emoji: '\ud83d\udc9c',
  ),
  ComfortCard(
    id: 'comfort_emp_4',
    category: ComfortCategory.empathy,
    messageEn: 'I have been where you are. It does get easier.',
    messageHi: '\u092E\u0948\u0902 \u092D\u0940 \u0935\u0939\u0940\u0902 \u0930\u0939\u093E/\u0930\u0939\u0940 \u0939\u0942\u0901 \u091C\u0939\u093E\u0901 \u0906\u092A \u0939\u0948\u0902\u0964 \u092F\u0939 \u0906\u0938\u093E\u0928 \u0939\u094B\u0924\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964',
    emoji: '\ud83e\udd1d',
  ),

  // ── Strength ──
  ComfortCard(
    id: 'comfort_str_1',
    category: ComfortCategory.strength,
    messageEn: 'You are a warrior. This disease does not define you.',
    messageHi: '\u0906\u092A \u090F\u0915 \u092F\u094B\u0926\u094D\u0927\u093E \u0939\u0948\u0902\u0964 \u092F\u0939 \u092C\u0940\u092E\u093E\u0930\u0940 \u0906\u092A\u0915\u094B \u092A\u0930\u093F\u092D\u093E\u0937\u093F\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930\u0924\u0940\u0964',
    emoji: '\u2694\ufe0f',
  ),
  ComfortCard(
    id: 'comfort_str_2',
    category: ComfortCategory.strength,
    messageEn: 'You have survived 100% of your worst days.',
    messageHi: '\u0906\u092A\u0928\u0947 \u0905\u092A\u0928\u0947 \u0938\u092C\u0938\u0947 \u092C\u0941\u0930\u0947 \u0926\u093F\u0928\u094B\u0902 \u092E\u0947\u0902 100% \u091C\u0940\u0924 \u0939\u093E\u0938\u093F\u0932 \u0915\u0940 \u0939\u0948\u0964',
    emoji: '\ud83d\udee1\ufe0f',
  ),
  ComfortCard(
    id: 'comfort_str_3',
    category: ComfortCategory.strength,
    messageEn: 'Your courage is remarkable. We stand with you.',
    messageHi: '\u0906\u092A\u0915\u093E \u0938\u093E\u0939\u0938 \u0905\u0926\u094D\u092D\u0941\u0924 \u0939\u0948\u0964 \u0939\u092E \u0906\u092A\u0915\u0947 \u0938\u093E\u0925 \u0916\u0921\u093C\u0947 \u0939\u0948\u0902\u0964',
    emoji: '\ud83d\udcaa',
  ),
  ComfortCard(
    id: 'comfort_str_4',
    category: ComfortCategory.strength,
    messageEn: 'Even on tough days, you show incredible resilience.',
    messageHi: '\u0915\u0920\u093F\u0928 \u0926\u093F\u0928\u094B\u0902 \u092E\u0947\u0902 \u092D\u0940, \u0906\u092A \u0905\u0926\u094D\u092D\u0941\u0924 \u0932\u091A\u0940\u0932\u093E\u092A\u0928 \u0926\u093F\u0916\u093E\u0924\u0947 \u0939\u0948\u0902\u0964',
    emoji: '\ud83c\udf3f',
  ),

  // ── Peace ──
  ComfortCard(
    id: 'comfort_pce_1',
    category: ComfortCategory.peace,
    messageEn: 'May today bring you moments of calm and comfort.',
    messageHi: '\u0906\u091C \u0915\u093E \u0926\u093F\u0928 \u0906\u092A\u0915\u094B \u0936\u093E\u0902\u0924\u093F \u0914\u0930 \u0906\u0930\u093E\u092E \u0915\u0947 \u092A\u0932 \u0926\u0947\u0964',
    emoji: '\ud83d\udd4a\ufe0f',
  ),
  ComfortCard(
    id: 'comfort_pce_2',
    category: ComfortCategory.peace,
    messageEn: 'Rest when you need to. Healing is not a race.',
    messageHi: '\u091C\u092C \u091C\u093C\u0930\u0942\u0930\u0924 \u0939\u094B \u0906\u0930\u093E\u092E \u0915\u0930\u0947\u0902\u0964 \u0909\u092A\u091A\u093E\u0930 \u0915\u094B\u0908 \u0926\u094C\u0921\u093C \u0928\u0939\u0940\u0902 \u0939\u0948\u0964',
    emoji: '\ud83c\udf3a',
  ),
  ComfortCard(
    id: 'comfort_pce_3',
    category: ComfortCategory.peace,
    messageEn: 'Breathe in hope, breathe out worry.',
    messageHi: '\u0906\u0936\u093E \u0915\u094B \u0938\u093E\u0901\u0938 \u0932\u0947\u0902, \u091A\u093F\u0902\u0924\u093E \u0915\u094B \u092C\u093E\u0939\u0930 \u091B\u094B\u0921\u093C\u0947\u0902\u0964',
    emoji: '\ud83c\udf43',
  ),
  ComfortCard(
    id: 'comfort_pce_4',
    category: ComfortCategory.peace,
    messageEn: 'You are surrounded by love, even when it feels distant.',
    messageHi: '\u0906\u092A \u092A\u094D\u092F\u093E\u0930 \u0938\u0947 \u0918\u093F\u0930\u0947 \u0939\u0948\u0902, \u092D\u0932\u0947 \u0939\u0940 \u092F\u0939 \u0926\u0942\u0930 \u0932\u0917\u0947\u0964',
    emoji: '\ud83d\udc95',
  ),
];

// ─────────────────────────────────────────────────────────
// Static Data — Pinned Resources (crisis helplines)
// ─────────────────────────────────────────────────────────

const List<PinnedResource> _pinnedResources = [
  PinnedResource(
    id: 'res_icall',
    titleEn: 'iCall — Psychosocial Helpline',
    titleHi: 'iCall \u2014 \u092E\u0928\u094B\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928',
    descriptionEn: 'Mon-Sat 8AM-10PM • 9152987821',
    descriptionHi: '\u0938\u094B\u092E-\u0936\u0928\u093F 8AM-10PM \u2022 9152987821',
    url: 'tel:9152987821',
    emoji: '\ud83d\udcde',
  ),
  PinnedResource(
    id: 'res_vandrevala',
    titleEn: 'Vandrevala Foundation — 24/7 Helpline',
    titleHi: 'Vandrevala Foundation \u2014 24/7 \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928',
    descriptionEn: '24/7 toll-free • 1860-2662-345',
    descriptionHi: '24/7 \u091F\u094B\u0932-\u092B\u094D\u0930\u0940 \u2022 1860-2662-345',
    url: 'tel:18602662345',
    emoji: '\ud83c\udfe5',
  ),
  PinnedResource(
    id: 'res_aiims',
    titleEn: 'AIIMS Bhopal — Palliative Care',
    titleHi: 'AIIMS \u092D\u094B\u092A\u093E\u0932 \u2014 \u092A\u0948\u0932\u093F\u090F\u091F\u093F\u0935 \u0915\u0947\u092F\u0930',
    descriptionEn: 'Mon-Fri 9AM-5PM • 0755-2672317',
    descriptionHi: '\u0938\u094B\u092E-\u0936\u0941\u0915\u094D\u0930 9AM-5PM \u2022 0755-2672317',
    url: 'tel:07552672317',
    emoji: '\ud83c\udfe8',
  ),
  PinnedResource(
    id: 'res_kiran',
    titleEn: 'KIRAN Mental Health Helpline',
    titleHi: 'KIRAN \u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928',
    descriptionEn: '24/7 toll-free • 1800-599-0019',
    descriptionHi: '24/7 \u091F\u094B\u0932-\u092B\u094D\u0930\u0940 \u2022 1800-599-0019',
    url: 'tel:18005990019',
    emoji: '\ud83d\udcf1',
  ),
];

// ─────────────────────────────────────────────────────────
// Static Data — Mock Posts (sample content)
// ─────────────────────────────────────────────────────────

const List<CommunityPost> _mockPosts = [
  CommunityPost(
    id: 'post_001',
    channelId: 'ch_newly_diagnosed',
    authorId: 'user_anita',
    authorNameEn: 'Anita',
    authorNameHi: '\u0905\u0928\u093F\u0924\u093E',
    type: PostType.text,
    contentEn: 'I was diagnosed last week. I feel scared and confused. Is this normal? How did you all cope with the first few days?',
    contentHi: '\u092A\u093F\u091B\u0932\u0947 \u0939\u092B\u094D\u0924\u0947 \u092E\u0947\u0930\u0940 \u0924\u0936\u094D\u0916\u0940\u0938 \u0939\u0941\u0908\u0964 \u092E\u0941\u091D\u0947 \u0921\u0930 \u0914\u0930 \u092D\u094D\u0930\u092E \u0932\u0917 \u0930\u0939\u093E \u0939\u0948\u0964 \u0915\u094D\u092F\u093E \u092F\u0939 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948? \u0906\u092A \u0938\u092C\u0928\u0947 \u092A\u0939\u0932\u0947 \u0926\u093F\u0928\u094B\u0902 \u092E\u0947\u0902 \u0915\u0948\u0938\u0947 \u0938\u092E\u094D\u092D\u093E\u0932\u093E?',
    supportCount: 24,
    replyCount: 8,
    moderationStatus: ModerationStatus.approved,
    createdAt: '2026-02-25T14:30:00',
    replies: [
      PostReply(
        id: 'reply_001a',
        postId: 'post_001',
        authorId: 'user_rajesh',
        authorNameEn: 'Rajesh',
        authorNameHi: '\u0930\u093E\u091C\u0947\u0936',
        contentEn: 'It is completely normal to feel this way. I felt the same when I was diagnosed. Take it one day at a time. We are all here for you.',
        contentHi: '\u0910\u0938\u093E \u092E\u0939\u0938\u0942\u0938 \u0915\u0930\u0928\u093E \u092C\u093F\u0932\u0915\u0941\u0932 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948\u0964 \u092E\u0941\u091D\u0947 \u092D\u0940 \u0910\u0938\u093E \u0939\u0940 \u0932\u0917\u093E \u0925\u093E\u0964 \u090F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u090F\u0915 \u0926\u093F\u0928\u0964 \u0939\u092E \u0938\u092C \u0906\u092A\u0915\u0947 \u0938\u093E\u0925 \u0939\u0948\u0902\u0964',
        supportCount: 12,
        moderationStatus: ModerationStatus.approved,
        createdAt: '2026-02-25T15:10:00',
      ),
    ],
  ),
  CommunityPost(
    id: 'post_002',
    channelId: 'ch_active_treatment',
    authorId: 'user_meera',
    authorNameEn: 'Meera',
    authorNameHi: '\u092E\u0940\u0930\u093E',
    type: PostType.text,
    contentEn: 'Finished my 4th chemo cycle today. The nausea is terrible but knowing I am more than halfway done keeps me going. Sending strength to everyone in treatment.',
    contentHi: '\u0906\u091C \u0905\u092A\u0928\u093E \u091A\u094C\u0925\u093E \u0915\u0940\u092E\u094B \u091A\u0915\u094D\u0930 \u092A\u0942\u0930\u093E \u0915\u093F\u092F\u093E\u0964 \u092E\u093F\u091A\u0932\u0940 \u092C\u0939\u0941\u0924 \u0939\u0948 \u0932\u0947\u0915\u093F\u0928 \u0906\u0927\u0947 \u0938\u0947 \u0905\u0927\u093F\u0915 \u092A\u0942\u0930\u093E \u0939\u094B\u0928\u0947 \u0915\u0940 \u0909\u092E\u094D\u092E\u0940\u0926 \u091A\u0932\u093E\u0924\u0940 \u0939\u0948\u0964 \u0938\u092C\u0915\u094B \u0924\u093E\u0915\u0924 \u092D\u0947\u091C \u0930\u0939\u0940 \u0939\u0942\u0901\u0964',
    supportCount: 45,
    replyCount: 12,
    moderationStatus: ModerationStatus.approved,
    createdAt: '2026-02-26T09:45:00',
  ),
  CommunityPost(
    id: 'post_003',
    channelId: 'ch_chronic_pain',
    authorId: 'user_anon',
    authorNameEn: 'Anonymous',
    authorNameHi: '\u0905\u091C\u094D\u091E\u093E\u0924',
    type: PostType.text,
    contentEn: 'Today was a 7 on the pain scale. I tried the breathing exercises from the app and it helped bring it down to a 5. Small wins matter.',
    contentHi: '\u0906\u091C \u0926\u0930\u094D\u0926 \u092A\u0948\u092E\u093E\u0928\u0947 \u092A\u0930 7 \u0925\u093E\u0964 \u092E\u0948\u0902\u0928\u0947 \u0910\u092A \u0938\u0947 \u0938\u093E\u0901\u0938 \u0915\u0947 \u0905\u092D\u094D\u092F\u093E\u0938 \u0915\u093F\u090F \u0914\u0930 \u092F\u0939 5 \u0924\u0915 \u0906 \u0917\u092F\u093E\u0964 \u091B\u094B\u091F\u0940 \u091C\u0940\u0924 \u092E\u093E\u092F\u0928\u0947 \u0930\u0916\u0924\u0940 \u0939\u0948\u0902\u0964',
    isAnonymous: true,
    supportCount: 31,
    replyCount: 5,
    moderationStatus: ModerationStatus.approved,
    createdAt: '2026-02-26T08:00:00',
  ),
  CommunityPost(
    id: 'post_004',
    channelId: 'ch_caregiver_support',
    authorId: 'user_sunita',
    authorNameEn: 'Sunita',
    authorNameHi: '\u0938\u0941\u0928\u0940\u0924\u093E',
    type: PostType.comfortCard,
    contentEn: 'You are braver than you believe. One day at a time.',
    contentHi: '\u0906\u092A \u0905\u092A\u0928\u0940 \u0938\u094B\u091A \u0938\u0947 \u0915\u0939\u0940\u0902 \u0905\u0927\u093F\u0915 \u092C\u0939\u093E\u0926\u0941\u0930 \u0939\u0948\u0902\u0964 \u090F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u090F\u0915 \u0926\u093F\u0928\u0964',
    comfortCardId: 'comfort_enc_1',
    supportCount: 18,
    replyCount: 2,
    moderationStatus: ModerationStatus.autoApproved,
    createdAt: '2026-02-26T10:30:00',
  ),
  CommunityPost(
    id: 'post_005',
    channelId: 'ch_survivorship',
    authorId: 'user_vikram',
    authorNameEn: 'Vikram',
    authorNameHi: '\u0935\u093F\u0915\u094D\u0930\u092E',
    type: PostType.milestone,
    contentEn: '6 months in remission today! Never thought I would get here. Thank you all for your support throughout my journey.',
    contentHi: '\u0906\u091C 6 \u092E\u0939\u0940\u0928\u0947 \u0915\u0940 \u091B\u0942\u091F \u092E\u0947\u0902 \u0939\u0942\u0901! \u0915\u092D\u0940 \u0928\u0939\u0940\u0902 \u0938\u094B\u091A\u093E \u0925\u093E \u0915\u093F \u092F\u0939\u093E\u0901 \u092A\u0939\u0941\u0901\u091A\u0942\u0901\u0917\u093E\u0964 \u092E\u0947\u0930\u0940 \u092F\u093E\u0924\u094D\u0930\u093E \u092E\u0947\u0902 \u0906\u092A \u0938\u092C\u0915\u0947 \u0938\u092E\u0930\u094D\u0925\u0928 \u0915\u0947 \u0932\u093F\u090F \u0927\u0928\u094D\u092F\u0935\u093E\u0926\u0964',
    supportCount: 67,
    replyCount: 15,
    moderationStatus: ModerationStatus.approved,
    createdAt: '2026-02-26T07:15:00',
  ),
];
