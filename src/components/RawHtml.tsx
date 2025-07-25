import DomPurify from "dompurify";

interface RawHtmlProps {
  rawHtml: string;
}

function RawHtml({ rawHtml }: RawHtmlProps): React.ReactElement {
  const sanitizedHtml = DomPurify.sanitize(rawHtml);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
}

export default RawHtml;
