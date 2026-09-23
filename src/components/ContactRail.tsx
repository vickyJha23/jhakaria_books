import { BUSINESS } from '../data/site';
import { Whatsapp, Phone, Mail } from './Icons';

/**
 * Fixed right-edge contact rail, after Sundaram's phone/email tabs. WhatsApp
 * leads because that is where this business already takes its enquiries; on
 * phones the rail collapses to the WhatsApp button alone.
 */
export default function ContactRail() {
  return (
    <div className="rail">
      <a
        className="rail-tab rail-tab--wa"
        href={BUSINESS.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="rail-ring" aria-hidden />
        <Whatsapp size={22} />
        <span className="rail-txt">WhatsApp</span>
      </a>

      <a className="rail-tab rail-tab--call" href={BUSINESS.phoneHref} aria-label={`Call ${BUSINESS.phone}`}>
        <Phone size={20} />
        <span className="rail-txt">Call us</span>
      </a>

      <a className="rail-tab rail-tab--mail" href={`mailto:${BUSINESS.email}`} aria-label="Email us">
        <Mail size={20} />
        <span className="rail-txt">Email</span>
      </a>
    </div>
  );
}
