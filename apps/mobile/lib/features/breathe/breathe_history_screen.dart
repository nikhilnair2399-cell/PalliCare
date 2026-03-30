import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'breathe_provider.dart';

/// History Screen — session history with mood trends.
///
/// Layout:
///  [A] Stats summary card
///  [B] Mood trend sparkline
///  [C] Session history list
///
/// Spec: Feature 3 — Breathing Module Enhancement.
class BreatheHistoryScreen extends ConsumerWidget {
  const BreatheHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final breatheState = ref.watch(breatheProvider);
    final history = breatheState.history;
    final stats = breatheState.stats;

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Practice History',
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: history.isEmpty
            ? _EmptyHistoryState()
            : SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // [A] Stats card
                    _StatsCard(
                      stats: stats,
                      todayCount: breatheState.todaySessionCount,
                      moodTrend: breatheState.moodTrendBetter,
                    ),
                    const SizedBox(height: AppSpacing.md),

                    // [B] Mood trend
                    if (history.length >= 3) ...[
                      _MoodTrendCard(history: history),
                      const SizedBox(height: AppSpacing.md),
                    ],

                    // [C] Session list
                    Text(
                      'Recent Sessions',
                      style: AppTypography.heading3.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '\u0939\u093E\u0932 \u0915\u0947 \u0938\u0924\u094D\u0930',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ...history.map(
                      (entry) => _SessionHistoryTile(entry: entry),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                  ],
                ),
              ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// STATS CARD
// ---------------------------------------------------------------------------

class _StatsCard extends StatelessWidget {
  final PracticeStats stats;
  final int todayCount;
  final double moodTrend;

