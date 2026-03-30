import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'community_provider.dart';

/// Channel card widget — displays a community channel in the hub list.
class ChannelCard extends StatelessWidget {
  final CommunityChannel channel;
  final VoidCallback onTap;

  const ChannelCard({
    super.key,
    required this.channel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
            border: Border.all(color: AppColors.border, width: 1),
            boxShadow: [
              BoxShadow(
                color: AppColors.textPrimary.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              // ── Emoji Avatar ──
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _phaseColor(channel.phase).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                ),
                alignment: Alignment.center,
                child: Text(
                  channel.emoji,
                  style: const TextStyle(fontSize: 24),
                ),
              ),

              const SizedBox(width: AppSpacing.md),

              // ── Channel Info ──
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name EN
                    Text(
                      channel.nameEn,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 2),
                    // Name HI
                    Text(
                      channel.nameHi,
                      style: TextStyle(
                        color: AppColors.textSecondary.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    // Stats row
                    Row(
                      children: [
                        Icon(
                          Icons.people_outline,
                          size: 13,
                          color: AppColors.textTertiary.withValues(alpha: 0.8),
                        ),
                        const SizedBox(width: 3),
                        Text(
                          '${channel.memberCount}',
                          style: TextStyle(
                            color: AppColors.textTertiary.withValues(alpha: 0.8),
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 13,
                          color: AppColors.textTertiary.withValues(alpha: 0.8),
                        ),
                        const SizedBox(width: 3),
                        Text(
                          '${channel.postCount}',
                          style: TextStyle(
                            color: AppColors.textTertiary.withValues(alpha: 0.8),
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const Spacer(),
                        if (channel.lastActivityAt != null)
                          Text(
                            _formatLastActivity(channel.lastActivityAt!),
                            style: TextStyle(
                              color: AppColors.textTertiary.withValues(alpha: 0.6),
                              fontSize: 10,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(width: AppSpacing.sm),

              // ── Arrow ──
              Icon(
                Icons.chevron_right,
                color: AppColors.textTertiary.withValues(alpha: 0.5),
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _phaseColor(DiseasePhase phase) {
    switch (phase) {
      case DiseasePhase.newlyDiagnosed:
        return AppColors.primary;
      case DiseasePhase.activeTreatment:
        return AppColors.deepTeal;
      case DiseasePhase.chronicPain:
        return AppColors.accentWarm;
      case DiseasePhase.endOfLife:
        return AppColors.lavender;
      case DiseasePhase.survivorship:
        return AppColors.success;
      case DiseasePhase.caregiverSupport:
        return AppColors.warning;
    }
  }

  String _formatLastActivity(String isoString) {
    try {
      final dt = DateTime.parse(isoString);
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 1) return 'Active now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 7) return '${diff.inDays}d ago';
      return '${dt.day}/${dt.month}';
    } catch (_) {
      return '';
    }
  }
}
