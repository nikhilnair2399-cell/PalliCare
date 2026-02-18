import 'package:flutter/material.dart';
import 'pain_badge.dart';

/// Mini sparkline chart for trends in compact cards.
class Sparkline extends StatelessWidget {
  final List<double> values;
  final double height;
  final double width;
  final Color? color;
  final bool usePainColors;

  const Sparkline({
    super.key,
    required this.values,
    this.height = 40,
    this.width = 100,
    this.color,
    this.usePainColors = false,
  });

  @override
  Widget build(BuildContext context) {
    if (values.isEmpty) return SizedBox(height: height, width: width);

    return CustomPaint(
      size: Size(width, height),
      painter: _SparklinePainter(
        values: values,
        color: color ?? const Color(0xFF7BA68C),
        usePainColors: usePainColors,
      ),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  final List<double> values;
  final Color color;
  final bool usePainColors;

  _SparklinePainter({
    required this.values,
    required this.color,
    required this.usePainColors,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;

    final maxVal = values.reduce((a, b) => a > b ? a : b);
    final minVal = values.reduce((a, b) => a < b ? a : b);
    final range = maxVal - minVal;
    final barWidth = (size.width - (values.length - 1) * 2) / values.length;
    final padding = 2.0;

    for (int i = 0; i < values.length; i++) {
      final normalized =
          range == 0 ? 0.5 : (values[i] - minVal) / range;
      final barHeight = (normalized * (size.height - 4)) + 4;
      final x = i * (barWidth + padding);
      final y = size.height - barHeight;

      final paint = Paint()
        ..style = PaintingStyle.fill
        ..color = usePainColors
            ? PainBadge.painColor(values[i].round().clamp(0, 10))
            : color;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, barWidth, barHeight),
          const Radius.circular(2),
        ),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SparklinePainter old) =>
      old.values != values || old.color != color;
}
