import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/routing/app_router.dart';
import 'voice_provider.dart';

/// Voice Module Hub — "Your Voice Matters"
///
/// Three sections: Voice Journal, Comfort Audio, recent entries.
/// Designed for patients who may be too fatigued to type.
class VoiceScreen extends ConsumerWidget {
  const VoiceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(voiceProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: const Column(
          children: [
            Text(
              'Voice & Comfort',
              style: TextStyle(
                color: AppColors.teal,
                fontWeight: FontWeight.w800,
                fontSize: 18,
              ),
            ),
            Text(
              // Hindi: Aawaz aur aaram
              '\u0906\u0935\u093E\u091C\u093C \u0914\u0930 \u0906\u0930\u093E\u092E',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Intro ──
            _buildIntroCard(),
            const SizedBox(height: AppSpacing.lg),

            // ── Quick Actions ──
            Row(
              children: [
                Expanded(
                  child: _ActionCard(
                    emoji: '\ud83c\udfa4',
                    titleEn: 'Voice Journal',
                    titleHi: '\u0906\u0935\u093E\u091C\u093C \u0921\u093E\u092F\u0930\u0940',
                    subtitle: '${state.journalEntries.length} entries',
                    color: AppColors.teal,
                    onTap: () => context.push(AppRoutes.voiceJournal),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: _ActionCard(
                    emoji: '\ud83c\udfb6',
                    titleEn: 'Comfort Audio',
                    titleHi:
                        '\u0906\u0930\u093E\u092E \u0911\u0921\u093F\u092F\u094B',
                    subtitle: '${state.comfortTracks.length} tracks',
                    color: AppColors.accentCalm,
                    onTap: () => context.push(AppRoutes.comfortAudio),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),

            // ── Now Playing (if any) ──
            if (state.playbackStatus != PlaybackStatus.idle)
              _buildNowPlaying(ref, state),

            // ── Recent Journal Entries ──
            const Text(
              'Recent Voice Notes',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 2),
            const Text(
              // Hindi: Haal ki aawaz tippaniyaan
              '\u0939\u093E\u0932 \u0915\u0940 \u0906\u0935\u093E\u091C\u093C \u091F\u093F\u092A\u094D\u092A\u0923\u093F\u092F\u093E\u0901',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),

            if (state.journalEntries.isEmpty)
              _buildEmptyState()
            else
              ...state.journalEntries.take(5).map(
                    (entry) => Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: _JournalEntryCard(entry: entry, ref: ref),
                    ),
                  ),

            if (state.journalEntries.length > 5)
              Center(
                child: TextButton(
                  onPressed: () => context.push(AppRoutes.voiceJournal),
                  child: const Text(
                    'View all entries \u2192',
                    style: TextStyle(color: AppColors.teal),
                  ),
                ),
              ),

            const SizedBox(height: AppSpacing.lg),

            // ── Favorites ──
            _buildFavoriteTracks(state, ref),

            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),

      // Record FAB
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.voiceJournal),
        backgroundColor: AppColors.teal,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.mic),
        label: const Text('Record'),
      ),
    );
  }

  Widget _buildIntroCard() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.accentCalm.withValues(alpha: 0.3),
            AppColors.teal.withValues(alpha: 0.08),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        border: Border.all(color: AppColors.accentCalm.withValues(alpha: 0.4)),
      ),
      child: const Row(
        children: [
          Text('\ud83c\udf3f', style: TextStyle(fontSize: 32)),
          SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Your voice matters',
                  style: TextStyle(
                    color: AppColors.teal,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Too tired to type? Just speak. Record your thoughts, '
                  'listen to comfort audio, or let your voice be your diary.',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNowPlaying(WidgetRef ref, VoiceState state) {
    final track = state.comfortTracks.where((t) => t.id == state.playingTrackId).firstOrNull;
    if (track == null) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.teal.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.teal.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Text(track.emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  track.titleEn,
                  style: const TextStyle(
                    color: AppColors.teal,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                Text(
                  state.playbackStatus == PlaybackStatus.playing
                      ? 'Now playing...'
                      : 'Paused',
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(
              state.playbackStatus == PlaybackStatus.playing
                  ? Icons.pause_circle_filled
                  : Icons.play_circle_filled,
              color: AppColors.teal,
              size: 32,
            ),
            onPressed: () {
              final notifier = ref.read(voiceProvider.notifier);
              if (state.playbackStatus == PlaybackStatus.playing) {
                notifier.pausePlayback();
              } else {
                notifier.resumePlayback();
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.stop_circle, color: AppColors.textTertiary, size: 28),
            onPressed: () => ref.read(voiceProvider.notifier).stopPlayback(),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Text('\ud83c\udfa4', style: TextStyle(fontSize: 40)),
          SizedBox(height: AppSpacing.sm),
          Text(
            'No voice notes yet',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Tap the microphone to record your first voice note.',
            style: TextStyle(
              color: AppColors.textTertiary,
              fontSize: 13,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFavoriteTracks(VoiceState state, WidgetRef ref) {
    final favs = state.comfortTracks.where((t) => t.isFavorite).toList();
    if (favs.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Favorites',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        ...favs.map((track) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.xs),
              child: _ComfortTrackTile(track: track, ref: ref),
            )),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// INTERNAL WIDGETS
// ---------------------------------------------------------------------------

class _ActionCard extends StatelessWidget {
  final String emoji;
  final String titleEn;
  final String titleHi;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.emoji,
    required this.titleEn,
    required this.titleHi,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 28)),
            const SizedBox(height: AppSpacing.sm),
            Text(
              titleEn,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w700,
                fontSize: 15,
              ),
            ),
            Text(
              titleHi,
              style: const TextStyle(
                color: AppColors.textTertiary,
                fontSize: 11,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _JournalEntryCard extends StatelessWidget {
  final VoiceJournalEntry entry;
  final WidgetRef ref;

  const _JournalEntryCard({required this.entry, required this.ref});

  static const _moodEmoji = {
    VoiceJournalMood.peaceful: '\u2728',
    VoiceJournalMood.hopeful: '\ud83c\udf1f',
    VoiceJournalMood.tired: '\ud83d\ude34',
    VoiceJournalMood.anxious: '\ud83d\ude1f',
    VoiceJournalMood.grateful: '\ud83d\ude4f',
  };

  String _formatDuration(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    return '${m}m ${s.toString().padLeft(2, '0')}s';
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${dt.day}/${dt.month}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          // Play button
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.teal.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Icon(
              Icons.play_arrow,
              color: AppColors.teal,
              size: 24,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      _moodEmoji[entry.mood] ?? '\u2728',
                      style: const TextStyle(fontSize: 14),
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        entry.titleEn ?? 'Voice note',
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                if (entry.transcription != null)
                  Text(
                    entry.transcription!,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      height: 1.3,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                const SizedBox(height: 2),
                Text(
                  '${_formatDuration(entry.duration)}  \u2022  ${_formatDate(entry.createdAt)}',
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ComfortTrackTile extends StatelessWidget {
  final ComfortTrack track;
  final WidgetRef ref;

  const _ComfortTrackTile({required this.track, required this.ref});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Text(track.emoji, style: const TextStyle(fontSize: 24)),
      title: Text(
        track.titleEn,
        style: const TextStyle(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w500,
          fontSize: 14,
        ),
      ),
      subtitle: Text(
        '${track.duration.inMinutes}m ${track.duration.inSeconds % 60}s',
        style: const TextStyle(color: AppColors.textTertiary, fontSize: 11),
      ),
      trailing: IconButton(
        icon: const Icon(Icons.play_circle_filled, color: AppColors.teal, size: 28),
        onPressed: () => ref.read(voiceProvider.notifier).playTrack(track.id),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      tileColor: AppColors.surfaceCard,
      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
    );
  }
}
