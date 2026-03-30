import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';

/// Bottom sheet for reporting a post or reply.
///
/// Users select a reason from the [ReportReason] enum and optionally add details.
/// Bilingual labels (EN + HI) throughout.
void showReportDialog(
  BuildContext context, {
  required String postId,
  required void Function(ReportReason reason, String details) onSubmit,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppColors.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
        top: Radius.circular(AppSpacing.radiusHero),
      ),
    ),
    builder: (ctx) => _ReportSheet(
      postId: postId,
      onSubmit: onSubmit,
    ),
  );
}

class _ReportSheet extends StatefulWidget {
  final String postId;
  final void Function(ReportReason reason, String details) onSubmit;

  const _ReportSheet({
    required this.postId,
    required this.onSubmit,
  });

  @override
  State<_ReportSheet> createState() => _ReportSheetState();
}

class _ReportSheetState extends State<_ReportSheet> {
  ReportReason? _selectedReason;
  final _detailsController = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  // ── Reason display data ──

  static const _reasonData = <ReportReason, _ReasonInfo>{
    ReportReason.harassment: _ReasonInfo(
      emoji: '\u26d4',
      labelEn: 'Harassment or bullying',
      // Hindi: Utpidan ya darana-dhamkana
      labelHi:
          '\u0909\u0924\u094D\u092A\u0940\u0921\u093C\u0928 \u092F\u093E \u0921\u0930\u093E\u0928\u093E-\u0927\u092E\u0915\u093E\u0928\u093E',
    ),
    ReportReason.misinformation: _ReasonInfo(
      emoji: '\u2757',
      labelEn: 'Medical misinformation',
      // Hindi: Chikitsa sambandhi galat jankari
      labelHi:
          '\u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0938\u0902\u092C\u0902\u0927\u0940 \u0917\u0932\u0924 \u091C\u093E\u0928\u0915\u093E\u0930\u0940',
    ),
    ReportReason.spam: _ReasonInfo(
      emoji: '\ud83d\udeab',
      labelEn: 'Spam or advertising',
      // Hindi: Spam ya vigyapan
      labelHi:
          '\u0938\u094D\u092A\u0948\u092E \u092F\u093E \u0935\u093F\u091C\u094D\u091E\u093E\u092A\u0928',
    ),
    ReportReason.selfHarm: _ReasonInfo(
      emoji: '\ud83d\udea8',
      labelEn: 'Self-harm or suicide',
      // Hindi: Aatm-haani ya aatm-hatya
      labelHi:
          '\u0906\u0924\u094D\u092E-\u0939\u093E\u0928\u093F \u092F\u093E \u0906\u0924\u094D\u092E\u0939\u0924\u094D\u092F\u093E',
    ),
    ReportReason.inappropriateContent: _ReasonInfo(
      emoji: '\ud83d\udeab',
      labelEn: 'Inappropriate content',
      // Hindi: Anuchit saamgri
      labelHi:
          '\u0905\u0928\u0941\u091A\u093F\u0924 \u0938\u093E\u092E\u0917\u094D\u0930\u0940',
    ),
    ReportReason.medicalAdvice: _ReasonInfo(
      emoji: '\ud83d\udc8a',
      labelEn: 'Unverified medical advice',
      // Hindi: Asatyapit chikitsa salah
      labelHi:
          '\u0905\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0938\u0932\u093E\u0939',
    ),
    ReportReason.other: _ReasonInfo(
      emoji: '\ud83d\udcdd',
      labelEn: 'Other',
      // Hindi: Anya
      labelHi: '\u0905\u0928\u094D\u092F',
    ),
  };

