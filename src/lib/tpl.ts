/**
 * Copy templating. Every string of page copy goes through t() so facts and
 * promises come from src/config/site.ts.
 *
 *   {phone} {email} {hours} {replyTime} {cutOff} {pestPartner} {insurance}
 *   {reclean}        → "subject to team availability" (or "within N hours" if set)
 *   {guaranteeDays}  → "5 days" (COTG Bond Back window)
 *   {bondBack}       → full COTG Bond Back Guarantee sentence
 *   {carpet}         → "complimentary with every bond clean" or add-on wording
 *   {price:b2}       → "$330" or "a free quote" when quote-based
 *   {cancel}         → "[up to 48 hours before]"
 *   {?flag}…{/flag}  → kept only when the flag is on
 *   {!flag}…{/flag}  → kept only when the flag is off
 */
import { business, flags, confirmed, prices } from '../config/site';

type FlagKey = keyof typeof flags;

/** Wraps unconfirmed wording in [brackets]. */
export const b = (key: string, text: string) => (confirmed[key] ? text : `[${text}]`);

export const flagOn = (key: string): boolean => {
  const v = (flags as Record<string, unknown>)[key];
  return v !== false && v !== null && v !== undefined;
};

/** Quote-based: no dollar figures until a real number is set in site.ts. */
export const price = (key: string): string => {
  const v = prices[key];
  return typeof v === 'number' ? `$${v.toLocaleString('en-AU')}` : 'a free quote';
};

export const hasPrices = (): boolean => typeof prices.b1 === 'number' && typeof prices.b2 === 'number';

export const recleanWindow = (): string =>
  flags.reCleanWindowHours
    ? `within ${b('reCleanWindow', `${flags.reCleanWindowHours} hours`)}`
    : 'subject to team availability';

export const guaranteeDays = (): string =>
  flags.guaranteeDays ? b('guaranteeDays', `${flags.guaranteeDays} days`) : 'the agreed period';

export const carpetText = (): string =>
  flags.freeCarpet
    ? b('freeCarpet', 'complimentary with every bond clean')
    : `an add-on quoted per room`;

export const bondBackText = (): string => business.bondBackGuarantee;

export const insuranceText = (): string =>
  flags.insuranceAmount ? `${b('insurance', flags.insuranceAmount)} public liability insured` : 'Public liability insured';

const vars: Record<string, () => string> = {
  phone: () => business.phone,
  email: () => business.email,
  hours: () => business.hours,
  replyTime: () => business.replyTime,
  cutOff: () => business.cutOff,
  pestPartner: () => business.pestPartner,
  insurance: insuranceText,
  reclean: recleanWindow,
  guaranteeDays,
  bondBack: bondBackText,
  carpet: carpetText,
  cancel: () => (flags.freeCancellationHours ? b('cancellation', `up to ${flags.freeCancellationHours} hours before`) : ''),
  name: () => business.name,
  turnaround: () => b('turnaround', '24–48 hours'),
  dryCarpet: () => b('dryTimes', '3–6 hours'),
  dryMattress: () => b('dryTimes', '4–6 hours'),
};

export function t(input: string | undefined | null): string {
  if (!input) return '';
  let s = input;
  // Conditionals (repeat to allow different flags nested inside each other)
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\{([?!])(\w+)\}([\s\S]*?)\{\/\2\}/g, (_m, mode: string, key: string, body: string) => {
      const on = flagOn(key as FlagKey);
      return (mode === '?' ? on : !on) ? body : '';
    });
  }
  s = s.replace(/\{price:(\w+)\}/g, (_m, key: string) => price(key));
  s = s.replace(/\{(\w+)\}/g, (m, key: string) => (vars[key] ? vars[key]() : m));
  // Legacy bracket placeholders in meta/copy (kept until every string uses {phone})
  if (business.phone && !business.phone.includes('[')) s = s.replaceAll('[PHONE]', business.phone);
  if (business.email && !business.email.includes('[')) s = s.replaceAll('[EMAIL]', business.email);
  return s.replace(/ {2,}/g, ' ');
}

/** Plain text for schema and meta tags. */
export function plain(input: string): string {
  return t(input)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export const telHref = () => `tel:${business.phoneE164}`;
export const waHref = (msg = "Hi, I'd like a bond clean quote for a [x] bed in [suburb]") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(msg)}`;
export const mailHref = (to: 'info' | 'sales' = 'info') =>
  `mailto:${to === 'sales' ? business.emailSales : business.email}`;
