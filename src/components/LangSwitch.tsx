import { LANGS, useLang } from '../i18n/context';

/** EN · हिं · मरा · ગુ toggle, used in the header top bar and the mobile menu. */
export default function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, content } = useLang();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={content.APP_COPY.language}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" lang={l.id} aria-pressed={lang === l.id} title={l.name} onClick={() => setLang(l.id)}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
