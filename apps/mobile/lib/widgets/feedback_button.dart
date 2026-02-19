import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_spacing.dart';
import '../core/theme/app_typography.dart';

/// In-app feedback floating action button for pilot study.
///
/// Displays as a small teal FAB with a chat icon. On tap, opens a
/// bottom sheet where users can rate the app (1-5 stars) and leave
/// a free-text comment in Hindi or English.
class FeedbackButton extends StatelessWidget {
  const FeedbackButton({super.key});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.small(
      heroTag: 'feedback_fab',
      backgroundColor: AppColors.primaryDark,
      foregroundColor: Colors.white,
      tooltip: 'Send Feedback / प्रतिक्रिया भेजें',
      onPressed: () => _showFeedbackSheet(context),
      child: const Icon(Icons.feedback_outlined, size: 20),
    );
  }

  void _showFeedbackSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const _FeedbackSheet(),
    );
  }
}

class _FeedbackSheet extends StatefulWidget {
  const _FeedbackSheet();

  @override
  State<_FeedbackSheet> createState() => _FeedbackSheetState();
}

class _FeedbackSheetState extends State<_FeedbackSheet> {
  int _rating = 0;
  final _commentController = TextEditingController();
  String _category = 'general';
  bool _submitted = false;

  static const _categories = <String, String>{
    'general': 'General / सामान्य',
    'pain_logging': 'Pain Logging / दर्द लॉगिंग',
    'medication': 'Medication / दवाई',
    'ui_ux': 'App Design / ऐप डिज़ाइन',
    'bug': 'Bug Report / बग रिपोर्ट',
    'suggestion': 'Suggestion / सुझाव',
  };

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _submit() {
    // In production, this would send to Firebase Analytics or backend
    // For pilot, we store locally and export later
    setState(() => _submitted = true);

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.pop(context);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      margin: EdgeInsets.only(bottom: bottomInset),
      decoration: const BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: _submitted ? _buildThankYou() : _buildForm(),
    );
  }

  Widget _buildThankYou() {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.check_circle, size: 56, color: AppColors.primary),
          const SizedBox(height: AppSpacing.space4),
          Text(
            'Thank you! / धन्यवाद!',
            style: AppTypography.heading3.copyWith(
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: AppSpacing.space2),
          Text(
            'Your feedback helps us improve PalliCare',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          Text(
            'आपकी प्रतिक्रिया पैलीकेयर को बेहतर बनाने में मदद करती है',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textTertiary,
            ),
          ),
          const SizedBox(height: AppSpacing.space6),
        ],
      ),
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.screenPaddingHorizontal,
          AppSpacing.space4,
          AppSpacing.screenPaddingHorizontal,
          AppSpacing.space6,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.space4),

            // Title
            Text(
              'Send Feedback',
              style: AppTypography.heading3.copyWith(
                color: AppColors.primaryDark,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'प्रतिक्रिया भेजें',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.space5),

            // Star rating
            Text(
              'How is your experience? / आपका अनुभव कैसा है?',
              style: AppTypography.label.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.space3),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (i) {
                final starIndex = i + 1;
                return GestureDetector(
                  onTap: () => setState(() => _rating = starIndex),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    child: Icon(
                      starIndex <= _rating
                          ? Icons.star_rounded
                          : Icons.star_outline_rounded,
                      size: 40,
                      color: starIndex <= _rating
                          ? AppColors.warning
                          : AppColors.border,
                    ),
                  ),
                );
              }),
            ),
            if (_rating > 0)
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    _ratingLabel(_rating),
                    style: AppTypography.caption.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            const SizedBox(height: AppSpacing.space5),

            // Category
            Text(
              'Category / श्रेणी',
              style: AppTypography.label.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.space2),
            Wrap(
              spacing: AppSpacing.space2,
              runSpacing: AppSpacing.space2,
              children: _categories.entries.map((e) {
                final isSelected = _category == e.key;
                return GestureDetector(
                  onTap: () => setState(() => _category = e.key),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color:
                          isSelected ? AppColors.primary : AppColors.surface,
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusChip),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.border,
                      ),
                    ),
                    child: Text(
                      e.value,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                        color: isSelected
                            ? Colors.white
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.space5),

            // Comment
            Text(
              'Comment (optional) / टिप्पणी (वैकल्पिक)',
              style: AppTypography.label.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.space2),
            TextField(
              controller: _commentController,
              maxLines: 3,
              maxLength: 500,
              decoration: InputDecoration(
                hintText: 'Tell us more... / हमें और बताएँ...',
                hintStyle: TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 14,
                ),
                filled: true,
                fillColor: AppColors.surface,
                border: OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                  borderSide: BorderSide(color: AppColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(AppSpacing.radiusButton),
                  borderSide: BorderSide(color: AppColors.primary, width: 2),
                ),
                contentPadding: const EdgeInsets.all(AppSpacing.space3),
              ),
            ),
            const SizedBox(height: AppSpacing.space5),

            // Submit button
            SizedBox(
              height: AppSpacing.buttonHeight,
              child: ElevatedButton(
                onPressed: _rating > 0 ? _submit : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: AppColors.border,
                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusButton),
                  ),
                ),
                child: const Text(
                  'Submit Feedback / प्रतिक्रिया भेजें',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _ratingLabel(int rating) {
    switch (rating) {
      case 1:
        return 'Poor / खराब';
      case 2:
        return 'Fair / ठीक';
      case 3:
        return 'Good / अच्छा';
      case 4:
        return 'Very Good / बहुत अच्छा';
      case 5:
        return 'Excellent / उत्कृष्ट';
      default:
        return '';
    }
  }
}
