import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'caregiver_provider.dart';

/// Visitor Log Screen — track visitors and appointments.
///
/// Records who visited the patient and when, with optional notes.
class VisitorLogScreen extends ConsumerStatefulWidget {
  const VisitorLogScreen({super.key});

  @override
  ConsumerState<VisitorLogScreen> createState() => _VisitorLogScreenState();
}

class _VisitorLogScreenState extends ConsumerState<VisitorLogScreen> {
  final _nameController = TextEditingController();
  final _purposeController = TextEditingController();
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _purposeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _addEntry() {
    final name = _nameController.text.trim();
    final purpose = _purposeController.text.trim();
    if (name.isEmpty) return;

    ref.read(caregiverProvider.notifier).addVisitorEntry(
          name,
          purpose.isEmpty ? 'Visit' : purpose,
          notes: _notesController.text.trim(),
        );
    _nameController.clear();
    _purposeController.clear();
    _notesController.clear();
    Navigator.pop(context);
  }

  void _showAddSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surfaceCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusHero),
        ),
      ),
      builder: (_) => Padding(
        padding: EdgeInsets.only(
          left: AppSpacing.md,
          right: AppSpacing.md,
          top: AppSpacing.md,
          bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.md,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Log Visitor',
              style: AppTypography.heading3.copyWith(color: AppColors.teal),
            ),
            Text(
              '\u0906\u0917\u0902\u0924\u0941\u0915 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902',
              style:
                  AppTypography.caption.copyWith(color: AppColors.charcoalLight),
            ),
            const SizedBox(height: AppSpacing.md),
            _field(_nameController, 'Visitor name'),
            const SizedBox(height: AppSpacing.sm),
            _field(_purposeController, 'Purpose (e.g. Doctor visit, Family)'),
            const SizedBox(height: AppSpacing.sm),
            _field(_notesController, 'Notes (optional)', maxLines: 2),
            const SizedBox(height: AppSpacing.md),
            SizedBox(
              width: double.infinity,
              height: AppSpacing.buttonHeight,
              child: ElevatedButton(
                onPressed: _addEntry,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentWarm,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.radiusButton),
                  ),
                ),
                child: const Text(
                  'Log Visit',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(TextEditingController c, String hint, {int maxLines = 1}) {
    return TextField(
      controller: c,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle:
            AppTypography.bodyDefault.copyWith(color: AppColors.textTertiary),
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
          borderSide: const BorderSide(color: AppColors.accentWarm),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final period = dt.hour >= 12 ? 'PM' : 'AM';
    return '${months[dt.month - 1]} ${dt.day}, ${dt.year} \u00B7 $hour:${dt.minute.toString().padLeft(2, '0')} $period';
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(caregiverProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.accentWarmDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Visitor Log',
              style: AppTypography.heading3.copyWith(color: Colors.white),
            ),
            Text(
              '\u0906\u0917\u0902\u0924\u0941\u0915 \u0930\u091C\u093F\u0938\u094D\u091F\u0930',
              style: AppTypography.caption.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddSheet,
        backgroundColor: AppColors.accentWarm,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: state.visitorLog.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('\ud83d\udcdd', style: TextStyle(fontSize: 40)),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'No visitors logged yet',
                    style: AppTypography.label.copyWith(
                      color: AppColors.charcoalLight,
                    ),
                  ),
                  Text(
                    '\u0905\u092D\u0940 \u0915\u094B\u0908 \u0906\u0917\u0902\u0924\u0941\u0915 \u0928\u0939\u0940\u0902',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.md),
              itemCount: state.visitorLog.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(height: AppSpacing.sm),
              itemBuilder: (_, index) {
                final entry = state.visitorLog[index];
                return Dismissible(
                  key: Key(entry.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.accentAlert.withValues(alpha: 0.1),
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusCard),
                    ),
                    child: const Icon(Icons.delete,
                        color: AppColors.accentAlert),
                  ),
                  onDismissed: (_) => ref
                      .read(caregiverProvider.notifier)
                      .deleteVisitorEntry(entry.id),
                  child: Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceCard,
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusCard),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: AppColors.teal.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(Icons.person,
                              size: 20, color: AppColors.teal),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                entry.visitorName,
                                style: AppTypography.label.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                entry.purpose,
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.charcoalLight,
                                ),
                              ),
                              if (entry.notes.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text(
                                  entry.notes,
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.textTertiary,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 4),
                              Text(
                                _formatDate(entry.dateTime),
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.textTertiary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
