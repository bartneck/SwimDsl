import { isSafari } from "./browserCheck";

interface WindowHandle {
  contentWindow: Window;
  cleanup: () => void;
}

/**
 * Create a new window for the printing content to sit in.
 *
 * @returns If the window opens successfully, an object containing a reference
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

  // INFO: The following code was entirely written by an LLM, with the comments
  // rewritten to reduce bloat. I am unsure exactly why each line is needed, but
  // after playing around, this seemed to be the only thing I could get reliably
  // working in Firefox, Chromium, and Safari. IMPORTANT NOTE - If you change
  // the following code, test it in Safari! I previously had it working
  // perfectly in Firefox and Chromium, but the print dialogue didn't show at
  // all in Safari due to stricter conditions on what can be `.print()`ed from
  // JavaScript.

  const winLoaded = new Promise<void>((resolve) => {
    // Some browsers (Chrome/Firefox) may have already fired `load`
    // by the time we attach the listener, so also check readyState.
    if (contentWindow.document.readyState === "complete") {
      resolve();
    } else {
      contentWindow.addEventListener(
        "load",
        () => {
          resolve();
        },
        { once: true },
      );
    }
  });

  const fontsReady = doc.fonts.ready.catch((err: unknown) => {
    // A font has failed to load, the fallback font will be used.
    console.warn("Font loading error:", err);
  });

  const timeout = new Promise<void>((resolve) =>
    setTimeout(() => {
      console.warn("Rendering timed out, fonts unlikely to have rendered.");
      resolve();
    }, 1000),
  );

  // Wait until one of the following conditions is true:
  //     - The document is loaded, in the ready state, and the fonts have loaded
  //     - One second has elapsed. This provides a fallback in the case of an
  //         error.
  await Promise.race([Promise.all([winLoaded, fontsReady]), timeout]);

  // Call paint on the next repaint of the browser window.
  contentWindow.requestAnimationFrame(() => {
    contentWindow.focus();
    contentWindow.addEventListener("afterprint", windowHandle.cleanup, {
      once: true,
    });
    contentWindow.print();
  });
}

export { printNode };
