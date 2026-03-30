import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/progress_dots.dart';
import '../../widgets/pallicare_button.dart';
import '../../services/api_service.dart';
import 'onboarding_provider.dart';

/// DPDPA 2023 compliant granular consent screen.
///
/// Replaces the simple privacy_screen.dart with categorized consent toggles,
/// required vs optional consent separation, and Hindi/English descriptions.
class ConsentFlowScreen extends ConsumerStatefulWidget {
  const ConsentFlowScreen({super.key});

  @override
  ConsumerState<ConsentFlowScreen> createState() => _ConsentFlowScreenState();
}

class _ConsentFlowScreenState extends ConsumerState<ConsentFlowScreen> {
  bool _showDpdpaRights = false;
  bool _submitting = false;

  // ---- Consent definitions ----

  static const _requiredConsents = [
    _ConsentItem(
      type: 'data_collection',
      titleEn: 'Data Collection',
      titleHi: 'डेटा संग्रहण',
      descEn:
          'We collect your health data (symptoms, medications, care plans) to provide palliative care support.',
      descHi:
          'हम आपकी स्वास्थ्य जानकारी (लक्षण, दवाइयाँ, देखभाल योजना) एकत्र करते हैं ताकि उपशामक देखभाल सहायता प्रदान कर सकें।',
      required: true,
    ),
    _ConsentItem(
      type: 'clinician_data_access',
      titleEn: 'Clinician Data Access',
      titleHi: 'चिकित्सक डेटा पहुँच',
      descEn:
          'Your assigned clinicians can view your health data to provide appropriate care.',
      descHi:
          'आपके निर्धारित चिकित्सक आपकी स्वास्थ्य जानकारी देख सकते हैं ताकि उचित देखभाल प्रदान कर सकें।',
      required: true,
    ),
  ];

  static const _optionalConsents = [
    _ConsentItem(
      type: 'caregiver_data_access',
      titleEn: 'Caregiver Data Access',
      titleHi: 'देखभालकर्ता डेटा पहुँच',
      descEn:
          'Allow your designated caregiver to view your health data and receive updates.',
      descHi:
          'अपने नामित देखभालकर्ता को आपकी स्वास्थ्य जानकारी देखने और अपडेट प्राप्त करने की अनुमति दें।',
    ),
    _ConsentItem(
      type: 'anonymized_analytics',
      titleEn: 'Anonymized Analytics',
      titleHi: 'गुमनाम विश्लेषण',
      descEn:
          'Help improve PalliCare by sharing anonymized usage data. No personal information is shared.',
      descHi:
          'गुमनाम उपयोग डेटा साझा करके PalliCare को बेहतर बनाने में मदद करें। कोई व्यक्तिगत जानकारी साझा नहीं की जाती।',
    ),
    _ConsentItem(
      type: 'push_notifications',
      titleEn: 'Push Notifications',
      titleHi: 'पुश सूचनाएँ',
      descEn:
          'Receive medication reminders, appointment alerts, and care updates.',
      descHi:
          'दवा अनुस्मारक, अपॉइंटमेंट अलर्ट और देखभाल अपडेट प्राप्त करें।',
    ),
    _ConsentItem(
      type: 'voice_recording',
      titleEn: 'Voice Recording',
      titleHi: 'ध्वनि रिकॉर्डिंग',
      descEn:
          'Use voice input to log symptoms and communicate with your care team.',
      descHi:
          'लक्षण दर्ज करने और अपनी देखभाल टीम से संवाद करने के लिए ध्वनि इनपुट का उपयोग करें।',
    ),
    _ConsentItem(
      type: 'photo_upload',
      titleEn: 'Photo Upload',
      titleHi: 'फोटो अपलोड',
      descEn:
          'Upload photos of wounds, medications, or documents for clinical review.',
      descHi:
          'नैदानिक समीक्षा के लिए घावों, दवाइयों या दस्तावेजों की तस्वीरें अपलोड करें।',
    ),
    _ConsentItem(
      type: 'research_participation',
      titleEn: 'Research Participation',
      titleHi: 'अनुसंधान भागीदारी',
      descEn:
          'Allow anonymized data to be used for palliative care research studies.',
      descHi:
          'उपशामक देखभाल अनुसंधान अध्ययनों के लिए गुमनाम डेटा का उपयोग करने की अनुमति दें।',
    ),
  ];

