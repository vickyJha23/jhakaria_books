import { BUSINESS } from '../data/site';
import { Whatsapp, Phone, Mail } from './Icons';
import { useContent } from '../i18n/context';

/**
 * Fixed right-edge contact rail, after Sundaram's phone/email tabs. WhatsApp
 * leads because that is where this business already takes its enquiries; on
 * phones the rail collapses to the WhatsApp button alone.
 */
export default function ContactRail() {
  const { RAIL_COPY: T } = useContent();
  return (
    <div className="rail">
      <a
        className="rail-tab rail-tab--wa"
        href={BUSINESS.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label={T.whatsappAria}
      >
        <span className="rail-ring" aria-hidden />
        <Whatsapp size={22} />
        <span className="rail-txt">{T.whatsapp}</span>
      </a>

      <a className="rail-tab rail-tab--call" href={BUSINESS.phoneHref} aria-label={`${T.call} ${BUSINESS.phone}`}>
        <Phone size={20} />
        <span className="rail-txt">{T.call}</span>
      </a>

      <a className="rail-tab rail-tab--mail" href={`mailto:${BUSINESS.email}`} aria-label={T.emailAria}>
        <Mail size={20} />
        <span className="rail-txt">{T.email}</span>
      </a>
    </div>
  );
}
