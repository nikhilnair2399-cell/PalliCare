import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/routing/app_router.dart';
import 'disease_library_provider.dart';
import 'disease_category_card.dart';

/// Disease Library Screen — browse diseases by class, search, bookmarks.
///
/// Layout:
///  [A] Search bar (tap opens search screen)
///  [B] Recently Viewed strip (horizontal scroll)
///  [C] Disease Class grid (2-column)
///  [D] Bookmarks quick-access row
///  [E] FAQ corner link
///
/// Spec: Feature 2 — Psychoeducation Library.
class LearnLibraryScreen extends ConsumerWidget {
  const LearnLibraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final libState = ref.watch(diseaseLibraryProvider);

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
          'Disease Library',
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: AppColors.teal),
            tooltip: 'Search diseases',
            onPressed: () => context.push(AppRoutes.learnSearch),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // [A] Search Bar (visual, taps to search screen)
              _SearchBarButton(
                onTap: () => context.push(AppRoutes.learnSearch),
              ),
              const SizedBox(height: AppSpacing.lg),

              // [B] Recently Viewed
              if (libState.recentlyViewed.isNotEmpty) ...[
                Text(
                  'Recently Viewed',
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '\u0939\u093E\u0932 \u0939\u0940 \u092E\u0947\u0902 \u0926\u0947\u0916\u093E \u0917\u092F\u093E',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                SizedBox(
                  height: 90,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: libState.recentlyViewed.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (context, index) {
                      final disease = libState.recentlyViewed[index];
                      return _RecentDiseaseChip(
                        disease: disease,
                        onTap: () {
                          ref
                              .read(diseaseLibraryProvider.notifier)
                              .selectDisease(disease.id);
                          context.push(AppRoutes.learnDiseaseDetail,
                              extra: disease.id);
                        },
                      );
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // [C] Browse by Category
              Text(
                'Browse by Category',
                style: AppTypography.heading3.copyWith(
                  color: AppColors.teal,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                '\u0936\u094D\u0930\u0947\u0923\u0940 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0916\u094B\u091C\u0947\u0902',
                style: AppTypography.caption.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              _DiseaseCategoryGrid(
                classCountMap: libState.classCountMap,
                onCategoryTap: (cls) {
                  ref.read(diseaseLibraryProvider.notifier).selectClass(cls);
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // Filtered disease list (when a class is selected)
              if (libState.selectedClass != null) ...[
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        _classLabelEn(libState.selectedClass!),
                        style: AppTypography.heading3.copyWith(
                          color: AppColors.teal,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => ref
                          .read(diseaseLibraryProvider.notifier)
                          .selectClass(null),
                      icon: const Icon(Icons.close, size: 16),
                      label: const Text('Clear'),
                      style: TextButton.styleFrom(
                        foregroundColor: AppColors.charcoalLight,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                ...libState.filteredDiseases.map(
                  (disease) => _DiseaseListTile(
                    disease: disease,
                    onTap: () {
                      ref
                          .read(diseaseLibraryProvider.notifier)
                          .selectDisease(disease.id);
                      context.push(AppRoutes.learnDiseaseDetail,
                          extra: disease.id);
                    },
                    onBookmark: () => ref
                        .read(diseaseLibraryProvider.notifier)
                        .toggleBookmark(disease.id),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // [D] Bookmarks
              if (libState.bookmarkedDiseases.isNotEmpty) ...[
                Row(
                  children: [
                    const Icon(Icons.bookmark, color: AppColors.sage, size: 20),
                    const SizedBox(width: 6),
                    Text(
                      'Bookmarked',
                      style: AppTypography.heading3.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                ...libState.bookmarkedDiseases.map(
                  (disease) => _DiseaseListTile(
                    disease: disease,
                    onTap: () {
                      ref
                          .read(diseaseLibraryProvider.notifier)
                          .selectDisease(disease.id);
                      context.push(AppRoutes.learnDiseaseDetail,
                          extra: disease.id);
                    },
                    onBookmark: () => ref
                        .read(diseaseLibraryProvider.notifier)
                        .toggleBookmark(disease.id),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // [E] FAQ Corner Link
              _FaqCornerCard(
                onTap: () => context.push(AppRoutes.learnFaq),
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
// SEARCH BAR BUTTON (visual — navigates to search screen)
// ---------------------------------------------------------------------------

class _SearchBarButton extends StatelessWidget {
  final VoidCallback onTap;
  const _SearchBarButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: 14,
        ),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusInput),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Icon(Icons.search, color: AppColors.charcoalLight, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                'Search diseases, topics, symptoms...',
                style: AppTypography.bodyDefault.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
            ),
            Text(
              '\u0916\u094B\u091C\u0947\u0902',
              style: AppTypography.caption.copyWith(
                color: AppColors.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DISEASE CATEGORY GRID (2-column)
// ---------------------------------------------------------------------------

class _DiseaseCategoryGrid extends StatelessWidget {
  final Map<DiseaseClass, int> classCountMap;
  final ValueChanged<DiseaseClass> onCategoryTap;

  const _DiseaseCategoryGrid({
    required this.classCountMap,
    required this.onCategoryTap,
  });

  @override
  Widget build(BuildContext context) {
    final classes = DiseaseClass.values;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: classes.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: AppSpacing.sm,
        mainAxisSpacing: AppSpacing.sm,
        childAspectRatio: 1.6,
      ),
      itemBuilder: (context, index) {
        final cls = classes[index];
        final count = classCountMap[cls] ?? 0;
        return DiseaseCategoryCard(
          diseaseClass: cls,
          count: count,
          onTap: () => onCategoryTap(cls),
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// RECENTLY VIEWED CHIP
// ---------------------------------------------------------------------------

class _RecentDiseaseChip extends StatelessWidget {
  final DiseaseEntry disease;
  final VoidCallback onTap;

  const _RecentDiseaseChip({required this.disease, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        padding: const EdgeInsets.all(AppSpacing.sm),
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(disease.emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 4),
            Text(
              disease.nameEn,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.teal,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              disease.nameHi,
              style: AppTypography.caption.copyWith(
                color: AppColors.charcoalLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DISEASE LIST TILE
// ---------------------------------------------------------------------------

class _DiseaseListTile extends StatelessWidget {
  final DiseaseEntry disease;
  final VoidCallback onTap;
  final VoidCallback onBookmark;

  const _DiseaseListTile({
    required this.disease,
    required this.onTap,
    required this.onBookmark,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.surfaceCard,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              // Emoji avatar
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: _classColor(disease.diseaseClass)
                      .withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(disease.emoji,
                    style: const TextStyle(fontSize: 22)),
              ),
              const SizedBox(width: AppSpacing.sm),
              // Title
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      disease.nameEn,
                      style: AppTypography.label.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      disease.nameHi,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.charcoalLight,
                      ),
                    ),
                    if (disease.keyFacts.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        '${disease.sections.length} sections  •  ${disease.keyFacts.length} key facts',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              // Bookmark
              IconButton(
                icon: Icon(
                  disease.isBookmarked
                      ? Icons.bookmark
                      : Icons.bookmark_border,
                  color: disease.isBookmarked
                      ? AppColors.sage
                      : AppColors.charcoalLight,
                  size: 22,
                ),
                onPressed: onBookmark,
                tooltip: disease.isBookmarked ? 'Remove bookmark' : 'Bookmark',
              ),
              // Chevron
              const Icon(
                Icons.chevron_right,
                color: AppColors.charcoalLight,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// FAQ CORNER CARD
// ---------------------------------------------------------------------------

class _FaqCornerCard extends StatelessWidget {
  final VoidCallback onTap;
  const _FaqCornerCard({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.lavender.withValues(alpha: 0.3),
              AppColors.teal.withValues(alpha: 0.08),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(
            color: AppColors.lavender.withValues(alpha: 0.4),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.lavender.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: const Text('\u2753', style: TextStyle(fontSize: 24)),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'FAQ Corner',
                    style: AppTypography.heading3.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Common questions answered',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  Text(
                    '\u0905\u0915\u094D\u0938\u0930 \u092A\u0942\u091B\u0947 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0947 \u0938\u0935\u093E\u0932',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppColors.teal.withValues(alpha: 0.5),
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

String _classLabelEn(DiseaseClass cls) {
  switch (cls) {
    case DiseaseClass.cancer:
      return 'Cancer Types';
    case DiseaseClass.neurological:
      return 'Neurological';
    case DiseaseClass.cardiac:
      return 'Cardiac';
    case DiseaseClass.respiratory:
      return 'Respiratory';
    case DiseaseClass.renal:
      return 'Renal';
    case DiseaseClass.hepatic:
      return 'Hepatic';
    case DiseaseClass.hematological:
      return 'Hematological';
    case DiseaseClass.autoimmune:
      return 'Autoimmune';
  }
}

Color _classColor(DiseaseClass cls) {
  switch (cls) {
    case DiseaseClass.cancer:
      return AppColors.accentWarm;
    case DiseaseClass.neurological:
      return AppColors.lavender;
    case DiseaseClass.cardiac:
      return AppColors.error;
    case DiseaseClass.respiratory:
      return AppColors.teal;
    case DiseaseClass.renal:
      return AppColors.accentHighlight;
    case DiseaseClass.hepatic:
      return AppColors.sage;
    case DiseaseClass.hematological:
      return AppColors.info;
    case DiseaseClass.autoimmune:
      return AppColors.accentCalm;
  }
}