  void _handleSubmit() {
    if (_selectedReason == null) return;
    widget.onSubmit(_selectedReason!, _detailsController.text.trim());
    setState(() => _submitted = true);

    // Auto-close after a brief confirmation
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) Navigator.of(context).pop();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return _buildConfirmation();
    }
    return _buildForm(context);
  }

  // ── Confirmation view ──

  Widget _buildConfirmation() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.xl,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: const Icon(
              Icons.check_circle,
              color: AppColors.success,
              size: 36,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'Report submitted',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            // Hindi: Report prastaav bheja gaya
            '\u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092A\u094D\u0930\u0938\u094D\u0924\u093E\u0935 \u092D\u0947\u091C\u093E \u0917\u092F\u093E',
            style: TextStyle(
              color: AppColors.textTertiary,
              fontSize: 13,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'Our moderation team will review this post within 24 hours. '
            'Thank you for helping keep our community safe.',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.lg),
        ],
      ),
    );
  }

  // ── Main form view ──

  Widget _buildForm(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: AppSpacing.lg + bottomInset,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Handle bar ──
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
          const SizedBox(height: AppSpacing.md),

          // ── Title ──
          const Row(
            children: [
              Icon(Icons.flag_outlined, color: AppColors.error, size: 22),
              SizedBox(width: AppSpacing.xs),
              Text(
                'Report Post',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          const Text(
            // Hindi: Post ki report karein
            '\u092A\u094B\u0938\u094D\u091F \u0915\u0940 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0930\u0947\u0902',
            style: TextStyle(
              color: AppColors.textTertiary,
              fontSize: 13,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // ── Reason Label ──
          const Text(
            'Why are you reporting this?',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            // Hindi: Aap ise kyun report kar rahe hain?
            '\u0906\u092A \u0907\u0938\u0947 \u0915\u094D\u092F\u094B\u0902 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?',
            style: TextStyle(
              color: AppColors.textTertiary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // ── Reason Options ──
          ..._reasonData.entries.map((e) => _buildReasonTile(e.key, e.value)),

          const SizedBox(height: AppSpacing.md),

          // ── Additional details ──
          const Text(
            'Additional details (optional)',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          TextField(
            controller: _detailsController,
            maxLines: 3,
            maxLength: 300,
            decoration: InputDecoration(
              hintText: 'Describe what happened...',
              hintStyle: const TextStyle(
                color: AppColors.textTertiary,
                fontSize: 13,
              ),
              filled: true,
              fillColor: AppColors.background,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                borderSide: BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                borderSide: BorderSide(color: AppColors.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                borderSide: const BorderSide(color: AppColors.primary),
              ),
              contentPadding: const EdgeInsets.all(AppSpacing.sm),
            ),
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 13,
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // ── Submit button ──
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: ElevatedButton.icon(
              onPressed: _selectedReason != null ? _handleSubmit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
                disabledBackgroundColor: AppColors.border,
                disabledForegroundColor: AppColors.textTertiary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                ),
                elevation: 0,
              ),
              icon: const Icon(Icons.send, size: 18),
              label: const Text(
                'Submit Report',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.xs),

          // ── Disclaimer ──
          const Center(
            child: Text(
              'Reports are reviewed by our moderation team.',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 11,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReasonTile(ReportReason reason, _ReasonInfo info) {
    final selected = _selectedReason == reason;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => setState(() => _selectedReason = reason),
          borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.sm,
              vertical: 10,
            ),
            decoration: BoxDecoration(
              color: selected
                  ? AppColors.error.withValues(alpha: 0.08)
                  : AppColors.background,
              borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
              border: Border.all(
                color:
                    selected ? AppColors.error : AppColors.border,
                width: selected ? 1.5 : 1,
              ),
            ),
            child: Row(
              children: [
                Text(info.emoji, style: const TextStyle(fontSize: 18)),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        info.labelEn,
                        style: TextStyle(
                          color: selected
                              ? AppColors.error
                              : AppColors.textPrimary,
                          fontWeight:
                              selected ? FontWeight.w700 : FontWeight.w500,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        info.labelHi,
                        style: const TextStyle(
                          color: AppColors.textTertiary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  selected
                      ? Icons.radio_button_checked
                      : Icons.radio_button_off,
                  color: selected ? AppColors.error : AppColors.textTertiary,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Internal data class for reason display info.
class _ReasonInfo {
  final String emoji;
  final String labelEn;
  final String labelHi;

  const _ReasonInfo({
    required this.emoji,
    required this.labelEn,
    required this.labelHi,
  });
}
