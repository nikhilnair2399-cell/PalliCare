import 'package:flutter_riverpod/flutter_riverpod.dart';

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------

/// Recording state for voice capture.
enum RecordingStatus { idle, recording, paused, processing }

/// Playback state for audio entries.
enum PlaybackStatus { idle, playing, paused }

/// Category of comfort audio tracks.
enum ComfortCategory { affirmation, prayer, nature, guided, story }

/// Mood tag for voice journal entries.
enum VoiceJournalMood { peaceful, hopeful, tired, anxious, grateful }

// ---------------------------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------------------------

/// A single voice journal entry (audio diary).
class VoiceJournalEntry {
  final String id;
  final String? titleEn;
  final String? titleHi;
  final VoiceJournalMood mood;
  final Duration duration;
  final DateTime createdAt;
  final String? transcription;
  final String? audioPath;

  const VoiceJournalEntry({
    required this.id,
    this.titleEn,
    this.titleHi,
    required this.mood,
    required this.duration,
    required this.createdAt,
    this.transcription,
    this.audioPath,
  });

  VoiceJournalEntry copyWith({
    String? titleEn,
    String? titleHi,
    VoiceJournalMood? mood,
    Duration? duration,
    String? transcription,
    String? audioPath,
  }) {
    return VoiceJournalEntry(
      id: id,
      titleEn: titleEn ?? this.titleEn,
      titleHi: titleHi ?? this.titleHi,
      mood: mood ?? this.mood,
      duration: duration ?? this.duration,
      createdAt: createdAt,
      transcription: transcription ?? this.transcription,
      audioPath: audioPath ?? this.audioPath,
    );
  }
}

/// A comfort audio track (affirmation, guided, etc.).
class ComfortTrack {
  final String id;
  final String titleEn;
  final String titleHi;
  final String descriptionEn;
  final String descriptionHi;
  final ComfortCategory category;
  final Duration duration;
  final String emoji;
  final bool isFavorite;

  const ComfortTrack({
    required this.id,
    required this.titleEn,
    required this.titleHi,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.category,
    required this.duration,
    required this.emoji,
    this.isFavorite = false,
  });

