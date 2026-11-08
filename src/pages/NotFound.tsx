import { Link } from 'react-router-dom';
import { ArrowRight } from '../components/Icons';
import { useContent } from '../i18n/context';

export default function NotFound() {
  const { NOT_FOUND_COPY: T } = useContent();
  return (
    <section className="section nf ruled-fade">
      <div className="container center">
        <span className="eyebrow intro">{T.eyebrow}</span>
        <h1 className="intro" style={{ '--d': '120ms' } as React.CSSProperties}>
          {T.title}
        </h1>
        <p className="lede intro" style={{ '--d': '220ms', margin: '18px auto 30px' } as React.CSSProperties}>
          {T.lede}
        </p>
        <Link to="/products" className="btn btn--primary intro" style={{ '--d': '300ms' } as React.CSSProperties}>
          {T.cta} <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
