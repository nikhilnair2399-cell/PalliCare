import 'package:flutter/material.dart';

/// PalliCare brand color system.
///
/// All values are derived from the PalliCare Design System v1.0.
/// See: Design_System.md Section 2 — Color System.
class AppColors {
  AppColors._();

  // ---------------------------------------------------------------------------
  // PRIMARY PALETTE
  // ---------------------------------------------------------------------------

  /// Sage Green — primary actions, positive states, brand identity.
  static const Color primary = Color(0xFF7BA68C);

  /// Deep Teal — headers, emphasis, primary text on light backgrounds.
  static const Color primaryDark = Color(0xFF2A6B6B);

  /// Sage Light — hover states, secondary elements.
  static const Color primaryLight = Color(0xFFA8CBB5);

  /// Warm Cream — app background (light mode).
  static const Color surface = Color(0xFFFFF8F0);

  /// Warm Off-White — card backgrounds (not clinical pure white).
  static const Color surfaceCard = Color(0xFFFFFDF8);

  /// Soft Linen — alternate section backgrounds.
  static const Color surfaceSecondary = Color(0xFFF5EDE3);

  // ---------------------------------------------------------------------------
  // SECONDARY / ACCENT PALETTE
  // ---------------------------------------------------------------------------

  /// Soft Terracotta — warm accents, gentle warnings.
  static const Color accentWarm = Color(0xFFD4856B);

  /// Terracotta Dark — caregiver mode headers, emphasis.
  static const Color accentWarmDark = Color(0xFFB0644E);

  /// Lavender Mist — calming elements, breathe module.
  static const Color accentCalm = Color(0xFFD9D4E7);

  /// Golden Amber — milestones, achievements, highlights.
  static const Color accentHighlight = Color(0xFFE8A838);

  /// Soft Coral — important alerts (used sparingly).
  static const Color accentAlert = Color(0xFFE87461);

  /// Dusty Rose — secondary warm actions, gentle emphasis.
  static const Color accentDustyRose = Color(0xFFC9A9A6);

  // ---------------------------------------------------------------------------
  // SEMANTIC / TEXT COLORS
  // ---------------------------------------------------------------------------

  /// Warm Charcoal — primary body text.
  static const Color textPrimary = Color(0xFF332E2B);

  /// Muted Brown — secondary text, labels.
  static const Color textSecondary = Color(0xFF6B5E57);

  /// Warm Grey — hints, placeholders, timestamps.
  static const Color textTertiary = Color(0xFF948883);

  /// White — text on dark backgrounds.
  static const Color textInverse = Color(0xFFFFFFFF);

  // ---------------------------------------------------------------------------
  // SEMANTIC STATUS COLORS
  // ---------------------------------------------------------------------------

  /// Success — completed, positive outcomes (same as primary Sage Green).
  static const Color success = Color(0xFF7BA68C);

  /// Warning — caution states (never use red for routine warnings).
  static const Color warning = Color(0xFFE8A838);

  /// Error — errors and critical alerts (used very sparingly).
  static const Color error = Color(0xFFE87461);

  /// Info — informational notes.
  static const Color info = Color(0xFF6BA3BE);

  // ---------------------------------------------------------------------------
  // BORDER & DIVIDER
  // ---------------------------------------------------------------------------

  /// Warm Sand — card borders, dividers.
  static const Color border = Color(0xFFE5DDD5);

  /// Warm Linen — section dividers.
  static const Color divider = Color(0xFFF0EBE4);

  /// Warm shadow color for cards and elevation.
  static const Color shadow = Color(0x143E2D23); // rgba(62, 45, 35, 0.08)

  // ---------------------------------------------------------------------------
  // PAIN INTENSITY COLOR SCALE (NRS 0-10)
  // ---------------------------------------------------------------------------

  /// No Pain Green — pain score 0.
  static const Color pain0 = Color(0xFF7BA68C);

  /// Mild Green — pain scores 1-2.
  static const Color pain1 = Color(0xFF8FB89C);

  /// Mild Green — pain scores 1-2.
  static const Color pain2 = Color(0xFF8FB89C);

  /// Light Yellow-Green — pain score 3.
  static const Color pain3 = Color(0xFFB5C98C);

  /// Warm Yellow — pain scores 4-5.
  static const Color pain4 = Color(0xFFE8C83E);

  /// Warm Yellow — pain scores 4-5.
  static const Color pain5 = Color(0xFFE8C83E);

