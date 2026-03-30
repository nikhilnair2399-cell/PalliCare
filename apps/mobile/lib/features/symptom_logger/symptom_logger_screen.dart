import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/l10n/app_localizations.dart';
import '../../widgets/progress_dots.dart';
import 'symptom_log_provider.dart';
import 'pain_intensity_card.dart';
import 'body_map_card.dart';
import 'pain_quality_card.dart';
import 'triggers_card.dart';
import 'esas_card.dart';
import 'mood_sleep_card.dart';
import 'notes_card.dart';

class SymptomLoggerScreen extends ConsumerStatefulWidget {
  final LogMode mode;
  const SymptomLoggerScreen({super.key, this.mode = LogMode.full});

  @override
  ConsumerState<SymptomLoggerScreen> createState() =>
      _SymptomLoggerScreenState();
}

class _SymptomLoggerScreenState extends ConsumerState<SymptomLoggerScreen> {
  late PageController _pageCtrl;

  @override
  void initState() {
    super.initState();
    _pageCtrl = PageController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(symptomLogProvider.notifier).startLog(widget.mode);
    });
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    super.dispose();
  }

  List<Widget> _buildCards(LogMode mode) {
    switch (mode) {
      case LogMode.quick:
        return [
          const PainIntensityCard(),
          const BodyMapCard(),
          const _QuickSummaryCard(),
        ];
      case LogMode.full:
        return [
          const PainIntensityCard(),
          const BodyMapCard(),
          const PainQualityCard(),
          const TriggersCard(),
          const EsasCard(),
          const MoodSleepCard(),
          const NotesCard(),
        ];
      case LogMode.breakthrough:
        return [const PainIntensityCard()];
    }
  }

  void _next() {
    final entry = ref.read(symptomLogProvider);
    if (entry.currentCard < entry.totalCards - 1) {
      ref.read(symptomLogProvider.notifier).nextCard();
      _pageCtrl.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    } else {
      _complete();
    }
  }

  void _prev() {
    final entry = ref.read(symptomLogProvider);
    if (entry.currentCard > 0) {
      ref.read(symptomLogProvider.notifier).prevCard();
      _pageCtrl.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _complete() {
    // TODO: Save to local DB, queue for sync
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(AppLocalizations.of(context).symptomLogSaved),
        backgroundColor: AppColors.sageGreen,
      ),
    );
    ref.read(symptomLogProvider.notifier).reset();
  }

  @override
  Widget build(BuildContext context) {
    final entry = ref.watch(symptomLogProvider);
    final cards = _buildCards(entry.mode);

    return Scaffold(
      backgroundColor: AppColors.warmCream,
      appBar: AppBar(
        backgroundColor: AppColors.warmCream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.deepTeal),
          onPressed: entry.currentCard > 0 ? _prev : () => Navigator.pop(context),
        ),
        title: Text(
          AppLocalizations.of(context).symptomCheckinTitle,
          style: const TextStyle(fontSize: 14, color: Colors.grey),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.grey),
            onPressed: () {
              ref.read(symptomLogProvider.notifier).reset();
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ProgressDots(
              currentStep: entry.currentCard,
              totalSteps: entry.totalCards,
              label: '${entry.currentCard + 1} / ${entry.totalCards}',
            ),
          ),
          Expanded(
            child: PageView(
              controller: _pageCtrl,
              physics: const NeverScrollableScrollPhysics(),
              children: cards,
            ),
          ),
          // Navigation bar
          Container(
            padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
            child: Row(
              children: [
                if (entry.currentCard > 0)
                  TextButton(
                    onPressed: _prev,
                    child: Text('\u2190 ${AppLocalizations.of(context).commonBack}',
                        style: const TextStyle(color: Colors.grey)),
                  ),
                const Spacer(),
                ElevatedButton(
                  onPressed: _next,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.sageGreen,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    entry.currentCard < entry.totalCards - 1
                        ? '${AppLocalizations.of(context).commonNext} \u2192'
                        : '${AppLocalizations.of(context).commonDone} \u2713',
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Quick mode summary card.
class _QuickSummaryCard extends ConsumerWidget {
  const _QuickSummaryCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l = AppLocalizations.of(context);
    final entry = ref.watch(symptomLogProvider);
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.check_circle_outline,
              size: 56, color: AppColors.sageGreen),
          const SizedBox(height: 16),
          Text(
            l.symptomPainLabel(entry.painIntensity ?? 0),
            style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: AppColors.deepTeal),
          ),
          const SizedBox(height: 8),
          Text(
            l.symptomLocationsMarked(entry.painLocations.length),
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 24),
          Text(
            l.symptomQuickSaveTip,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }
}
