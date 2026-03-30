/// Hindi date, time, and numeral formatting utilities for PalliCare.
///
/// Provides Devanagari numeral conversion, Hindi month/day names,
/// and locale-aware date/time formatting for `hi_IN`.

class HindiFormatters {
  HindiFormatters._();

  // ---------------------------------------------------------------------------
  // Devanagari numerals
  // ---------------------------------------------------------------------------

  static const _devanagariDigits = [
    '\u0966', // ०
    '\u0967', // १
    '\u0968', // २
    '\u0969', // ३
    '\u096A', // ४
    '\u096B', // ५
    '\u096C', // ६
    '\u096D', // ७
    '\u096E', // ८
    '\u096F', // ९
  ];

  /// Convert ASCII digits to Devanagari numerals.
  /// "123" → "१२३", leaves non-digit characters intact.
  static String toDevanagariNumerals(String input) {
    final buffer = StringBuffer();
    for (final ch in input.codeUnits) {
      if (ch >= 0x30 && ch <= 0x39) {
        buffer.write(_devanagariDigits[ch - 0x30]);
      } else {
        buffer.writeCharCode(ch);
      }
    }
    return buffer.toString();
  }

  // ---------------------------------------------------------------------------
  // Hindi month names
  // ---------------------------------------------------------------------------

  static const _monthsHi = [
    '\u091C\u0928\u0935\u0930\u0940', // जनवरी
    '\u092B\u093C\u0930\u0935\u0930\u0940', // फ़रवरी
    '\u092E\u093E\u0930\u094D\u091A', // मार्च
    '\u0905\u092A\u094D\u0930\u0948\u0932', // अप्रैल
    '\u092E\u0908', // मई
    '\u091C\u0942\u0928', // जून
    '\u091C\u0941\u0932\u093E\u0908', // जुलाई
    '\u0905\u0917\u0938\u094D\u0924', // अगस्त
    '\u0938\u093F\u0924\u0902\u092C\u0930', // सितंबर
    '\u0905\u0915\u094D\u091F\u0942\u092C\u0930', // अक्टूबर
    '\u0928\u0935\u0902\u092C\u0930', // नवंबर
    '\u0926\u093F\u0938\u0902\u092C\u0930', // दिसंबर
  ];

  // ---------------------------------------------------------------------------
  // Hindi day names
  // ---------------------------------------------------------------------------

  static const _daysHi = [
    '\u0938\u094B\u092E\u0935\u093E\u0930', // सोमवार
    '\u092E\u0902\u0917\u0932\u0935\u093E\u0930', // मंगलवार
    '\u092C\u0941\u0927\u0935\u093E\u0930', // बुधवार
    '\u0917\u0941\u0930\u0941\u0935\u093E\u0930', // गुरुवार
    '\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930', // शुक्रवार
    '\u0936\u0928\u093F\u0935\u093E\u0930', // शनिवार
    '\u0930\u0935\u093F\u0935\u093E\u0930', // रविवार
  ];

  static const _daysShortHi = [
    '\u0938\u094B\u092E', // सोम
    '\u092E\u0902\u0917\u0932', // मंगल
    '\u092C\u0941\u0927', // बुध
    '\u0917\u0941\u0930\u0941', // गुरु
    '\u0936\u0941\u0915\u094D\u0930', // शुक्र
    '\u0936\u0928\u093F', // शनि
    '\u0930\u0935\u093F', // रवि
  ];

  // ---------------------------------------------------------------------------
  // Date formatting
  // ---------------------------------------------------------------------------

  /// Format date as "4 मार्च 2026"
  static String formatDateHindi(DateTime date) {
    final day = toDevanagariNumerals(date.day.toString());
    final month = _monthsHi[date.month - 1];
    final year = toDevanagariNumerals(date.year.toString());
    return '$day $month $year';
  }

  /// Format date as "सोमवार, 4 मार्च 2026"
  static String formatDateLongHindi(DateTime date) {
    final dayName = _daysHi[date.weekday - 1]; // weekday: 1=Mon .. 7=Sun
    return '$dayName, ${formatDateHindi(date)}';
  }

  /// Format date as "4 मार्च" (without year)
  static String formatDateShortHindi(DateTime date) {
    final day = toDevanagariNumerals(date.day.toString());
    final month = _monthsHi[date.month - 1];
    return '$day $month';
  }

  /// Get short day name: "सोम", "मंगल", etc.
  static String dayShortHindi(DateTime date) => _daysShortHi[date.weekday - 1];

  /// Get full day name: "सोमवार", "मंगलवार", etc.
  static String dayFullHindi(DateTime date) => _daysHi[date.weekday - 1];

  // ---------------------------------------------------------------------------
  // Time formatting
  // ---------------------------------------------------------------------------

