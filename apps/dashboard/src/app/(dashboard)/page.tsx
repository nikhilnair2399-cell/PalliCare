import { StatCard } from '@/components/ui/StatCard';
import { PatientListPreview } from '@/components/patients/PatientListPreview';
import { AlertsPreview } from '@/components/ui/AlertsPreview';
import { PrehabOverview } from '@/components/prehab/PrehabOverview';
import { Users, AlertTriangle, Activity, Dumbbell } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">
          Clinician Dashboard
        </h1>
        <p className="text-sm text-charcoal-light">
          Real-time patient monitoring and clinical decision support
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value="24"
          change="+3 this week"
          changeType="increase"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Critical Alerts"
          value="3"
          change="2 unacknowledged"
          changeType="alert"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Pain Score"
          value="4.2"
          change="-0.8 from last week"
          changeType="decrease"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Prehab Patients"
          value="8"
          change="5 surgery < 14 days"
          changeType="info"
          icon={<Dumbbell className="h-5 w-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient List — 2 cols */}
        <div className="lg:col-span-2">
          <PatientListPreview />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsPreview />
          <PrehabOverview />
        </div>
      </div>
    </div>
  );
}
