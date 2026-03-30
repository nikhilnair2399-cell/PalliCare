import { clsx } from 'clsx';

/**
 * Patient page loading skeleton — warm shimmer effect on cream background.
 * Use <PatientSkeleton /> in Suspense boundaries or while data loads.
 */

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-charcoal/[0.06]',
        className,
      )}
    />
  );
}

export function PatientPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Heading */}
      <div>
        <Bone className="h-8 w-48" />
        <Bone className="mt-2 h-5 w-72" />
      </div>

      {/* Hero card */}
      <Bone className="h-40 w-full rounded-2xl" />

      {/* Content cards */}
      <Bone className="h-52 w-full rounded-2xl" />
      <Bone className="h-32 w-full rounded-2xl" />

      {/* Two small cards */}
      <div className="grid grid-cols-2 gap-4">
        <Bone className="h-24 rounded-2xl" />
        <Bone className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}

export function PatientCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 space-y-4">
      <Bone className="h-5 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-3/4" />
            <Bone className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PatientListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4">
          <Bone className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-2/3" />
            <Bone className="h-3 w-1/3" />
          </div>
          <Bone className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
