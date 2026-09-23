interface Props {
  eyebrow: string;
  title: string;
  lede?: string;
}

/** Inner-page banner with the ruled-paper wash. */
export default function PageHead({ eyebrow, title, lede }: Props) {
  return (
    <section className="phead ruled-fade">
      <div className="phead-glow" aria-hidden />
      <div className="container phead-in">
        <span className="eyebrow intro" style={{ '--d': '60ms' } as React.CSSProperties}>
          {eyebrow}
        </span>
        <h1 className="intro" style={{ '--d': '140ms' } as React.CSSProperties}>
          {title}
        </h1>
        {lede && (
          <p className="lede intro" style={{ '--d': '230ms' } as React.CSSProperties}>
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
