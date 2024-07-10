# prosemirror-text-map

![made by Emergence Engineering](https://emergence-engineering.com/ee-logo.svg)

[**Made by Emergence-Engineering**](https://emergence-engineering.com/)

A library for manipulating [ProseMirror](https://prosemirror.net) documents in text format.

Convert a ProseMirror document to text, do the work, then map back positions in the text to the ProseMirror document.

This lib is mostly helpful for situations where you use other libraries whose working on texts only (like diffing, parsing, etc.) and you need to map back the results to the ProseMirror document (like adding marks based on text change).

use `docToTextWithMapping` to create a mapping object & `textPosToDocPos` to map text positions to document positions.

You can use an additional mapping option which could help you to serialise a node to a different format, this could be helpful for example if you want to add images to the diff algo, to detect image (source or alt) changes too.