  // ---- Local toggle state ----

  final Map<String, bool> _toggles = {};

  @override
  void initState() {
    super.initState();
    // Initialize all toggles to false
    for (final c in _requiredConsents) {
      _toggles[c.type] = false;
    }
    for (final c in _optionalConsents) {
      _toggles[c.type] = false;
    }
  }

  bool get _requiredConsentsGranted =>
      _requiredConsents.every((c) => _toggles[c.type] == true);

  // ---- Build ----

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final state = ref.watch(onboardingProvider);
    final isHindi = state.language == 'hi';

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

              // Shield icon
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.sageGreen.withAlpha(30),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.shield_rounded,
                    size: 32, color: AppColors.sageGreen),
              ),
              const SizedBox(height: 20),

              // Title
              Text(
                isHindi
                    ? 'आपकी सहमति, आपका नियंत्रण'
                    : 'Your Consent, Your Control',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                isHindi
                    ? 'आगे बढ़ने से पहले कृपया निम्नलिखित अनुमतियाँ समीक्षा करें।'
                    : 'Please review the following permissions before proceeding.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
              const SizedBox(height: 28),

              // ---- Required Consents ----
              _sectionHeader(
                isHindi ? 'आवश्यक सहमतियाँ' : 'Required Consents',
                isHindi
                    ? 'आगे बढ़ने के लिए इन्हें स्वीकार करना अनिवार्य है'
                    : 'These must be accepted to proceed',
              ),
              const SizedBox(height: 12),
              ..._requiredConsents.map(
                (c) => _consentToggleTile(c, isHindi: isHindi),
              ),

              const SizedBox(height: 24),

              // ---- Optional Consents ----
              _sectionHeader(
                isHindi ? 'वैकल्पिक सहमतियाँ' : 'Optional Consents',
                isHindi
                    ? 'आप इन्हें बाद में सेटिंग्स से बदल सकते हैं'
                    : 'You can change these later in Settings',
              ),
              const SizedBox(height: 12),
              ..._optionalConsents.map(
                (c) => _consentToggleTile(c, isHindi: isHindi),
              ),

              const SizedBox(height: 28),

              // ---- Confirm button ----
              PalliCareButton(
                label: isHindi
                    ? 'मैं समझता/समझती हूँ और सहमत हूँ'
                    : 'I Understand & Agree',
                onPressed: _requiredConsentsGranted && !_submitting
                    ? _onConfirm
                    : null,
              ),

              if (_submitting) ...[
                const SizedBox(height: 12),
                const Center(
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.deepTeal,
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // ---- DPDPA Rights collapsible ----
              Center(
                child: GestureDetector(
                  onTap: () =>
                      setState(() => _showDpdpaRights = !_showDpdpaRights),
                  child: Text(
                    _showDpdpaRights
                        ? (isHindi ? 'कम दिखाएँ' : 'Show Less')
                        : (isHindi
                            ? 'DPDPA 2023 के तहत आपके अधिकार'
                            : 'Your Rights Under DPDPA 2023'),
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.sageGreen,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),

              if (_showDpdpaRights) ...[
                const SizedBox(height: 20),
                _dpdpaRightsSection(isHindi),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // ---- Event handlers ----

  Future<void> _onConfirm() async {
    setState(() => _submitting = true);

    try {
      // Send each toggled consent to the API
      final grantedConsents = <String, bool>{};
      for (final entry in _toggles.entries) {
        if (entry.value) {
          await ApiService().grantConsent({
            'consent_type': entry.key,
            'version': '1.0',
            'method': 'onboarding_toggle',
          });
        }
        grantedConsents[entry.key] = entry.value;
      }

      // Update provider state
      ref.read(onboardingProvider.notifier).setConsents(grantedConsents);
      ref.read(onboardingProvider.notifier).nextStep();

      if (mounted) {
        context.push('/onboarding/welcome');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save consents. Please try again.\n$e'),
            backgroundColor: Colors.red.shade700,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  // ---- Widget builders ----

  Widget _sectionHeader(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontFamily: 'Georgia',
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: AppColors.deepTeal,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
        ),
      ],
    );
  }

  Widget _consentToggleTile(_ConsentItem item, {required bool isHindi}) {
    final isOn = _toggles[item.type] ?? false;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: item.required && !isOn
            ? Border.all(color: Colors.orange.shade200, width: 1)
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        isHindi ? item.titleHi : item.titleEn,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.deepTeal,
                        ),
                      ),
                    ),
                    if (item.required)
                      Container(
                        margin: const EdgeInsets.only(left: 8),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          isHindi ? 'आवश्यक' : 'Required',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Colors.orange.shade800,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  isHindi ? item.descHi : item.descEn,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Switch.adaptive(
            value: isOn,
            activeColor: AppColors.sageGreen,
            onChanged: (val) {
              setState(() => _toggles[item.type] = val);
            },
          ),
        ],
      ),
    );
  }

  Widget _dpdpaRightsSection(bool isHindi) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isHindi
                ? 'DPDPA 2023 के तहत आपके अधिकार'
                : 'Your Rights Under DPDPA 2023',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.deepTeal,
            ),
          ),
          const SizedBox(height: 12),
          _rightItem(
            isHindi ? 'पहुँच का अधिकार' : 'Right to access',
            isHindi
                ? 'अपने सभी व्यक्तिगत डेटा की एक प्रति का अनुरोध करें'
                : 'Request a copy of all your personal data',
          ),
          _rightItem(
            isHindi ? 'सुधार का अधिकार' : 'Right to correction',
            isHindi
                ? 'गलत जानकारी को ठीक करने का अनुरोध करें'
                : 'Request we fix inaccurate information',
          ),
          _rightItem(
            isHindi ? 'हटाने का अधिकार' : 'Right to erasure',
            isHindi
                ? 'डेटा हटाने का अनुरोध ("भूलने का अधिकार")'
                : 'Request deletion ("right to be forgotten")',
          ),
          _rightItem(
            isHindi ? 'प्रसंस्करण सीमित करने का अधिकार' : 'Right to restrict processing',
            isHindi
                ? 'हमसे अपने डेटा के उपयोग को सीमित करने के लिए कहें'
                : 'Ask us to limit how we use your data',
          ),
          _rightItem(
            isHindi ? 'पोर्टेबिलिटी का अधिकार' : 'Right to portability',
            isHindi
                ? 'अपना डेटा पोर्टेबल प्रारूप में प्राप्त करें'
                : 'Get your data in portable format',
          ),
          _rightItem(
            isHindi ? 'शिकायत दर्ज करने का अधिकार' : 'Right to lodge complaint',
            isHindi
                ? 'डेटा संरक्षण प्राधिकरण में शिकायत दर्ज करें'
                : 'File with the Data Protection Authority',
          ),
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
                Text(
                  isHindi ? 'डेटा संरक्षण अधिकारी' : 'Data Protection Officer',
                  style: const TextStyle(
                      fontWeight: FontWeight.w700, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text('Email: dpo@pallicare.in',
                    style: TextStyle(
                        fontSize: 13, color: Colors.grey.shade700)),
                Text('AIIMS Bhopal',
                    style: TextStyle(
                        fontSize: 13, color: Colors.grey.shade700)),
              ],
            ),
          ),
        ],
      ),
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

/// Internal model for consent item definitions.
class _ConsentItem {
  final String type;
  final String titleEn;
  final String titleHi;
  final String descEn;
  final String descHi;
  final bool required;

  const _ConsentItem({
    required this.type,
    required this.titleEn,
    required this.titleHi,
    required this.descEn,
    required this.descHi,
    this.required = false,
  });
}
