import PriceListShop from '../components/PriceListShop';
import PageHead from '../components/PageHead';
import { useContent } from '../i18n/context';

export default function Products() {
  const { PRODUCTS_COPY: T } = useContent();
  return (
    <>
      <PageHead
        eyebrow={T.head.eyebrow}
        title={T.head.title}
        lede={T.head.lede}
      />

      <section className="section section--tight section--paper">
        <div className="container">
          <PriceListShop />
        </div>
      </section>
    </>
  );
}
