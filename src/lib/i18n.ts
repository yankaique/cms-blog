import { intl } from '@/config/intl';
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  if (!intl.locales.includes(locale as unknown as string)) {
    locale = intl.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../langs/${locale}.json`)).default
  };
});