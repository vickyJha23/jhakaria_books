import { useState } from 'react';
import { Link } from 'react-router-dom';
import PriceListShop from '../components/PriceListShop';
import PageHead from '../components/PageHead';
import { ArrowRight } from '../components/Icons';
import ThreeProductCatalog from '../components/ThreeProductCatalog';
import { PRODUCTS } from '../data/site';

export default function Products() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(PRODUCTS[0].slug);
  return (
    <>
      <PageHead
        eyebrow="Wholesale catalogue"
        title="The full range, with clear rates"
        lede="Browse Jakharia Books products by the categories in our current price list. Choose a page count or pack, build an order, and send it to us on WhatsApp."
      />

      <section className="section section--tight cover-gallery-section">
        <div className="container">
          <details className="cover-gallery" open={galleryOpen} onToggle={(event) => setGalleryOpen(event.currentTarget.open)}>
            <summary>
              <span><small>INTERACTIVE THREE.JS COVER GALLERY</small><strong>Explore the notebook covers</strong></span>
              <span className="cover-gallery-toggle" aria-hidden="true">{galleryOpen ? '−' : '+'}</span>
            </summary>
            {galleryOpen && <ThreeProductCatalog products={PRODUCTS} selectedSlug={selectedSlug} onSelect={(product) => setSelectedSlug(product.slug)} />}
          </details>
        </div>
      </section>

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
