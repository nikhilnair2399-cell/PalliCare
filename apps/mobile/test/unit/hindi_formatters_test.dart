import 'package:flutter_test/flutter_test.dart';
import 'package:pallicare/core/l10n/hindi_formatters.dart';

void main() {
  // ---------------------------------------------------------------------------
  // toDevanagariNumerals
  // ---------------------------------------------------------------------------

  group('toDevanagariNumerals', () {
    test('converts digits: "123" -> "\u0967\u0968\u0969"', () {
      expect(HindiFormatters.toDevanagariNumerals('123'), '\u0967\u0968\u0969');
    });

    test('converts "0" -> "\u0966"', () {
      expect(HindiFormatters.toDevanagariNumerals('0'), '\u0966');
    });

    test('preserves non-digit characters: "abc" -> "abc"', () {
      expect(HindiFormatters.toDevanagariNumerals('abc'), 'abc');
    });

    test('mixed input: "Room 301" -> "Room \u0969\u0966\u0967"', () {
      expect(
        HindiFormatters.toDevanagariNumerals('Room 301'),
        'Room \u0969\u0966\u0967',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // formatDateHindi
  // ---------------------------------------------------------------------------

  group('formatDateHindi', () {
    test('formats 2026-03-04 correctly', () {
      final date = DateTime(2026, 3, 4);
      final result = HindiFormatters.formatDateHindi(date);
      // "४ मार्च २०२६"
      expect(result, '\u096A \u092E\u093E\u0930\u094D\u091A \u0968\u0966\u0968\u096C');
    });

    test('formats January date correctly', () {
      final date = DateTime(2026, 1, 15);
      final result = HindiFormatters.formatDateHindi(date);
      // "१५ जनवरी २०२६"
      expect(
        result,
        '\u0967\u096B \u091C\u0928\u0935\u0930\u0940 \u0968\u0966\u0968\u096C',
      );
    });

    test('formats December date correctly', () {
      final date = DateTime(2026, 12, 25);
      final result = HindiFormatters.formatDateHindi(date);
      // "२५ दिसंबर २०२६"
      expect(
        result,
        '\u0968\u096B \u0926\u093F\u0938\u0902\u092C\u0930 \u0968\u0966\u0968\u096C',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // formatDateLongHindi
  // ---------------------------------------------------------------------------

  group('formatDateLongHindi', () {
    test('includes day name', () {
      // 2026-03-04 is a Wednesday (बुधवार)
      final date = DateTime(2026, 3, 4);
      final result = HindiFormatters.formatDateLongHindi(date);
      expect(result, contains('\u092C\u0941\u0927\u0935\u093E\u0930')); // बुधवार
      expect(result, contains('\u092E\u093E\u0930\u094D\u091A')); // मार्च
    });
  });

  // ---------------------------------------------------------------------------
  // formatTimeHindi
  // ---------------------------------------------------------------------------

  group('formatTimeHindi', () {
    test('morning time (8:30) starts with \u0938\u0941\u092C\u0939', () {
      final date = DateTime(2026, 1, 1, 8, 30);
      final result = HindiFormatters.formatTimeHindi(date);
      expect(result, startsWith('\u0938\u0941\u092C\u0939')); // सुबह
    });

    test('afternoon time (14:30) starts with \u0926\u094B\u092A\u0939\u0930', () {
      final date = DateTime(2026, 1, 1, 14, 30);
      final result = HindiFormatters.formatTimeHindi(date);
      expect(result, startsWith('\u0926\u094B\u092A\u0939\u0930')); // दोपहर
    });

    test('evening time (18:00) starts with \u0936\u093E\u092E', () {
      final date = DateTime(2026, 1, 1, 18, 0);
      final result = HindiFormatters.formatTimeHindi(date);
      expect(result, startsWith('\u0936\u093E\u092E')); // शाम
    });

    test('night time (22:00) starts with \u0930\u093E\u0924', () {
      final date = DateTime(2026, 1, 1, 22, 0);
      final result = HindiFormatters.formatTimeHindi(date);
      expect(result, startsWith('\u0930\u093E\u0924')); // रात
    });
  });

  // ---------------------------------------------------------------------------
  // formatTime24Hindi
  // ---------------------------------------------------------------------------

  group('formatTime24Hindi', () {
    test('converts 14:30 to Devanagari "\u0967\u096A:\u0969\u0966"', () {
      final date = DateTime(2026, 1, 1, 14, 30);
      final result = HindiFormatters.formatTime24Hindi(date);
      expect(result, '\u0967\u096A:\u0969\u0966'); // १४:३०
    });

    test('zero-pads single-digit hours and minutes', () {
      final date = DateTime(2026, 1, 1, 9, 5);
      final result = HindiFormatters.formatTime24Hindi(date);
      expect(result, '\u0966\u096F:\u0966\u096B'); // ०९:०५
    });
  });

  // ---------------------------------------------------------------------------
  // formatRelativeHindi
  // ---------------------------------------------------------------------------

  group('formatRelativeHindi', () {
    test('just now (< 1 minute) returns \u0905\u092D\u0940', () {
      final now = DateTime.now();
      final result = HindiFormatters.formatRelativeHindi(now);
      expect(result, '\u0905\u092D\u0940'); // अभी
    });

    test('minutes ago returns "X \u092E\u093F\u0928\u091F \u092A\u0939\u0932\u0947"', () {
      final fiveMinAgo = DateTime.now().subtract(const Duration(minutes: 5));
      final result = HindiFormatters.formatRelativeHindi(fiveMinAgo);
      expect(result, contains('\u092E\u093F\u0928\u091F \u092A\u0939\u0932\u0947')); // मिनट पहले
      expect(result, contains('\u096B')); // ५
    });

    test('hours ago returns "X \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947"', () {
      final twoHoursAgo = DateTime.now().subtract(const Duration(hours: 2));
      final result = HindiFormatters.formatRelativeHindi(twoHoursAgo);
      expect(result, contains('\u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947')); // घंटे पहले
      expect(result, contains('\u0968')); // २
    });
  });

  // ---------------------------------------------------------------------------
  // formatDurationHindi
  // ---------------------------------------------------------------------------

  group('formatDurationHindi', () {
    test('pure minutes: 45 min -> "\u096A\u096B \u092E\u093F\u0928\u091F"', () {
      final result =
          HindiFormatters.formatDurationHindi(const Duration(minutes: 45));
      // ४५ मिनट
      expect(result, '\u096A\u096B \u092E\u093F\u0928\u091F');
    });

    test(
        'hours and minutes: 90 min -> "\u0967 \u0918\u0902\u091F\u093E \u0969\u0966 \u092E\u093F\u0928\u091F"',
        () {
      final result =
          HindiFormatters.formatDurationHindi(const Duration(minutes: 90));
      // १ घंटा ३० मिनट
      expect(result,
          '\u0967 \u0918\u0902\u091F\u093E \u0969\u0966 \u092E\u093F\u0928\u091F');
    });

    test('exact hours: 120 min -> "\u0968 \u0918\u0902\u091F\u093E"', () {
      final result =
          HindiFormatters.formatDurationHindi(const Duration(minutes: 120));
      // २ घंटा
      expect(result, '\u0968 \u0918\u0902\u091F\u093E');
    });
  });
}
