import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/progress_dots.dart';
import '../../widgets/pallicare_button.dart';
import 'onboarding_provider.dart';

class QuickProfileScreen extends ConsumerStatefulWidget {
  const QuickProfileScreen({super.key});

  @override
  ConsumerState<QuickProfileScreen> createState() =>
      _QuickProfileScreenState();
}

class _QuickProfileScreenState extends ConsumerState<QuickProfileScreen> {
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _otpCtrls = List.generate(6, (_) => TextEditingController());
  final _otpFocuses = List.generate(6, (_) => FocusNode());

  Timer? _resendTimer;
  int _resendCountdown = 0;
  String? _nameError;
  String? _phoneError;
  String? _otpError;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    for (final c in _otpCtrls) {
      c.dispose();
    }
    for (final f in _otpFocuses) {
      f.dispose();
    }
    _resendTimer?.cancel();
    super.dispose();
  }

  bool _validatePhone(String phone) {
    if (phone.length != 10) return false;
    return RegExp(r'^[6-9]\d{9}$').hasMatch(phone);
  }

  void _sendOtp() {
    setState(() {
      _nameError =
          _nameCtrl.text.trim().isEmpty ? 'Please enter your name' : null;
      _phoneError = !_validatePhone(_phoneCtrl.text.trim())
          ? 'Enter a valid 10-digit number'
          : null;
    });

    if (_nameError != null || _phoneError != null) return;

    ref.read(onboardingProvider.notifier).setPatientName(_nameCtrl.text.trim());
    ref.read(onboardingProvider.notifier).setPatientPhone(_phoneCtrl.text.trim());
    ref.read(onboardingProvider.notifier).markOtpSent();

    // Start resend countdown
    setState(() => _resendCountdown = 30);
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendCountdown <= 1) {
        t.cancel();
        if (mounted) setState(() => _resendCountdown = 0);
      } else {
        if (mounted) setState(() => _resendCountdown--);
      }
    });

    // Focus first OTP box
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) _otpFocuses[0].requestFocus();
    });
  }

  void _verifyOtp() {
    final otp = _otpCtrls.map((c) => c.text).join();
    if (otp.length != 6 || !RegExp(r'^\d{6}$').hasMatch(otp)) {
      setState(() => _otpError = 'Please enter a valid 6-digit OTP');
      return;
    }

    // Mock verification — accept any 6-digit OTP
    setState(() => _otpError = null);
    ref.read(onboardingProvider.notifier).markOtpVerified();

    // Show success, then auto-advance
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        ref.read(onboardingProvider.notifier).nextStep();
        context.push('/onboarding/privacy');
      }
    });
  }

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
                currentStep: state.showWhatHelps ? 4 : 3,
                totalSteps: state.totalSteps,
              ),
              const SizedBox(height: 32),
              const Text(
                "Let's set up your account",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepTeal,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Just your name and phone number — that\'s it!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 32),

              // Name
              const Text('Your first name / आपका नाम',
                  style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextField(
                controller: _nameCtrl,
                textCapitalization: TextCapitalization.words,
                style: const TextStyle(fontSize: 20),
                decoration: InputDecoration(
                  hintText: 'e.g., Ramesh / रमेश',
                  hintStyle: TextStyle(color: Colors.grey.shade400),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 16),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  errorText: _nameError,
                  suffixIcon: const Icon(Icons.mic, color: AppColors.sageGreen),
                ),
              ),
              const SizedBox(height: 20),

              // Phone
              const Text('Phone number / फ़ोन नंबर',
                  style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                style: const TextStyle(fontSize: 20),
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(10),
                ],
                decoration: InputDecoration(
                  prefixText: '+91 ',
                  prefixStyle: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.w600),
                  hintText: '10-digit mobile number',
                  hintStyle: TextStyle(color: Colors.grey.shade400),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 16),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  errorText: _phoneError,
                ),
              ),
              const SizedBox(height: 24),

              if (!state.otpSent)
                PalliCareButton(
                    label: 'Send OTP / OTP भेजें', onPressed: _sendOtp),

              // OTP section
              if (state.otpSent && !state.otpVerified) ...[
                const SizedBox(height: 12),
                const Text('Enter 6-digit OTP',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(6, (i) {
                    return Container(
                      width: 48,
                      height: 56,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      child: TextField(
                        controller: _otpCtrls[i],
                        focusNode: _otpFocuses[i],
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        maxLength: 1,
                        style: const TextStyle(
                            fontSize: 24, fontWeight: FontWeight.w700),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly
                        ],
                        decoration: InputDecoration(
                          counterText: '',
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                BorderSide(color: Colors.grey.shade300),
                          ),
                        ),
                        onChanged: (val) {
                          if (val.isNotEmpty && i < 5) {
                            _otpFocuses[i + 1].requestFocus();
                          }
                          if (val.isEmpty && i > 0) {
                            _otpFocuses[i - 1].requestFocus();
                          }
                          // Auto-verify when all 6 filled
                          final full =
                              _otpCtrls.every((c) => c.text.isNotEmpty);
                          if (full) _verifyOtp();
                        },
                      ),
                    );
                  }),
                ),
                if (_otpError != null) ...[
                  const SizedBox(height: 8),
                  Text(_otpError!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: Colors.red, fontSize: 13)),
                ],
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_resendCountdown > 0)
                      Text('Resend in ${_resendCountdown}s',
                          style: TextStyle(
                              fontSize: 13, color: Colors.grey.shade500))
                    else
                      TextButton(
                        onPressed: _sendOtp,
                        child: const Text('Resend OTP'),
                      ),
                    const SizedBox(width: 16),
                    TextButton(
                      onPressed: () {},
                      child: Text('Call me instead',
                          style: TextStyle(color: Colors.grey.shade600)),
                    ),
                  ],
                ),
              ],

              // Verified state
              if (state.otpVerified) ...[
                const SizedBox(height: 32),
                const Icon(Icons.check_circle,
                    color: AppColors.sageGreen, size: 48),
                const SizedBox(height: 12),
                const Text('Verified!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.sageGreen)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
