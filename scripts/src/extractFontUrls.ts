import * as css from "css";

function extractFontUrls(cssContent: string): string[] {
  const parsedCss = css.parse(cssContent);

  if (!parsedCss.stylesheet) {
    return [];
  }

  const urls: string[] = [];

  for (const rule of parsedCss.stylesheet.rules) {
    if (rule.type !== "font-face" || !rule.declarations) continue;

    for (const declaration of rule.declarations) {
      if (
        declaration.type !== "declaration" ||
        declaration.property !== "src" ||
        !declaration.value
      )
        continue;

      const match = /url\('([^']+)'\)/.exec(declaration.value);
      if (match) {
        urls.push(match[1]);
      }
    }
  }

  return urls;
}

export default extractFontUrls;
