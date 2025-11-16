import DomPurify from "dompurify";
import { CSSProperties } from "react";

interface RawHtmlProps {
  rawHtml: string;
  style?: CSSProperties | undefined;
}

/**
 * Render arbitrary HTML content in React.
 *
 * Uses DomPurify to sanitize input string.
 *
 * @param rawHtml - Any valid HTML document as a string.
 *
 * @param style - A CSS object containing styles for the HTML compoent.
 *
 * @returns A React element used to render `rawHtml`.
 */
function RawHtml({ rawHtml, style }: RawHtmlProps): React.ReactElement {
  const sanitizedHtml = DomPurify.sanitize(rawHtml);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={style}
    ></div>
  );
}

export default RawHtml;
