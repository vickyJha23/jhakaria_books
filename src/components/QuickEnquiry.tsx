import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { BUSINESS } from '../data/site';
import { ArrowRight, Check, Phone, Whatsapp } from './Icons';

/**
 * Short "Let's connect" form for the foot of the home page, after Sundaram's
 * consultation block. Like the Contact page there is no server, so the
 * enquiry is composed into a WhatsApp message.
 */
export default function QuickEnquiry() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      'Quick enquiry from the website',
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.city && `City: ${form.city}`,
      form.message && '',
      form.message && form.message,
    ].filter(Boolean);
    window.open(`${BUSINESS.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  return (
    <section className="cta connect">
      <div className="container connect-in">
        <div className="connect-copy">
          <Reveal><span className="eyebrow">Let's connect</span></Reveal>
          <Reveal delay={90}>
            <h2>Looking for a notebook supplier you can re-order from every year?</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="lede">
              Tell us your sizes, page counts and quantities. We will come back with a slab-wise
              rate and a realistic dispatch date — usually the same day.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <ul className="connect-ticks">
              {['Free samples for new distributors', 'Mix categories to reach the next slab', 'Pan-India dispatch'].map((t) => (
                <li key={t}><Check size={16} /> {t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={260}>
            <div className="hero-btns">
              <a href={BUSINESS.phoneHref} className="btn btn--ghost">
                <Phone size={16} /> Call {BUSINESS.phone}
              </a>
              <Link to="/contact" className="btn btn--ghost">
                Full distributor form <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal anim="right" delay={120}>
          <form className="cform connect-form" onSubmit={submit}>
            <h3>Get a quote on WhatsApp</h3>
            <div className="frow">
              <label className="field">
                <span>Your name</span>
                <input required value={form.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label className="field">
                <span>Phone</span>
                <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </label>
            </div>
            <label className="field">
              <span>City</span>
              <input value={form.city} onChange={set('city')} autoComplete="address-level2" />
            </label>
            <label className="field">
              <span>What do you need?</span>
              <textarea
                rows={3}
                value={form.message}
                onChange={set('message')}
                placeholder="e.g. 50 bundles A4 172 pages, 30 bundles long books"
              />
            </label>
            <button type="submit" className="btn btn--primary btn--block">
              <Whatsapp size={17} /> Send enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