  const _StatsCard({
    required this.stats,
    required this.todayCount,
    required this.moodTrend,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.sage, AppColors.teal],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'This Week',
            style: AppTypography.heading3.copyWith(color: Colors.white),
          ),
          Text(
            '\u0907\u0938 \u0938\u092A\u094D\u0924\u093E\u0939',
            style: AppTypography.caption.copyWith(
              color: Colors.white.withValues(alpha: 0.7),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              _StatBubble(
                value: '${stats.sessionsThisWeek}',
                label: 'Sessions',
                labelHi: '\u0938\u0924\u094D\u0930',
              ),
              const SizedBox(width: AppSpacing.md),
              _StatBubble(
                value: '${stats.totalMinutesThisWeek}m',
                label: 'Minutes',
                labelHi: '\u092E\u093F\u0928\u091F',
              ),
              const SizedBox(width: AppSpacing.md),
              _StatBubble(
                value: '$todayCount',
                label: 'Today',
                labelHi: '\u0906\u091C',
              ),
              const SizedBox(width: AppSpacing.md),
              _StatBubble(
                value: '${(moodTrend * 100).toInt()}%',
                label: 'Feel Better',
                labelHi: '\u092C\u0947\u0939\u0924\u0930',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatBubble extends StatelessWidget {
  final String value;
  final String label;
  final String labelHi;

  const _StatBubble({
    required this.value,
    required this.label,
    required this.labelHi,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: AppTypography.heading3.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              label,
              style: AppTypography.caption.copyWith(
                color: Colors.white.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// MOOD TREND CARD
// ---------------------------------------------------------------------------

class _MoodTrendCard extends StatelessWidget {
  final List<SessionHistoryEntry> history;
  const _MoodTrendCard({required this.history});

  @override
  Widget build(BuildContext context) {
    final recent = history.take(7).toList().reversed.toList();

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.trending_up, color: AppColors.sage, size: 18),
              const SizedBox(width: 6),
              Text(
                'Mood After Sessions',
                style: AppTypography.heading4.copyWith(
                  color: AppColors.teal,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          // Simple mood sparkline
          SizedBox(
            height: 60,
            child: CustomPaint(
              size: const Size(double.infinity, 60),
              painter: _MoodSparklinePainter(
                moods: recent.map((e) => e.mood).toList(),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Last ${recent.length} sessions',
                style: AppTypography.caption.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: AppColors.sage,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Better',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: AppColors.accentHighlight,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Same',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// CustomPainter for a simple mood sparkline.
class _MoodSparklinePainter extends CustomPainter {
  final List<PostSessionMood> moods;
  _MoodSparklinePainter({required this.moods});

  @override
  void paint(Canvas canvas, Size size) {
    if (moods.isEmpty) return;

    final pointSpacing = moods.length > 1
        ? size.width / (moods.length - 1)
        : size.width / 2;
    final betterY = size.height * 0.2;
    final sameY = size.height * 0.6;
    final skipY = size.height * 0.9;

    final points = <Offset>[];
    for (int i = 0; i < moods.length; i++) {
      final x = moods.length > 1 ? i * pointSpacing : size.width / 2;
      final y = moods[i] == PostSessionMood.better
          ? betterY
          : moods[i] == PostSessionMood.same
              ? sameY
              : skipY;
      points.add(Offset(x, y));
    }

    // Draw line
    final linePaint = Paint()
      ..color = AppColors.sage.withAlpha(150)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(points.first.dx, points.first.dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }
    canvas.drawPath(path, linePaint);

    // Draw dots
    for (int i = 0; i < points.length; i++) {
      final dotColor = moods[i] == PostSessionMood.better
          ? AppColors.sage
          : moods[i] == PostSessionMood.same
              ? AppColors.accentHighlight
              : AppColors.charcoalLight;
      final dotPaint = Paint()..color = dotColor;
      canvas.drawCircle(points[i], 5, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

// ---------------------------------------------------------------------------
// SESSION HISTORY TILE
// ---------------------------------------------------------------------------

class _SessionHistoryTile extends StatelessWidget {
  final SessionHistoryEntry entry;
  const _SessionHistoryTile({required this.entry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            // Mood icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: _moodColor(entry.mood).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: Text(
                _moodEmoji(entry.mood),
                style: const TextStyle(fontSize: 20),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.exerciseNameEn,
                    style: AppTypography.label.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  Text(
                    _formatDuration(entry.durationSeconds),
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _formatTimeAgo(entry.completedAt),
                  style: AppTypography.caption.copyWith(
                    color: AppColors.textTertiary,
                  ),
                ),
                Text(
                  _moodLabel(entry.mood),
                  style: AppTypography.caption.copyWith(
                    color: _moodColor(entry.mood),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// EMPTY STATE
// ---------------------------------------------------------------------------

class _EmptyHistoryState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.self_improvement,
              size: 48,
              color: AppColors.charcoalLight.withValues(alpha: 0.4),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No sessions yet',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
            Text(
              'Complete your first breathing session to see history.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textTertiary,
              ),
              textAlign: TextAlign.center,
            ),
            Text(
              '\u0905\u092A\u0928\u093E \u092A\u0939\u0932\u093E \u0938\u0924\u094D\u0930 \u092A\u0942\u0930\u093E \u0915\u0930\u0947\u0902',
              style: AppTypography.caption.copyWith(
                color: AppColors.textTertiary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

String _moodEmoji(PostSessionMood mood) {
  switch (mood) {
    case PostSessionMood.better:
      return '\ud83d\ude0a';
    case PostSessionMood.same:
      return '\ud83d\ude10';
    case PostSessionMood.skip:
      return '\u2014';
  }
}

String _moodLabel(PostSessionMood mood) {
  switch (mood) {
    case PostSessionMood.better:
      return 'Felt Better';
    case PostSessionMood.same:
      return 'Same';
    case PostSessionMood.skip:
      return 'Skipped';
  }
}

Color _moodColor(PostSessionMood mood) {
  switch (mood) {
    case PostSessionMood.better:
      return AppColors.sage;
    case PostSessionMood.same:
      return AppColors.accentHighlight;
    case PostSessionMood.skip:
      return AppColors.charcoalLight;
  }
}

String _formatDuration(int seconds) {
  if (seconds < 60) return '${seconds}s';
  final m = seconds ~/ 60;
  final s = seconds % 60;
  return s > 0 ? '${m}m ${s}s' : '${m} min';
}

String _formatTimeAgo(DateTime time) {
  final diff = DateTime.now().difference(time);
  if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return '${diff.inHours}h ago';
  if (diff.inDays < 7) return '${diff.inDays}d ago';
  return '${diff.inDays ~/ 7}w ago';
}