  /// Format time as "दोपहर 2:30" / "सुबह 9:00" / "शाम 6:00" / "रात 10:00"
  static String formatTimeHindi(DateTime date) {
    final hour = date.hour;
    final minute = date.minute.toString().padLeft(2, '0');

    String period;
    int displayHour;

    if (hour == 0) {
      period = '\u0930\u093E\u0924'; // रात
      displayHour = 12;
    } else if (hour < 5) {
      period = '\u0930\u093E\u0924'; // रात
      displayHour = hour;
    } else if (hour < 12) {
      period = '\u0938\u0941\u092C\u0939'; // सुबह
      displayHour = hour;
    } else if (hour == 12) {
      period = '\u0926\u094B\u092A\u0939\u0930'; // दोपहर
      displayHour = 12;
    } else if (hour < 17) {
      period = '\u0926\u094B\u092A\u0939\u0930'; // दोपहर
      displayHour = hour - 12;
    } else if (hour < 20) {
      period = '\u0936\u093E\u092E'; // शाम
      displayHour = hour - 12;
    } else {
      period = '\u0930\u093E\u0924'; // रात
      displayHour = hour - 12;
    }

    final hourStr = toDevanagariNumerals(displayHour.toString());
    final minStr = toDevanagariNumerals(minute);
    return '$period $hourStr:$minStr';
  }

  /// Format time in 24h as "१४:३०"
  static String formatTime24Hindi(DateTime date) {
    final h = toDevanagariNumerals(date.hour.toString().padLeft(2, '0'));
    final m = toDevanagariNumerals(date.minute.toString().padLeft(2, '0'));
    return '$h:$m';
  }

  // ---------------------------------------------------------------------------
  // Relative time
  // ---------------------------------------------------------------------------

  /// Format relative time: "2 घंटे पहले", "अभी", "5 मिनट पहले", "3 दिन पहले"
  static String formatRelativeHindi(DateTime dateTime) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);

    if (diff.isNegative) {
      // Future
      final absDiff = dateTime.difference(now);
      if (absDiff.inMinutes < 1) return '\u0905\u092D\u0940'; // अभी
      if (absDiff.inMinutes < 60) {
        return '${toDevanagariNumerals(absDiff.inMinutes.toString())} \u092E\u093F\u0928\u091F \u092E\u0947\u0902'; // X मिनट में
      }
      if (absDiff.inHours < 24) {
        return '${toDevanagariNumerals(absDiff.inHours.toString())} \u0918\u0902\u091F\u0947 \u092E\u0947\u0902'; // X घंटे में
      }
      return '${toDevanagariNumerals(absDiff.inDays.toString())} \u0926\u093F\u0928 \u092E\u0947\u0902'; // X दिन में
    }

    // Past
    if (diff.inMinutes < 1) return '\u0905\u092D\u0940'; // अभी
    if (diff.inMinutes < 60) {
      return '${toDevanagariNumerals(diff.inMinutes.toString())} \u092E\u093F\u0928\u091F \u092A\u0939\u0932\u0947'; // X मिनट पहले
    }
    if (diff.inHours < 24) {
      return '${toDevanagariNumerals(diff.inHours.toString())} \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947'; // X घंटे पहले
    }
    if (diff.inDays == 1) return '\u0915\u0932'; // कल
    if (diff.inDays < 7) {
      return '${toDevanagariNumerals(diff.inDays.toString())} \u0926\u093F\u0928 \u092A\u0939\u0932\u0947'; // X दिन पहले
    }
    if (diff.inDays < 30) {
      final weeks = diff.inDays ~/ 7;
      return '${toDevanagariNumerals(weeks.toString())} \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947'; // X सप्ताह पहले
    }
    final months = diff.inDays ~/ 30;
    return '${toDevanagariNumerals(months.toString())} \u092E\u0939\u0940\u0928\u0947 \u092A\u0939\u0932\u0947'; // X महीने पहले
  }

  // ---------------------------------------------------------------------------
  // Duration formatting
  // ---------------------------------------------------------------------------

  /// Format duration as "5 मिनट" or "1 घंटा 30 मिनट"
  static String formatDurationHindi(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);

    if (hours > 0 && minutes > 0) {
      return '${toDevanagariNumerals(hours.toString())} \u0918\u0902\u091F\u093E ${toDevanagariNumerals(minutes.toString())} \u092E\u093F\u0928\u091F';
    }
    if (hours > 0) {
      return '${toDevanagariNumerals(hours.toString())} \u0918\u0902\u091F\u093E'; // X घंटा
    }
    return '${toDevanagariNumerals(minutes.toString())} \u092E\u093F\u0928\u091F'; // X मिनट
  }
}
