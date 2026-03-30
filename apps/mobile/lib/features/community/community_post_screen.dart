import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';
import 'post_card.dart';
import 'comfort_card_picker.dart';
import 'crisis_dialog.dart';

/// Post Detail — Single post with reply thread.
class CommunityPostScreen extends ConsumerStatefulWidget {
  final String postId;

  const CommunityPostScreen({super.key, required this.postId});

  @override
  ConsumerState<CommunityPostScreen> createState() => _CommunityPostScreenState();
}

class _CommunityPostScreenState extends ConsumerState<CommunityPostScreen> {
  final _replyController = TextEditingController();
  final _focusNode = FocusNode();
  bool _showComfortPicker = false;

  @override
  void dispose() {
    _replyController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(communityProvider);
    final notifier = ref.read(communityProvider.notifier);

    // Find the post
    CommunityPost? post;
    try {
      post = state.posts.firstWhere((p) => p.id == widget.postId);
    } catch (_) {
      post = null;
    }

    // Listen for crisis dialog trigger
    if (state.showCrisisDialog) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showCrisisDialog(context, ref);
      });
    }

    if (post == null) {
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
            'Post not found',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
          ),
        ),
      );
    }

    final approvedReplies = post.replies
        .where((r) =>
            r.moderationStatus == ModerationStatus.approved ||
            r.moderationStatus == ModerationStatus.autoApproved)
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
        title: const Text(
          'Post',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.md),
              children: [
                // ── Main Post ──
                PostCard(
                  post: post,
                  isExpanded: true,
                  onSupport: () => notifier.toggleSupport(post!.id),
                  onReport: () {
                    // Report handled in channel screen
                  },
                ),

                const SizedBox(height: AppSpacing.lg),

                // ── Replies Header ──
                Row(
                  children: [
                    const Icon(Icons.chat_bubble_outline, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 6),
                    Text(
                      '${approvedReplies.length} Replies',
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      // Hindi: Jawab
                      '(\u091C\u0935\u093E\u092C)',
                      style: TextStyle(
                        color: AppColors.textSecondary.withValues(alpha: 0.7),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                // ── Reply Thread ──
                if (approvedReplies.isEmpty)
                  _EmptyRepliesMessage()
                else
                  ...approvedReplies.map((reply) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: _ReplyCard(
                        reply: reply,
                        onSupport: () => notifier.toggleReplySupport(post!.id, reply.id),
                      ),
                    );
                  }),

                const SizedBox(height: 80), // Space for reply input
              ],
            ),
          ),

          // ── Comfort Card Picker ──
          if (_showComfortPicker)
            ComfortCardPicker(
              comfortCards: state.comfortCards,
              onSelect: (card) {
                _sendComfortCardReply(card);
                setState(() => _showComfortPicker = false);
              },
              onClose: () => setState(() => _showComfortPicker = false),
            ),

          // ── Reply Input Bar ──
          _ReplyInputBar(
            controller: _replyController,
            focusNode: _focusNode,
            isAnonymous: state.isAnonymousMode,
            isRateLimited: state.isRateLimited,
            onSend: _sendReply,
            onComfortCard: () {
              setState(() => _showComfortPicker = !_showComfortPicker);
            },
            onToggleAnonymous: () => notifier.toggleAnonymous(),
          ),
        ],
      ),
    );
  }

  void _sendReply() {
    final text = _replyController.text.trim();
    if (text.isEmpty) return;

    final success = ref.read(communityProvider.notifier).createReply(
      postId: widget.postId,
      contentEn: text,
      contentHi: text, // In production, auto-translate or require bilingual input
    );

    if (success) {
      _replyController.clear();
      _focusNode.unfocus();
    }
  }

  void _sendComfortCardReply(ComfortCard card) {
    ref.read(communityProvider.notifier).createReply(
      postId: widget.postId,
      contentEn: card.messageEn,
      contentHi: card.messageHi,
      comfortCardId: card.id,
    );
  }
}

// ─────────────────────────────────────────────────────────
// Private Widgets
// ─────────────────────────────────────────────────────────

class _ReplyCard extends StatelessWidget {
  final PostReply reply;
  final VoidCallback onSupport;

  const _ReplyCard({required this.reply, required this.onSupport});

