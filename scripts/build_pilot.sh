#!/usr/bin/env bash
# =============================================================================
# PalliCare Pilot Build Script
# Builds Android APK (release) and Next.js dashboard for AIIMS pilot deployment
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$ROOT_DIR/apps/mobile"
DASHBOARD_DIR="$ROOT_DIR/apps/dashboard"
OUTPUT_DIR="$ROOT_DIR/build/pilot"

echo "============================================="
echo "  PalliCare Pilot Build"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================="
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# ---------------------------------------------------------------------------
# Step 1: Flutter APK Build
# ---------------------------------------------------------------------------
echo "[1/4] Building Flutter APK (release)..."
cd "$MOBILE_DIR"

# Clean previous builds
flutter clean
flutter pub get

# Run code generation (freezed, json_serializable)
# dart run build_runner build --delete-conflicting-outputs

# Build release APK
flutter build apk --release --no-tree-shake-icons

# Copy APK to output
APK_PATH="$MOBILE_DIR/build/app/outputs/flutter-apk/app-release.apk"
if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" "$OUTPUT_DIR/PalliCare-pilot-$(date '+%Y%m%d').apk"
  echo "  APK built successfully!"
  echo "  Size: $(du -h "$APK_PATH" | cut -f1)"
else
  echo "  ERROR: APK not found at $APK_PATH"
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 2: Flutter Analyze
# ---------------------------------------------------------------------------
echo ""
echo "[2/4] Running Flutter analysis..."
flutter analyze --no-fatal-infos || echo "  Warnings found (non-fatal)"

# ---------------------------------------------------------------------------
# Step 3: Next.js Dashboard Build
# ---------------------------------------------------------------------------
echo ""
echo "[3/4] Building Next.js dashboard..."
cd "$DASHBOARD_DIR"

npm run build

echo "  Dashboard built successfully!"

# ---------------------------------------------------------------------------
# Step 4: Generate Build Report
# ---------------------------------------------------------------------------
echo ""
echo "[4/4] Generating build report..."

cat > "$OUTPUT_DIR/BUILD_REPORT.md" << REPORT
# PalliCare Pilot Build Report

| Field | Value |
|-------|-------|
| **Build Date** | $(date '+%Y-%m-%d %H:%M:%S') |
| **Git Commit** | $(cd "$ROOT_DIR" && git rev-parse --short HEAD) |
| **Git Branch** | $(cd "$ROOT_DIR" && git branch --show-current) |
| **Flutter Version** | $(flutter --version --machine 2>/dev/null | head -1 || echo "N/A") |
| **Node Version** | $(node --version) |
| **APK Size** | $(du -h "$OUTPUT_DIR"/PalliCare-pilot-*.apk 2>/dev/null | cut -f1 || echo "N/A") |

## Artifacts

- \`PalliCare-pilot-$(date '+%Y%m%d').apk\` — Android release build
- Dashboard: Deploy \`apps/dashboard/.next/\` to staging server

## Pre-Deployment Checklist

- [ ] APK tested on at least 3 Android devices
- [ ] Dashboard tested on Chrome and Firefox
- [ ] Offline mode verified (airplane mode test)
- [ ] Hindi language switching verified
- [ ] Pain logging flow tested end-to-end
- [ ] Medication tracker tested
- [ ] QR code generated for APK download
- [ ] Test accounts created for clinicians
REPORT

echo "  Build report saved to $OUTPUT_DIR/BUILD_REPORT.md"
echo ""
echo "============================================="
echo "  Build Complete!"
echo "  Output: $OUTPUT_DIR"
echo "============================================="
