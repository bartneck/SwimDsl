function createIframe(): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  return iframe;
}

async function templateDocument(): Promise<string> {
  const css = await (await fetch("/swiML.css")).text();

  return `\
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Swim Programme</title>
        <style>${css}</style>
      </head>
      <body></body>
    </html>`;
}

async function printNode(node: Node): Promise<void> {
  const clone = node.cloneNode(true);

  const iframe = createIframe();
  document.body.appendChild(iframe);

  if (iframe.contentWindow === null) return;

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(await templateDocument());
  doc.close();

  doc.body.appendChild(clone);

  // Trigger the print dialog – the user can choose “Save as PDF”
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  document.body.removeChild(iframe);
}

export { printNode };
