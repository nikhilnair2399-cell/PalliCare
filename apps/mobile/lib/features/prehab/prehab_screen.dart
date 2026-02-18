import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// Prehabilitation Module — Patient-facing
/// Spec: 13_Screen_Prehabilitation.md
/// Tabs: Overview, Exercise, Nutrition, Mind
class PrehabScreen extends StatefulWidget {
  const PrehabScreen({super.key});

  @override
  State<PrehabScreen> createState() => _PrehabScreenState();
}

class _PrehabScreenState extends State<PrehabScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.teal,
        title: const Text('Preparing for Surgery'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.teal,
          unselectedLabelColor: AppColors.charcoalLight,
          indicatorColor: AppColors.sage,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
            Tab(icon: Icon(Icons.fitness_center), text: 'Exercise'),
            Tab(icon: Icon(Icons.restaurant), text: 'Nutrition'),
            Tab(icon: Icon(Icons.self_improvement), text: 'Mind'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _OverviewTab(),
          _ExerciseTab(),
          _NutritionTab(),
          _MindTab(),
        ],
      ),
    );
  }
}

class _OverviewTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        children: [
          // Surgery Countdown
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.teal, AppColors.tealDark],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Text(
                  '8',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 64,
                      fontWeight: FontWeight.bold),
                ),
                Text(
                  'days until surgery',
                  style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8), fontSize: 16),
                ),
                const SizedBox(height: 16),
                // Readiness meter
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check_circle, color: Colors.white, size: 18),
                      SizedBox(width: 8),
                      Text('Readiness: 72%',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Pre-op Checklist
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Pre-Op Checklist',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.teal, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                _ChecklistItem(label: 'Blood tests completed', done: true),
                _ChecklistItem(label: 'Imaging reviewed', done: true),
                _ChecklistItem(label: 'Consent signed', done: false),
                _ChecklistItem(label: 'Medication review', done: true),
                _ChecklistItem(label: 'NPO instructions received', done: false),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChecklistItem extends StatelessWidget {
  final String label;
  final bool done;

  const _ChecklistItem({required this.label, required this.done});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(
            done ? Icons.check_circle : Icons.radio_button_unchecked,
            color: done ? AppColors.sage : AppColors.charcoalLight,
            size: 20,
          ),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: done ? AppColors.charcoalLight : AppColors.charcoal,
              decoration: done ? TextDecoration.lineThrough : null,
            ),
          ),
        ],
      ),
    );
  }
}

class _ExerciseTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Exercise Tab — Sprint 3: S3-1',
          style: TextStyle(color: AppColors.charcoalLight)),
    );
  }
}

class _NutritionTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Nutrition Tab — Sprint 3: S3-2',
          style: TextStyle(color: AppColors.charcoalLight)),
    );
  }
}

class _MindTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Mind Tab — Sprint 3: S3-3',
          style: TextStyle(color: AppColors.charcoalLight)),
    );
  }
}
