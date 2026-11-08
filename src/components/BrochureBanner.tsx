import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import flatlay from '../assets/brochure-flatlay.jpg';
import { useContent } from '../i18n/context';

/** Full-width catalogue call-out over a flat-lay of our own covers. */
export default function BrochureBanner() {
  const { HOME_COPY: T } = useContent();
  return (
    <section className="brochure" style={{ '--brochure-img': `url(${flatlay})` } as React.CSSProperties}>
      <div className="container brochure-in">
        <Reveal><h2>{T.brochure.title}</h2></Reveal>
        <Reveal delay={90}><p>{T.brochure.lede}</p></Reveal>
        <Reveal delay={160}>
          <div className="brochure-btns">
            <Link to="/catalogue" className="btn brochure-btn">{T.brochure.view}</Link>
            <Link to="/catalogue?print=1" className="btn brochure-btn brochure-btn--solid">{T.brochure.download}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
