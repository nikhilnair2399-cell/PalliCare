import 'package:flutter_riverpod/flutter_riverpod.dart';

enum UserType { patient, caregiver, together }

enum EmotionalState { okay, tired, toughDay }

class OnboardingState {
  final String language;
  final UserType? userType;
  final EmotionalState? emotionalState;
  final List<String> helpTopics;
  final String patientFirstName;
  final String patientPhone;
  final String caregiverFirstName;
  final String caregiverPhone;
  final String caregiverRelationship;
  final bool privacyConsented;
  final bool isComplete;
  final int currentStep;
  final bool otpSent;
  final bool otpVerified;

  const OnboardingState({
    this.language = 'en',
    this.userType,
    this.emotionalState,
    this.helpTopics = const [],
    this.patientFirstName = '',
    this.patientPhone = '',
    this.caregiverFirstName = '',
    this.caregiverPhone = '',
    this.caregiverRelationship = '',
    this.privacyConsented = false,
    this.isComplete = false,
    this.currentStep = 0,
    this.otpSent = false,
    this.otpVerified = false,
  });

  OnboardingState copyWith({
    String? language,
    UserType? userType,
    EmotionalState? emotionalState,
    List<String>? helpTopics,
    String? patientFirstName,
    String? patientPhone,
    String? caregiverFirstName,
    String? caregiverPhone,
    String? caregiverRelationship,
    bool? privacyConsented,
    bool? isComplete,
    int? currentStep,
    bool? otpSent,
    bool? otpVerified,
  }) {
    return OnboardingState(
      language: language ?? this.language,
      userType: userType ?? this.userType,
      emotionalState: emotionalState ?? this.emotionalState,
      helpTopics: helpTopics ?? this.helpTopics,
      patientFirstName: patientFirstName ?? this.patientFirstName,
      patientPhone: patientPhone ?? this.patientPhone,
      caregiverFirstName: caregiverFirstName ?? this.caregiverFirstName,
      caregiverPhone: caregiverPhone ?? this.caregiverPhone,
      caregiverRelationship:
          caregiverRelationship ?? this.caregiverRelationship,
      privacyConsented: privacyConsented ?? this.privacyConsented,
      isComplete: isComplete ?? this.isComplete,
      currentStep: currentStep ?? this.currentStep,
      otpSent: otpSent ?? this.otpSent,
      otpVerified: otpVerified ?? this.otpVerified,
    );
  }

  /// Total steps based on emotional state (adaptive flow).
  int get totalSteps {
    switch (emotionalState) {
      case EmotionalState.okay:
        return 7; // Full flow including "What helps?"
      case EmotionalState.tired:
        return 6; // Skips "What helps?"
      case EmotionalState.toughDay:
        return 5; // Express flow
      case null:
        return 7;
    }
  }

  bool get showWhatHelps => emotionalState == EmotionalState.okay;
}

class OnboardingNotifier extends StateNotifier<OnboardingState> {
  OnboardingNotifier() : super(const OnboardingState());

  void setLanguage(String lang) =>
      state = state.copyWith(language: lang);

  void setUserType(UserType type) =>
      state = state.copyWith(userType: type);

  void setEmotionalState(EmotionalState es) =>
      state = state.copyWith(emotionalState: es);

  void toggleHelpTopic(String topic) {
    final current = List<String>.from(state.helpTopics);
    current.contains(topic) ? current.remove(topic) : current.add(topic);
    state = state.copyWith(helpTopics: current);
  }

  void setPatientName(String name) =>
      state = state.copyWith(patientFirstName: name);

  void setPatientPhone(String phone) =>
      state = state.copyWith(patientPhone: phone);

  void setCaregiverInfo({
    String? name,
    String? phone,
    String? relationship,
  }) {
    state = state.copyWith(
      caregiverFirstName: name ?? state.caregiverFirstName,
      caregiverPhone: phone ?? state.caregiverPhone,
      caregiverRelationship: relationship ?? state.caregiverRelationship,
    );
  }

  void markOtpSent() => state = state.copyWith(otpSent: true);
  void markOtpVerified() => state = state.copyWith(otpVerified: true);

  void setPrivacyConsented() =>
      state = state.copyWith(privacyConsented: true);

  void nextStep() =>
      state = state.copyWith(currentStep: state.currentStep + 1);

  void prevStep() {
    if (state.currentStep > 0) {
      state = state.copyWith(currentStep: state.currentStep - 1);
    }
  }

  void completeOnboarding() =>
      state = state.copyWith(isComplete: true);
}

final onboardingProvider =
    StateNotifierProvider<OnboardingNotifier, OnboardingState>(
  (ref) => OnboardingNotifier(),
);
