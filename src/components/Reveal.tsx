import type { ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useReveal';

type Anim = 'up' | 'left' | 'right' | 'pop';

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds */
  delay?: number;
  anim?: Anim;
  as?: ElementType;
  className?: string;
}

/** Wraps children in an element that animates in the first time it is seen. */
export default function Reveal({
  children,
  delay = 0,
  anim = 'up',
  as: Tag = 'div',
  className = '',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-anim={anim}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
