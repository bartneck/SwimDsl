import DomPurify from "dompurify";

interface RawHtmlProps {
  rawHtml: string;
}

/**
 * Render arbitrary HTML content in React.
 *
 * Uses DomPurify to sanitize input string.
 *
 * @param rawHtml - Any valid HTML document as a string.
 *
 * @returns A React element used to render `rawHtml`.
 */
function RawHtml({ rawHtml }: RawHtmlProps): React.ReactElement {
  const sanitizedHtml = DomPurify.sanitize(rawHtml);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
}

export default RawHtml;
