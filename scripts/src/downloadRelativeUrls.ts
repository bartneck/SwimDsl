import fs from "node:fs";
import path from "node:path";

async function downloadRelativeUrls(
  relativeUrls: string[],
  fetchBase: string,
  downloadLocation: string,
): Promise<void> {
  const promises: Promise<void>[] = [];

  for (const relativeUrl of relativeUrls) {
    const absoluteFetchUrl = new URL(relativeUrl, fetchBase);
    const localDownloadFilePath = path.join(downloadLocation, relativeUrl);
    const localDownloadDirectory = path.dirname(localDownloadFilePath);

    const responseBytes = fetch(absoluteFetchUrl.href).then((response) =>
      response.bytes(),
    );

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

export default downloadRelativeUrls;
