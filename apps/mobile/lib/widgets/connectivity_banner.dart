import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/theme/app_colors.dart';
import '../services/sync_provider.dart';
import '../services/sync_service.dart';

/// Thin connectivity/sync status banner displayed at the top of scaffolds.
///
/// Shows:
/// - Green "Online" when connected with no pending items
/// - Amber "Offline (X pending)" when disconnected
/// - Blue "Syncing..." with progress when actively syncing
/// - Red "X conflicts" when sync conflicts exist
///
/// Tappable to force sync when online.
class ConnectivityBanner extends ConsumerWidget {
  const ConnectivityBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncState = ref.watch(syncProvider);

    // Don't show banner if online and nothing pending
    if (syncState.hasConnection &&
        !syncState.isSyncing &&
        syncState.pendingCount == 0 &&
        syncState.conflictCount == 0) {
      return const SizedBox.shrink();
    }

    return GestureDetector(
      onTap: () {
        if (syncState.hasConnection && !syncState.isSyncing) {
          ref.read(syncProvider.notifier).forceSync();
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        color: _backgroundColor(syncState),
        child: SafeArea(
          bottom: false,
          child: Row(
            children: [
              Icon(
                _icon(syncState),
                size: 16,
                color: _textColor(syncState),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _message(syncState),
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: _textColor(syncState),
                  ),
                ),
              ),
              if (syncState.isSyncing)
                SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _textColor(syncState),
                    ),
                  ),
                ),
              if (!syncState.isSyncing &&
                  syncState.hasConnection &&
                  syncState.pendingCount > 0)
                Icon(
                  Icons.sync,
                  size: 16,
                  color: _textColor(syncState),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Color _backgroundColor(SyncState state) {
    if (state.conflictCount > 0) return AppColors.error.withValues(alpha: 0.1);
    if (!state.hasConnection) return AppColors.warning.withValues(alpha: 0.15);
    if (state.isSyncing) return AppColors.info.withValues(alpha: 0.1);
    return AppColors.success.withValues(alpha: 0.1);
  }

  Color _textColor(SyncState state) {
    if (state.conflictCount > 0) return AppColors.error;
    if (!state.hasConnection) return AppColors.accentWarmDark;
    if (state.isSyncing) return AppColors.info;
    return AppColors.success;
  }

  IconData _icon(SyncState state) {
    if (state.conflictCount > 0) return Icons.warning_amber_rounded;
    if (!state.hasConnection) return Icons.cloud_off_rounded;
    if (state.isSyncing) return Icons.cloud_sync_rounded;
    return Icons.cloud_done_rounded;
  }

  String _message(SyncState state) {
    if (state.conflictCount > 0) {
      return '${state.conflictCount} sync conflict${state.conflictCount > 1 ? 's' : ''} — tap to review';
    }
    if (!state.hasConnection) {
      if (state.pendingCount > 0) {
        return 'Offline — ${state.pendingCount} item${state.pendingCount > 1 ? 's' : ''} pending';
      }
      return 'Offline — data saved locally';
    }
    if (state.isSyncing) {
      return 'Syncing ${state.pendingCount} item${state.pendingCount > 1 ? 's' : ''}...';
    }
    if (state.pendingCount > 0) {
      return '${state.pendingCount} pending — tap to sync';
    }
    return 'All data synced';
  }
}
