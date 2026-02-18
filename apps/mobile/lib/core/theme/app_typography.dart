import 'package:flutter/material.dart';
import 'app_colors.dart';

/// PalliCare typography scale.
///
/// All values are derived from the PalliCare Design System v1.0.
/// See: Design_System.md Section 3 — Typography.
///
/// Headings use Georgia (serif). Body text uses the platform default
/// (Roboto on Android, SF Pro on iOS). Hindi text uses Noto Sans Devanagari.
class AppTypography {
  AppTypography._();

  // ---------------------------------------------------------------------------
  // FONT FAMILIES
  // ---------------------------------------------------------------------------

  static const String headingFontFamily = 'Georgia';
  static const String bodyFontFamily = 'Roboto'; // system default fallback
  static const String hindiFontFamily = 'Noto Sans Devanagari';
  static const String monoFontFamily = 'JetBrains Mono';

  // ---------------------------------------------------------------------------
  // MOBILE TYPE SCALE
  // ---------------------------------------------------------------------------

  /// Screen titles — 24sp, Bold 700, line height 32sp.
  static const TextStyle heading1 = TextStyle(
    fontFamily: headingFontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w700,
    height: 32 / 24, // lineHeight / fontSize
    color: AppColors.textPrimary,
  );

  /// Section headers — 20sp, Bold 700, line height 28sp.
  static const TextStyle heading2 = TextStyle(
    fontFamily: headingFontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w700,
    height: 28 / 20,
    color: AppColors.textPrimary,
  );

  /// Card titles — 17sp, Semi-bold 600, line height 24sp.
  static const TextStyle heading3 = TextStyle(
    fontFamily: headingFontFamily,
    fontSize: 17,
    fontWeight: FontWeight.w600,
    height: 24 / 17,
    color: AppColors.textPrimary,
  );

  /// Sub-section headers — 15sp, Semi-bold 600, line height 22sp.
  static const TextStyle heading4 = TextStyle(
    fontFamily: headingFontFamily,
    fontSize: 15,
    fontWeight: FontWeight.w600,
    height: 22 / 15,
    color: AppColors.textPrimary,
  );

  /// Primary body text, prompts — 16sp, Regular 400, line height 24sp.
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 24 / 16,
    color: AppColors.textPrimary,
  );

  /// Standard body text — 14sp, Regular 400, line height 20sp.
  static const TextStyle bodyDefault = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 20 / 14,
    color: AppColors.textPrimary,
  );

  /// Secondary info, captions — 12sp, Regular 400, line height 18sp.
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 18 / 12,
    color: AppColors.textSecondary,
  );

  /// Button text, form labels — 14sp, Medium 500, line height 20sp.
  static const TextStyle label = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 20 / 14,
    color: AppColors.textPrimary,
  );

  /// Tags, badges, chips — 12sp, Medium 500, line height 16sp.
  static const TextStyle labelSmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 16 / 12,
    color: AppColors.textSecondary,
  );

  /// Timestamps, metadata — 11sp, Regular 400, line height 16sp.
  static const TextStyle caption = TextStyle(
    fontSize: 11,
    fontWeight: FontWeight.w400,
    height: 16 / 11,
    color: AppColors.textTertiary,
  );

  /// Category labels, section tags — 10sp, Medium 500, line height 14sp.
  static const TextStyle overline = TextStyle(
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 14 / 10,
    letterSpacing: 0.5,
    color: AppColors.textTertiary,
  );

  // ---------------------------------------------------------------------------
  // SPECIAL-PURPOSE STYLES
  // ---------------------------------------------------------------------------

  /// Pain score display — large bold value.
  static const TextStyle painScore = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 40 / 32,
    color: AppColors.textPrimary,
  );

  /// Hindi body text — 1sp larger than English equivalent per design system.
  static const TextStyle hindiBody = TextStyle(
    fontFamily: hindiFontFamily,
    fontSize: 15, // bodyDefault (14) + 1sp
    fontWeight: FontWeight.w400,
    height: 22 / 15,
    color: AppColors.textPrimary,
  );

  /// Hindi heading — 1sp larger than English heading3 equivalent.
  static const TextStyle hindiHeading = TextStyle(
    fontFamily: hindiFontFamily,
    fontSize: 18, // heading3 (17) + 1sp
    fontWeight: FontWeight.w600,
    height: 26 / 18,
    color: AppColors.textPrimary,
  );

  // ---------------------------------------------------------------------------
  // FLUTTER TextTheme (for ThemeData integration)
  // ---------------------------------------------------------------------------

  /// Returns a [TextTheme] for use in [ThemeData].
  ///
  /// Pass [brightness] to automatically adjust text colors for dark mode.
  static TextTheme textTheme({Brightness brightness = Brightness.light}) {
    final Color defaultColor = brightness == Brightness.light
        ? AppColors.textPrimary
        : AppColors.darkTextPrimary;
    final Color secondaryColor = brightness == Brightness.light
        ? AppColors.textSecondary
        : AppColors.darkTextSecondary;

    return TextTheme(
      displayLarge: heading1.copyWith(color: defaultColor),
      displayMedium: heading2.copyWith(color: defaultColor),
      displaySmall: heading3.copyWith(color: defaultColor),
      headlineLarge: heading1.copyWith(color: defaultColor),
      headlineMedium: heading2.copyWith(color: defaultColor),
      headlineSmall: heading3.copyWith(color: defaultColor),
      titleLarge: heading3.copyWith(color: defaultColor),
      titleMedium: heading4.copyWith(color: defaultColor),
      titleSmall: label.copyWith(color: defaultColor),
      bodyLarge: bodyLarge.copyWith(color: defaultColor),
      bodyMedium: bodyDefault.copyWith(color: defaultColor),
      bodySmall: bodySmall.copyWith(color: secondaryColor),
      labelLarge: label.copyWith(color: defaultColor),
      labelMedium: labelSmall.copyWith(color: secondaryColor),
      labelSmall: caption.copyWith(color: secondaryColor),
    );
  }
}
