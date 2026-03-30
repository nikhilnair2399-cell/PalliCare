import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/routing/app_router.dart';
import 'disease_library_provider.dart';

/// Search Screen — full-text search across all disease content.
///
/// Features:
///  - Auto-focus text input with clear button
///  - Real-time search as user types
///  - Results grouped by disease class
///  - Empty state with suggested categories
///
/// Spec: Feature 2 — Psychoeducation Library.
class LearnSearchScreen extends ConsumerStatefulWidget {
  const LearnSearchScreen({super.key});

  @override
  ConsumerState<LearnSearchScreen> createState() => _LearnSearchScreenState();
}

class _LearnSearchScreenState extends ConsumerState<LearnSearchScreen> {
  late final TextEditingController _controller;
  late final FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _focusNode = FocusNode();

    // Auto-focus the search field
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    // Clear search when leaving
    ref.read(diseaseLibraryProvider.notifier).clearSearch();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    ref.read(diseaseLibraryProvider.notifier).updateSearch(query);
  }

  @override
  Widget build(BuildContext context) {
    final libState = ref.watch(diseaseLibraryProvider);
    final results = libState.filteredDiseases;
    final hasQuery = libState.searchQuery.isNotEmpty;

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.teal),
          onPressed: () {
            ref.read(diseaseLibraryProvider.notifier).clearSearch();
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          'Search',
          style: AppTypography.heading3.copyWith(color: AppColors.teal),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search input
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm,
              ),
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                onChanged: _onSearchChanged,
                style: AppTypography.bodyDefault.copyWith(
                  color: AppColors.textPrimary,
                ),
                decoration: InputDecoration(
                  hintText:
                      'Search diseases, symptoms, treatments...',
                  hintStyle: AppTypography.bodyDefault.copyWith(
                    color: AppColors.textTertiary,
                  ),
                  prefixIcon: const Icon(Icons.search,
                      color: AppColors.charcoalLight, size: 20),
                  suffixIcon: hasQuery
                      ? IconButton(
                          icon: const Icon(Icons.close,
                              color: AppColors.charcoalLight, size: 20),
                          onPressed: () {
                            _controller.clear();
                            _onSearchChanged('');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: AppColors.surfaceCard,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: 14,
                  ),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide:
                        const BorderSide(color: AppColors.teal, width: 1.5),
                  ),
                ),
              ),
            ),

            // Results or empty state
            Expanded(
              child: hasQuery
                  ? results.isEmpty
                      ? _EmptySearchState(query: libState.searchQuery)
                      : _SearchResults(
                          results: results,
                          onTap: (disease) {
                            ref
                                .read(diseaseLibraryProvider.notifier)
                                .selectDisease(disease.id);
                            context.push(AppRoutes.learnDiseaseDetail,
                                extra: disease.id);
                          },
                          onBookmark: (id) => ref
                              .read(diseaseLibraryProvider.notifier)
                              .toggleBookmark(id),
                        )
                  : _SuggestedSearches(
                      onTap: (query) {
                        _controller.text = query;
                        _onSearchChanged(query);
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
// SEARCH RESULTS
// ---------------------------------------------------------------------------

class _SearchResults extends StatelessWidget {
  final List<DiseaseEntry> results;
  final ValueChanged<DiseaseEntry> onTap;
  final ValueChanged<String> onBookmark;

  const _SearchResults({
    required this.results,
    required this.onTap,
    required this.onBookmark,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      itemCount: results.length + 1, // +1 for results count header
      itemBuilder: (context, index) {
        if (index == 0) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: Text(
              '${results.length} result${results.length == 1 ? '' : 's'} found',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.charcoalLight,
              ),
            ),
          );
        }

        final disease = results[index - 1];
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.sm),
          child: GestureDetector(
            onTap: () => onTap(disease),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.surfaceCard,
                borderRadius:
                    BorderRadius.circular(AppSpacing.radiusCard),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  // Emoji
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.teal.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(disease.emoji,
                        style: const TextStyle(fontSize: 20)),
                  ),
                  const SizedBox(width: AppSpacing.sm),
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
                        Text(
                          disease.nameHi,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.charcoalLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Disease class badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.teal.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(
                                AppSpacing.radiusBadge),
                          ),
                          child: Text(
                            _classLabel(disease.diseaseClass),
                            style: AppTypography.caption.copyWith(
                              color: AppColors.teal,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      disease.isBookmarked
                          ? Icons.bookmark
                          : Icons.bookmark_border,
                      color: disease.isBookmarked
                          ? AppColors.sage
                          : AppColors.charcoalLight,
                      size: 20,
                    ),
                    onPressed: () => onBookmark(disease.id),
                  ),
                  const Icon(Icons.chevron_right,
                      color: AppColors.charcoalLight, size: 20),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// EMPTY SEARCH STATE
// ---------------------------------------------------------------------------

class _EmptySearchState extends StatelessWidget {
  final String query;
  const _EmptySearchState({required this.query});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.search_off,
              size: 48,
              color: AppColors.charcoalLight.withValues(alpha: 0.4),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No results for "$query"',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.charcoalLight,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Try different keywords or browse by category',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textTertiary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 2),
            Text(
              '\u0905\u0932\u0917 \u0936\u092C\u094D\u0926\u094B\u0902 \u0938\u0947 \u0916\u094B\u091C\u0947\u0902',
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
// SUGGESTED SEARCHES
// ---------------------------------------------------------------------------

class _SuggestedSearches extends StatelessWidget {
  final ValueChanged<String> onTap;
  const _SuggestedSearches({required this.onTap});

  static const _suggestions = [
    'Cancer',
    'Pain',
    'Breathlessness',
    'Heart Failure',
    'COPD',
    'Nausea',
    'Kidney',
    'Liver',
    'Parkinson',
    'Morphine',
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Suggested Topics',
            style: AppTypography.heading4.copyWith(
              color: AppColors.teal,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '\u0938\u0941\u091D\u093E\u0935 \u0926\u093F\u090F \u0917\u090F \u0935\u093F\u0937\u092F',
            style: AppTypography.caption.copyWith(
              color: AppColors.charcoalLight,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: _suggestions
                .map(
                  (s) => ActionChip(
                    label: Text(
                      s,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.teal,
                      ),
                    ),
                    backgroundColor: AppColors.surfaceCard,
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusChip),
                    ),
                    onPressed: () => onTap(s),
                  ),
                )
                .toList(),
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
