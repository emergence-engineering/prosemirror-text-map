// eslint-disable-next-line import/no-extraneous-dependencies
import { EditorState } from "prosemirror-state";
// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p, h1, schema, em, strong, h2 } from "prosemirror-test-builder";

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

describe("mapping utils with custom mapping", () => {
  const initialDoc = doc(
    p("test", em("em"), strong("strong")),
    h1("test2", em("em2"), strong("strong2")),
    h2("test3", em("em3"), strong("strong3")),
  );
  it("should return with the same if override with itself", () => {
    const { text, mapping } = docToTextWithMapping(initialDoc, {
      nodeToTextMappingOverride: {
        paragraph: (node) => {
          return docToTextWithMapping(node);
        },
        heading: (node) => {
          return docToTextWithMapping(node);
        },
      },
    });
    const reference = docToTextWithMapping(initialDoc);
    expect(text).toEqual(reference.text);
    expect(mapping).toEqual(reference.mapping);
  });
});
