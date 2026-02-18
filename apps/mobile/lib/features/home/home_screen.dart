import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// Patient Home Screen — "Today, You Matter"
/// Spec: 02_Screen_Home.md
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              _buildGreetingHeader(context),
              const SizedBox(height: AppSpacing.md),

              // Hero Card — "How are you feeling?"
              _buildHeroCard(context),
              const SizedBox(height: AppSpacing.md),

              // Prehab Countdown (if enrolled)
              _buildPrehabCountdown(context),
              const SizedBox(height: AppSpacing.md),

              // Medication Strip
              _buildMedicationStrip(context),
              const SizedBox(height: AppSpacing.md),

              // Comfort Card
              _buildComfortCard(context),
            ],
          ),
        ),
      ),

      // Quick-log FAB
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Navigate to quick log
        },
        backgroundColor: AppColors.sage,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Log'),
      ),

      // Bottom Navigation
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.sage,
        unselectedItemColor: AppColors.charcoalLight,
        currentIndex: 0,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Today'),
          BottomNavigationBarItem(icon: Icon(Icons.edit_note), label: 'Log'),
          BottomNavigationBarItem(icon: Icon(Icons.medication), label: 'Meds'),
          BottomNavigationBarItem(icon: Icon(Icons.school), label: 'Learn'),
          BottomNavigationBarItem(icon: Icon(Icons.more_horiz), label: 'More'),
        ],
      ),
    );
  }

  Widget _buildGreetingHeader(BuildContext context) {
    final hour = DateTime.now().hour;
    String greeting;
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$greeting, Ramesh',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: AppColors.teal,
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 4),
        Text(
          'Today, you matter.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.charcoalLight,
                fontStyle: FontStyle.italic,
              ),
        ),
      ],
    );
  }

  Widget _buildHeroCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.sage, AppColors.teal],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'How are you feeling?',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Last log: 3 hrs ago  •  Pain 4/10',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.8),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              // Navigate to symptom logger
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Log now'),
          ),
        ],
      ),
    );
  }

  Widget _buildPrehabCountdown(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.teal.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.teal.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.fitness_center, color: AppColors.teal, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Surgery in 8 days',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.teal,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 4),
                // Readiness bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: 0.72,
                    backgroundColor: AppColors.sageLightColor.withValues(alpha: 0.3),
                    valueColor: const AlwaysStoppedAnimation(AppColors.sage),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Readiness: 72% • Exercise: 85% • Nutrition: 70%',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.charcoalLight,
                        fontSize: 11,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationStrip(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Evening Medications',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.sage,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              Text(
                'View all',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.teal,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildMedRow('Morphine SR 30mg', '6:00 PM', false),
          const Divider(height: 16),
          _buildMedRow('Gabapentin 300mg', '6:00 PM', true),
          const Divider(height: 16),
          _buildMedRow('Dulcolax 5mg', '9:00 PM', false),
        ],
      ),
    );
  }

  Widget _buildMedRow(String name, String time, bool taken) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
              Text(time, style: TextStyle(fontSize: 12, color: AppColors.charcoalLight)),
            ],
          ),
        ),
        if (taken)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.sage,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text('Taken', style: TextStyle(color: Colors.white, fontSize: 12)),
          )
        else
          OutlinedButton(
            onPressed: () {},
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: AppColors.sage.withValues(alpha: 0.5)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              minimumSize: Size.zero,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Take', style: TextStyle(fontSize: 12)),
          ),
      ],
    );
  }

  Widget _buildComfortCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.lavenderLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.lavender.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '"A moment of calm is always within reach."',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.charcoalLight,
                        fontStyle: FontStyle.italic,
                      ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () {},
                  child: const Text('Try breathing →',
                      style: TextStyle(color: AppColors.sage)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
