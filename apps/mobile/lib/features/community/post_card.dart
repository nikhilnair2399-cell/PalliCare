import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';

/// Post card widget — displays a community post in the channel feed.
class PostCard extends StatelessWidget {
  final CommunityPost post;
  final VoidCallback? onTap;
  final VoidCallback onSupport;
  final VoidCallback? onReport;
  final bool isExpanded;

  const PostCard({
    super.key,
    required this.post,
    this.onTap,
    required this.onSupport,
    this.onReport,
    this.isExpanded = false,
  });

  @override
  Widget build(BuildContext context) {
    final isComfort = post.type == PostType.comfortCard;
    final isMilestone = post.type == PostType.milestone;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: isComfort
                ? AppColors.primary.withValues(alpha: 0.06)
                : isMilestone
                    ? AppColors.success.withValues(alpha: 0.06)
                    : AppColors.surface,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(
              color: isComfort
                  ? AppColors.primary.withValues(alpha: 0.2)
                  : isMilestone
                      ? AppColors.success.withValues(alpha: 0.2)
                      : AppColors.border,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.textPrimary.withValues(alpha: 0.03),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Author Row ──
              _AuthorRow(post: post, onReport: onReport),

              const SizedBox(height: AppSpacing.sm),

              // ── Post Type Badge ──
              if (isMilestone)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('\ud83c\udfc6', style: TextStyle(fontSize: 12)),
                        SizedBox(width: 4),
                        Text(
                          'Milestone',
                          style: TextStyle(
                            color: AppColors.success,
                            fontWeight: FontWeight.w700,
                            fontSize: 11,
                          ),
                        ),
                        SizedBox(width: 4),
                        Text(
                          '\u0909\u092A\u0932\u092C\u094D\u0927\u093F',  // Uplabdhi
                          style: TextStyle(
                            color: AppColors.success,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // ── Content ──
              if (isComfort)
                _ComfortCardContent(post: post)
              else
                Text(
                  post.contentEn,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    height: 1.6,
                  ),
                  maxLines: isExpanded ? null : 6,
                  overflow: isExpanded ? null : TextOverflow.ellipsis,
                ),

              // ── Hindi content (only in expanded view) ──
              if (isExpanded && !isComfort && post.contentHi != post.contentEn) ...[
                const SizedBox(height: AppSpacing.sm),
                Text(
                  post.contentHi,
                  style: TextStyle(
                    color: AppColors.textSecondary.withValues(alpha: 0.8),
                    fontSize: 13,
                    height: 1.5,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],

              const SizedBox(height: AppSpacing.md),

              // ── Sync Status ──
              if (post.syncStatus == SyncStatus.pending)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(
                        width: 10,
                        height: 10,
                        child: CircularProgressIndicator(
                          strokeWidth: 1.5,
                          color: AppColors.textTertiary,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Sending...',
                        style: TextStyle(
                          color: AppColors.textTertiary.withValues(alpha: 0.7),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),

              // ── Actions Row ──
              Row(
                children: [
                  // Support (hug) button
                  _ActionButton(
                    icon: post.hasSupportedByMe
                        ? Icons.favorite
                        : Icons.favorite_border,
                    label: '${post.supportCount}',
                    color: post.hasSupportedByMe
                        ? AppColors.accentWarm
                        : AppColors.textTertiary,
                    onTap: onSupport,
                    tooltip: 'Support',
                  ),

                  const SizedBox(width: AppSpacing.lg),

                  // Reply count
                  _ActionButton(
                    icon: Icons.chat_bubble_outline,
                    label: '${post.replyCount}',
                    color: AppColors.textTertiary,
                    onTap: onTap,
                    tooltip: 'Replies',
                  ),

                  const Spacer(),

                  // Moderation badge
                  if (post.moderationStatus == ModerationStatus.pending)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.warning.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Pending review',
                        style: TextStyle(
                          color: AppColors.warning,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Private Widgets
// ─────────────────────────────────────────────────────────

class _AuthorRow extends StatelessWidget {
  final CommunityPost post;
  final VoidCallback? onReport;

  const _AuthorRow({required this.post, this.onReport});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Avatar
        CircleAvatar(
          radius: 16,
          backgroundColor: post.isAnonymous
              ? AppColors.textTertiary.withValues(alpha: 0.2)
              : AppColors.primary.withValues(alpha: 0.15),
          child: Icon(
            post.isAnonymous ? Icons.visibility_off : Icons.person,
            size: 16,
            color: post.isAnonymous ? AppColors.textTertiary : AppColors.primary,
          ),
        ),
        const SizedBox(width: AppSpacing.sm),

        // Name + time
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    post.authorNameEn,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  if (post.isAnonymous) ...[
                    const SizedBox(width: 4),
                    Icon(
                      Icons.visibility_off,
                      size: 12,
                      color: AppColors.textTertiary.withValues(alpha: 0.6),
                    ),
                  ],
                ],
              ),
              Text(
                _formatTime(post.createdAt),
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),

        // Report button
        if (onReport != null)
          IconButton(
            icon: const Icon(Icons.more_horiz, size: 18),
            color: AppColors.textTertiary,
            onPressed: onReport,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
          ),
      ],
    );
  }

  String _formatTime(String isoString) {
    try {
      final dt = DateTime.parse(isoString);
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 1) return 'Just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 7) return '${diff.inDays}d ago';
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }
}

class _ComfortCardContent extends StatelessWidget {
  final CommunityPost post;

  const _ComfortCardContent({required this.post});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withValues(alpha: 0.08),
            AppColors.primary.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('\ud83e\udd17', style: TextStyle(fontSize: 22)),
              const SizedBox(width: AppSpacing.sm),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'Comfort Card',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            post.contentEn,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w500,
              fontStyle: FontStyle.italic,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            post.contentHi,
            style: TextStyle(
              color: AppColors.textSecondary.withValues(alpha: 0.8),
              fontSize: 14,
              fontStyle: FontStyle.italic,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;
  final String tooltip;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
    required this.tooltip,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Tooltip(
        message: tooltip,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
