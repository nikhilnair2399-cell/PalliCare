/**
 * PalliCare — Role-Based UI Configuration
 *
 * Single source of truth for what each clinician sub-role can see and do.
 * To add a new role, add an entry to ROLE_CONFIGS below.
 */

// ─── Sidebar Navigation Item Keys ───────────────────────────────────
export type SidebarItemKey =
  | 'dashboard'
  | 'patients'
  | 'alerts'
  | 'notes'
  | 'care_plans'
  | 'messages'
  | 'mdt'
  | 'analytics'
  | 'community'
  | 'medication_db'
  | 'settings';

// ─── Dashboard Widget Keys ──────────────────────────────────────────
export type DashboardWidgetKey =
  | 'stat_cards'
  | 'trend_sparklines'
  | 'schedule'
  | 'bed_occupancy'
  | 'quality_compliance'
  | 'opioid_census'
  | 'workload_heatmap'
  | 'critical_next_steps'
  | 'patient_list'
  | 'alerts_preview'
  | 'shift_snapshot'
  // Psychologist-specific
  | 'mood_trends'
  | 'counseling_sessions'
  | 'caregiver_distress_overview';

// ─── Stat Card Keys ─────────────────────────────────────────────────
export type StatCardKey =
  | 'active_patients'
  | 'critical_alerts'
  | 'avg_pain'
  | 'medication_adherence'
  // Psychologist-specific
  | 'mood_trends_summary'
  | 'counseling_scheduled'
  | 'caregiver_distress';

// ─── Patient Detail Tab Keys ────────────────────────────────────────
export type PatientTabKey =
  | 'care_plan'
  | 'caregivers'
  | 'education'
  | 'messages'
  | 'vitals'
  | 'documents'
  | 'mood_assessment';

// ─── Capability Flags ───────────────────────────────────────────────
export interface RoleCapabilities {
  canPrescribe: boolean;
  canEditCarePlans: boolean;
  canAdministerMeds: boolean;
  canViewAnalytics: boolean;
  canViewOpioidCensus: boolean;
  canViewMDT: boolean;
  canAccessPsychAssessment: boolean;
}

// ─── Role Configuration Interface ───────────────────────────────────
export interface RoleConfig {
  label: string;
  sidebarItems: SidebarItemKey[];
  dashboardWidgets: DashboardWidgetKey[];
  statCards: StatCardKey[];
  patientTabs: PatientTabKey[];
  defaultPatientTab: PatientTabKey;
  capabilities: RoleCapabilities;
}

// ─── Role Configurations ────────────────────────────────────────────

// ─── Full access: all sidebar items, all widgets, all tabs ─────────
const ALL_SIDEBAR_ITEMS: SidebarItemKey[] = [
  'dashboard', 'patients', 'alerts', 'notes', 'care_plans',
  'messages', 'mdt', 'analytics', 'community', 'medication_db', 'settings',
];

const ALL_DASHBOARD_WIDGETS: DashboardWidgetKey[] = [
  'stat_cards', 'trend_sparklines', 'schedule', 'bed_occupancy',
  'quality_compliance', 'opioid_census', 'workload_heatmap',
  'critical_next_steps', 'patient_list', 'alerts_preview', 'shift_snapshot',
  // Psychologist widgets — available to all roles for MDT visibility
  'mood_trends', 'counseling_sessions', 'caregiver_distress_overview',
];

const ALL_STAT_CARDS: StatCardKey[] = [
  'active_patients', 'critical_alerts', 'avg_pain', 'medication_adherence',
  'mood_trends_summary', 'counseling_scheduled', 'caregiver_distress',
];

const ALL_PATIENT_TABS: PatientTabKey[] = [
  'care_plan', 'caregivers', 'vitals', 'documents', 'education', 'messages', 'mood_assessment',
];

const FULL_CAPABILITIES: RoleCapabilities = {
  canPrescribe: true,
  canEditCarePlans: true,
  canAdministerMeds: true,
  canViewAnalytics: true,
  canViewOpioidCensus: true,
  canViewMDT: true,
  canAccessPsychAssessment: true,
};

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  physician: {
    label: 'Physician',
    sidebarItems: ALL_SIDEBAR_ITEMS,
    dashboardWidgets: ALL_DASHBOARD_WIDGETS,
    statCards: ALL_STAT_CARDS,
    patientTabs: ALL_PATIENT_TABS,
    defaultPatientTab: 'care_plan',
    capabilities: FULL_CAPABILITIES,
  },

  nurse: {
    label: 'Nurse',
    sidebarItems: ALL_SIDEBAR_ITEMS,
    dashboardWidgets: ALL_DASHBOARD_WIDGETS,
    statCards: ALL_STAT_CARDS,
    patientTabs: ALL_PATIENT_TABS,
    defaultPatientTab: 'vitals',
    capabilities: FULL_CAPABILITIES,
  },

  psychologist: {
    label: 'Psychologist',
    sidebarItems: ALL_SIDEBAR_ITEMS,
    dashboardWidgets: ALL_DASHBOARD_WIDGETS,
    statCards: ALL_STAT_CARDS,
    patientTabs: ALL_PATIENT_TABS,
    defaultPatientTab: 'mood_assessment',
    capabilities: FULL_CAPABILITIES,
  },
};

// ─── Fallback Config (minimal read-only) ────────────────────────────

const FALLBACK_CONFIG: RoleConfig = {
  label: 'Clinician',
  sidebarItems: ALL_SIDEBAR_ITEMS,
  dashboardWidgets: ALL_DASHBOARD_WIDGETS,
  statCards: ALL_STAT_CARDS,
  patientTabs: ALL_PATIENT_TABS,
  defaultPatientTab: 'care_plan',
  capabilities: FULL_CAPABILITIES,
};

// ─── Accessor ───────────────────────────────────────────────────────

export function getRoleConfig(clinicianRole?: string | null): RoleConfig {
  if (!clinicianRole) return FALLBACK_CONFIG;
  return ROLE_CONFIGS[clinicianRole] ?? FALLBACK_CONFIG;
}

// ─── Helpers ────────────────────────────────────────────────────────

export function isDashboardWidgetAllowed(
  clinicianRole: string | undefined | null,
  widgetKey: DashboardWidgetKey,
): boolean {
  return getRoleConfig(clinicianRole).dashboardWidgets.includes(widgetKey);
}

export function isPatientTabAllowed(
  clinicianRole: string | undefined | null,
  tabKey: PatientTabKey,
): boolean {
  return getRoleConfig(clinicianRole).patientTabs.includes(tabKey);
}

// ─── Route Protection ───────────────────────────────────────────────

export const ROUTE_TO_SIDEBAR_KEY: Record<string, SidebarItemKey> = {
  '/':              'dashboard',
  '/patients':      'patients',
  '/alerts':        'alerts',
  '/notes':         'notes',
  '/care-plans':    'care_plans',
  '/messages':      'messages',
  '/mdt':           'mdt',
  '/analytics':     'analytics',
  '/community':     'community',
  '/medication-db': 'medication_db',
  '/settings':      'settings',
};

export function isRouteAllowed(
  clinicianRole: string | undefined | null,
  pathname: string,
): boolean {
  // Patient detail pages are allowed if 'patients' sidebar item is allowed
  if (pathname.startsWith('/patients/')) {
    return getRoleConfig(clinicianRole).sidebarItems.includes('patients');
  }
  const key = ROUTE_TO_SIDEBAR_KEY[pathname];
  if (!key) return true; // Unknown routes default to allowed
  return getRoleConfig(clinicianRole).sidebarItems.includes(key);
}
