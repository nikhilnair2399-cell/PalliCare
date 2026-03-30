import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// APP MODE ENUM
// ---------------------------------------------------------------------------

/// App-wide interface mode: patient-facing or caregiver-facing.
enum AppMode { patient, caregiver }

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

class CaregiverModeState {
  final AppMode mode;
  final String caregiverName;
  final String patientName;

  const CaregiverModeState({
    this.mode = AppMode.patient,
    this.caregiverName = '',
    this.patientName = '',
  });

  bool get isCaregiverMode => mode == AppMode.caregiver;

  /// Accent color for current mode.
  Color get accentColor =>
      isCaregiverMode ? AppColors.accentWarm : AppColors.sage;

  /// Dark accent for current mode.
  Color get accentDarkColor =>
      isCaregiverMode ? AppColors.accentWarmDark : AppColors.teal;

  CaregiverModeState copyWith({
    AppMode? mode,
    String? caregiverName,
    String? patientName,
  }) {
    return CaregiverModeState(
      mode: mode ?? this.mode,
      caregiverName: caregiverName ?? this.caregiverName,
      patientName: patientName ?? this.patientName,
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIFIER
// ---------------------------------------------------------------------------

class CaregiverModeNotifier extends StateNotifier<CaregiverModeState> {
  CaregiverModeNotifier() : super(const CaregiverModeState()) {
    _loadSavedMode();
  }

  void _loadSavedMode() {
    // Mock: default to patient mode. In production, load from SharedPreferences.
    state = state.copyWith(
      mode: AppMode.patient,
      caregiverName: 'Priya',
      patientName: 'Rajesh',
    );
  }

  /// Toggle between patient and caregiver mode.
  void toggleMode() {
    state = state.copyWith(
      mode: state.isCaregiverMode ? AppMode.patient : AppMode.caregiver,
    );
  }

  /// Set mode explicitly.
  void setMode(AppMode mode) {
    state = state.copyWith(mode: mode);
  }

  void setCaregiverName(String name) {
    state = state.copyWith(caregiverName: name);
  }

  void setPatientName(String name) {
    state = state.copyWith(patientName: name);
  }
}

// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

final caregiverModeProvider =
    StateNotifierProvider<CaregiverModeNotifier, CaregiverModeState>(
  (ref) => CaregiverModeNotifier(),
);
