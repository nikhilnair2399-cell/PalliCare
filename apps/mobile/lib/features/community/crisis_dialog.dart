import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';

/// Shows the crisis support dialog when crisis keywords are detected.
/// Displays helpline numbers and reassurance in both EN and HI.
void showCrisisDialog(BuildContext context, WidgetRef ref) {
  final notifier = ref.read(communityProvider.notifier);

  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (ctx) => const _CrisisDialog(),
  ).then((_) {
    notifier.dismissCrisisDialog();
  });
}

class _CrisisDialog extends StatelessWidget {
  const _CrisisDialog();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
      ),
      insetPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.xl,
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Heart Icon ──
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.favorite,
                  color: AppColors.error,
                  size: 32,
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // ── Title ──
              const Text(
                'We Care About You',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w800,
                  fontSize: 20,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              const Text(
                // Hindi: Hum aapki chinta karte hain
                '\u0939\u092E \u0906\u092A\u0915\u0940 \u091A\u093F\u0902\u0924\u093E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 15,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.lg),

              // ── Message ──
              Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                ),
                child: const Column(
                  children: [
                    Text(
                      'It sounds like you may be going through a very difficult time. '
                      'You are not alone, and help is available right now.',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14,
                        height: 1.6,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: AppSpacing.sm),
                    Text(
                      // Hindi: Aisa lagta hai aap bahut kathin samay se guzar rahe hain.
                      // Aap akele nahi hain, madad abhi upalabdh hai.
                      '\u0910\u0938\u093E \u0932\u0917\u0924\u093E \u0939\u0948 \u0906\u092A \u092C\u0939\u0941\u0924 \u0915\u0920\u093F\u0928 \u0938\u092E\u092F \u0938\u0947 '
                      '\u0917\u0941\u091C\u093C\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 '
                      '\u0906\u092A \u0905\u0915\u0947\u0932\u0947 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902, '
                      '\u092E\u0926\u0926 \u0905\u092D\u0940 \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u0948\u0964',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                        height: 1.5,
                        fontStyle: FontStyle.italic,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // ── Helpline Cards ──
              const Text(
                'Reach out now',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 2),
              const Text(
                // Hindi: Abhi sampark karein
                '\u0905\u092D\u0940 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902',
                style: TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              _HelplineCard(
                emoji: '\ud83d\udcde',
                nameEn: 'iCall Helpline',
                nameHi: 'iCall \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928',
                numberDisplay: '9152 987 821',
                availability: 'Mon-Sat 8AM-10PM',
                onTap: () {
                  // TODO: url_launcher → tel:9152987821
                },
              ),

              const SizedBox(height: AppSpacing.sm),

              _HelplineCard(
                emoji: '\ud83c\udfe5',
                nameEn: 'Vandrevala Foundation',
                nameHi: 'Vandrevala \u092B\u093E\u0909\u0902\u0921\u0947\u0936\u0928',
                numberDisplay: '1860 2662 345',
                availability: '24/7 Toll-free',
                onTap: () {
                  // TODO: url_launcher → tel:18602662345
                },
              ),

              const SizedBox(height: AppSpacing.sm),

              _HelplineCard(
                emoji: '\ud83d\udcf1',
                nameEn: 'KIRAN Mental Health',
                nameHi: 'KIRAN \u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F',
                numberDisplay: '1800 599 0019',
                availability: '24/7 Toll-free',
                onTap: () {
                  // TODO: url_launcher → tel:18005990019
                },
              ),

              const SizedBox(height: AppSpacing.lg),

              // ── Reassurance ──
              Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                ),
                child: const Row(
                  children: [
                    Text('\ud83d\udc9a', style: TextStyle(fontSize: 20)),
                    SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Text(
                        'Your message will still be posted. A trained professional '
                        'from our team may also reach out to check on you.',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // ── Dismiss Button ──
              SizedBox(
                width: double.infinity,
                height: AppSpacing.buttonHeight,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'I understand, continue',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              const Text(
                // Hindi: Main samajhta/samajhti hoon, aage badhein
                '\u092E\u0948\u0902 \u0938\u092E\u091D\u0924\u093E/\u0938\u092E\u091D\u0924\u0940 \u0939\u0942\u0901, \u0906\u0917\u0947 \u092C\u0922\u093C\u0947\u0902',
                style: TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HelplineCard extends StatelessWidget {
  final String emoji;
  final String nameEn;
  final String nameHi;
  final String numberDisplay;
  final String availability;
  final VoidCallback onTap;

  const _HelplineCard({
    required this.emoji,
    required this.nameEn,
    required this.nameHi,
    required this.numberDisplay,
    required this.availability,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      nameEn,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      nameHi,
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    numberDisplay,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    availability,
                    style: const TextStyle(
                      color: AppColors.textTertiary,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
              const SizedBox(width: AppSpacing.xs),
              const Icon(
                Icons.call,
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
