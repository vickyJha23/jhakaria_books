import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS } from '../data/site';
import { ArrowRight, Check, Phone, Whatsapp } from './Icons';
import { useContent } from '../i18n/context';

/**
 * Compact quote band for the foot of the home page: a short pitch beside a
 * one-row form. There is no server, so the enquiry is composed into a WhatsApp message.
 */
export default function QuickEnquiry() {
  const { HOME_COPY: T, QUICK_ENQUIRY_TICKS } = useContent();
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
    <section className="connect">
      <div className="container connect-in">
        <div className="connect-copy">
          <span className="eyebrow">{T.enquiry.eyebrow}</span>
          <h2>{T.enquiry.title}</h2>
          <p>{T.enquiry.lede}</p>
          <ul className="connect-ticks">
            {QUICK_ENQUIRY_TICKS.map((t) => <li key={t}><Check size={14} /> {t}</li>)}
          </ul>
        </div>

        <form className="connect-form" onSubmit={submit}>
          <input required value={form.name} onChange={set('name')} autoComplete="name" placeholder={T.enquiry.fields.name} aria-label={T.enquiry.fields.name} />
          <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder={T.enquiry.fields.phone} aria-label={T.enquiry.fields.phone} />
          <input value={form.city} onChange={set('city')} autoComplete="address-level2" placeholder={T.enquiry.fields.city} aria-label={T.enquiry.fields.city} />
          <input className="connect-need" value={form.message} onChange={set('message')} placeholder={T.enquiry.placeholder} aria-label={T.enquiry.fields.message} />
          <button type="submit" className="btn btn--primary"><Whatsapp size={17} /> {T.enquiry.submit}</button>
          <span className="connect-alt">
            <a href={BUSINESS.phoneHref}><Phone size={14} /> {BUSINESS.phone}</a>
            <Link to="/contact">{T.enquiry.formCta} <ArrowRight size={14} /></Link>
          </span>
        </form>
      </div>
    </section>
  );
}
