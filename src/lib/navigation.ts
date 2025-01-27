import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import { intl } from '@/config/intl';
 
export const routing = defineRouting({
  locales: intl.locales,
  defaultLocale: intl.defaultLocale,
});
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);