import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'disease_library_provider.dart';

/// FAQ Screen — frequently asked questions with category tabs and accordion.
///
/// Layout:
///  [A] Category filter chips (horizontal scroll)
///  [B] FAQ accordion list (expandable Q&A)
///  [C] Contact prompt at bottom
///
/// Spec: Feature 2 — Psychoeducation Library.
class LearnFaqScreen extends ConsumerWidget {
  const LearnFaqScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final libState = ref.watch(diseaseLibraryProvider);
    final faqs = libState.filteredFaqs;

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
          'FAQ Corner',
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Subtitle
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Common Questions Answered',
                    style: AppTypography.bodyDefault.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  Text(
                    '\u0905\u0915\u094D\u0938\u0930 \u092A\u0942\u091B\u0947 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0947 \u0938\u0935\u093E\u0932\u094B\u0902 \u0915\u0947 \u0909\u0924\u094D\u0924\u0930',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.sm),

            // [A] Category chips
            _CategoryFilterRow(
              selectedCategory: libState.selectedFaqCategory,
              onCategoryTap: (cat) => ref
                  .read(diseaseLibraryProvider.notifier)
                  .selectFaqCategory(cat),
            ),
            const SizedBox(height: AppSpacing.sm),

            // [B] FAQ List
            Expanded(
              child: faqs.isEmpty
                  ? _EmptyFaqState()
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md,
                        vertical: AppSpacing.sm,
                      ),
                      itemCount: faqs.length + 1, // +1 for contact card
                      itemBuilder: (context, index) {
                        if (index == faqs.length) {
                          return _ContactPromptCard();
                        }
                        final faq = faqs[index];
                        return _FaqAccordionCard(
                          faq: faq,
                          onToggle: () => ref
                              .read(diseaseLibraryProvider.notifier)
                              .toggleFaqExpanded(faq.id),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// CATEGORY FILTER ROW
// ---------------------------------------------------------------------------

class _CategoryFilterRow extends StatelessWidget {
  final FaqCategory? selectedCategory;
  final ValueChanged<FaqCategory?> onCategoryTap;

  const _CategoryFilterRow({
    required this.selectedCategory,
    required this.onCategoryTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
        children: [
          // "All" chip
          _FilterChip(
            label: 'All',
            labelHi: '\u0938\u092D\u0940',
            isSelected: selectedCategory == null,
            onTap: () => onCategoryTap(null),
          ),
          const SizedBox(width: AppSpacing.sm),
          // Category chips
          ...FaqCategory.values.map(
            (cat) => Padding(
              padding: const EdgeInsets.only(right: AppSpacing.sm),
              child: _FilterChip(
                label: _categoryLabelEn(cat),
                labelHi: _categoryLabelHi(cat),
                isSelected: selectedCategory == cat,
                onTap: () => onCategoryTap(cat),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final String labelHi;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.labelHi,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.teal : AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(
            color: isSelected ? AppColors.teal : AppColors.border,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelSmall.copyWith(
            color: isSelected ? Colors.white : AppColors.charcoalLight,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// FAQ ACCORDION CARD
// ---------------------------------------------------------------------------

class _FaqAccordionCard extends StatelessWidget {
  final FaqEntry faq;
  final VoidCallback onToggle;

  const _FaqAccordionCard({
    required this.faq,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: faq.isExpanded
                ? AppColors.teal.withValues(alpha: 0.3)
                : AppColors.border,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question header
            InkWell(
              onTap: onToggle,
              borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: faq.isExpanded
                            ? AppColors.teal.withValues(alpha: 0.12)
                            : AppColors.cream,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Q',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.teal,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            faq.questionEn,
                            style: AppTypography.label.copyWith(
                              color: AppColors.teal,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            faq.questionHi,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.charcoalLight,
                            ),
                          ),
                        ],
                      ),
                    ),
                    AnimatedRotation(
                      turns: faq.isExpanded ? 0.5 : 0,
                      duration: const Duration(milliseconds: 200),
                      child: const Icon(
                        Icons.expand_more,
                        color: AppColors.charcoalLight,
                        size: 22,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Answer (expandable)
            AnimatedCrossFade(
              firstChild: const SizedBox.shrink(),
              secondChild: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.md,
                  0,
                  AppSpacing.md,
                  AppSpacing.md,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Divider(height: 1),
                    const SizedBox(height: AppSpacing.sm),

                    // Answer English
                    Text(
                      faq.answerEn,
                      style: AppTypography.bodyDefault.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),

                    // Answer Hindi
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.sm),
                      decoration: BoxDecoration(
                        color: AppColors.cream,
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusButton),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.teal,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            faq.answerHi,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.charcoalLight,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Source note
                    if (faq.sourceNote != null) ...[
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        children: [
                          Icon(Icons.verified_outlined,
                              size: 14,
                              color: AppColors.sage.withValues(alpha: 0.7)),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              'Source: ${faq.sourceNote}',
                              style: AppTypography.caption.copyWith(
                                color: AppColors.sage,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],

                    // Category badge
                    const SizedBox(height: AppSpacing.sm),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: _categoryColor(faq.category)
                            .withValues(alpha: 0.1),
                        borderRadius:
                            BorderRadius.circular(AppSpacing.radiusBadge),
                      ),
                      child: Text(
                        _categoryLabelEn(faq.category),
                        style: AppTypography.caption.copyWith(
                          color: _categoryColor(faq.category),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              crossFadeState: faq.isExpanded
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 250),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// EMPTY FAQ STATE
// ---------------------------------------------------------------------------

class _EmptyFaqState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.question_answer_outlined,
              size: 48,
              color: AppColors.charcoalLight.withValues(alpha: 0.4),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No FAQs in this category yet',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.charcoalLight,
              ),
              textAlign: TextAlign.center,
            ),
            Text(
              '\u0907\u0938 \u0936\u094D\u0930\u0947\u0923\u0940 \u092E\u0947\u0902 \u0905\u092D\u0940 \u0915\u094B\u0908 FAQ \u0928\u0939\u0940\u0902',
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
// CONTACT PROMPT CARD
// ---------------------------------------------------------------------------

class _ContactPromptCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.sage.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: AppColors.sage.withValues(alpha: 0.2),
          ),
        ),
        child: Column(
          children: [
            const Icon(Icons.chat_bubble_outline,
                color: AppColors.sage, size: 28),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Still have questions?',
              style: AppTypography.heading4.copyWith(
                color: AppColors.teal,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Talk to your palliative care team. They are here to help.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 2),
            Text(
              '\u0905\u092A\u0928\u0940 \u092A\u0948\u0932\u093F\u090F\u091F\u093F\u0935 \u0915\u0947\u092F\u0930 \u091F\u0940\u092E \u0938\u0947 \u092C\u093E\u0924 \u0915\u0930\u0947\u0902\u0964',
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
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

String _categoryLabelEn(FaqCategory cat) {
  switch (cat) {
    case FaqCategory.general:
      return 'General';
    case FaqCategory.treatment:
      return 'Treatment';
    case FaqCategory.sideEffects:
      return 'Side Effects';
    case FaqCategory.nutrition:
      return 'Nutrition';
    case FaqCategory.emotional:
      return 'Emotional';
    case FaqCategory.caregiver:
      return 'Caregiver';
    case FaqCategory.endOfLife:
      return 'End of Life';
    case FaqCategory.financial:
      return 'Financial';
  }
}

String _categoryLabelHi(FaqCategory cat) {
  switch (cat) {
    case FaqCategory.general:
      return '\u0938\u093E\u092E\u093E\u0928\u094D\u092F';
    case FaqCategory.treatment:
      return '\u0909\u092A\u091A\u093E\u0930';
    case FaqCategory.sideEffects:
      return '\u0926\u0941\u0937\u094D\u092A\u094D\u0930\u092D\u093E\u0935';
    case FaqCategory.nutrition:
      return '\u092A\u094B\u0937\u0923';
    case FaqCategory.emotional:
      return '\u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915';
    case FaqCategory.caregiver:
      return '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E';
    case FaqCategory.endOfLife:
      return '\u091C\u0940\u0935\u0928 \u0915\u093E \u0905\u0902\u0924';
    case FaqCategory.financial:
      return '\u0935\u093F\u0924\u094D\u0924\u0940\u092F';
  }
}

Color _categoryColor(FaqCategory cat) {
  switch (cat) {
    case FaqCategory.general:
      return AppColors.teal;
    case FaqCategory.treatment:
      return AppColors.sage;
    case FaqCategory.sideEffects:
      return AppColors.accentWarm;
    case FaqCategory.nutrition:
      return AppColors.accentHighlight;
    case FaqCategory.emotional:
      return AppColors.lavender;
    case FaqCategory.caregiver:
      return AppColors.info;
    case FaqCategory.endOfLife:
      return AppColors.charcoalLight;
    case FaqCategory.financial:
      return AppColors.sage;
  }
}
