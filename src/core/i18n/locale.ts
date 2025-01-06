import { defaultLocale } from './config';
import type { Locale } from './types';

// In this example the locale is read from a localStorage. You could alternatively
// also read it from a database, backend service, or any other source.
const LS_NAME = 'LOCALE';

// FIXME: Not sure if localStorage works here, maybe use cookies instead
const getLocale = () => {
  return localStorage.getItem(LS_NAME) || defaultLocale;
};

const setLocale = (locale?: string) => {
  localStorage.setItem(LS_NAME, (locale as Locale) || defaultLocale);
};

export { getLocale, setLocale };
