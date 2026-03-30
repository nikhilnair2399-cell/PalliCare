import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'voice_provider.dart';

/// Comfort Audio — browse and play soothing tracks.
///
/// Categories: Affirmations, Nature, Guided, Prayers, Stories.
/// Each track has play, favorite toggle, and bilingual titles.
class ComfortAudioScreen extends ConsumerStatefulWidget {
  const ComfortAudioScreen({super.key});

  @override
  ConsumerState<ComfortAudioScreen> createState() => _ComfortAudioScreenState();
}

class _ComfortAudioScreenState extends ConsumerState<ComfortAudioScreen> {
  ComfortCategory? _selectedCategory;

  static const _categoryMeta = <ComfortCategory, _CategoryInfo>{
    ComfortCategory.affirmation: _CategoryInfo(
      emoji: '\ud83d\udc9c',
      labelEn: 'Affirmations',
      labelHi: '\u092A\u094D\u0930\u0947\u0930\u0923\u093E',
    ),
    ComfortCategory.nature: _CategoryInfo(
      emoji: '\ud83c\udf3f',
      labelEn: 'Nature',
      labelHi: '\u092A\u094D\u0930\u0915\u0943\u0924\u093F',
    ),
    ComfortCategory.guided: _CategoryInfo(
      emoji: '\ud83e\uddd8',
      labelEn: 'Guided',
      labelHi: '\u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0924',
    ),
    ComfortCategory.prayer: _CategoryInfo(
      emoji: '\ud83d\ude4f',
      labelEn: 'Prayers',
      labelHi: '\u092A\u094D\u0930\u093E\u0930\u094D\u0925\u0928\u093E',
    ),
    ComfortCategory.story: _CategoryInfo(
      emoji: '\ud83d\udcd6',
      labelEn: 'Stories',
      labelHi: '\u0915\u0939\u093E\u0928\u093F\u092F\u093E\u0901',
    ),
  };

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(voiceProvider);

    final tracks = _selectedCategory == null
        ? state.comfortTracks
        : state.comfortTracks
            .where((t) => t.category == _selectedCategory)
            .toList();

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: const Column(
          children: [
            Text(
              'Comfort Audio',
              style: TextStyle(
                color: AppColors.teal,
                fontWeight: FontWeight.w800,
                fontSize: 18,
              ),
            ),
            Text(
              '\u0906\u0930\u093E\u092E \u0911\u0921\u093F\u092F\u094B',
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
      body: Column(
        children: [
          // ── Now Playing Bar ──
          if (state.playbackStatus != PlaybackStatus.idle)
            _buildNowPlaying(state),

          // ── Category Chips ──
          _buildCategoryChips(),

          // ── Track List ──
          Expanded(
            child: tracks.isEmpty
                ? const Center(
                    child: Text(
                      'No tracks in this category',
                      style: TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 14,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                    itemCount: tracks.length,
                    itemBuilder: (_, i) =>
                        _TrackCard(track: tracks[i], ref: ref),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildNowPlaying(VoiceState state) {
    final track = state.comfortTracks
        .where((t) => t.id == state.playingTrackId)
        .firstOrNull;
    if (track == null) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.all(AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.teal.withValues(alpha: 0.12),
            AppColors.accentCalm.withValues(alpha: 0.08),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.teal.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Text(track.emoji, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  track.titleEn,
                  style: const TextStyle(
                    color: AppColors.teal,
                    fontWeight: FontWeight.w700,
                    fontSize: 15,
                  ),
                ),
                Text(
                  track.titleHi,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  state.playbackStatus == PlaybackStatus.playing
                      ? 'Now playing...'
                      : 'Paused',
                  style: const TextStyle(
                    color: AppColors.textSecondary,
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
              size: 36,
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
            icon: const Icon(Icons.stop_circle,
                color: AppColors.textTertiary, size: 30),
            onPressed: () => ref.read(voiceProvider.notifier).stopPlayback(),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: Row(
        children: [
          // "All" chip
          _buildChip(
            label: 'All',
            emoji: '\u2728',
            isSelected: _selectedCategory == null,
            onTap: () => setState(() => _selectedCategory = null),
          ),
          const SizedBox(width: AppSpacing.xs),
          ..._categoryMeta.entries.map((entry) {
            final cat = entry.key;
            final info = entry.value;
            return Padding(
              padding: const EdgeInsets.only(right: AppSpacing.xs),
              child: _buildChip(
                label: info.labelEn,
                emoji: info.emoji,
                isSelected: _selectedCategory == cat,
                onTap: () => setState(() => _selectedCategory = cat),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildChip({
    required String label,
    required String emoji,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.teal.withValues(alpha: 0.12)
              : AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(
            color: isSelected ? AppColors.teal : AppColors.border,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.teal : AppColors.textSecondary,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// INTERNAL WIDGETS
// ---------------------------------------------------------------------------

class _CategoryInfo {
  final String emoji;
  final String labelEn;
  final String labelHi;

  const _CategoryInfo({
    required this.emoji,
    required this.labelEn,
    required this.labelHi,
  });
}

class _TrackCard extends StatelessWidget {
  final ComfortTrack track;
  final WidgetRef ref;

  const _TrackCard({required this.track, required this.ref});

  String _formatDuration(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    if (s == 0) return '${m}m';
    return '${m}m ${s}s';
  }

  static const _categoryLabel = {
    ComfortCategory.affirmation: 'Affirmation',
    ComfortCategory.nature: 'Nature',
    ComfortCategory.guided: 'Guided',
    ComfortCategory.prayer: 'Prayer',
    ComfortCategory.story: 'Story',
  };

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(voiceProvider);
    final isPlaying = state.playingTrackId == track.id &&
        state.playbackStatus != PlaybackStatus.idle;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: isPlaying
            ? AppColors.teal.withValues(alpha: 0.06)
            : AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color:
              isPlaying ? AppColors.teal.withValues(alpha: 0.3) : AppColors.border,
        ),
      ),
      child: Row(
        children: [
          // Emoji + Play
          GestureDetector(
            onTap: () {
              final notifier = ref.read(voiceProvider.notifier);
              if (isPlaying) {
                if (state.playbackStatus == PlaybackStatus.playing) {
                  notifier.pausePlayback();
                } else {
                  notifier.resumePlayback();
                }
              } else {
                notifier.playTrack(track.id);
              }
            },
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: isPlaying
                    ? AppColors.teal.withValues(alpha: 0.15)
                    : AppColors.teal.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              alignment: Alignment.center,
              child: isPlaying
                  ? Icon(
                      state.playbackStatus == PlaybackStatus.playing
                          ? Icons.pause
                          : Icons.play_arrow,
                      color: AppColors.teal,
                      size: 28,
                    )
                  : Text(track.emoji, style: const TextStyle(fontSize: 24)),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),

          // Title + Description
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  track.titleEn,
                  style: TextStyle(
                    color: isPlaying ? AppColors.teal : AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                Text(
                  track.titleHi,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  track.descriptionEn,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    height: 1.3,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.teal.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        _categoryLabel[track.category] ?? '',
                        style: const TextStyle(
                          color: AppColors.teal,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _formatDuration(track.duration),
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Favorite toggle
          IconButton(
            icon: Icon(
              track.isFavorite ? Icons.favorite : Icons.favorite_border,
              color: track.isFavorite ? AppColors.error : AppColors.textTertiary,
              size: 22,
            ),
            onPressed: () =>
                ref.read(voiceProvider.notifier).toggleFavorite(track.id),
          ),
        ],
      ),
    );
  }
}
