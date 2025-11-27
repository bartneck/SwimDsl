import { isSafari } from "./browserCheck";

interface WindowHandle {
  contentWindow: Window;
  cleanup: () => void;
}

/**
 * Create a new window for the printing content to sit in.
 *
 * @returns If the window opens successfully, an object containing a refernce
 * to the window and a cleanup function to call once the printing has completed,
 * otherwise `null`.
 */
function createContentWindow(): WindowHandle | null {
  if (isSafari()) {
    const contentWindow = window.open("", "_blank", "width=800,height=600");
    return contentWindow !== null
      ? {
          contentWindow,
          cleanup() {
            contentWindow.close();
          },
        }
      : null;
  } else {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const contentWindow = iframe.contentWindow;

    return contentWindow !== null
      ? {
          contentWindow,
          cleanup() {
            document.body.removeChild(iframe);
          },
        }
      : null;
  }
}

/**
 * Generate a template HTML string with the swiML CSS file pre-loaded.
 *
 * @returns An HTML string with an empty body.
 */
async function templateDocument(): Promise<string> {
  const css = await (await fetch("./swiML.css")).text();

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

/**
 * Print the given node as if it were the only one on the page using the
 * browser's print dialogue.
 *
 * @param node The DOM node to print.
 */
async function printNode(node: Node): Promise<void> {
  const clone = node.cloneNode(true);

  const windowHandle = createContentWindow();

  if (windowHandle === null) {
    console.error("Failed to open print window");
    return;
  }

  const contentWindow = windowHandle.contentWindow;
  const doc = contentWindow.document;
  doc.open();
  doc.write(await templateDocument());
  doc.close();
  doc.body.appendChild(clone);

  // Wait briefly for content to render. This is neccessary for the fonts to
  // appear in Chromium browsers.
  setTimeout(() => {
    contentWindow.focus();
    contentWindow.print();

    // This timeout is neccesary to prevent the window from closing before
    // the print dialogue has appeeared in Safari.
    setTimeout(windowHandle.cleanup, 10);
  }, 50);
}

export { printNode };