  /// Amber — pain score 6.
  static const Color pain6 = Color(0xFFE8A838);

  /// Orange — pain score 7.
  static const Color pain7 = Color(0xFFE88B38);

  /// Deep Orange — pain score 8.
  static const Color pain8 = Color(0xFFE87438);

  /// Coral Red — pain score 9.
  static const Color pain9 = Color(0xFFE85E38);

  /// Deep Red — pain score 10 (worst possible).
  static const Color pain10 = Color(0xFFD43B2A);

  /// Indexed access to pain scale colors (0-10).
  static const List<Color> painScale = [
    pain0,
    pain1,
    pain2,
    pain3,
    pain4,
    pain5,
    pain6,
    pain7,
    pain8,
    pain9,
    pain10,
  ];

  /// Returns `true` when pain-button text should be white (scores >= 6).
  static bool useLightTextForPain(int score) => score >= 6;

  // ---------------------------------------------------------------------------
  // LEGACY ALIASES (used across onboarding + widget files)
  // ---------------------------------------------------------------------------

  /// Alias for surface (used as background).
  static const Color background = surface;

  /// Light error tint — error badge backgrounds.
  static const Color errorLight = Color(0xFFFDE8E5);

  /// Alias for surface (Warm Cream background).
  static const Color warmCream = surface;

  /// Alias for primary (Sage Green).
  static const Color sageGreen = primary;

  /// Alias for primaryDark (Deep Teal).
  static const Color deepTeal = primaryDark;

  /// Alias for primary (Sage).
  static const Color sage = primary;

  /// Alias for primaryDark (Teal).
  static const Color teal = primaryDark;

  /// Alias for surface (Cream).
  static const Color cream = surface;

  /// Alias for primaryLight (Sage Light).
  static const Color sageLightColor = primaryLight;

  /// Alias for textSecondary (Charcoal Light).
  static const Color charcoalLight = textSecondary;

  /// Alias for accentCalm (Lavender).
  static const Color lavender = accentCalm;

  /// Lavender light variant.
  static const Color lavenderLight = Color(0xFFEDE9F5);

  /// Alias for textPrimary (Charcoal).
  static const Color charcoal = textPrimary;

  /// Teal dark variant.
  static const Color tealDark = Color(0xFF1E5555);

  /// Alias for accentDustyRose.
  static const Color dustyRose = accentDustyRose;

  // ---------------------------------------------------------------------------
  // DARK MODE VARIANTS
  // ---------------------------------------------------------------------------

  /// Dark surface — warm charcoal background (dark mode).
  static const Color darkSurface = Color(0xFF1C1A18);

  /// Dark surface card — warm dark card backgrounds (dark mode).
  static const Color darkSurfaceCard = Color(0xFF282522);

  /// Dark surface secondary — warm alternate dark section.
  static const Color darkSurfaceSecondary = Color(0xFF302D2A);

  /// Dark text primary — warm off-white.
  static const Color darkTextPrimary = Color(0xFFE8E2DA);

  /// Dark text secondary — warm muted.
  static const Color darkTextSecondary = Color(0xFFB0A89F);

  /// Dark primary — slightly warmer sage for warm dark backgrounds.
  static const Color darkPrimary = Color(0xFF9DB89A);

  /// Dark primary dark — deep teal adjusted for dark mode.
  static const Color darkPrimaryDark = Color(0xFF3A8B8B);

  /// Dark border — warm dark border.
  static const Color darkBorder = Color(0xFF3A3530);

  // ---------------------------------------------------------------------------
  // BREATHE MODULE SPECIFIC
  // ---------------------------------------------------------------------------

  /// Breathing circle background.
  static const Color breatheBackground = Color(0xFF1A3A3A);

  // ---------------------------------------------------------------------------
  // MATERIAL COLOR SWATCH (for ThemeData)
  // ---------------------------------------------------------------------------

  /// MaterialColor swatch built from Sage Green primary.
  static const MaterialColor primarySwatch = MaterialColor(
    0xFF7BA68C,
    <int, Color>{
      50: Color(0xFFEFF5F1),
      100: Color(0xFFD7E6DD),
      200: Color(0xFFBDD6C6),
      300: Color(0xFFA3C5AF),
      400: Color(0xFF8FB89C),
      500: Color(0xFF7BA68C),
      600: Color(0xFF6E9A7F),
      700: Color(0xFF5E8B6E),
      800: Color(0xFF507C5F),
      900: Color(0xFF3A6044),
    },
  );
}
