import type { Brand } from './types'

const COMMONS = 'upload.wikimedia.org/wikipedia/commons'

/**
 * Logos, keyed by the company name used in `CLIENTS` and in the career list.
 * Files are sanitised copies (no script, no external reference) cropped to
 * their artwork. A company missing here is shown by its name.
 *
 * No logo was found for Innso (now part of Foundever), Amplement or Business
 * Lab.
 */
export const BRANDS: Readonly<Record<string, Brand>> = {
  TF1: { name: 'TF1', logo: 'tf1.svg', ratio: 2.65, source: `${COMMONS} Logo_TF1_2013.svg` },
  'Molotov TV': {
    name: 'Molotov TV',
    logo: 'molotov.svg',
    ratio: 3.0,
    source: `${COMMONS} Logo_Molotov.tv.svg, without the "by fubo" line`,
  },
  Arte: { name: 'Arte', logo: 'arte.svg', ratio: 3.88, source: `${COMMONS} Arte_Logo_2026.svg` },
  Ardian: { name: 'Ardian', logo: 'ardian.svg', ratio: 6.11, source: `${COMMONS} Ardian_Logo.svg` },
  Equidia: { name: 'Equidia', logo: 'equidia.svg', ratio: 3.84, source: 'static.equidia.fr logo.svg (white)' },
  'Infopro Digital': {
    name: 'Infopro Digital',
    logo: 'infopro.svg',
    ratio: 6.29,
    invert: true,
    source: 'infopro-digital.com icon sprite',
  },
  Peugeot: { name: 'Peugeot', logo: 'peugeot.svg', ratio: 9.58, invert: true, source: `${COMMONS} Wordmark_Peugeot_2021.svg` },
  'Leroy Merlin': {
    name: 'Leroy Merlin',
    logo: 'leroymerlin.svg',
    ratio: 1.64,
    source: `${COMMONS} Leroy Merlin - logo (France, 1995-).svg, lettering set in white`,
  },
  'E.Leclerc': { name: 'E.Leclerc', logo: 'leclerc.svg', ratio: 4.08, source: `${COMMONS} E.Leclerc_logo.svg` },
  Staffmatch: { name: 'Staffmatch', logo: 'staffmatch.svg', ratio: 5.87, invert: true, source: 'staffmatch.com header' },
  GoSecure: { name: 'GoSecure', logo: 'gosecure.png', ratio: 5.84, source: 'GoSecure mobile app assets' },
  RetroRoads: {
    name: 'RetroRoads',
    logo: 'retroroads.png',
    ratio: 1.04,
    source: 'retroroads.fr/templates/retroauto/assets/img/logo-200.png',
  },
}
