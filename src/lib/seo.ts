import { siteUrl as SITE_URL, siteName as SITE_NAME, defaultOgImage, absoluteUrl } from "./seo/config";
export { SITE_URL, SITE_NAME, absoluteUrl };
export const DEFAULT_OG_IMAGE = absoluteUrl(defaultOgImage);
export const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — AI automation and custom software`;

export { formatPageTitle, pageSeo, HOME_TITLE, HOME_DESCRIPTION } from "./seo/pages";
