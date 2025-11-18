import { printNode } from "./pdfExport";

/**
 * Prompt the user to choose a file to upload and assuming the file contains
 * string content, call `callback` with its content.
 *
 * @param callback A function which takes a single string and has no return.
 */
function uploadFile(callback: (arg: string) => void): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileText = e.target?.result;
        if (typeof fileText === "string") {
          callback(fileText);
        }
      };

      reader.readAsText(file);
    }
  };

  input.click();
}

/**
 * Prompt the user to download a blob as a file to their file system.
 *
 * @param blob The binary file data for the user to download.
 * @param filename The default name the file should be called.
 */
function exportBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download the user's swimDSL programme to the user's file system as a text
 * file.
 *
 * @param swimdslProgramme The swimDSL programme as a string.
 */
function downloadSwimdsl(swimdslProgramme: string): void {
  const blob = new Blob([swimdslProgramme], {
    type: "text/plain;charset=utf-8",
  });

  exportBlob(blob, "SwimProgramme.txt");
}

/**
 * Download the swiML XML generated from the user's swimDSL programme to their
 * file system as an XML file.
 *
 * @param swimlXml The swiML XML programme as a string.
 */
function downloadSwimlXml(swimlXml: string): void {
  const blob = new Blob([swimlXml], { type: "application/xml" });
  exportBlob(blob, "SwimProgramme.xml");
}

function downloadHtml(htmlString: string): void {
  const blob = new Blob([htmlString], { type: "text/html" });
  exportBlob(blob, "SwimProgramme.html");
}

/**
 * Download the render of the user's programme to their file system as a PDF
 * file.
 */
async function downloadPdf(node: Node): Promise<void> {
  await printNode(node);
}

export {
  downloadSwimdsl,
  downloadSwimlXml,
  downloadPdf,
  downloadHtml,
  uploadFile,
};
