export const countryCodes = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
];

export interface ParsedPhone {
  code: string;
  flag: string;
  number: string;
  formatted: string;
  isValid: boolean;
}

/**
 * Parses a full phone number (e.g. +2348012345678) into its components.
 * If no matching country code is found, falls back to raw rendering.
 */
export function parsePhoneNumber(fullPhone: string | null | undefined): ParsedPhone {
  if (!fullPhone) {
    return { code: '', flag: '🌐', number: '', formatted: 'N/A', isValid: false };
  }

  // Remove whitespace and any characters that aren't digits or '+'
  const cleanPhone = fullPhone.replace(/[^\d+]/g, '');

  const matchedCountry = countryCodes.find(c => cleanPhone.startsWith(c.code));

  if (matchedCountry) {
    const numberPart = cleanPhone.slice(matchedCountry.code.length);
    return {
      code: matchedCountry.code,
      flag: matchedCountry.flag,
      number: numberPart,
      formatted: `${matchedCountry.flag} ${matchedCountry.code} ${numberPart}`,
      isValid: numberPart.length >= 7 && numberPart.length <= 15
    };
  }

  return {
    code: '',
    flag: '🌐', // Default fallback icon
    number: cleanPhone,
    formatted: cleanPhone,
    isValid: cleanPhone.length >= 7
  };
}

/**
 * Validates a number (without country code). Length should be between 7 and 15 digits.
 */
export function validatePhoneNumber(number: string): boolean {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length >= 7 && cleanNumber.length <= 15;
}
