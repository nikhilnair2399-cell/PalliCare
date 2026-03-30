import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';

/// Comfort Card Picker — bottom sheet grid for selecting a pre-written comfort card.
/// Organized by 4 categories: Encouragement, Empathy, Strength, Peace.
class ComfortCardPicker extends StatefulWidget {
  final List<ComfortCard> comfortCards;
  final void Function(ComfortCard card) onSelect;
  final VoidCallback onClose;

  const ComfortCardPicker({
    super.key,
    required this.comfortCards,
    required this.onSelect,
    required this.onClose,
  });

  @override
  State<ComfortCardPicker> createState() => _ComfortCardPickerState();
}

class _ComfortCardPickerState extends State<ComfortCardPicker> {
  ComfortCategory _selectedCategory = ComfortCategory.encouragement;

  @override
  Widget build(BuildContext context) {
    final filteredCards = widget.comfortCards
        .where((c) => c.category == _selectedCategory)
        .toList();

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.45,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusHero),
        ),
        border: Border(
          top: BorderSide(color: AppColors.border.withValues(alpha: 0.5)),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.textPrimary.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // ── Header ──
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.md, AppSpacing.md, AppSpacing.sm, AppSpacing.xs,
            ),
            child: Row(
              children: [
                const Text('\ud83e\udd17', style: TextStyle(fontSize: 22)),
                const SizedBox(width: AppSpacing.sm),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Send a Comfort Card',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        // Hindi: Saantvana card bhejein
                        '\u0938\u093E\u0902\u0924\u094D\u0935\u0928\u093E \u0915\u093E\u0930\u094D\u0921 \u092D\u0947\u091C\u0947\u0902',
                        style: TextStyle(
                          color: AppColors.textTertiary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20, color: AppColors.textTertiary),
                  onPressed: widget.onClose,
                ),
              ],
            ),
          ),

          // ── Category Tabs ──
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: ComfortCategory.values.map((cat) {
                  return Padding(
                    padding: const EdgeInsets.only(right: AppSpacing.xs),
                    child: _CategoryTab(
                      category: cat,
                      isSelected: _selectedCategory == cat,
                      onTap: () => setState(() => _selectedCategory = cat),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.sm),

          // ── Cards Grid ──
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.xs,
              ),
              itemCount: filteredCards.length,
              separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
              itemBuilder: (context, index) {
                final card = filteredCards[index];
                return _ComfortCardTile(
                  card: card,
                  onTap: () => widget.onSelect(card),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// Private Widgets
// ─────────────────────────────────────────────────────────

class _CategoryTab extends StatelessWidget {
  final ComfortCategory category;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryTab({
    required this.category,
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
          vertical: 6,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? _categoryColor(category).withValues(alpha: 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
          border: Border.all(
            color: isSelected
                ? _categoryColor(category).withValues(alpha: 0.4)
                : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_categoryEmoji(category), style: const TextStyle(fontSize: 14)),
            const SizedBox(width: 4),
            Text(
              _categoryLabel(category),
              style: TextStyle(
                color: isSelected ? _categoryColor(category) : AppColors.textSecondary,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _categoryEmoji(ComfortCategory cat) {
    switch (cat) {
      case ComfortCategory.encouragement:
        return '\ud83c\udf1f';
      case ComfortCategory.empathy:
        return '\ud83e\udd17';
      case ComfortCategory.strength:
        return '\ud83d\udcaa';
      case ComfortCategory.peace:
        return '\ud83d\udd4a\ufe0f';
    }
  }

  String _categoryLabel(ComfortCategory cat) {
    switch (cat) {
      case ComfortCategory.encouragement:
        return 'Encouragement';
      case ComfortCategory.empathy:
        return 'Empathy';
      case ComfortCategory.strength:
        return 'Strength';
      case ComfortCategory.peace:
        return 'Peace';
    }
  }

  Color _categoryColor(ComfortCategory cat) {
    switch (cat) {
      case ComfortCategory.encouragement:
        return AppColors.success;
      case ComfortCategory.empathy:
        return AppColors.accentWarm;
      case ComfortCategory.strength:
        return AppColors.deepTeal;
      case ComfortCategory.peace:
        return AppColors.lavender;
    }
  }
}

class _ComfortCardTile extends StatelessWidget {
  final ComfortCard card;
  final VoidCallback onTap;

  const _ComfortCardTile({required this.card, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(card.emoji, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      card.messageEn,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      card.messageHi,
                      style: TextStyle(
                        color: AppColors.textSecondary.withValues(alpha: 0.8),
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              const Icon(
                Icons.send_rounded,
                size: 18,
                color: AppColors.primary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
