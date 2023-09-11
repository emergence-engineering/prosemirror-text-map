import { Node } from "prosemirror-model";

export type TextMappingItem = {
  docPos: number;
  textPos: number;
};

const defaultMapping = [{ docPos: 1, textPos: 0 }];

export const docToTextWithMapping = (
  doc: Node,
): { text: string; mapping: TextMappingItem[] } => {
  let text = "";
  let currentBlock = "";
  let firstBlockDone = false;
  const mapping: TextMappingItem[] = [];
  doc.descendants((node, pos) => {
    if (node.type.isBlock) {
      if (!firstBlockDone) {
        firstBlockDone = true;
        return;
      }
      text += `${currentBlock}\n`;
      currentBlock = "";
    } else if (node.isText) {
      mapping.push({ docPos: pos, textPos: text.length + currentBlock.length });
      currentBlock += `${node.text}`;
    }
  });
  text += currentBlock;
  return { text, mapping: mapping.length ? mapping : defaultMapping };
};
export const textPosToDocPos = (
  textPos: number,
  mapping: TextMappingItem[],
) => {
  for (let i = 0; i < mapping.length; i++) {
    if (
      textPos >= mapping[i].textPos &&
      (mapping[i + 1] === undefined || textPos < mapping[i + 1].textPos)
    ) {
      return mapping[i].docPos + (textPos - mapping[i].textPos);
    }
  }
  throw new Error(
    "textPositionToDocumentPosition: textPos not found in mapping",
  );
};
