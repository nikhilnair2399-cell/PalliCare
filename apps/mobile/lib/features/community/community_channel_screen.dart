import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';
import 'post_card.dart';

/// Channel Feed — Shows posts within a specific disease-phase channel.
class CommunityChannelScreen extends ConsumerWidget {
  final String channelId;

  const CommunityChannelScreen({super.key, required this.channelId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(communityProvider);
    final notifier = ref.read(communityProvider.notifier);

    // Find channel
    CommunityChannel? channel;
    try {
      channel = state.channels.firstWhere((c) => c.id == channelId);
    } catch (_) {
      channel = null;
    }

    if (channel == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.surface,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: const Center(
          child: Text(
            'Channel not found',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
          ),
        ),
      );
    }

    // Filter posts for this channel (approved / autoApproved only)
    final posts = state.posts
        .where((p) =>
            p.channelId == channelId &&
            (p.moderationStatus == ModerationStatus.approved ||
             p.moderationStatus == ModerationStatus.autoApproved))
        .toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () {
            notifier.goBack();
            Navigator.of(context).pop();
          },
        ),
        title: Row(
          children: [
            Text(channel.emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    channel.nameEn,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    '${channel.memberCount} members',
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          // Anonymous toggle
          IconButton(
            icon: Icon(
              state.isAnonymousMode ? Icons.visibility_off : Icons.visibility,
              color: state.isAnonymousMode ? AppColors.primary : AppColors.textSecondary,
            ),
            tooltip: state.isAnonymousMode ? 'Anonymous Mode On' : 'Anonymous Mode Off',
            onPressed: () => notifier.toggleAnonymous(),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Channel Description Banner ──
          _ChannelDescriptionBanner(channel: channel),

          // ── Anonymous Mode Indicator ──
          if (state.isAnonymousMode)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.xs,
              ),
              color: AppColors.lavender.withValues(alpha: 0.2),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.visibility_off, size: 14, color: AppColors.lavender),
                  SizedBox(width: 4),
                  Text(
                    'Anonymous Mode — Your identity is hidden',
                    style: TextStyle(
                      color: AppColors.lavender,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

          // ── Error Banner ──
          if (state.errorMessage != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.sm),
              color: AppColors.error.withValues(alpha: 0.1),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber, size: 16, color: AppColors.error),
                  const SizedBox(width: AppSpacing.xs),
                  Expanded(
                    child: Text(
                      state.errorMessage!,
                      style: const TextStyle(
                        color: AppColors.error,
                        fontSize: 13,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 16, color: AppColors.error),
                    onPressed: () => notifier.clearError(),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 24, minHeight: 24),
                  ),
                ],
              ),
            ),

          // ── Posts Feed ──
          Expanded(
            child: posts.isEmpty
                ? _EmptyFeedMessage(channel: channel)
                : ListView.builder(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: posts.length,
                    itemBuilder: (context, index) {
                      final post = posts[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                        child: PostCard(
                          post: post,
                          onTap: () {
                            notifier.selectPost(post.id);
                            context.push('/community/post', extra: post.id);
                          },
                          onSupport: () => notifier.toggleSupport(post.id),
                          onReport: () {
                            _showReportDialog(context, ref, post.id);
                          },
                        ),
                      );
                    },
                  ),
          ),

          // ── Offline Queue Indicator ──
          if (state.pendingOfflinePosts.isNotEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.xs,
              ),
              color: AppColors.warning.withValues(alpha: 0.15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    width: 12,
                    height: 12,
                    child: CircularProgressIndicator(
                      strokeWidth: 1.5,
                      color: AppColors.warning,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${state.pendingOfflinePosts.length} post(s) waiting to sync',
                    style: const TextStyle(
                      color: AppColors.warning,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          notifier.openCompose();
          context.push('/community/compose', extra: channelId);
        },
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.edit, color: Colors.white),
        label: const Text(
          'Post',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  void _showReportDialog(BuildContext context, WidgetRef ref, String postId) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusHero)),
      ),
      builder: (ctx) => _ReportSheet(
        onReport: (reason) {
          ref.read(communityProvider.notifier).reportPost(postId, reason);
          Navigator.of(ctx).pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Report submitted. Thank you for keeping the community safe.'),
              backgroundColor: AppColors.primary,
            ),
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Private Widgets
// ─────────────────────────────────────────────────────────

class _ChannelDescriptionBanner extends StatelessWidget {
  final CommunityChannel channel;

  const _ChannelDescriptionBanner({required this.channel});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          bottom: BorderSide(color: AppColors.border.withValues(alpha: 0.5)),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            channel.descriptionEn,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            channel.descriptionHi,
            style: TextStyle(
              color: AppColors.textSecondary.withValues(alpha: 0.8),
              fontSize: 12,
              height: 1.3,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              _StatChip(
                icon: Icons.people_outline,
                label: '${channel.memberCount}',
              ),
              const SizedBox(width: AppSpacing.sm),
              _StatChip(
                icon: Icons.chat_bubble_outline,
                label: '${channel.postCount} posts',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _StatChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: AppColors.textTertiary),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textTertiary,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class _EmptyFeedMessage extends StatelessWidget {
  final CommunityChannel channel;

  const _EmptyFeedMessage({required this.channel});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              channel.emoji,
              style: const TextStyle(fontSize: 48),
            ),
            const SizedBox(height: AppSpacing.md),
            const Text(
              'Be the first to share',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            const Text(
              // Hindi: Pehle banne waale banein
              'Start a conversation and let others know they are not alone.\n'
              '\u092A\u0939\u0932\u0947 \u092C\u0928\u0928\u0947 \u0935\u093E\u0932\u0947 \u092C\u0928\u0947\u0902',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReportSheet extends StatelessWidget {
  final void Function(ReportReason reason) onReport;

  const _ReportSheet({required this.onReport});

  @override
  Widget build(BuildContext context) {
    final reasons = [
      (ReportReason.harassment, 'Harassment / Bullying', '\u0909\u0924\u094D\u092A\u0940\u0921\u093C\u0928', Icons.report_problem),
      (ReportReason.misinformation, 'Medical Misinformation', '\u0917\u0932\u0924 \u091C\u093E\u0928\u0915\u093E\u0930\u0940', Icons.medical_information),
      (ReportReason.spam, 'Spam', '\u0938\u094D\u092A\u0948\u092E', Icons.block),
      (ReportReason.selfHarm, 'Self-harm Content', '\u0906\u0924\u094D\u092E-\u0939\u093E\u0928\u093F', Icons.health_and_safety),
      (ReportReason.inappropriateContent, 'Inappropriate Content', '\u0905\u0928\u0941\u091A\u093F\u0924 \u0938\u093E\u092E\u0917\u094D\u0930\u0940', Icons.remove_circle_outline),
      (ReportReason.medicalAdvice, 'Unverified Medical Advice', '\u0905\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0938\u0932\u093E\u0939', Icons.medication),
    ];

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Center(
            child: SizedBox(
              width: 40,
              child: Divider(thickness: 3, color: AppColors.border),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'Report Post',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            // Hindi: Post ki report karein
            '\u092A\u094B\u0938\u094D\u091F \u0915\u0940 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0930\u0947\u0902',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ...reasons.map((r) {
            return ListTile(
              leading: Icon(r.$4, color: AppColors.textSecondary),
              title: Text(
                r.$2,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
              subtitle: Text(
                r.$3,
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 12,
                ),
              ),
              contentPadding: EdgeInsets.zero,
              minTileHeight: 48,
              onTap: () => onReport(r.$1),
            );
          }),
          const SizedBox(height: AppSpacing.md),
        ],
      ),
    );
  }
}
