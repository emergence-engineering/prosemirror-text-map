# prosemirror-text-map

A library for manipulating [ProseMirror](https://prosemirror.net) documents in text format.

Convert a ProseMirror document to text, do the work, then map back positions in the text to the ProseMirror document.

use `docToTextWithMapping` to create a mapping object & `textPosToDocPos` to map text positions to document positions.