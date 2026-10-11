import { useState } from 'react';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { BUSINESS, PRODUCTS, bySlug } from '../data/site';
import { Phone, Mail, Pin, Whatsapp, ArrowRight, Check } from '../components/Icons';

const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: 'MOQ depends on the product and whether covers are customised. Standard-cover books start at carton quantities; customised covers need a larger run because plates are made per design. Tell us your sizes and we will give you the exact MOQ for that job.',
  },
  {
    q: 'How do bulk discounts work?',
    a: 'Pricing is slab-wise on the total order, not per line item. That means you can mix A4, A5, long books and registers in one order and still reach the next slab. Rates are shared in writing against your specific requirement.',
  },
  {
    q: 'How long does a customised cover order take?',
    a: 'Artwork and a digital proof typically go out within two to three working days of receiving your logo and details. Production time after approval depends on quantity and the season — we commit to a date only once the line can hold it.',
  },
  {
    q: 'Do you supply outside Gujarat?',
    a: 'Yes. We supply distributors and wholesalers across India. Transport is arranged to your preferred transporter, and cartons are shrink-wrapped and strapped for long-haul transit.',
  },
  {
    q: 'Can I get samples before ordering?',
    a: 'Please do. Ask for samples in the sizes and page counts you sell most, so you can compare the paper directly against what you currently stock.',
  },
];

const PRODUCT_NAMES = PRODUCTS.map((p) => p.name);

export default function Contact() {
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
        eyebrow="Get in touch"
        title="Become a Jakharia distributor"
        lede="Tell us what you sell and how much of it. We will come back with a slab-wise rate, MOQ and a realistic dispatch date — usually the same day."
      />

      <section className="section section--tight partner-audience" style={{ '--partner-image': `url(${bySlug('long-premium-book')?.photo ?? ''})` } as React.CSSProperties}>
        <div className="container">
          <div className="head head--center">
            <span className="eyebrow">Who we work with</span>
            <h2>A direct manufacturing partner for your business</h2>
            <p className="lede">Tell us how you serve your market so we can shape the right product mix and quote.</p>
          </div>
          <div className="partner-audience-grid">
            {[
              ['Retailers', 'Build a dependable shelf range for your local customers.'],
              ['Wholesalers', 'Source multiple paper stationery lines from one manufacturer.'],
              ['Distributors', 'Discuss territory, seasonal demand and a suitable product mix.'],
            ].map(([title, body], i) => (
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
              <h2>Send an enquiry</h2>
              <p className="cform-note">
                Fields marked * are required. Submitting opens WhatsApp with your details filled
                in, ready to send.
              </p>

              <div className="frow">
                <label className="field">
                  <span>Your name *</span>
                  <input required value={form.name} onChange={set('name')} placeholder="Full name" />
                </label>
                <label className="field">
                  <span>Firm / shop name</span>
                  <input value={form.firm} onChange={set('firm')} placeholder="Business name" />
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>Phone *</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+\s-]{10,15}"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="10-digit mobile"
                  />
                </label>
                <label className="field">
                  <span>Business type</span>
                  <select value={form.businessType} onChange={set('businessType')}>
                    <option value="">Select your business</option>
                    <option>Retailer</option>
                    <option>Wholesaler</option>
                    <option>Distributor</option>
                    <option>School / institution</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>City</span>
                  <input value={form.city} onChange={set('city')} placeholder="City / district" />
                </label>
              </div>

              <div className="frow">
                <label className="field">
                  <span>Product of interest</span>
                  <select value={form.product} onChange={set('product')}>
                    <option value="">Select a product line</option>
                    {PRODUCT_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value="Multiple / full range">Multiple / full range</option>
                  </select>
                </label>
                <label className="field">
                  <span>Approx. quantity</span>
                  <input value={form.qty} onChange={set('qty')} placeholder="e.g. 5,000 books" />
                </label>
              </div>

              <label className="field">
                <span>Anything else we should know?</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Sizes, page counts, cover customisation, delivery timeline…"
                />
              </label>

              <button type="submit" className="btn btn--wa btn--block">
                <Whatsapp size={17} /> Send enquiry on WhatsApp
              </button>

              <p className="cform-alt">
                Prefer to talk? Call{' '}
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
                <h3>Reach us directly</h3>
                <a href={BUSINESS.phoneHref} className="crow">
                  <span className="crow-ico">
                    <Phone size={18} />
                  </span>
                  <span>
                    <strong>{BUSINESS.phone}</strong>
                    <small>Mon–Sat, 10 am – 7 pm IST</small>
                  </span>
                </a>
                <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="crow">
                  <span className="crow-ico">
                    <Whatsapp size={18} />
                  </span>
                  <span>
                    <strong>WhatsApp</strong>
                    <small>Fastest for quotes and samples</small>
                  </span>
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="crow">
                  <span className="crow-ico">
                    <Mail size={18} />
                  </span>
                  <span>
                    <strong>{BUSINESS.email}</strong>
                    <small>For purchase orders</small>
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
                    <small>Manufacturing unit — visits by appointment</small>
                  </span>
                </span>
              </div>
            </Reveal>

            <Reveal anim="right" delay={120}>
              <div className="ccard ccard--wa">
                <h3>See the full range first</h3>
                <p>
                  Our complete catalogue with current products sits on WhatsApp — browse it, then
                  send us the item codes you want rates for.
                </p>
                <a
                  href={BUSINESS.catalog}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--wa btn--block"
                >
                  <Whatsapp size={17} /> Open catalogue
                </a>
              </div>
            </Reveal>

            <Reveal anim="right" delay={200}>
              <div className="ccard ccard--soft">
                <h3>What happens next</h3>
                <ul className="ticklist ticklist--sm">
                  {[
                    'We confirm your requirement on call or WhatsApp',
                    'Slab-wise rate and MOQ shared in writing',
                    'Samples couriered if you want to compare paper',
                    'Order confirmed, dispatch date committed',
                  ].map((t) => (
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
              <span className="eyebrow">Questions</span>
            </Reveal>
            <Reveal delay={90}>
              <h2>Before you enquire</h2>
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
                Still unsure? Ask us on WhatsApp <ArrowRight size={16} />
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
