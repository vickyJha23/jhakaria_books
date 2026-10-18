import { Link } from 'react-router-dom';
import PriceListShop from '../components/PriceListShop';
import PageHead from '../components/PageHead';
import { ArrowRight } from '../components/Icons';

export default function Products() {
  return (
    <>
      <PageHead
        eyebrow="Wholesale catalogue"
        title="The full range, at a glance"
        lede="Browse every Jakharia Books product by category, check sizes, pages and printed MRPs, then send your order list to us on WhatsApp for wholesale rates."
      />

      <section className="section section--tight section--paper">
        <div className="container">
          <PriceListShop />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container price-list-footnote">
          <div>
            <span className="eyebrow">Need a custom specification?</span>
            <h2>We can help build your order.</h2>
            <p className="lede">Share your sizes, quantities, paper GSM and cover requirements. Our team will confirm availability, delivery and the final invoice.</p>
          </div>
          <Link to="/contact" className="btn btn--ghost">Talk to our team <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
