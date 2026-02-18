/// PalliCare spacing constants on an 8dp grid.
///
/// All values are derived from the PalliCare Design System v1.0.
/// See: Design_System.md Section 4 — Spacing & Layout.
class AppSpacing {
  AppSpacing._();

  // ---------------------------------------------------------------------------
  // SPACING SCALE (8dp grid)
  // ---------------------------------------------------------------------------

  /// 0dp — no spacing.
  static const double space0 = 0;

  /// 4dp — tight spacing (icon-to-text).
  static const double space1 = 4;

  /// 8dp — default internal padding.
  static const double space2 = 8;

  /// 12dp — between related elements.
  static const double space3 = 12;

  /// 16dp — card internal padding.
  static const double space4 = 16;

  /// 20dp — between cards.
  static const double space5 = 20;

  /// 24dp — section spacing.
  static const double space6 = 24;

  /// 32dp — major section gaps.
  static const double space7 = 32;

  /// 40dp — page-level spacing.
  static const double space8 = 40;

  /// 48dp — large gaps (top padding).
  static const double space9 = 48;

  // ---------------------------------------------------------------------------
  // LEGACY ALIASES (used across screen files)
  // ---------------------------------------------------------------------------

  /// Alias for space2 (8dp).
  static const double sm = space2;

  /// Alias for space4 (16dp).
  static const double md = space4;

  /// Alias for space6 (24dp).
  static const double lg = space6;

  /// Alias for space7 (32dp).
  static const double xl = space7;

  // ---------------------------------------------------------------------------
  // LAYOUT CONSTANTS
  // ---------------------------------------------------------------------------

  /// Horizontal padding on both sides of screen content.
  static const double screenPaddingHorizontal = 16;

  /// Vertical gap between cards.
  static const double cardGap = 16;

  /// Internal card padding.
  static const double cardPadding = 16;

  /// App header height.
  static const double headerHeight = 56;

  /// Bottom navigation bar height (excluding safe area).
  static const double bottomNavHeight = 56;

  /// Minimum design target screen width.
  static const double minScreenWidth = 360;

  /// Maximum design target screen width.
  static const double maxScreenWidth = 428;

  // ---------------------------------------------------------------------------
  // BORDER RADIUS
  // ---------------------------------------------------------------------------

  /// Standard card border radius.
  static const double radiusCard = 16;

  /// Hero card border radius.
  static const double radiusHero = 20;

  /// Button border radius.
  static const double radiusButton = 12;

  /// Input field border radius.
  static const double radiusInput = 12;

  /// NRS pain button border radius.
  static const double radiusPainButton = 8;

  /// Chip / pill border radius.
  static const double radiusChip = 16;

  /// Status badge border radius.
  static const double radiusBadge = 10;

  // ---------------------------------------------------------------------------
  // TOUCH TARGET SIZES
  // ---------------------------------------------------------------------------

  /// Minimum touch target size (WCAG 2.5.5 exceeds 44px).
  static const double minTouchTarget = 48;

  /// Primary button height.
  static const double buttonHeight = 48;

  /// Text button height.
  static const double textButtonHeight = 40;

  /// Input field height.
  static const double inputHeight = 48;

  /// NRS pain button dimensions.
  static const double painButtonWidth = 56;
  static const double painButtonHeight = 40;

  /// Emotion button size.
  static const double emotionButtonSize = 56;

  /// Icon sizes.
  static const double iconDefault = 24;
  static const double iconSmall = 20;
  static const double iconLarge = 32;

  // ---------------------------------------------------------------------------
  // BREATHING CIRCLE
  // ---------------------------------------------------------------------------

  /// Minimum breathing circle diameter.
  static const double breatheCircleMin = 80;

  /// Maximum breathing circle diameter.
  static const double breatheCircleMax = 180;
}
