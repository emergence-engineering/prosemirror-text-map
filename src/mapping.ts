import { Node } from "prosemirror-model";

export type TextMappingItem = {
  docPos: number;
  textPos: number;
};

export type TextWithMapping = {
  text: string;
  mapping: TextMappingItem[];
};

export type MappingOptions = {
  nodeToTextMappingOverride: {
    [key: string]: (node: Node) => TextWithMapping;
  };
};

const defaultMapping = [{ docPos: 1, textPos: 0 }];

export const docToTextWithMapping = (
  doc: Node,
  options: Partial<MappingOptions> = {},
): TextWithMapping => {
  const nodeToTextMapping = options.nodeToTextMappingOverride || {};
  let text = "";
  let currentBlock = "";
  let firstBlockDone = false;
  const mapping: TextMappingItem[] = [];
  doc.descendants((node, pos) => {
    if (node.type.name in nodeToTextMapping) {
      const { mapping: nodeMapping, text: nodeText } =
        nodeToTextMapping[node.type.name](node);
      if (!firstBlockDone || node.type.isInline) {
        mapping.push(
          ...nodeMapping.map(({ docPos, textPos }) => ({
            docPos: docPos + pos + 1,
            textPos: text.length + currentBlock.length + textPos,
          })),
        );
        currentBlock += nodeText;
        if (!node.type.isInline) {
          firstBlockDone = true;
        }
      } else {
        mapping.push(
          ...nodeMapping.map(({ docPos, textPos }) => ({
            docPos: docPos + pos + 1,
            textPos: text.length + currentBlock.length + textPos + 1,
          })),
        );
        currentBlock += `\n${nodeText}`;
      }
      return false;
    }
    if (node.type.isBlock) {
      if (!firstBlockDone) {
        firstBlockDone = true;
        return true;
      }
      text += `${currentBlock}\n`;
      currentBlock = "";
    } else if (node.isText) {
      mapping.push({ docPos: pos, textPos: text.length + currentBlock.length });
      currentBlock += `${node.text}`;
    }
    return true;
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
