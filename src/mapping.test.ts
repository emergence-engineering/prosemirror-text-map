import { EditorState } from "prosemirror-state";
import { doc, p, h1, schema, em, strong } from "prosemirror-test-builder";

import { textPosToDocPos, docToTextWithMapping } from "./mapping";

describe("mapping utils for empty doc", () => {
  const initialDoc = doc();
  const { text, mapping } = docToTextWithMapping(initialDoc);
  it("should return an empty string and a mapping with a single item", () => {
    expect(text).toEqual("");
    expect(mapping).toEqual([{ docPos: 1, textPos: 0 }]);
  });
});

describe("mapping utils", () => {
  const initialDoc = doc(
    p("test", em("em"), strong("strong")),
    h1("test2", em("em2"), strong("strong2")),
  );
  const state = EditorState.create({ doc: initialDoc, schema });
  const { text, mapping } = docToTextWithMapping(initialDoc);
  console.log({ text });
  const cases = Array.from(new Array(text.length)).map((i, idx) => idx);
  it.each(cases)("map between text position and document position", (idx) => {
    // Create an insertion in the text. Map that position to a document position, apply a transaction with a character insert, get the text back.
    // The two texts should be the same.
    const textPosition = textPosToDocPos(idx, mapping);
    const newDoc = state.tr.insertText("a", textPosition).doc;
    const newText = docToTextWithMapping(newDoc).text;
    expect(newText).toEqual(`${text.slice(0, idx)}a${text.slice(idx)}`);
  });
});
