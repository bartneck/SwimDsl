import fs from "node:fs";
import path from "node:path";

/**
 * Download all resources specified by `relativeUrls` from `fetchBase`.
 *
 * @param relativeUrls - An array of relative resource paths to download.
 * @param fetchBase - The base URL to fetch the resources from.
 * @param downloadLocation - The local directory to download the files to.
 */
export default async function downloadRelativeUrls(
  relativeUrls: string[],
  fetchBase: string,
  downloadLocation: string,
): Promise<void> {
  const promises: Promise<void>[] = [];

  for (const relativeUrl of relativeUrls) {
    const absoluteFetchUrl = new URL(relativeUrl, fetchBase);
    const localDownloadFilePath = path.join(downloadLocation, relativeUrl);
    const localDownloadDirectory = path.dirname(localDownloadFilePath);

    const responseBytes = fetch(absoluteFetchUrl.href).then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to download resousrce from ${absoluteFetchUrl.href}: ` +
            `${response.status} ${response.statusText}`,
        );
      }
      return response.bytes();
    });

    const directoryCreated = fs.promises.mkdir(localDownloadDirectory, {
      recursive: true,
    });

    promises.push(
      Promise.all([responseBytes, directoryCreated]).then(([font]) =>
        fs.promises.writeFile(localDownloadFilePath, font),
      ),
    );
  }

  await Promise.all(promises);
}
