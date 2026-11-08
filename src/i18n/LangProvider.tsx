import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONTENT_EN } from '../data/content';
import { CONTENT_HI } from '../data/content.hi';
import { CONTENT_MR } from '../data/content.mr';
import { CONTENT_GU } from '../data/content.gu';
import { LangContext, LANGS, type Lang } from './context';

const STORAGE_KEY = 'jakharia-lang';
const EDITIONS = { en: CONTENT_EN, hi: CONTENT_HI, mr: CONTENT_MR, gu: CONTENT_GU };

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (LANGS.some((l) => l.id === stored)) return stored as Lang;
  } catch { /* storage unavailable */ }
  return 'en';
}

/** Holds the visitor's language, remembers it, and tags <html lang> so fonts and screen readers follow. */
export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }, [lang]);

  const api = useMemo(() => ({ lang, setLang, content: EDITIONS[lang] }), [lang]);
  return <LangContext.Provider value={api}>{children}</LangContext.Provider>;
}