  ComfortTrack copyWith({bool? isFavorite}) {
    return ComfortTrack(
      id: id,
      titleEn: titleEn,
      titleHi: titleHi,
      descriptionEn: descriptionEn,
      descriptionHi: descriptionHi,
      category: category,
      duration: duration,
      emoji: emoji,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

// ---------------------------------------------------------------------------
// SAMPLE DATA
// ---------------------------------------------------------------------------

const _sampleComfortTracks = <ComfortTrack>[
  // Affirmations
  ComfortTrack(
    id: 'aff_01',
    titleEn: 'You Are Not Alone',
    titleHi: '\u0906\u092A \u0905\u0915\u0947\u0932\u0947 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902',
    descriptionEn: 'Gentle reminder that support surrounds you.',
    descriptionHi:
        '\u0927\u0940\u0930\u0947 \u0938\u0947 \u092F\u093E\u0926 \u0926\u093F\u0932\u093E\u0928\u093E \u0915\u093F \u0938\u0939\u093E\u0930\u093E \u0906\u092A\u0915\u0947 \u091A\u093E\u0930\u094B\u0902 \u0913\u0930 \u0939\u0948\u0964',
    category: ComfortCategory.affirmation,
    duration: Duration(minutes: 3, seconds: 20),
    emoji: '\ud83d\udc9c',
  ),
  ComfortTrack(
    id: 'aff_02',
    titleEn: 'Strength Within',
    titleHi: '\u0906\u0902\u0924\u0930\u093F\u0915 \u0936\u0915\u094D\u0924\u093F',
    descriptionEn: 'Affirmations for inner courage and resilience.',
    descriptionHi:
        '\u0906\u0902\u0924\u0930\u093F\u0915 \u0938\u093E\u0939\u0938 \u0914\u0930 \u0932\u091A\u0940\u0932\u0947\u092A\u0928 \u0915\u0947 \u0932\u093F\u090F\u0964',
    category: ComfortCategory.affirmation,
    duration: Duration(minutes: 4, seconds: 10),
    emoji: '\ud83d\udcaa',
  ),
  ComfortTrack(
    id: 'aff_03',
    titleEn: 'Today Is Enough',
    titleHi: '\u0906\u091C \u0915\u093E\u092B\u093C\u0940 \u0939\u0948',
    descriptionEn: 'Permission to take one day at a time.',
    descriptionHi:
        '\u090F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u090F\u0915 \u0926\u093F\u0928 \u091C\u0940\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F\u0964',
    category: ComfortCategory.affirmation,
    duration: Duration(minutes: 2, seconds: 45),
    emoji: '\ud83c\udf1f',
  ),

  // Nature sounds
  ComfortTrack(
    id: 'nat_01',
    titleEn: 'Morning Birdsong',
    titleHi: '\u0938\u0941\u092C\u0939 \u0915\u0940 \u091A\u093F\u0921\u093C\u093F\u092F\u094B\u0902 \u0915\u0940 \u0906\u0935\u093E\u091C\u093C',
    descriptionEn: 'Peaceful dawn chorus recorded in the Himalayas.',
    descriptionHi:
        '\u0939\u093F\u092E\u093E\u0932\u092F \u092E\u0947\u0902 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0936\u093E\u0902\u0924\u093F\u092A\u0942\u0930\u094D\u0923 \u092D\u094B\u0930 \u0915\u093E \u0917\u093E\u092F\u0928\u0964',
    category: ComfortCategory.nature,
    duration: Duration(minutes: 10),
    emoji: '\ud83d\udc26',
  ),
  ComfortTrack(
    id: 'nat_02',
    titleEn: 'River Flowing',
    titleHi: '\u092C\u0939\u0924\u0940 \u0928\u0926\u0940',
    descriptionEn: 'Gentle stream sounds for relaxation.',
    descriptionHi:
        '\u0906\u0930\u093E\u092E \u0915\u0947 \u0932\u093F\u090F \u0928\u0926\u0940 \u0915\u0940 \u0915\u094B\u092E\u0932 \u0927\u094D\u0935\u0928\u093F\u0964',
    category: ComfortCategory.nature,
    duration: Duration(minutes: 15),
    emoji: '\ud83c\udf0a',
  ),
  ComfortTrack(
    id: 'nat_03',
    titleEn: 'Temple Bells at Dusk',
    titleHi: '\u0938\u0902\u0927\u094D\u092F\u093E \u0915\u0947 \u092E\u0902\u0926\u093F\u0930 \u0915\u0940 \u0918\u0902\u091F\u093F\u092F\u093E\u0901',
    descriptionEn: 'Soothing temple bell chimes at evening.',
    descriptionHi:
        '\u0936\u093E\u092E \u0915\u094B \u092E\u0902\u0926\u093F\u0930 \u0915\u0940 \u0938\u0941\u0916\u0926\u093E\u092F\u0940 \u0918\u0902\u091F\u093F\u092F\u093E\u0901\u0964',
    category: ComfortCategory.nature,
    duration: Duration(minutes: 8),
    emoji: '\ud83d\udd14',
  ),

  // Guided relaxation
  ComfortTrack(
    id: 'gui_01',
    titleEn: 'Body Scan for Pain',
    titleHi:
        '\u0926\u0930\u094D\u0926 \u0915\u0947 \u0932\u093F\u090F \u0936\u0930\u0940\u0930 \u0938\u094D\u0915\u0948\u0928',
    descriptionEn: 'Guided body scan to ease tension and discomfort.',
    descriptionHi:
        '\u0924\u0928\u093E\u0935 \u0914\u0930 \u092C\u0947\u091A\u0948\u0928\u0940 \u0915\u092E \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0924 \u0936\u0930\u0940\u0930 \u0938\u094D\u0915\u0948\u0928\u0964',
    category: ComfortCategory.guided,
    duration: Duration(minutes: 12),
    emoji: '\ud83e\uddd8',
  ),
  ComfortTrack(
    id: 'gui_02',
    titleEn: 'Letting Go Visualization',
    titleHi:
        '\u091B\u094B\u0921\u093C\u0928\u0947 \u0915\u0940 \u0915\u0932\u094D\u092A\u0928\u093E',
    descriptionEn: 'Imagine releasing worries like leaves on a stream.',
    descriptionHi:
        '\u091A\u093F\u0902\u0924\u093E\u0913\u0902 \u0915\u094B \u0928\u0926\u0940 \u092E\u0947\u0902 \u092A\u0924\u094D\u0924\u094B\u0902 \u0915\u0940 \u0924\u0930\u0939 \u092C\u0939\u093E \u0926\u0947\u0928\u0947 \u0915\u0940 \u0915\u0932\u094D\u092A\u0928\u093E\u0964',
    category: ComfortCategory.guided,
    duration: Duration(minutes: 7, seconds: 30),
    emoji: '\ud83c\udf43',
  ),

  // Prayers
  ComfortTrack(
    id: 'pra_01',
    titleEn: 'Gayatri Mantra',
    titleHi: '\u0917\u093E\u092F\u0924\u094D\u0930\u0940 \u092E\u0902\u0924\u094D\u0930',
    descriptionEn: '108 repetitions of the sacred Gayatri mantra.',
    descriptionHi: '\u092A\u0935\u093F\u0924\u094D\u0930 \u0917\u093E\u092F\u0924\u094D\u0930\u0940 \u092E\u0902\u0924\u094D\u0930 \u0915\u0947 108 \u091C\u093E\u092A\u0964',
    category: ComfortCategory.prayer,
    duration: Duration(minutes: 20),
    emoji: '\ud83d\ude4f',
  ),
  ComfortTrack(
    id: 'pra_02',
    titleEn: 'Hanuman Chalisa',
    titleHi: '\u0939\u0928\u0941\u092E\u093E\u0928 \u091A\u093E\u0932\u0940\u0938\u093E',
    descriptionEn: 'Slow, peaceful recitation for courage and healing.',
    descriptionHi:
        '\u0938\u093E\u0939\u0938 \u0914\u0930 \u0909\u092A\u091A\u093E\u0930 \u0915\u0947 \u0932\u093F\u090F \u0927\u0940\u092E\u0940, \u0936\u093E\u0902\u0924 \u092A\u093E\u0920\u0964',
    category: ComfortCategory.prayer,
    duration: Duration(minutes: 15),
    emoji: '\ud83d\udcff',
  ),

  // Stories
  ComfortTrack(
    id: 'sto_01',
    titleEn: 'The Banyan Tree',
    titleHi: '\u092C\u0930\u0917\u0926 \u0915\u093E \u092A\u0947\u0921\u093C',
    descriptionEn: 'A gentle story about roots, shelter, and belonging.',
    descriptionHi:
        '\u091C\u0921\u093C\u094B\u0902, \u0906\u0936\u094D\u0930\u092F \u0914\u0930 \u0905\u092A\u0928\u0947\u092A\u0928 \u0915\u0940 \u090F\u0915 \u0915\u094B\u092E\u0932 \u0915\u0939\u093E\u0928\u0940\u0964',
    category: ComfortCategory.story,
    duration: Duration(minutes: 8, seconds: 45),
    emoji: '\ud83c\udf33',
  ),
  ComfortTrack(
    id: 'sto_02',
    titleEn: 'Stars Never Disappear',
    titleHi:
        '\u0924\u093E\u0930\u0947 \u0915\u092D\u0940 \u0917\u093E\u092F\u092C \u0928\u0939\u0940\u0902 \u0939\u094B\u0924\u0947',
    descriptionEn: 'A comforting bedtime tale about presence and light.',
    descriptionHi:
        '\u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0914\u0930 \u092A\u094D\u0930\u0915\u093E\u0936 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0938\u094B\u0924\u0947 \u0938\u092E\u092F \u0915\u0940 \u0915\u0939\u093E\u0928\u0940\u0964',
    category: ComfortCategory.story,
    duration: Duration(minutes: 6),
    emoji: '\u2b50',
  ),
];

final _sampleJournal = <VoiceJournalEntry>[
  VoiceJournalEntry(
    id: 'vj_01',
    titleEn: 'Morning thoughts',
    mood: VoiceJournalMood.peaceful,
    duration: const Duration(minutes: 2, seconds: 14),
    createdAt: DateTime.now().subtract(const Duration(hours: 3)),
    transcription:
        'Feeling a bit better today. The morning light came through the window and it felt warm...',
  ),
  VoiceJournalEntry(
    id: 'vj_02',
    titleEn: 'After physiotherapy',
    mood: VoiceJournalMood.tired,
    duration: const Duration(minutes: 1, seconds: 38),
    createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 5)),
    transcription: 'The session was tough but I feel like it helped a little...',
  ),
  VoiceJournalEntry(
    id: 'vj_03',
    titleEn: 'Grateful for family',
    mood: VoiceJournalMood.grateful,
    duration: const Duration(minutes: 3, seconds: 5),
    createdAt: DateTime.now().subtract(const Duration(days: 2)),
    transcription: 'My daughter brought me flowers today. Small things matter so much...',
  ),
];

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

class VoiceState {
  final List<VoiceJournalEntry> journalEntries;
  final List<ComfortTrack> comfortTracks;
  final RecordingStatus recordingStatus;
  final PlaybackStatus playbackStatus;
  final String? playingTrackId;
  final Duration recordingDuration;
  final Duration playbackPosition;
  final VoiceJournalMood selectedMood;

