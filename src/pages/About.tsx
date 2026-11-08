import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import AboutNotebook3D from '../components/AboutNotebook3D';
import { BUSINESS } from '../data/site';
import { folderPhotos } from '../data/gallery';
import portraitDesk from '../assets/team/portrait-desk.webp';
import { ArrowRight, Whatsapp, Icon } from '../components/Icons';
import { useContent } from '../i18n/context';

export default function About() {
  const { ABOUT_CHAPTERS, ABOUT_COPY: T, ABOUT_VALUES } = useContent();
  const storyRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* ---------- Hero: centred title over a paper-roll motif ---------- */}
      <section className="ab-hero">
        <div className="ab-hero-roll" aria-hidden />
        <div className="container ab-hero-in">
          <Reveal><span className="eyebrow">{T.hero.eyebrow}</span></Reveal>
          <Reveal delay={90}><h1>{T.hero.title}</h1></Reveal>
          <Reveal delay={150}><p className="ab-hero-sub">{T.hero.sub}</p></Reveal>
          <Reveal delay={210}>
            <p className="ab-hero-lede">{T.hero.lede}</p>
          </Reveal>
          <Reveal delay={270}>
            <a href="#our-story" className="ab-hero-scroll">{T.hero.cta} <span aria-hidden>↓</span></a>
          </Reveal>
        </div>
      </section>

      {/* ---------- Story: sticky 3D notebook + chapters ---------- */}
      <section className="ab-story" id="our-story" ref={storyRef}>
        <div className="container ab-story-in">
          <div className="ab-story-stage">
            <AboutNotebook3D pages={ABOUT_CHAPTERS} trackRef={storyRef} label={T.bookAria} />
            <p className="ab-story-hint">{T.story.hint}</p>
          </div>
          <div className="ab-story-chapters">
            <Reveal><span className="eyebrow">{T.story.eyebrow}</span></Reveal>
            <Reveal delay={90}><h2>{T.story.title}</h2></Reveal>
            {ABOUT_CHAPTERS.map((c) => (
              <article key={c.no} className="ab-chapter">
                <span className="ab-chapter-no">{c.no}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Since 1987 ---------- */}
      <section className="ab-since">
        <div className="container">
          <div className="ab-since-in">
            <div className="ab-since-year" aria-hidden="true">
              <span>{T.since.stamp}</span>
              <strong>{BUSINESS.established}</strong>
            </div>
            <div className="ab-since-copy">
              <span className="eyebrow">{T.since.eyebrow}</span>
              <h2>{T.since.title}</h2>
              {T.since.paragraphs.map((para) => <p key={para}>{para}</p>)}
            </div>
          </div>
          <ul className="ab-since-facts">
            {T.since.facts.map((f) => <li key={f.label}><strong>{f.value}</strong><span>{f.label}</span></li>)}
          </ul>
          <p className="ab-since-sign">“{BUSINESS.tagline}.”</p>
        </div>
      </section>

      {/* ---------- The people behind the books ---------- */}
      <section className="section ab-team">
        <div className="container ab-team-in">
          <div className="ab-team-copy">
            <Reveal><span className="eyebrow">{T.team.eyebrow}</span></Reveal>
            <Reveal delay={90}><h2>{T.team.title}</h2></Reveal>
            <Reveal delay={150}><p>{T.team.body}</p></Reveal>
          </div>
          <div className="ab-team-photos">
            <Reveal anim="pop" className="ab-team-portrait"><img src={portraitDesk} alt="" loading="lazy" /></Reveal>
          </div>
        </div>
      </section>

      {/* ---------- What we stand for: alternating image / text rows ---------- */}
      <section className="section ab-stand" id="quality">
        <div className="container">
          <div className="head head--center">
            <Reveal><span className="eyebrow">{T.values.eyebrow}</span></Reveal>
            <Reveal delay={90}><h2>{T.values.title}</h2></Reveal>
          </div>
          <div className="ab-rows">
            {ABOUT_VALUES.map((v, i) => (
              <Reveal key={v.t} anim={i % 2 ? 'right' : 'left'} className={`ab-row ${i % 2 ? 'ab-row--flip' : ''}`}>
                <div className="ab-row-art">
                  <span className="ab-row-no" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <img className="ab-row-photo" src={folderPhotos(v.photo).find((p) => p.shot === 'lifestyle')?.src} alt={v.t} loading="lazy" />
                </div>
                <div className="ab-row-copy">
                  <span className="pillar-ico"><Icon name={v.icon} /></span>
                  <span className="ab-row-kicker">{v.kicker}</span>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Quote band ---------- */}
      <section className="ab-quote">
        <div className="container">
          <Reveal>
            <figure>
              <span className="ab-quote-mark" aria-hidden>“</span>
              <blockquote>
                {T.quote.lines[0]}
                <br />
                {T.quote.lines[1]}
              </blockquote>
              <figcaption>{T.quote.by}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- Philosophy + sample offer split ---------- */}
      <section className="ab-split">
        <div className="ab-split-half ab-split-half--warm">
          <Reveal anim="left" className="ab-split-in">
            <span className="eyebrow">{T.philosophy.eyebrow}</span>
            <h2>“{BUSINESS.tagline}.”</h2>
            <p>{T.philosophy.body}</p>
          </Reveal>
        </div>
        <div className="ab-split-half ab-split-half--ink">
          <Reveal anim="right" className="ab-offer">
            <span className="ab-offer-tag">{T.offer.tag}</span>
            <h2>{T.offer.title}</h2>
            <p>{T.offer.body}</p>
            <div className="ab-offer-actions">
              <Link to="/contact" className="btn btn--primary">{T.offer.cta} <ArrowRight /></Link>
              <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="tlink"><Whatsapp size={16} /> {BUSINESS.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
