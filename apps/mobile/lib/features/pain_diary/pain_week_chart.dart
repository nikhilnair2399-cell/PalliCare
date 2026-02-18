import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../widgets/pain_badge.dart';
import 'pain_diary_provider.dart';

/// 7-day bar chart showing daily average pain with min/max range indicators.
class PainWeekChart extends StatelessWidget {
  final List<DailyPainEntry> entries;
  const PainWeekChart({super.key, required this.entries});

  @override
  Widget build(BuildContext context) {
    final last7 = entries.length > 7 ? entries.sublist(entries.length - 7) : entries;

    return Container(
      height: 220,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: last7.isEmpty
          ? const Center(
              child: Text('No data yet',
                  style: TextStyle(color: AppColors.textTertiary)))
          : CustomPaint(
              size: const Size(double.infinity, 188),
              painter: _WeekChartPainter(entries: last7),
            ),
    );
  }
}

class _WeekChartPainter extends CustomPainter {
  final List<DailyPainEntry> entries;
  _WeekChartPainter({required this.entries});

  static const _dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @override
  void paint(Canvas canvas, Size size) {
    if (entries.isEmpty) return;

    final chartBottom = size.height - 24; // space for labels
    final chartTop = 8.0;
    final chartHeight = chartBottom - chartTop;
    final barWidth = (size.width - (entries.length - 1) * 6) / entries.length;

    // Draw horizontal gridlines
    final gridPaint = Paint()
      ..color = const Color(0xFFF0F0F0)
      ..strokeWidth = 1;

    for (int i = 0; i <= 10; i += 2) {
      final y = chartTop + chartHeight * (1 - i / 10);
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Draw scale labels
    final labelStyle = TextStyle(fontSize: 9, color: Colors.grey.shade400);
    for (int i = 0; i <= 10; i += 5) {
      final y = chartTop + chartHeight * (1 - i / 10);
      final tp = TextPainter(
        text: TextSpan(text: '$i', style: labelStyle),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(-2, y - tp.height / 2));
    }

    for (int i = 0; i < entries.length; i++) {
      final entry = entries[i];
      final x = i * (barWidth + 6);

      // Min-max range line
      final minY = chartTop + chartHeight * (1 - entry.minPain / 10);
      final maxY = chartTop + chartHeight * (1 - entry.maxPain / 10);
      final rangePaint = Paint()
        ..color = Colors.grey.shade300
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(
        Offset(x + barWidth / 2, minY),
        Offset(x + barWidth / 2, maxY),
        rangePaint,
      );

      // Average pain bar
      final barHeight = (entry.avgPain / 10) * chartHeight;
      final barY = chartTop + chartHeight - barHeight;
      final barColor = PainBadge.painColor(entry.avgPain);

      final barPaint = Paint()
        ..color = barColor
        ..style = PaintingStyle.fill;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, barY, barWidth, barHeight),
          const Radius.circular(4),
        ),
        barPaint,
      );

      // Value label on bar
      final valTp = TextPainter(
        text: TextSpan(
          text: '${entry.avgPain}',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: entry.avgPain >= 6 ? Colors.white : AppColors.textPrimary,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      valTp.paint(
        canvas,
        Offset(x + (barWidth - valTp.width) / 2, barY + 4),
      );

      // Day label below
      final dayIndex = entry.date.weekday - 1;
      final dayLabel = dayIndex < _dayLabels.length
          ? _dayLabels[dayIndex]
          : '${entry.date.day}';
      final dayTp = TextPainter(
        text: TextSpan(
          text: dayLabel,
          style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      dayTp.paint(
        canvas,
        Offset(x + (barWidth - dayTp.width) / 2, chartBottom + 4),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _WeekChartPainter old) =>
      old.entries != entries;
}
