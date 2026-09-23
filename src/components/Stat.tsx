import { useCountUp, useInView } from '../hooks/useReveal';

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}

/** Number that counts up the first time it scrolls into view. */
export default function Stat({ value, suffix = '', prefix = '', label, delay = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const n = useCountUp(value, inView, 1700);

  return (
    <div
      ref={ref}
      className={`stat reveal ${inView ? 'is-in' : ''}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      <span className="stat-n">
        {prefix}
        {n.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="stat-l">{label}</span>
    </div>
  );
}
