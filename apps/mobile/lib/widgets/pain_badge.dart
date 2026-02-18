import 'package:flutter/material.dart';

/// Compact colored badge showing a pain NRS value.
class PainBadge extends StatelessWidget {
  final int score;
  final double size;

  const PainBadge({super.key, required this.score, this.size = 32});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: painColor(score),
        borderRadius: BorderRadius.circular(size / 4),
      ),
      alignment: Alignment.center,
      child: Text(
        '$score',
        style: TextStyle(
          color: score >= 6 ? Colors.white : const Color(0xFF2D2D2D),
          fontSize: size * 0.45,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  /// 11-level pain gradient color scale.
  static Color painColor(int score) {
    const colors = [
      Color(0xFF7BA68C), // 0 - no pain
      Color(0xFF8FB89E), // 1
      Color(0xFFA8C97F), // 2
      Color(0xFFC4D94F), // 3
      Color(0xFFE8D44D), // 4
      Color(0xFFE8C033), // 5
      Color(0xFFE8A838), // 6
      Color(0xFFE89040), // 7
      Color(0xFFE87461), // 8
      Color(0xFFD94F4F), // 9
      Color(0xFFC0392B), // 10
    ];
    return colors[score.clamp(0, 10)];
  }

  static String painLabel(int score) {
    if (score == 0) return 'No pain';
    if (score <= 2) return 'Mild';
    if (score <= 4) return 'Moderate';
    if (score <= 6) return 'Moderate-severe';
    if (score <= 8) return 'Severe';
    return 'Worst possible';
  }

  static String painLabelHindi(int score) {
    if (score == 0) return 'कोई दर्द नहीं';
    if (score <= 2) return 'हल्का';
    if (score <= 4) return 'मध्यम';
    if (score <= 6) return 'मध्यम-तेज़';
    if (score <= 8) return 'तेज़';
    return 'सबसे बुरा';
  }
}
