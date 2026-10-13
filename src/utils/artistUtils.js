/**
 * Get the artist name based on environment variables and app type
 * @param {string} language - The language ('EN' or 'CN')
 * @returns {string|null} The artist name or null if not applicable
 */
export function getArtistName(language = 'EN') {
  // Check if this is an Artist web
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;
  
  // If not an Artist web, return null (keep original manual fill behavior)
  if (appType !== 'Artist web') {
    return null;
  }
  
  // Get the appropriate artist name based on language
  if (language === 'CN') {
    return process.env.NEXT_PUBLIC_APP_PERSON_CN || null;
  } else {
    return process.env.NEXT_PUBLIC_APP_PERSON_EN || null;
  }
}

/**
 * Get the display name used as the site wordmark (e.g. the nav brand text).
 *
 * Unlike getArtistName(), this has NO APP_TYPE gate — it always reads the
 * public person env vars, so it works on any web type.
 *
 * Current design: the wordmark matches the site language —
 *   EN site → NEXT_PUBLIC_APP_PERSON_EN, CN site → NEXT_PUBLIC_APP_PERSON_CN.
 * Falls back to the other var (then "") if the preferred one is empty.
 *
 * @param {boolean} isCn - Whether the current language is Chinese.
 * @returns {string} The name to render, or "" if neither env var is set.
 */
export function getBrandName(isCn = false) {
  const personEn = process.env.NEXT_PUBLIC_APP_PERSON_EN || "";
  const personCn = process.env.NEXT_PUBLIC_APP_PERSON_CN || "";
  return isCn ? personCn || personEn : personEn || personCn;
}

/**
 * Auto-fill artist field in data if applicable
 * @param {Object} data - The data object
 * @param {string} language - The language ('EN' or 'CN')
 * @returns {Object} The data with artist field auto-filled if applicable
 */
export function autoFillArtist(data, language = 'EN') {
  const artistName = getArtistName(language);
  
  // Only auto-fill if we have an artist name AND the field is empty
  if (artistName && !data.artist) {
    return {
      ...data,
      artist: artistName
    };
  }
  
  // Return original data unchanged (preserves manual fill behavior)
  return data;
}

/**
 * Check if the artist field should be hidden in forms
 * @returns {boolean} True if artist field should be hidden (Artist web), false otherwise
 */
export function shouldHideArtistField() {
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;
  
  // For Gallery webs, never hide artist fields
  if (appType === 'Gallery web') {
    return false;
  }
  
  // For Artist webs, hide artist fields (auto-fill from environment)
  if (appType === 'Artist web') {
    return true;
  }
  
  // Default behavior: don't hide artist fields
  return false;
}

/**
 * Get the default artist value for forms
 * @param {string} fallbackValue - The fallback value to use when not an Artist web
 * @param {string} language - The language to get the artist name for
 * @returns {string} The artist value to use in form defaults
 */
export function getFormArtistValue(fallbackValue = '', language = 'EN') {
  if (shouldHideArtistField()) {
    // For Artist webs, auto-fill from environment variables
    const artistName = getArtistName(language);
    return artistName || '';
  }
  // For other app types, use the fallback value (manual entry)
  return fallbackValue;
} 