import type { ReactNode } from 'react';

interface ComfortCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'sage' | 'teal' | 'lavender' | 'amber' | 'terra';
}

const colorMap: Record<string, { iconBg: string; iconColor: string; valueColor: string }> = {
  sage:     { iconBg: 'rgba(123,166,140,0.12)', iconColor: '#7BA68C', valueColor: '#5A8A6E' },
  teal:     { iconBg: 'rgba(42,107,107,0.08)',  iconColor: '#2A6B6B', valueColor: '#2A6B6B' },
  lavender: { iconBg: 'rgba(217,212,231,0.35)', iconColor: '#4A4A4A', valueColor: '#2D2D2D' },
  amber:    { iconBg: 'rgba(232,168,56,0.10)',  iconColor: '#E8A838', valueColor: '#E8A838' },
  terra:    { iconBg: 'rgba(212,133,107,0.10)', iconColor: '#D4856B', valueColor: '#D4856B' },
};

export function ComfortCard({
  title,
  value,
  subtitle,
  icon,
  color = 'sage',
}: ComfortCardProps) {
  const styles = colorMap[color] || colorMap.sage;

  return (
    <div
      className="rounded-xl bg-white p-5 transition-shadow hover:shadow-md"
      style={{ border: '1px solid rgba(168,203,181,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium" style={{ color: '#4A4A4A' }}>
            {title}
          </p>
          <p className="mt-1.5 font-heading text-[24px] font-bold" style={{ color: styles.valueColor }}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-[12px]" style={{ color: '#4A4A4A' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: styles.iconBg, color: styles.iconColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
