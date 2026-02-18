import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'caregiver_provider.dart';

/// Help & Support resource directory with phone numbers and call buttons.
class ResourceDirectory extends ConsumerWidget {
  const ResourceDirectory({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(caregiverProvider);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          const Row(
            children: [
              Icon(Icons.support_agent, size: 20, color: AppColors.primaryDark),
              SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Help & Support',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '\u0938\u0939\u093E\u092F\u0924\u093E \u0914\u0930 \u0938\u092E\u0930\u094D\u0925\u0928',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),

          // Resource entries
          ...state.resources
              .map((r) => _ResourceRow(resource: r))
              .toList(),

          // Caregiver Guide PDF
          const SizedBox(height: AppSpacing.space3),
          const Divider(color: AppColors.divider, height: 1),
          const SizedBox(height: AppSpacing.space3),
          _buildDownloadRow(),
        ],
      ),
    );
  }

  Widget _buildDownloadRow() {
    return InkWell(
      onTap: () {
        // Download or open caregiver guide PDF
      },
      borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.info.withAlpha(20),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.download,
                size: 18,
                color: AppColors.info,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Caregiver Guide (PDF)',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '\u0926\u0947\u0916\u092D\u093E\u0932\u0915\u0930\u094D\u0924\u093E \u0917\u093E\u0907\u0921',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: AppColors.textTertiary,
            ),
          ],
        ),
      ),
    );
  }
}

/// A single resource entry with icon, name, phone, and Call button.
class _ResourceRow extends StatelessWidget {
  final ResourceEntry resource;

  const _ResourceRow({required this.resource});

  IconData get _icon {
    if (resource.phone == '112') return Icons.emergency;
    if (resource.name.contains('Mental') ||
        resource.name.contains('iCall') ||
        resource.name.contains('Vandrevala')) {
      return Icons.psychology;
    }
    if (resource.name.contains('Support Group')) return Icons.group;
    return Icons.phone_in_talk;
  }

  Color get _iconColor {
    if (resource.phone == '112') return AppColors.accentAlert;
    if (resource.name.contains('Mental') ||
        resource.name.contains('iCall') ||
        resource.name.contains('Vandrevala')) {
      return AppColors.accentCalm;
    }
    return AppColors.primaryDark;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: _iconColor.withAlpha(20),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(_icon, size: 18, color: _iconColor),
          ),
          const SizedBox(width: 12),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  resource.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                if (resource.nameHindi.isNotEmpty)
                  Text(
                    resource.nameHindi,
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                const SizedBox(height: 2),
                Text(
                  '${resource.phone} \u00B7 ${resource.description}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ),

          // Call button
          SizedBox(
            height: 32,
            child: ElevatedButton.icon(
              onPressed: () => _makeCall(resource.phone),
              icon: const Icon(Icons.call, size: 14),
              label: const Text(
                'Call',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: resource.phone == '112'
                    ? AppColors.accentAlert
                    : AppColors.primaryDark,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _makeCall(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone.replaceAll('-', ''));
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}
