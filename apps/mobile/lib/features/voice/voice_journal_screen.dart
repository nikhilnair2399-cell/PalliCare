import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'voice_provider.dart';

/// Voice Journal — record audio diary entries.
///
/// Recorder section at top, entries list below. Mood selector before save.
class VoiceJournalScreen extends ConsumerStatefulWidget {
  const VoiceJournalScreen({super.key});

  @override
  ConsumerState<VoiceJournalScreen> createState() => _VoiceJournalScreenState();
}

class _VoiceJournalScreenState extends ConsumerState<VoiceJournalScreen> {
  Timer? _recordingTimer;
  final _titleController = TextEditingController();

  @override
  void dispose() {
    _recordingTimer?.cancel();
    _titleController.dispose();
    super.dispose();
  }

  void _startRecording() {
    final notifier = ref.read(voiceProvider.notifier);
    notifier.startRecording();
    _recordingTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      final current = ref.read(voiceProvider).recordingDuration;
      notifier.updateRecordingDuration(current + const Duration(seconds: 1));
    });
  }

  void _stopAndSave() {
    _recordingTimer?.cancel();
    _showSaveDialog();
  }

  void _cancelRecording() {
    _recordingTimer?.cancel();
    ref.read(voiceProvider.notifier).cancelRecording();
  }

  void _showSaveDialog() {
    _titleController.clear();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final bottomInset = MediaQuery.of(ctx).viewInsets.bottom;
        return Padding(
          padding: EdgeInsets.only(
            left: AppSpacing.md,
            right: AppSpacing.md,
            top: AppSpacing.md,
            bottom: AppSpacing.md + bottomInset,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              const Text(
                'Save Voice Note',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Title
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Add a title (optional)',
                  hintStyle: const TextStyle(color: AppColors.textTertiary, fontSize: 14),
                  filled: true,
                  fillColor: AppColors.surfaceCard,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppSpacing.radiusInput),
                    borderSide: BorderSide(color: AppColors.border),
                  ),
                  contentPadding: const EdgeInsets.all(AppSpacing.sm),
                ),
                style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
              ),
              const SizedBox(height: AppSpacing.md),

              // Mood selector
              const Text(
                'How do you feel?',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Consumer(builder: (_, cRef, __) {
                final selected = cRef.watch(voiceProvider).selectedMood;
                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: VoiceJournalMood.values.map((mood) {
                    final isSelected = mood == selected;
                    return GestureDetector(
                      onTap: () => cRef.read(voiceProvider.notifier).setMood(mood),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.teal.withValues(alpha: 0.12)
                              : AppColors.surfaceCard,
                          borderRadius: BorderRadius.circular(AppSpacing.radiusChip),
                          border: Border.all(
                            color: isSelected ? AppColors.teal : AppColors.border,
                          ),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(_moodEmoji[mood]!, style: const TextStyle(fontSize: 20)),
                            const SizedBox(height: 2),
                            Text(
                              _moodLabel[mood]!,
                              style: TextStyle(
                                color: isSelected ? AppColors.teal : AppColors.textTertiary,
                                fontSize: 10,
                                fontWeight: isSelected ? FontWeight.w600 : null,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                );
              }),
              const SizedBox(height: AppSpacing.md),

              // Save button
              SizedBox(
                width: double.infinity,
                height: AppSpacing.buttonHeight,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ref.read(voiceProvider.notifier).saveRecording(
                          title: _titleController.text.trim().isEmpty
                              ? null
                              : _titleController.text.trim(),
                        );
                    Navigator.pop(ctx);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.teal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppSpacing.radiusButton),
                    ),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.check, size: 20),
                  label: const Text(
                    'Save Entry',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  static const _moodEmoji = {
    VoiceJournalMood.peaceful: '\u2728',
    VoiceJournalMood.hopeful: '\ud83c\udf1f',
    VoiceJournalMood.tired: '\ud83d\ude34',
    VoiceJournalMood.anxious: '\ud83d\ude1f',
    VoiceJournalMood.grateful: '\ud83d\ude4f',
  };

  static const _moodLabel = {
    VoiceJournalMood.peaceful: 'Peaceful',
    VoiceJournalMood.hopeful: 'Hopeful',
    VoiceJournalMood.tired: 'Tired',
    VoiceJournalMood.anxious: 'Anxious',
    VoiceJournalMood.grateful: 'Grateful',
  };

  String _formatDuration(Duration d) {
    final m = d.inMinutes.toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${dt.day}/${dt.month}/${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(voiceProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: const Column(
          children: [
            Text(
              'Voice Journal',
              style: TextStyle(
                color: AppColors.teal,
                fontWeight: FontWeight.w800,
                fontSize: 18,
              ),
            ),
            Text(
              '\u0906\u0935\u093E\u091C\u093C \u0921\u093E\u092F\u0930\u0940',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // ── Recorder Section ──
          _buildRecorderSection(state),

          // ── Entries List ──
          Expanded(
            child: state.journalEntries.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('\ud83c\udfa4', style: TextStyle(fontSize: 48)),
                        SizedBox(height: AppSpacing.sm),
                        Text(
                          'No entries yet',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 15),
                        ),
                        Text(
                          'Tap the mic to start recording',
                          style: TextStyle(color: AppColors.textTertiary, fontSize: 13),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: state.journalEntries.length,
                    itemBuilder: (_, i) {
                      final entry = state.journalEntries[i];
                      return Dismissible(
                        key: ValueKey(entry.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: AppSpacing.md),
                          decoration: BoxDecoration(
                            color: AppColors.error.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                          ),
                          child: const Icon(Icons.delete, color: AppColors.error),
                        ),
                        onDismissed: (_) =>
                            ref.read(voiceProvider.notifier).deleteJournalEntry(entry.id),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                          padding: const EdgeInsets.all(AppSpacing.sm),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceCard,
                            borderRadius: BorderRadius.circular(AppSpacing.radiusCard),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Row(
                            children: [
                              // Play
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: AppColors.teal.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                alignment: Alignment.center,
                                child: const Icon(Icons.play_arrow, color: AppColors.teal, size: 24),
                              ),
                              const SizedBox(width: AppSpacing.sm),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          _moodEmoji[entry.mood] ?? '\u2728',
                                          style: const TextStyle(fontSize: 14),
                                        ),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            entry.titleEn ?? 'Voice note',
                                            style: const TextStyle(
                                              color: AppColors.textPrimary,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 14,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                    if (entry.transcription != null) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        entry.transcription!,
                                        style: const TextStyle(
                                          color: AppColors.textSecondary,
                                          fontSize: 12,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                    const SizedBox(height: 2),
                                    Text(
                                      '${_formatDuration(entry.duration)}  \u2022  ${_formatDate(entry.createdAt)}',
                                      style: const TextStyle(
                                        color: AppColors.textTertiary,
                                        fontSize: 11,
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
          ),
        ],
      ),
    );
  }

  Widget _buildRecorderSection(VoiceState state) {
    final isRecording = state.recordingStatus == RecordingStatus.recording;
    final isPaused = state.recordingStatus == RecordingStatus.paused;
    final isActive = isRecording || isPaused;

    return Container(
      margin: const EdgeInsets.all(AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isActive
            ? AppColors.teal.withValues(alpha: 0.06)
            : AppColors.surfaceCard,
        borderRadius: BorderRadius.circular(AppSpacing.radiusHero),
        border: Border.all(
          color: isActive ? AppColors.teal.withValues(alpha: 0.3) : AppColors.border,
        ),
      ),
      child: Column(
        children: [
          // Timer display
          Text(
            _formatDuration(state.recordingDuration),
            style: TextStyle(
              color: isActive ? AppColors.teal : AppColors.textTertiary,
              fontWeight: FontWeight.w800,
              fontSize: 36,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            isRecording
                ? 'Recording...'
                : isPaused
                    ? 'Paused'
                    : 'Tap to start recording',
            style: TextStyle(
              color: isRecording ? AppColors.error : AppColors.textTertiary,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Controls
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (isActive) ...[
                // Cancel
                IconButton(
                  onPressed: _cancelRecording,
                  icon: const Icon(Icons.close, color: AppColors.error, size: 28),
                  tooltip: 'Cancel',
                ),
                const SizedBox(width: AppSpacing.lg),
              ],

              // Main record/stop button
              GestureDetector(
                onTap: isActive ? _stopAndSave : _startRecording,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: isRecording ? AppColors.error : AppColors.teal,
                    shape: BoxShape.circle,
                    boxShadow: [
                      if (isRecording)
                        BoxShadow(
                          color: AppColors.error.withValues(alpha: 0.3),
                          blurRadius: 16,
                          spreadRadius: 2,
                        ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: isActive
                        ? const Icon(Icons.stop, color: Colors.white, size: 32,
                            key: ValueKey('stop'))
                        : const Icon(Icons.mic, color: Colors.white, size: 32,
                            key: ValueKey('mic')),
                  ),
                ),
              ),

              if (isActive) ...[
                const SizedBox(width: AppSpacing.lg),
                // Pause/Resume
                IconButton(
                  onPressed: () {
                    final notifier = ref.read(voiceProvider.notifier);
                    if (isRecording) {
                      _recordingTimer?.cancel();
                      notifier.pauseRecording();
                    } else {
                      notifier.resumeRecording();
                      _recordingTimer = Timer.periodic(
                        const Duration(seconds: 1),
                        (_) {
                          final current = ref.read(voiceProvider).recordingDuration;
                          notifier.updateRecordingDuration(
                              current + const Duration(seconds: 1));
                        },
                      );
                    }
                  },
                  icon: Icon(
                    isPaused ? Icons.play_arrow : Icons.pause,
                    color: AppColors.teal,
                    size: 28,
                  ),
                  tooltip: isPaused ? 'Resume' : 'Pause',
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