  @override
  Widget build(BuildContext context) {
    final isComfort = reply.comfortCardId != null;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isComfort
            ? AppColors.primary.withValues(alpha: 0.05)
            : AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: isComfort
              ? AppColors.primary.withValues(alpha: 0.2)
              : AppColors.border,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author row
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: reply.isAnonymous
                    ? AppColors.textTertiary.withValues(alpha: 0.3)
                    : AppColors.primary.withValues(alpha: 0.2),
                child: Icon(
                  reply.isAnonymous ? Icons.visibility_off : Icons.person,
                  size: 14,
                  color: reply.isAnonymous ? AppColors.textTertiary : AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      reply.authorNameEn,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      _formatTime(reply.createdAt),
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              if (reply.syncStatus == SyncStatus.pending)
                const SizedBox(
                  width: 12,
                  height: 12,
                  child: CircularProgressIndicator(
                    strokeWidth: 1.5,
                    color: AppColors.textTertiary,
                  ),
                ),
            ],
          ),

          const SizedBox(height: AppSpacing.sm),

          // Content
          if (isComfort)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('\ud83e\udd17', style: TextStyle(fontSize: 20)),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reply.contentEn,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 14,
                          fontStyle: FontStyle.italic,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        reply.contentHi,
                        style: TextStyle(
                          color: AppColors.textSecondary.withValues(alpha: 0.8),
                          fontSize: 13,
                          fontStyle: FontStyle.italic,
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )
          else
            Text(
              reply.contentEn,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                height: 1.5,
              ),
            ),

          const SizedBox(height: AppSpacing.sm),

          // Support button
          GestureDetector(
            onTap: onSupport,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  reply.hasSupportedByMe ? Icons.favorite : Icons.favorite_border,
                  size: 16,
                  color: reply.hasSupportedByMe ? AppColors.accentWarm : AppColors.textTertiary,
                ),
                const SizedBox(width: 4),
                Text(
                  '${reply.supportCount}',
                  style: TextStyle(
                    color: reply.hasSupportedByMe ? AppColors.accentWarm : AppColors.textTertiary,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
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

class _EmptyRepliesMessage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        children: [
          const Text('\ud83d\udcac', style: TextStyle(fontSize: 32)),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'No replies yet',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Be the first to offer support.\n'
            // Hindi: Sabse pehle sahara dein.
            '\u0938\u092C\u0938\u0947 \u092A\u0939\u0932\u0947 \u0938\u0939\u093E\u0930\u093E \u0926\u0947\u0902\u0964',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.textSecondary.withValues(alpha: 0.8),
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

class _ReplyInputBar extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final bool isAnonymous;
  final bool isRateLimited;
  final VoidCallback onSend;
  final VoidCallback onComfortCard;
  final VoidCallback onToggleAnonymous;

  const _ReplyInputBar({
    required this.controller,
    required this.focusNode,
    required this.isAnonymous,
    required this.isRateLimited,
    required this.onSend,
    required this.onComfortCard,
    required this.onToggleAnonymous,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.sm, AppSpacing.sm, AppSpacing.sm, AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.border.withValues(alpha: 0.5)),
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Comfort card button
            IconButton(
              icon: const Icon(Icons.card_giftcard, size: 22),
              color: AppColors.primary,
              tooltip: 'Send a Comfort Card',
              onPressed: onComfortCard,
            ),

            // Anonymous toggle
            IconButton(
              icon: Icon(
                isAnonymous ? Icons.visibility_off : Icons.visibility,
                size: 20,
              ),
              color: isAnonymous ? AppColors.lavender : AppColors.textTertiary,
              tooltip: isAnonymous ? 'Anonymous On' : 'Anonymous Off',
              onPressed: onToggleAnonymous,
            ),

            // Text input
            Expanded(
              child: Container(
                constraints: const BoxConstraints(minHeight: 40, maxHeight: 100),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                  border: Border.all(color: AppColors.border),
                ),
                child: TextField(
                  controller: controller,
                  focusNode: focusNode,
                  maxLines: 3,
                  minLines: 1,
                  enabled: !isRateLimited,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                  ),
                  decoration: InputDecoration(
                    hintText: isRateLimited
                        ? 'Rate limit reached (5/hr)'
                        : 'Write a supportive reply...',
                    hintStyle: const TextStyle(
                      color: AppColors.textTertiary,
                      fontSize: 14,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: AppSpacing.sm,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),

            const SizedBox(width: AppSpacing.xs),

            // Send button
            IconButton(
              icon: const Icon(Icons.send_rounded, size: 22),
              color: AppColors.primary,
              onPressed: isRateLimited ? null : onSend,
            ),
          ],
        ),
      ),
    );
  }
}
