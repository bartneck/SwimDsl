import { EditorState } from "@codemirror/state"
import { syntaxTree } from "@codemirror/language"
import buildAst from "../../codemirror-swimdsl/src/buildAst.ts"
import { swimdslLanguage } from "codemirror-lang-swimdsl"

export default function parseProgramme(source: string) {
  const state = EditorState.create({
    doc: source,
    extensions: [swimdslLanguage],
  });

  const treeCursor = syntaxTree(state).cursor();

  return buildAst(treeCursor, state);
}
