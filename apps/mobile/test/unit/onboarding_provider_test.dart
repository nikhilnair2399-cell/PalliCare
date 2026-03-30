import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/features/onboarding/onboarding_provider.dart';

void main() {
  group('OnboardingState', () {
    test('default state has language=en, null userType, currentStep=0', () {
      const state = OnboardingState();
      expect(state.language, 'en');
      expect(state.userType, isNull);
      expect(state.currentStep, 0);
      expect(state.emotionalState, isNull);
      expect(state.helpTopics, isEmpty);
      expect(state.privacyConsented, false);
      expect(state.isComplete, false);
      expect(state.otpSent, false);
      expect(state.otpVerified, false);
    });

    test('totalSteps is 5 when emotionalState is toughDay', () {
      const state = OnboardingState(emotionalState: EmotionalState.toughDay);
      expect(state.totalSteps, 5);
    });

    test('totalSteps is 6 when emotionalState is tired', () {
      const state = OnboardingState(emotionalState: EmotionalState.tired);
      expect(state.totalSteps, 6);
    });

    test('totalSteps is 7 when emotionalState is okay', () {
      const state = OnboardingState(emotionalState: EmotionalState.okay);
      expect(state.totalSteps, 7);
    });

    test('totalSteps is 7 when emotionalState is null', () {
      const state = OnboardingState();
      expect(state.totalSteps, 7);
    });

    test('showWhatHelps is true when emotionalState is okay', () {
      const state = OnboardingState(emotionalState: EmotionalState.okay);
      expect(state.showWhatHelps, true);
    });

    test('showWhatHelps is false when emotionalState is tired', () {
      const state = OnboardingState(emotionalState: EmotionalState.tired);
      expect(state.showWhatHelps, false);
    });

    test('showWhatHelps is false when emotionalState is toughDay', () {
      const state = OnboardingState(emotionalState: EmotionalState.toughDay);
      expect(state.showWhatHelps, false);
    });

    test('showWhatHelps is false when emotionalState is null', () {
      const state = OnboardingState();
      expect(state.showWhatHelps, false);
    });

    test('copyWith preserves unchanged fields', () {
      const state = OnboardingState(
        language: 'hi',
        patientFirstName: 'Ramesh',
        currentStep: 3,
      );
      final updated = state.copyWith(language: 'en');
      expect(updated.language, 'en');
      expect(updated.patientFirstName, 'Ramesh'); // preserved
      expect(updated.currentStep, 3); // preserved
    });
  });

  group('OnboardingNotifier', () {
    late OnboardingNotifier notifier;

    setUp(() {
      notifier = OnboardingNotifier();
    });

    test('setLanguage updates language', () {
      notifier.setLanguage('hi');
      expect(notifier.state.language, 'hi');
    });

    test('setUserType updates userType', () {
      notifier.setUserType(UserType.caregiver);
      expect(notifier.state.userType, UserType.caregiver);
    });

    test('setEmotionalState updates emotionalState', () {
      notifier.setEmotionalState(EmotionalState.tired);
      expect(notifier.state.emotionalState, EmotionalState.tired);
    });

    test('toggleHelpTopic adds topic to list', () {
      notifier.toggleHelpTopic('pain');
      expect(notifier.state.helpTopics, ['pain']);
    });

    test('toggleHelpTopic removes topic if already present (toggle behavior)',
        () {
      notifier.toggleHelpTopic('pain');
      notifier.toggleHelpTopic('sleep');
      expect(notifier.state.helpTopics, ['pain', 'sleep']);

      notifier.toggleHelpTopic('pain'); // remove
      expect(notifier.state.helpTopics, ['sleep']);
    });

    test('setPatientName updates patientFirstName', () {
      notifier.setPatientName('Ramesh');
      expect(notifier.state.patientFirstName, 'Ramesh');
    });

    test('setPatientPhone updates patientPhone', () {
      notifier.setPatientPhone('9876543210');
      expect(notifier.state.patientPhone, '9876543210');
    });

    test('setCaregiverInfo updates all caregiver fields', () {
      notifier.setCaregiverInfo(
        name: 'Priya',
        phone: '9876543211',
        relationship: 'daughter',
      );
      expect(notifier.state.caregiverFirstName, 'Priya');
      expect(notifier.state.caregiverPhone, '9876543211');
      expect(notifier.state.caregiverRelationship, 'daughter');
    });

    test('markOtpSent sets otpSent to true', () {
      expect(notifier.state.otpSent, false);
      notifier.markOtpSent();
      expect(notifier.state.otpSent, true);
    });

    test('markOtpVerified sets otpVerified to true', () {
      expect(notifier.state.otpVerified, false);
      notifier.markOtpVerified();
      expect(notifier.state.otpVerified, true);
    });

    test('setPrivacyConsented sets privacyConsented to true', () {
      expect(notifier.state.privacyConsented, false);
      notifier.setPrivacyConsented();
      expect(notifier.state.privacyConsented, true);
    });

    test('nextStep increments currentStep', () {
      expect(notifier.state.currentStep, 0);
      notifier.nextStep();
      expect(notifier.state.currentStep, 1);
      notifier.nextStep();
      expect(notifier.state.currentStep, 2);
    });

    test('prevStep decrements currentStep (does nothing at 0)', () {
      notifier.nextStep(); // 1
      notifier.nextStep(); // 2
      notifier.prevStep(); // 1
      expect(notifier.state.currentStep, 1);

      notifier.prevStep(); // 0
      notifier.prevStep(); // stays 0
      expect(notifier.state.currentStep, 0);
    });

    test('completeOnboarding sets isComplete to true', () {
      expect(notifier.state.isComplete, false);
      notifier.completeOnboarding();
      expect(notifier.state.isComplete, true);
    });
  });
}
