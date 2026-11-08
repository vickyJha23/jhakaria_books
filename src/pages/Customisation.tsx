import { useState } from 'react';
import Reveal from '../components/Reveal';
import NotebookArt from '../components/NotebookArt';
import { BUSINESS, bySlug } from '../data/site';
import type { Product } from '../data/site';
import { ArrowRight, Check, Whatsapp, Icon } from '../components/Icons';
import { useContent } from '../i18n/context';
import { PRICE_ITEMS } from '../data/priceList';
import { artFor } from '../data/shop';
import { folderPhotos } from '../data/gallery';

/** Photo folders of custom jobs, in the order of CUSTOM_COPY.made.items. */
const MADE_FOLDERS = ['06-bharuchi-patel-trust-custom-book', '07-al-nadi-ul-falah-school-custom-book'];

/** Cover palette per buyer card: schools, corporates, private label, parties, NGOs, shops. */
const SEGMENT_THEMES = ['green', 'slate', 'plum', 'saffron', 'emerald', 'crimson'];

export default function Customisation() {
  const { CUSTOM_COPY: T, CUSTOM_ADVANTAGES, CUSTOM_FIELDS, CUSTOM_SEGMENTS, CUSTOM_THEMES, ORG_TYPES } = useContent();
  const [theme, setTheme] = useState(CUSTOM_THEMES[0]);
  const [form, setForm] = useState({ name: '', phone: '', city: '', org: '', cover: '', size: '', ruling: '', pages: '', qty: '', mrp: '', by: '', message: '' });
  const [files, setFiles] = useState<string[]>([]);
  const [customise, setCustomise] = useState<string[]>(() => [CUSTOM_FIELDS[0]]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleCustom = (c: string) => setCustomise((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  /** No server behind the site — the requirement is composed into a WhatsApp message. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      'Custom / bulk notebook enquiry from the website',
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.city && `City: ${form.city}`,
      form.org && `Organisation: ${form.org}`,
      form.cover && `Name on cover: ${form.cover}`,
      `Cover colour: ${theme.label}`,
      form.size && `Book size: ${form.size}`,
      form.ruling && `Ruling: ${form.ruling}`,
      form.pages && `Pages: ${form.pages}`,
      form.qty && `Quantity: ${form.qty}`,
      form.mrp && `MRP to print: ${form.mrp}`,
      form.by && `Needed by: ${form.by}`,
      customise.length > 0 && `Customise: ${customise.join(', ')}`,
      files.length > 0 && `Design files (attaching in this chat): ${files.join(', ')}`,
      form.message && '',
      form.message && form.message,
    ].filter(Boolean);
    window.open(`${BUSINESS.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  // Hero pair: our standard book beside the same book carrying a customer's name.
  const base = bySlug('long-note-book');
  const stock = artFor(PRICE_ITEMS.find((i) => i.id === 'premium-a4')!);
  const custom: Product = { ...base, slug: 'custom-cover-sample', art: theme.art, photo: undefined, photoBack: undefined };
  // The form's live preview: the chosen colour, the name typed for the cover and the size / pages picked.
  const preview: Product = { ...custom, slug: 'custom-cover-preview' };
  const previewLabel = {
    title: form.cover.trim() || T.hero.sampleTitle,
    sub: [form.size, form.pages].filter(Boolean).join(' · ') || T.hero.sampleSub,
  };

  return (
    <>
      {/* Hero: our book next to the same book with the buyer's name on it */}
      <section className="chero">
        <div className="container chero-in">
          <div className="chero-copy">
            <span className="eyebrow intro" style={{ '--d': '60ms' } as React.CSSProperties}>{T.head.eyebrow}</span>
            <h1 className="intro" style={{ '--d': '140ms' } as React.CSSProperties}>{T.head.title}</h1>
            <p className="lede intro" style={{ '--d': '230ms' } as React.CSSProperties}>{T.head.lede}</p>
            <div className="hero-btns intro" style={{ '--d': '320ms' } as React.CSSProperties}>
              <a href="#bulk-enquiry" className="btn btn--primary">{T.segments.cta} <ArrowRight /></a>
              <a href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(T.themes.whatsappMessage)}`} target="_blank" rel="noreferrer" className="btn chero-wa">
                <Whatsapp size={17} /> {T.themes.logoCta}
              </a>
            </div>
          </div>

          <div className="chero-art" aria-hidden="true">
            <figure className="chero-book chero-book--ours">
              <figcaption className="chero-tag">
                {T.hero.ours}
                <svg viewBox="0 0 60 50" className="chero-arrow"><path d="M8 6c18 2 34 12 38 34" /><path d="M38 34l8 7 4-10" /></svg>
              </figcaption>
              <NotebookArt product={stock} height="clamp(220px, 26vw, 330px)" eager />
            </figure>
            <figure className="chero-book chero-book--yours" key={theme.id}>
              <figcaption className="chero-tag">
                {T.hero.yours}
                <svg viewBox="0 0 60 50" className="chero-arrow"><path d="M52 6C34 8 18 18 14 40" /><path d="M22 34l-8 7-4-10" /></svg>
              </figcaption>
              <NotebookArt product={custom} height="clamp(240px, 29vw, 360px)" label={{ title: T.hero.sampleTitle, sub: T.hero.sampleSub }} eager />
            </figure>
            <span className="chero-shelf" />
          </div>
        </div>
      </section>

      {/* Who we make custom books for */}
      <section className="section section--tight">
        <div className="container">
          <div className="head head--center">
            <Reveal><span className="eyebrow">{T.segments.eyebrow}</span></Reveal>
            <Reveal delay={90}><h2>{T.segments.title}</h2></Reveal>
          </div>
          <div className="segments">
            {CUSTOM_SEGMENTS.map((sg, i) => {
              // Each buyer gets its own cover colour, taken from the theme palettes further down the page.
              const art = CUSTOM_THEMES.find((t) => t.id === SEGMENT_THEMES[i % SEGMENT_THEMES.length])!.art;
              return (
                <Reveal key={sg.t} delay={(i % 3) * 80}>
                  <article className="segment" style={{ '--seg': art.cover, '--seg-band': art.band, '--seg-accent': art.accent } as React.CSSProperties}>
                    <span className="segment-spine" aria-hidden="true" />
                    <div className="segment-plate">
                      <span className="segment-ico"><Icon name={sg.icon} /></span>
                      <h3>{sg.t}</h3>
                    </div>
                    <p>{sg.d}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real custom jobs: the cover, and the book in use */}
      <section className="section section--tight section--paper">
        <div className="container">
          <div className="head head--center">
            <Reveal><span className="eyebrow">{T.made.eyebrow}</span></Reveal>
            <Reveal delay={90}><h2>{T.made.title}</h2></Reveal>
          </div>
          <div className="made-grid">
            {T.made.items.map((m, i) => {
              const photos = folderPhotos(MADE_FOLDERS[i]);
              const front = photos.find((p) => p.shot === 'front');
              const inUse = photos.find((p) => p.shot === 'lifestyle');
              return (
                <Reveal key={m.name} delay={i * 90}>
                  <figure className="made-card">
                    <div className="made-shots">
                      {front && <img src={front.src} alt={m.name} loading="lazy" />}
                      {inUse && <img src={inUse.thumb} alt="" loading="lazy" />}
                    </div>
                    <figcaption><strong>{m.name}</strong><span>{m.place}</span></figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom / bulk enquiry */}
      <section className="section bulk" id="bulk-enquiry">
        <div className="container contact-grid">
          <Reveal anim="left">
            <form className="cform cform--cover" onSubmit={submit}>
              <div>
                <span className="eyebrow">{T.form.eyebrow}</span>
                <h2 className="bulk-title">{T.form.title}</h2>
                <p className="cform-note">{T.form.note}</p>
              </div>
              <div className="frow">
                <label className="field"><span>{T.form.name}</span><input required value={form.name} onChange={set('name')} autoComplete="name" /></label>
                <label className="field"><span>{T.form.phone}</span><input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>
              </div>
              <div className="frow">
                <label className="field"><span>{T.form.city}</span><input required value={form.city} onChange={set('city')} autoComplete="address-level2" /></label>
                <label className="field">
                  <span>{T.form.org}</span>
                  <select value={form.org} onChange={set('org')}>
                    <option value="">{T.form.select}</option>
                    {ORG_TYPES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>
              <div className="frow">
                <label className="field"><span>{T.form.coverText}</span><input value={form.cover} onChange={set('cover')} placeholder={T.form.coverTextPlaceholder} maxLength={28} /></label>
                <div className="field">
                  <span>{T.form.colour} · <b>{theme.label}</b></span>
                  <div className="cover-swatches" role="radiogroup" aria-label={T.form.colour}>
                    {CUSTOM_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={theme.id === t.id}
                        aria-label={t.label}
                        title={t.label}
                        className={theme.id === t.id ? 'is-active' : ''}
                        style={{ background: t.art.cover }}
                        onClick={() => setTheme(t)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="frow">
                <label className="field">
                  <span>{T.form.size}</span>
                  <select value={form.size} onChange={set('size')}>
                    <option value="">{T.form.select}</option>
                    {T.form.sizes.map((o) => <option key={o}>{o}</option>)}
                    <option>{T.form.notSure}</option>
                  </select>
                </label>
                <label className="field">
                  <span>{T.form.ruling}</span>
                  <select value={form.ruling} onChange={set('ruling')}>
                    <option value="">{T.form.select}</option>
                    {T.form.rulings.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>
              <div className="frow">
                <label className="field"><span>{T.form.pages}</span><input inputMode="numeric" value={form.pages} onChange={set('pages')} placeholder={T.form.pagesPlaceholder} /></label>
                <label className="field">
                  <span>{T.form.qty}</span>
                  <input value={form.qty} onChange={set('qty')} placeholder={T.form.qtyPlaceholder} />
                  <small className="field-note">{T.form.qtyNote}</small>
                </label>
              </div>
              <div className="frow">
                <label className="field"><span>{T.form.mrp}</span><input inputMode="decimal" value={form.mrp} onChange={set('mrp')} placeholder={T.form.mrpPlaceholder} /></label>
                <label className="field"><span>{T.form.by}</span><input type="date" value={form.by} onChange={set('by')} /></label>
              </div>
              <fieldset className="bulk-options">
                <legend>{T.form.customise}</legend>
                {CUSTOM_FIELDS.map((c) => (
                  <label key={c} className={`bulk-option ${customise.includes(c) ? 'is-on' : ''}`}>
                    <input type="checkbox" checked={customise.includes(c)} onChange={() => toggleCustom(c)} />
                    {c}
                  </label>
                ))}
              </fieldset>
              <div className="field">
                <span>{T.form.design}</span>
                {/* The file input covers the whole box, so a click or a drop lands on it. */}
                <label className={`dropzone ${files.length ? 'has-files' : ''}`}>
                  <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf,.cdr,.ai,.svg" onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 10).map((f) => f.name))} />
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
                  <strong>{files.length ? files.join(', ') : T.form.designDrop}</strong>
                  <small>{T.form.designHint}</small>
                </label>
                {files.length > 0 && <small className="field-note">{T.form.designNote}</small>}
              </div>
              <label className="field"><span>{T.form.details}</span><textarea rows={4} value={form.message} onChange={set('message')} placeholder={T.form.detailsPlaceholder} /></label>
              <button type="submit" className="btn btn--primary btn--block"><Whatsapp size={17} /> {T.form.submit}</button>
              <p className="cform-alt">{T.form.callPrompt} <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a></p>
            </form>
          </Reveal>

          <div className="cside cside--sticky">
            <Reveal anim="right">
              <div className="ccard cpreview">
                <h3>{T.form.previewTitle}</h3>
                <div className="cpreview-book" key={theme.id}>
                  <NotebookArt product={preview} height={300} label={previewLabel} />
                </div>
                <span className="preview-note">{T.themes.previewNote}</span>
              </div>
            </Reveal>
            <Reveal anim="right" delay={90}>
              <div className="ccard">
                <h3>{T.side.advantageTitle}</h3>
                <ul className="ticklist">
                  {CUSTOM_ADVANTAGES.map((t) => (
                    <li key={t}><Check size={17} /> {t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
