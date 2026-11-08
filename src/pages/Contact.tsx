import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { BUSINESS, PRODUCTS } from '../data/site';
import { Phone, Mail, Pin, Whatsapp, ArrowRight, Check } from '../components/Icons';
import { useContent } from '../i18n/context';

const PRODUCT_NAMES = PRODUCTS.map((p) => p.name);

export default function Contact() {
  const { CONTACT_COPY: T, CONTACT_AUDIENCES, CONTACT_NEXT_STEPS, FAQS } = useContent();
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({
    name: '',
    firm: '',
    businessType: '',
    city: '',
    phone: '',
    product: '',
    qty: '',
    message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  /**
   * There is no server behind this site, so the enquiry is composed into a
   * WhatsApp message and handed to the customer's WhatsApp client to send.
   */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      'New distributor enquiry from the website',
      '',
      `Name: ${form.name}`,
      form.firm && `Firm: ${form.firm}`,
      form.businessType && `Business type: ${form.businessType}`,
      form.city && `City: ${form.city}`,
      `Phone: ${form.phone}`,
      form.product && `Product: ${form.product}`,
      form.qty && `Approx. quantity: ${form.qty}`,
      form.message && '',
      form.message && form.message,
    ].filter(Boolean);

    window.open(`${BUSINESS.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  return (
    <>
      <PageHead
        eyebrow={T.head.eyebrow}
        title={T.head.title}
        lede={T.head.lede}
      />

      <section className="section section--tight partner-audience">
        <div className="container">
          <div className="head head--center">
            <span className="eyebrow">{T.audiences.eyebrow}</span>
            <h2>{T.audiences.title}</h2>
            <p className="lede">{T.audiences.lede}</p>
          </div>
          <div className="partner-audience-grid">
            {CONTACT_AUDIENCES.map(({ title, body }, i) => (
              <article className="partner-audience-card" key={title}>
                <span>0{i + 1}</span><h3>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container contact-grid">
          {/* Form */}
          <Reveal anim="left">
            <form className="cform" onSubmit={submit}>
              <h2>{T.form.title}</h2>
              <p className="cform-note">{T.form.note}</p>

              <div className="frow">
                <label className="field">
                  <span>{T.form.name}</span>
                  <input required value={form.name} onChange={set('name')} placeholder={T.form.namePlaceholder} />
                </label>
                <label className="field">
                  <span>{T.form.firm}</span>
                  <input value={form.firm} onChange={set('firm')} placeholder={T.form.firmPlaceholder} />
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>{T.form.phone}</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+\s-]{10,15}"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder={T.form.phonePlaceholder}
                  />
                </label>
                <label className="field">
                  <span>{T.form.businessType}</span>
                  <select value={form.businessType} onChange={set('businessType')}>
                    <option value="">{T.form.businessTypeSelect}</option>
                    {T.form.businessTypes.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>{T.form.city}</span>
                  <input value={form.city} onChange={set('city')} placeholder={T.form.cityPlaceholder} />
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>{T.form.product}</span>
                  <select value={form.product} onChange={set('product')}>
                    <option value="">{T.form.productSelect}</option>
                    {PRODUCT_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value={T.form.productAll}>{T.form.productAll}</option>
                  </select>
                </label>
                <label className="field">
                  <span>{T.form.qty}</span>
                  <input value={form.qty} onChange={set('qty')} placeholder={T.form.qtyPlaceholder} />
                </label>
              </div>

              <label className="field">
                <span>{T.form.message}</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set('message')}
                  placeholder={T.form.messagePlaceholder}
                />
              </label>

              <button type="submit" className="btn btn--wa btn--block">
                <Whatsapp size={17} /> {T.form.submit}
              </button>

              <p className="cform-alt">
                {T.form.callPrompt}{' '}
                <a href={BUSINESS.phoneHref} className="tlink">
                  {BUSINESS.phone}
                </a>
              </p>
            </form>
          </Reveal>

          {/* Details */}
          <div className="cside">
            <Reveal anim="right">
              <div className="ccard">
                <h3>{T.direct.title}</h3>
                <a href={BUSINESS.phoneHref} className="crow">
                  <span className="crow-ico">
                    <Phone size={18} />
                  </span>
                  <span>
                    <strong>{BUSINESS.phone}</strong>
                    <small>{T.direct.phoneNote}</small>
                  </span>
                </a>
                <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="crow">
                  <span className="crow-ico">
                    <Whatsapp size={18} />
                  </span>
                  <span>
                    <strong>{T.direct.whatsapp}</strong>
                    <small>{T.direct.whatsappNote}</small>
                  </span>
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="crow">
                  <span className="crow-ico">
                    <Mail size={18} />
                  </span>
                  <span>
                    <strong>{BUSINESS.email}</strong>
                    <small>{T.direct.emailNote}</small>
                  </span>
                </a>
                <span className="crow">
                  <span className="crow-ico">
                    <Pin size={18} />
                  </span>
                  <span>
                    <strong>
                      {BUSINESS.city}, {BUSINESS.state}
                    </strong>
                    <small>{T.direct.addressNote}</small>
                  </span>
                </span>
              </div>
            </Reveal>

            <Reveal anim="right" delay={120}>
              <div className="ccard ccard--wa">
                <h3>{T.catalogue.title}</h3>
                <p>{T.catalogue.body}</p>
                <Link to="/catalogue" className="btn btn--wa btn--block">
                  {T.catalogue.cta} <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>

            <Reveal anim="right" delay={200}>
              <div className="ccard ccard--soft">
                <h3>{T.nextTitle}</h3>
                <ul className="ticklist ticklist--sm">
                  {CONTACT_NEXT_STEPS.map((t) => (
                    <li key={t}>
                      <Check size={16} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container faq-wrap">
          <div className="head head--center">
            <Reveal>
              <span className="eyebrow">{T.faq.eyebrow}</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>{T.faq.title}</h2>
            </Reveal>
          </div>

          <div className="faq">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <div className={`faq-item ${open === i ? 'is-open' : ''}`}>
                  <button
                    className="faq-q"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    {f.q}
                    <span className="faq-mark" aria-hidden />
                  </button>
                  <div className="faq-a">
                    <p>{f.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <p className="center" style={{ marginTop: 34 }}>
              <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="tlink">
                {T.faq.cta} <ArrowRight size={16} />
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
