import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'learn_provider.dart';

/// Full-screen module content viewer (Screen 06b).
///
/// Displays:
///  - Reading progress bar (top)
///  - Header illustration placeholder (200dp)
///  - Bilingual title (EN + HI)
///  - Duration + audio badges
///  - Scrollable body content
///  - Action link card (e.g. "Try the Breathe exercise")
///  - Feedback section: "Was this helpful?" [Yes] [Somewhat] [Skip]
///  - "Next module" navigation / "All done!" button
class LearnModuleScreen extends ConsumerStatefulWidget {
  final String moduleId;
  const LearnModuleScreen({super.key, required this.moduleId});

  @override
  ConsumerState<LearnModuleScreen> createState() => _LearnModuleScreenState();
}

class _LearnModuleScreenState extends ConsumerState<LearnModuleScreen> {
  final ScrollController _scrollController = ScrollController();
  double _readProgress = 0.0;
  FeedbackResponse? _selectedFeedback;
  bool _feedbackInitialized = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final maxScroll = _scrollController.position.maxScrollExtent;
    if (maxScroll <= 0) return;
    final current = _scrollController.offset;
    setState(() {
      _readProgress = (current / maxScroll).clamp(0.0, 1.0);
    });
    // Persist progress when user scrolls past meaningful thresholds.
    ref
        .read(learnProvider.notifier)
        .updateProgress(widget.moduleId, _readProgress);
  }

  @override
  Widget build(BuildContext context) {
    final learnState = ref.watch(learnProvider);
    final module = learnState.modules
        .cast<LearnModule?>()
        .firstWhere((m) => m?.id == widget.moduleId, orElse: () => null);

    if (module == null) {
      return Scaffold(
        backgroundColor: AppColors.cream,
        appBar: AppBar(
          backgroundColor: AppColors.cream,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.teal),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: const Center(child: Text('Module not found.')),
      );
    }

    // Initialize feedback selection from persisted state once.
    if (!_feedbackInitialized && module.feedback != null) {
      _selectedFeedback = module.feedback;
      _feedbackInitialized = true;
    }

    final nextModule = ref.read(learnProvider.notifier).nextModule(module.id);

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Column(
        children: [
          // Top progress bar
          _ReadingProgressBar(progress: _readProgress),

          // App bar area
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm, vertical: 4),
              child: Row(
                children: [
                  IconButton(
                    icon:
                        const Icon(Icons.arrow_back, color: AppColors.teal),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  const Spacer(),
                  Text(
                    module.number,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.charcoalLight),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
          ),

          // Scrollable content
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header illustration placeholder
                  _HeaderIllustration(module: module),
                  const SizedBox(height: AppSpacing.md),

                  // Bilingual title
                  Text(
                    module.titleEn,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: AppColors.teal,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    module.titleHi,
                    style: AppTypography.hindiHeading.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Duration + audio badge row
                  _MetaBadges(module: module),
                  const SizedBox(height: AppSpacing.lg),

                  // Content body
                  _ContentBody(module: module),
                  const SizedBox(height: AppSpacing.lg),

                  // Action link card (e.g. "Try the Breathe module")
                  if (module.actionLink != null)
                    _ActionLinkCard(actionLink: module.actionLink!),
                  if (module.actionLink != null)
                    const SizedBox(height: AppSpacing.lg),

                  // Feedback section
                  _FeedbackSection(
                    selected: _selectedFeedback,
                    onSelected: (response) {
                      setState(() => _selectedFeedback = response);
                      ref
                          .read(learnProvider.notifier)
                          .submitFeedback(module.id, response);
                    },
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Next module button
                  if (nextModule != null)
                    _NextModuleButton(
                      nextModule: nextModule,
                      onTap: () {
                        ref
                            .read(learnProvider.notifier)
                            .completeModule(module.id);
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (_) =>
                                LearnModuleScreen(moduleId: nextModule.id),
                          ),
                        );
                      },
                    )
                  else
                    _DoneButton(
                      onTap: () {
                        ref
                            .read(learnProvider.notifier)
                            .completeModule(module.id);
                        Navigator.of(context).pop();
                      },
                    ),

                  const SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// READING PROGRESS BAR (top of screen)
// ---------------------------------------------------------------------------

class _ReadingProgressBar extends StatelessWidget {
  final double progress;
  const _ReadingProgressBar({required this.progress});

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      value: progress,
      minHeight: 3,
      backgroundColor: AppColors.border,
      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.sage),
    );
  }
}

// ---------------------------------------------------------------------------
// HEADER ILLUSTRATION PLACEHOLDER (200dp)
// ---------------------------------------------------------------------------

class _HeaderIllustration extends StatelessWidget {
  final LearnModule module;
  const _HeaderIllustration({required this.module});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        gradient: const LinearGradient(
          colors: [AppColors.lavenderLight, AppColors.lavender],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.auto_stories,
              size: 48,
              color: AppColors.teal.withValues(alpha: 0.4),
            ),
            const SizedBox(height: 8),
            Text(
              'Illustration',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.teal.withValues(alpha: 0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// META BADGES (duration + audio + sensitive)
// ---------------------------------------------------------------------------

class _MetaBadges extends StatelessWidget {
  final LearnModule module;
  const _MetaBadges({required this.module});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.sm,
      runSpacing: 4,
      children: [
        _Badge(
          icon: Icons.access_time,
          label: '${module.durationMinutes} min',
        ),
        if (module.hasAudio)
          const _Badge(
            icon: Icons.headphones,
            label: 'Audio available',
          ),
        if (module.isSensitive)
          _Badge(
            icon: Icons.favorite_border,
            label: 'Sensitive topic',
            color: AppColors.lavender,
          ),
      ],
    );
  }
}

class _Badge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  const _Badge({required this.icon, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    final bgColor = color ?? AppColors.sage;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bgColor.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.charcoalLight),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.caption.copyWith(
              color: AppColors.charcoalLight,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// CONTENT BODY
// ---------------------------------------------------------------------------

class _ContentBody extends StatelessWidget {
  final LearnModule module;
  const _ContentBody({required this.module});

  @override
  Widget build(BuildContext context) {
    const bodyStyle = TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      color: AppColors.textPrimary,
      height: 1.6,
    );

    // Split content on double newlines to form paragraphs.
    final paragraphs = module.contentBody.isNotEmpty
        ? module.contentBody.split('\n\n')
        : <String>[];

    if (paragraphs.isEmpty) {
      // Fallback placeholder for modules without content yet.
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Content for this module is being prepared. '
            'Check back soon.',
            style: bodyStyle,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'Your experience is valid, and seeking understanding '
            'is an act of courage.',
            style: bodyStyle.copyWith(fontStyle: FontStyle.italic),
          ),
        ],
      );
    }

    // Render the last paragraph in italics as a closing thought if there are
    // at least 3 paragraphs. Otherwise render all normally.
    final hasClosing = paragraphs.length >= 3;
    final mainParagraphs =
        hasClosing ? paragraphs.sublist(0, paragraphs.length - 1) : paragraphs;
    final closingParagraph = hasClosing ? paragraphs.last : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Main body paragraphs
        for (int i = 0; i < mainParagraphs.length; i++) ...[
          if (i > 0) const SizedBox(height: AppSpacing.md),
          Text(mainParagraphs[i], style: bodyStyle),
        ],

        // Closing paragraph (italic)
        if (closingParagraph != null) ...[
          const SizedBox(height: AppSpacing.md),
          Text(
            closingParagraph,
            style: bodyStyle.copyWith(fontStyle: FontStyle.italic),
          ),
        ],
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// ACTION LINK CARD
// ---------------------------------------------------------------------------

class _ActionLinkCard extends StatelessWidget {
  final String actionLink;
  const _ActionLinkCard({required this.actionLink});

  @override
  Widget build(BuildContext context) {
    String label;
    IconData icon;
    if (actionLink == '/breathe') {
      label = 'Try the Breathe exercise';
      icon = Icons.air;
    } else {
      label = 'Related activity';
      icon = Icons.open_in_new;
    }

    return GestureDetector(
      onTap: () => context.push(actionLink),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.sage.withValues(alpha: 0.10),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.sage.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.sage.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.sage, size: 22),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: AppTypography.label.copyWith(
                      color: AppColors.sage,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Practice what you just learned',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.sage, size: 22),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// FEEDBACK SECTION
// ---------------------------------------------------------------------------

class _FeedbackSection extends StatelessWidget {
  final FeedbackResponse? selected;
  final ValueChanged<FeedbackResponse> onSelected;

  const _FeedbackSection({
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Text(
            'Was this helpful?',
            style: AppTypography.heading4.copyWith(color: AppColors.teal),
          ),
          const SizedBox(height: 2),
          Text(
            '\u0915\u094D\u092F\u093E \u092F\u0939 \u0938\u0939\u093E\u092F\u0915 \u0925\u093E?',
            style: AppTypography.caption.copyWith(
              color: AppColors.charcoalLight,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _FeedbackButton(
                icon: Icons.favorite,
                label: 'Yes',
                isSelected: selected == FeedbackResponse.helpful,
                activeColor: AppColors.sage,
                onTap: () => onSelected(FeedbackResponse.helpful),
              ),
              const SizedBox(width: AppSpacing.md),
              _FeedbackButton(
                icon: Icons.sentiment_neutral,
                label: 'Somewhat',
                isSelected: selected == FeedbackResponse.somewhat,
                activeColor: AppColors.accentHighlight,
                onTap: () => onSelected(FeedbackResponse.somewhat),
              ),
              const SizedBox(width: AppSpacing.md),
              _FeedbackButton(
                icon: Icons.skip_next,
                label: 'Skip',
                isSelected: selected == FeedbackResponse.skipped,
                activeColor: AppColors.charcoalLight,
                onTap: () => onSelected(FeedbackResponse.skipped),
              ),
            ],
          ),
          if (selected == FeedbackResponse.helpful) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Thank you for your feedback!',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.sage,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _FeedbackButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final Color activeColor;
  final VoidCallback onTap;

  const _FeedbackButton({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? activeColor.withValues(alpha: 0.12)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          border: Border.all(
            color: isSelected ? activeColor : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? activeColor : AppColors.charcoalLight,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: AppTypography.caption.copyWith(
                color: isSelected ? activeColor : AppColors.charcoalLight,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// NEXT MODULE / DONE BUTTONS
// ---------------------------------------------------------------------------

class _NextModuleButton extends StatelessWidget {
  final LearnModule nextModule;
  final VoidCallback onTap;
  const _NextModuleButton({required this.nextModule, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: AppSpacing.buttonHeight,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.sage,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              child: Text(
                'Next: ${nextModule.titleEn}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.arrow_forward, size: 20),
          ],
        ),
      ),
    );
  }
}

class _DoneButton extends StatelessWidget {
  final VoidCallback onTap;
  const _DoneButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: AppSpacing.buttonHeight,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.teal,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          ),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check, size: 20),
            SizedBox(width: 8),
            Text(
              'All done!',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}
