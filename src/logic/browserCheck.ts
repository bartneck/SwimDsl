declare const safari: object | undefined;

/**
 * Determine if the browser we are currently running in is Safari or not.
 *
 * @returns `true` If we are running in Safari, `false` otherwise.
 *
 * Source - https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browsers
 * Posted by Rob W, modified by community. See post 'Timeline' for change history
 * Retrieved 2025-11-27, License - CC BY-SA 4.0
 */
function isSafari(): boolean {
  return (
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification),
    )
  );
}

export { isSafari };