  const VoiceState({
    this.journalEntries = const [],
    this.comfortTracks = const [],
    this.recordingStatus = RecordingStatus.idle,
    this.playbackStatus = PlaybackStatus.idle,
    this.playingTrackId,
    this.recordingDuration = Duration.zero,
    this.playbackPosition = Duration.zero,
    this.selectedMood = VoiceJournalMood.peaceful,
  });

  VoiceState copyWith({
    List<VoiceJournalEntry>? journalEntries,
    List<ComfortTrack>? comfortTracks,
    RecordingStatus? recordingStatus,
    PlaybackStatus? playbackStatus,
    String? playingTrackId,
    Duration? recordingDuration,
    Duration? playbackPosition,
    VoiceJournalMood? selectedMood,
  }) {
    return VoiceState(
      journalEntries: journalEntries ?? this.journalEntries,
      comfortTracks: comfortTracks ?? this.comfortTracks,
      recordingStatus: recordingStatus ?? this.recordingStatus,
      playbackStatus: playbackStatus ?? this.playbackStatus,
      playingTrackId: playingTrackId ?? this.playingTrackId,
      recordingDuration: recordingDuration ?? this.recordingDuration,
      playbackPosition: playbackPosition ?? this.playbackPosition,
      selectedMood: selectedMood ?? this.selectedMood,
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class VoiceNotifier extends StateNotifier<VoiceState> {
  VoiceNotifier()
      : super(VoiceState(
          journalEntries: List.from(_sampleJournal),
          comfortTracks: List.from(_sampleComfortTracks),
        ));

  // ── Recording ──

  void startRecording() {
    state = state.copyWith(
      recordingStatus: RecordingStatus.recording,
      recordingDuration: Duration.zero,
    );
    // TODO: Start actual microphone recording via record package
  }

  void pauseRecording() {
    state = state.copyWith(recordingStatus: RecordingStatus.paused);
  }

  void resumeRecording() {
    state = state.copyWith(recordingStatus: RecordingStatus.recording);
  }

  void updateRecordingDuration(Duration d) {
    state = state.copyWith(recordingDuration: d);
  }

  void cancelRecording() {
    state = state.copyWith(
      recordingStatus: RecordingStatus.idle,
      recordingDuration: Duration.zero,
    );
  }

  void saveRecording({String? title}) {
    final entry = VoiceJournalEntry(
      id: 'vj_${DateTime.now().millisecondsSinceEpoch}',
      titleEn: title ?? 'Voice note',
      mood: state.selectedMood,
      duration: state.recordingDuration,
      createdAt: DateTime.now(),
    );
    state = state.copyWith(
      journalEntries: [entry, ...state.journalEntries],
      recordingStatus: RecordingStatus.idle,
      recordingDuration: Duration.zero,
    );
  }

  void setMood(VoiceJournalMood mood) {
    state = state.copyWith(selectedMood: mood);
  }

  void deleteJournalEntry(String id) {
    state = state.copyWith(
      journalEntries: state.journalEntries.where((e) => e.id != id).toList(),
    );
  }

  // ── Playback ──

  void playTrack(String trackId) {
    state = state.copyWith(
      playbackStatus: PlaybackStatus.playing,
      playingTrackId: trackId,
      playbackPosition: Duration.zero,
    );
    // TODO: Start actual audio playback via just_audio
  }

  void pausePlayback() {
    state = state.copyWith(playbackStatus: PlaybackStatus.paused);
  }

  void resumePlayback() {
    state = state.copyWith(playbackStatus: PlaybackStatus.playing);
  }

  void stopPlayback() {
    state = state.copyWith(
      playbackStatus: PlaybackStatus.idle,
      playingTrackId: null,
      playbackPosition: Duration.zero,
    );
  }

  void seekTo(Duration position) {
    state = state.copyWith(playbackPosition: position);
  }

  void toggleFavorite(String trackId) {
    state = state.copyWith(
      comfortTracks: state.comfortTracks.map((t) {
        if (t.id == trackId) return t.copyWith(isFavorite: !t.isFavorite);
        return t;
      }).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final voiceProvider = StateNotifierProvider<VoiceNotifier, VoiceState>(
  (ref) => VoiceNotifier(),
);
