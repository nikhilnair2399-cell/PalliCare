import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/routing/app_router.dart';
import 'disease_library_provider.dart';

/// Disease Detail Screen — comprehensive view of a single disease entry.
///
/// Layout:
///  [A] Hero banner with emoji, title, disease class badge
///  [B] Overview card (bilingual)
///  [C] Key Facts strip
///  [D] Content sections (expandable)
///  [E] Related Diseases
///
/// Spec: Feature 2 — Psychoeducation Library.
class LearnDiseaseDetailScreen extends ConsumerWidget {
  final String diseaseId;
  const LearnDiseaseDetailScreen({super.key, required this.diseaseId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final libState = ref.watch(diseaseLibraryProvider);

    // Find the disease
    DiseaseEntry? disease;
    try {
      disease = libState.diseases.firstWhere((d) => d.id == diseaseId);
    } catch (_) {
      disease = null;
    }

    if (disease == null) {
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
        body: Center(
          child: Text(
            'Disease not found',
            style: AppTypography.bodyLarge.copyWith(
              color: AppColors.charcoalLight,
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: CustomScrollView(
        slivers: [
          // App bar with bookmark action
          SliverAppBar(
            backgroundColor: AppColors.cream,
            elevation: 0,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: AppColors.teal),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text(
              disease.nameEn,
              style: AppTypography.heading3.copyWith(color: AppColors.teal),
            ),
            centerTitle: true,
            actions: [
              IconButton(
                icon: Icon(
                  disease.isBookmarked
                      ? Icons.bookmark
                      : Icons.bookmark_border,
                  color: disease.isBookmarked
                      ? AppColors.sage
                      : AppColors.charcoalLight,
                ),
                onPressed: () => ref
                    .read(diseaseLibraryProvider.notifier)
                    .toggleBookmark(disease!.id),
                tooltip:
                    disease.isBookmarked ? 'Remove bookmark' : 'Bookmark',
              ),
            ],
          ),

          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.md),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // [A] Hero Banner
                _HeroBanner(disease: disease),
                const SizedBox(height: AppSpacing.md),

                // [B] Overview
                _OverviewCard(disease: disease),
                const SizedBox(height: AppSpacing.md),

                // [C] Key Facts
                if (disease.keyFacts.isNotEmpty) ...[
                  _KeyFactsCard(facts: disease.keyFacts),
                  const SizedBox(height: AppSpacing.md),
                ],

                // [D] Content Sections
                Text(
                  'Detailed Information',
                  style: AppTypography.heading3.copyWith(
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '\u0935\u093F\u0938\u094D\u0924\u0943\u0924 \u091C\u093E\u0928\u0915\u093E\u0930\u0940',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                ...disease.sections.asMap().entries.map(
                      (entry) => _SectionCard(
                        section: entry.value,
                        index: entry.key,
                        totalSections: disease!.sections.length,
                      ),
                    ),
                const SizedBox(height: AppSpacing.md),

                // [E] Related Diseases
                if (disease.relatedDiseaseIds.isNotEmpty) ...[
                  Text(
                    'Related Topics',
                    style: AppTypography.heading3.copyWith(
                      color: AppColors.teal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '\u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0935\u093F\u0937\u092F',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  _RelatedDiseasesRow(
                    relatedIds: disease.relatedDiseaseIds,
                    allDiseases: libState.diseases,
                    onTap: (id) {
                      ref
                          .read(diseaseLibraryProvider.notifier)
                          .selectDisease(id);
                      context.push(AppRoutes.learnDiseaseDetail, extra: id);
                    },
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],

                // Disclaimer
                _DisclaimerCard(),
                const SizedBox(height: AppSpacing.lg),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// HERO BANNER
// ---------------------------------------------------------------------------

class _HeroBanner extends StatelessWidget {
  final DiseaseEntry disease;
  const _HeroBanner({required this.disease});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _classColor(disease.diseaseClass),
            AppColors.teal,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
      ),
      child: Row(
        children: [
          Text(disease.emoji, style: const TextStyle(fontSize: 48)),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Disease class badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusChip),
                  ),
                  child: Text(
                    _classLabel(disease.diseaseClass),
                    style: AppTypography.caption.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  disease.nameEn,
                  style: AppTypography.heading2.copyWith(
                    color: Colors.white,
                  ),
                ),
                Text(
                  disease.nameHi,
                  style: AppTypography.bodyDefault.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
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

// ---------------------------------------------------------------------------
// OVERVIEW CARD
// ---------------------------------------------------------------------------

class _OverviewCard extends StatelessWidget {
  final DiseaseEntry disease;
  const _OverviewCard({required this.disease});

  @override
  Widget build(BuildContext context) {
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
              const Icon(Icons.info_outline, color: AppColors.teal, size: 18),
              const SizedBox(width: 6),
              Text(
                'Overview',
                style: AppTypography.heading4.copyWith(
                  color: AppColors.teal,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            disease.overviewEn,
            style: AppTypography.bodyDefault.copyWith(
              color: AppColors.textPrimary,
              height: 1.6,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.cream,
              borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
            ),
            child: Text(
              disease.overviewHi,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// KEY FACTS CARD
// ---------------------------------------------------------------------------

class _KeyFactsCard extends StatelessWidget {
  final List<String> facts;
  const _KeyFactsCard({required this.facts});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.accentHighlight.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: AppColors.accentHighlight.withValues(alpha: 0.25),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.lightbulb_outline,
                  color: AppColors.accentHighlight, size: 18),
              const SizedBox(width: 6),
              Text(
                'Key Facts',
                style: AppTypography.heading4.copyWith(
                  color: AppColors.teal,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '\u092E\u0941\u0916\u094D\u092F \u0924\u0925\u094D\u092F',
                style: AppTypography.caption.copyWith(
                  color: AppColors.charcoalLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          ...facts.map(
            (fact) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 6),
                    child: Icon(Icons.circle,
                        size: 6, color: AppColors.accentHighlight),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      fact,
                      style: AppTypography.bodyDefault.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.5,
                      ),
                    ),
                  ),
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
// SECTION CARD (expandable)
// ---------------------------------------------------------------------------

class _SectionCard extends StatefulWidget {
  final DiseaseSection section;
  final int index;
  final int totalSections;

  const _SectionCard({
    required this.section,
    required this.index,
    required this.totalSections,
  });

  @override
  State<_SectionCard> createState() => _SectionCardState();
}

class _SectionCardState extends State<_SectionCard> {
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    // Auto-expand first section
    _expanded = widget.index == 0;
  }

  @override
  Widget build(BuildContext context) {
    final section = widget.section;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header (tap to expand)
            InkWell(
              onTap: () => setState(() => _expanded = !_expanded),
              borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  children: [
                    // Section number
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: AppColors.teal.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '${widget.index + 1}',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.teal,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            section.titleEn,
                            style: AppTypography.label.copyWith(
                              color: AppColors.teal,
                            ),
                          ),
                          Text(
                            section.titleHi,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.charcoalLight,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Difficulty badge
                    if (section.difficulty != ContentDifficulty.basic)
                      Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: section.difficulty ==
                                  ContentDifficulty.intermediate
                              ? AppColors.info.withValues(alpha: 0.12)
                              : AppColors.accentWarm.withValues(alpha: 0.12),
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusBadge),
                        ),
                        child: Text(
                          section.difficulty ==
                                  ContentDifficulty.intermediate
                              ? 'Intermediate'
                              : 'Detailed',
                          style: AppTypography.caption.copyWith(
                            color: section.difficulty ==
                                    ContentDifficulty.intermediate
                                ? AppColors.info
                                : AppColors.accentWarm,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    AnimatedRotation(
                      turns: _expanded ? 0.5 : 0,
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

            // Expandable content
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
                    // English content
                    Text(
                      section.contentEn,
                      style: AppTypography.bodyDefault.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    // Hindi content
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
                          Row(
                            children: [
                              Text(
                                '\u0939\u093F\u0902\u0926\u0940',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.teal,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            section.contentHi,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.charcoalLight,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              crossFadeState: _expanded
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
// RELATED DISEASES ROW
// ---------------------------------------------------------------------------

class _RelatedDiseasesRow extends StatelessWidget {
  final List<String> relatedIds;
  final List<DiseaseEntry> allDiseases;
  final ValueChanged<String> onTap;

  const _RelatedDiseasesRow({
    required this.relatedIds,
    required this.allDiseases,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final related = relatedIds
        .map((id) {
          try {
            return allDiseases.firstWhere((d) => d.id == id);
          } catch (_) {
            return null;
          }
        })
        .whereType<DiseaseEntry>()
        .toList();

    if (related.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: 80,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: related.length,
        separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, index) {
          final d = related[index];
          return GestureDetector(
            onTap: () => onTap(d.id),
            child: Container(
              width: 160,
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.surfaceCard,
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Text(d.emoji, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          d.nameEn,
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.teal,
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          d.nameHi,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right,
                      size: 16, color: AppColors.charcoalLight),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DISCLAIMER CARD
// ---------------------------------------------------------------------------

class _DisclaimerCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.info.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(
          color: AppColors.info.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.medical_information,
              color: AppColors.info, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Medical Disclaimer',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.info,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'This content is for educational purposes only and should not replace professional medical advice. Always consult your doctor for personalized care.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.charcoalLight,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '\u092F\u0939 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u0947\u0935\u0932 \u0936\u0948\u0915\u094D\u0937\u093F\u0915 \u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0905\u092A\u0928\u0947 \u0921\u0949\u0915\u094D\u091F\u0930 \u0938\u0947 \u0938\u0932\u093E\u0939 \u0932\u0947\u0902\u0964',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.charcoalLight,
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

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

String _classLabel(DiseaseClass cls) {
  switch (cls) {
    case DiseaseClass.cancer:
      return 'Cancer';
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
