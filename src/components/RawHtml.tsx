import DomPurify from "dompurify";
import { CSSProperties, RefObject } from "react";

interface RawHtmlProps {
  rawHtml: string;
  ref?: RefObject<HTMLDivElement | null> | undefined;
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
 * @param ref - An object to hold a reference to the div element containing the
 *    rendered HTML.
 *
 * @returns A React element used to render `rawHtml`.
 */
function RawHtml({ rawHtml, style, ref }: RawHtmlProps): React.ReactElement {
  const sanitizedHtml = DomPurify.sanitize(rawHtml);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={style}
      ref={ref}
    ></div>
  );
}

export default RawHtml;
