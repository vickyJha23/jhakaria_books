import { Link } from 'react-router-dom';
import { ArrowRight } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="section nf ruled-fade">
      <div className="container center">
        <span className="eyebrow intro">Error 404</span>
        <h1 className="intro" style={{ '--d': '120ms' } as React.CSSProperties}>
          This page is off the ruled line
        </h1>
        <p className="lede intro" style={{ '--d': '220ms', margin: '18px auto 30px' } as React.CSSProperties}>
          The page you were after does not exist. The product range is the best place to pick up
          where you left off.
        </p>
        <Link to="/products" className="btn btn--primary intro" style={{ '--d': '300ms' } as React.CSSProperties}>
          Browse products <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
