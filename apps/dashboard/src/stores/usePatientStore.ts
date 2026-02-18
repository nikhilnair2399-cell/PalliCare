import { create } from 'zustand';

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  latestPainScore: number;
  painTrend: 'up' | 'down' | 'stable';
  lastLogAt: string;
  status: 'stable' | 'monitoring' | 'critical';
}

interface PatientStore {
  /** All loaded patients */
  patients: PatientSummary[];
  setPatients: (patients: PatientSummary[]) => void;

  /** Currently selected patient */
  selectedPatientId: string | null;
  selectPatient: (id: string | null) => void;

  /** Filters */
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  /** Computed: filtered patients */
  filteredPatients: () => PatientSummary[];
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),

  selectedPatientId: null,
  selectPatient: (id) => set({ selectedPatientId: id }),

  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  filteredPatients: () => {
    const { patients, statusFilter, searchQuery } = get();
    let filtered = patients;

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.diagnosis.toLowerCase().includes(q),
      );
    }

    // Sort: critical first, then by pain score descending
    return filtered.sort((a, b) => {
      const statusOrder = { critical: 0, monitoring: 1, stable: 2 };
      const statusDiff =
        (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
      if (statusDiff !== 0) return statusDiff;
      return b.latestPainScore - a.latestPainScore;
    });
  },
}));
