import { createContext, useContext } from 'react';
import { CONTENT_EN, type Content } from '../data/content';

export type Lang = 'en' | 'hi' | 'mr' | 'gu';

/** Languages offered in the header switch (EN · हिं · मरा · ગુ): `short` is the button text, `name` its full label. */
export const LANGS: { id: Lang; short: string; name: string }[] = [
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'hi', short: 'हिं', name: 'हिंदी' },
  { id: 'mr', short: 'मरा', name: 'मराठी' },
  { id: 'gu', short: 'ગુ', name: 'ગુજરાતી' },
];

export interface LangApi {
  lang: Lang;
  setLang: (lang: Lang) => void;
  content: Content;
}

export const LangContext = createContext<LangApi>({ lang: 'en', setLang: () => {}, content: CONTENT_EN });

export const useLang = () => useContext(LangContext);

/** The page copy in the visitor's chosen language. */
export const useContent = () => useContext(LangContext).content;
