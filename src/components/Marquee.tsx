interface Props {
  items: string[];
  /** Seconds for one full loop */
  speed?: number;
  reverse?: boolean;
}

/** Infinite ticker. The list is duplicated so the -50% translate loops seamlessly. */
export default function Marquee({ items, speed = 34, reverse = false }: Props) {
  const run = [...items, ...items];

  return (
    <div className="mq" aria-hidden>
      <div
        className="mq-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {run.map((t, i) => (
          <span className="mq-item" key={i}>
            {t}
            <i className="mq-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
