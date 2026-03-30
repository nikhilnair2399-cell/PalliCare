import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';
import 'comfort_card_picker.dart';
import 'crisis_dialog.dart';

/// Compose Screen — Create a new post or send a comfort card.
class CommunityComposeScreen extends ConsumerStatefulWidget {
  final String channelId;

  const CommunityComposeScreen({super.key, required this.channelId});

  @override
  ConsumerState<CommunityComposeScreen> createState() => _CommunityComposeScreenState();
}

class _CommunityComposeScreenState extends ConsumerState<CommunityComposeScreen> {
  final _contentController = TextEditingController();
  final _focusNode = FocusNode();
  PostType _selectedType = PostType.text;
  ComfortCard? _selectedComfortCard;
  bool _showComfortPicker = false;

  @override
  void dispose() {
    _contentController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(communityProvider);
    final notifier = ref.read(communityProvider.notifier);

    // Find channel for display
    CommunityChannel? channel;
    try {
      channel = state.channels.firstWhere((c) => c.id == widget.channelId);
    } catch (_) {
      channel = null;
    }

    // Listen for crisis dialog
    if (state.showCrisisDialog) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showCrisisDialog(context, ref);
      });
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.textPrimary),
          onPressed: () {
            notifier.goBack();
            Navigator.of(context).pop();
          },
        ),
        title: const Text(
          'New Post',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.sm),
            child: TextButton(
              onPressed: state.isRateLimited ? null : _submitPost,
              style: TextButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.xs,
                ),
              ),
              child: const Text(
                'Post',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Posting to Channel ──
            if (channel != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.md),
                color: AppColors.surface,
                child: Row(
                  children: [
                    Text(channel.emoji, style: const TextStyle(fontSize: 20)),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      'Posting to ${channel.nameEn}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),

            // ── Post Type Selector ──
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  _TypeChip(
                    label: 'Text',
                    labelHi: '\u092A\u093E\u0920',
                    icon: Icons.text_fields,
                    isSelected: _selectedType == PostType.text,
                    onTap: () => setState(() {
                      _selectedType = PostType.text;
                      _selectedComfortCard = null;
                    }),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _TypeChip(
                    label: 'Comfort Card',
                    labelHi: '\u0938\u093E\u0902\u0924\u094D\u0935\u0928\u093E',
                    icon: Icons.card_giftcard,
                    isSelected: _selectedType == PostType.comfortCard,
                    onTap: () => setState(() {
                      _selectedType = PostType.comfortCard;
                      _showComfortPicker = true;
                    }),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _TypeChip(
                    label: 'Milestone',
                    labelHi: '\u0909\u092A\u0932\u092C\u094D\u0927\u093F',
                    icon: Icons.emoji_events,
                    isSelected: _selectedType == PostType.milestone,
                    onTap: () => setState(() {
                      _selectedType = PostType.milestone;
                      _selectedComfortCard = null;
                    }),
                  ),
                ],
              ),
            ),

            // ── Anonymous Mode Toggle ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: GestureDetector(
                onTap: () => notifier.toggleAnonymous(),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.sm,
                  ),
                  decoration: BoxDecoration(
                    color: state.isAnonymousMode
                        ? AppColors.lavender.withValues(alpha: 0.15)
                        : AppColors.surface,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(
                      color: state.isAnonymousMode
                          ? AppColors.lavender.withValues(alpha: 0.4)
                          : AppColors.border,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        state.isAnonymousMode ? Icons.visibility_off : Icons.visibility,
                        size: 18,
                        color: state.isAnonymousMode ? AppColors.lavender : AppColors.textTertiary,
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              state.isAnonymousMode ? 'Posting Anonymously' : 'Post with your name',
                              style: TextStyle(
                                color: state.isAnonymousMode ? AppColors.lavender : AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              state.isAnonymousMode
                                  ? '\u0905\u091C\u094D\u091E\u093E\u0924 \u0930\u0942\u092A \u0938\u0947 \u092A\u094B\u0938\u094D\u091F \u0915\u0930\u0947\u0902'  // Post anonymously
                                  : '\u0905\u092A\u0928\u0947 \u0928\u093E\u092E \u0938\u0947 \u092A\u094B\u0938\u094D\u091F \u0915\u0930\u0947\u0902',  // Post with your name
                              style: TextStyle(
                                color: AppColors.textTertiary.withValues(alpha: 0.8),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Switch(
                        value: state.isAnonymousMode,
                        onChanged: (_) => notifier.toggleAnonymous(),
                        activeColor: AppColors.lavender,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: AppSpacing.md),

            // ── Selected Comfort Card Preview ──
            if (_selectedType == PostType.comfortCard && _selectedComfortCard != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: _SelectedComfortPreview(
                  card: _selectedComfortCard!,
                  onClear: () => setState(() => _selectedComfortCard = null),
                  onChangePick: () => setState(() => _showComfortPicker = true),
                ),
              ),

            // ── Text Content Input ──
            if (_selectedType != PostType.comfortCard)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 200),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: TextField(
                    controller: _contentController,
                    focusNode: _focusNode,
                    maxLines: null,
                    minLines: 8,
                    maxLength: 2000,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 15,
                      height: 1.6,
                    ),
                    decoration: InputDecoration(
                      hintText: _selectedType == PostType.milestone
                          ? 'Share your milestone! What are you celebrating?\n\n\u0905\u092A\u0928\u0940 \u0909\u092A\u0932\u092C\u094D\u0927\u093F \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902!'
                          : 'What would you like to share? This is a safe space.\n\n\u0906\u092A \u0915\u094D\u092F\u093E \u0938\u093E\u091D\u093E \u0915\u0930\u0928\u093E \u091A\u093E\u0939\u0947\u0902\u0917\u0947? \u092F\u0939 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u091C\u0917\u0939 \u0939\u0948\u0964',
                      hintStyle: TextStyle(
                        color: AppColors.textTertiary.withValues(alpha: 0.6),
                        fontSize: 15,
                        height: 1.6,
                      ),
                      contentPadding: const EdgeInsets.all(AppSpacing.md),
                      border: InputBorder.none,
                      counterStyle: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
              ),

            // ── Community Guidelines Reminder ──
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.shield_outlined, size: 16, color: AppColors.primary),
                        SizedBox(width: 6),
                        Text(
                          'Community Guidelines',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: AppSpacing.xs),
                    Text(
                      '\u2022 Be kind and supportive to fellow members\n'
                      '\u2022 Do not share unverified medical advice\n'
                      '\u2022 Respect everyone\'s privacy and anonymity\n'
                      '\u2022 Report content that makes you uncomfortable',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        height: 1.5,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      // Hindi guidelines summary
                      '\u2022 \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u0926\u092F\u093E\u0932\u0941 \u0914\u0930 \u0938\u0939\u093E\u092F\u0915 \u0930\u0939\u0947\u0902\n'
                      '\u2022 \u0905\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0938\u0932\u093E\u0939 \u0928 \u0926\u0947\u0902',
                      style: TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                        height: 1.4,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Rate Limit Warning ──
            if (state.isRateLimited)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.timer, size: 16, color: AppColors.warning),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'You have reached the limit of 5 posts per hour. Please wait before posting again.',
                          style: TextStyle(
                            color: AppColors.warning,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // ── Error Banner ──
            if (state.errorMessage != null)
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: AppColors.error.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.warning_amber, size: 16, color: AppColors.error),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          state.errorMessage!,
                          style: const TextStyle(color: AppColors.error, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // ── Comfort Card Picker ──
            if (_showComfortPicker)
              ComfortCardPicker(
                comfortCards: state.comfortCards,
                onSelect: (card) {
                  setState(() {
                    _selectedComfortCard = card;
                    _showComfortPicker = false;
                  });
                },
                onClose: () => setState(() => _showComfortPicker = false),
              ),

            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }

  void _submitPost() {
    if (_selectedType == PostType.comfortCard) {
      if (_selectedComfortCard == null) {
        setState(() => _showComfortPicker = true);
        return;
      }
      final success = ref.read(communityProvider.notifier).createPost(
        contentEn: _selectedComfortCard!.messageEn,
        contentHi: _selectedComfortCard!.messageHi,
        type: PostType.comfortCard,
        comfortCardId: _selectedComfortCard!.id,
      );
      if (success) Navigator.of(context).pop();
    } else {
      final text = _contentController.text.trim();
      if (text.isEmpty) return;

      final success = ref.read(communityProvider.notifier).createPost(
        contentEn: text,
        contentHi: text, // In production, auto-translate or require bilingual
        type: _selectedType,
      );
      if (success) Navigator.of(context).pop();
    }
  }
}

// ─────────────────────────────────────────────────────────
// Private Widgets
// ─────────────────────────────────────────────────────────

class _TypeChip extends StatelessWidget {
  final String label;
  final String labelHi;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _TypeChip({
    required this.label,
    required this.labelHi,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withValues(alpha: 0.15)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SelectedComfortPreview extends StatelessWidget {
  final ComfortCard card;
  final VoidCallback onClear;
  final VoidCallback onChangePick;

  const _SelectedComfortPreview({
    required this.card,
    required this.onClear,
    required this.onChangePick,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withValues(alpha: 0.1),
            AppColors.primary.withValues(alpha: 0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(card.emoji, style: const TextStyle(fontSize: 28)),
              const SizedBox(width: AppSpacing.sm),
              const Expanded(
                child: Text(
                  'Selected Comfort Card',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18, color: AppColors.textTertiary),
                onPressed: onClear,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 24, minHeight: 24),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            card.messageEn,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 16,
              fontStyle: FontStyle.italic,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            card.messageHi,
            style: TextStyle(
              color: AppColors.textSecondary.withValues(alpha: 0.8),
              fontSize: 14,
              fontStyle: FontStyle.italic,
              height: 1.3,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          GestureDetector(
            onTap: onChangePick,
            child: const Text(
              'Choose a different card',
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
                fontSize: 12,
                decoration: TextDecoration.underline,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
