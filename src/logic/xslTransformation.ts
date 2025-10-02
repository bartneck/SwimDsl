const emptyXml =
  '<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';

async function processSefJson(sefJson: string): Promise<object> {
  const result = await SaxonJS.transform(
    {
      stylesheetText: sefJson,
      sourceText: emptyXml,
    },
    "async",
  );

  return result.stylesheetInternal;
}

async function transformXML(
  xmlString: string,
  compiledStylesheet: object,
): Promise<string> {
  const result = await SaxonJS.transform(
    {
      stylesheetInternal: compiledStylesheet,
      sourceText: xmlString,
      destination: "serialized",
    },
    "async",
  );

  return result.principalResult;
}

export { processSefJson, transformXML };
