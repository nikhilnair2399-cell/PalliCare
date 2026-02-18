import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/progress_dots.dart';
import '../../widgets/pallicare_button.dart';
import 'onboarding_provider.dart';

class PrivacyScreen extends ConsumerStatefulWidget {
  const PrivacyScreen({super.key});

  @override
  ConsumerState<PrivacyScreen> createState() => _PrivacyScreenState();
}

class _PrivacyScreenState extends ConsumerState<PrivacyScreen> {
  bool _showDetails = false;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(onboardingProvider);

    return Scaffold(
      backgroundColor: AppColors.warmCream,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              ProgressDots(
                currentStep: state.totalSteps - 2,
                totalSteps: state.totalSteps,
              ),
              const SizedBox(height: 40),
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.sageGreen.withAlpha(30),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lock_rounded,
                    size: 32, color: AppColors.sageGreen),
              ),
              const SizedBox(height: 20),
              const Text(
                'Your information is safe with us',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'आपकी जानकारी सुरक्षित है',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 16, color: AppColors.deepTeal.withAlpha(180)),
              ),
              const SizedBox(height: 32),

              // Promise cards
              _promiseCard('🔒', 'Your data is encrypted',
                  'आपका डेटा एन्क्रिप्टेड है'),
              _promiseCard('🚫', 'We never sell your data',
                  'हम आपका डेटा कभी नहीं बेचते'),
              _promiseCard('👁️', 'Only people you choose can see it',
                  'सिर्फ़ वही लोग देखेंगे जिन्हें आप अनुमति दें'),
              _promiseCard('🗑️', 'You can delete your data anytime',
                  'आप कभी भी अपना डेटा हटा सकते हैं'),

              const SizedBox(height: 24),
              PalliCareButton(
                label: 'I understand / समझ गया',
                onPressed: () {
                  ref.read(onboardingProvider.notifier).setPrivacyConsented();
                  ref.read(onboardingProvider.notifier).nextStep();
                  context.push('/onboarding/welcome');
                },
              ),
              const SizedBox(height: 12),
              Center(
                child: GestureDetector(
                  onTap: () => setState(() => _showDetails = !_showDetails),
                  child: Text(
                    _showDetails ? 'Show less' : 'Tell me more / और जानें',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.sageGreen,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),

              if (_showDetails) ...[
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusCard),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _detailSection('Your rights under DPDPA 2023',
                          'डेटा सुरक्षा के संबंध में आपके अधिकार'),
                      const SizedBox(height: 12),
                      _rightItem('Right to access',
                          'Request a copy of all your personal data'),
                      _rightItem('Right to correction',
                          'Request we fix inaccurate information'),
                      _rightItem('Right to erasure',
                          'Request deletion ("right to be forgotten")'),
                      _rightItem('Right to restrict processing',
                          'Ask us to limit how we use your data'),
                      _rightItem('Right to portability',
                          'Get your data in portable format'),
                      _rightItem('Right to lodge complaint',
                          'File with the Data Protection Authority'),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Data Protection Officer',
                                style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14)),
                            const SizedBox(height: 4),
                            Text('Email: dpo@pallicare.in',
                                style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey.shade700)),
                            Text('AIIMS Bhopal',
                                style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey.shade700)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _promiseCard(String emoji, String en, String hi) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(en,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w600)),
                Text(hi,
                    style: TextStyle(
                        fontSize: 13, color: Colors.grey.shade600)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailSection(String en, String hi) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(en,
            style: const TextStyle(
                fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.deepTeal)),
        Text(hi,
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
      ],
    );
  }

  Widget _rightItem(String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('✓ ',
              style: TextStyle(
                  color: AppColors.sageGreen, fontWeight: FontWeight.w700)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 14)),
                Text(desc,
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade600)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
