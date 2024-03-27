import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  nodeNames,
  classNames,
} from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  searchTextNode,
  searchParentNodeForNodeName,
  searchParentListTag,
  searchLastChildForNodename,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { moveCursorToClassName } from "@/components/headless/Editor/nodeHandlers/common/utils";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";

const pasteRemainingNodes = (
  pasteStartNode: Node | null,
  index: number,
  resultArray: FlattendNode[],
  nodesBehindCursor?: Node | null
) => {
  const selection = window.getSelection();
  const remainingNode = resultArray[index];
  if (!remainingNode?.node) {
    if (pasteStartNode)
      insertNodesBehildCursor(pasteStartNode, nodesBehindCursor);
    return;
  }
  if (!selection) {
    console.error("need selection");
    return;
  }
  const range = selection.getRangeAt(0).cloneRange();
  if (!range) {
    console.error("need range");
    return;
  }
  if (resultArray.length <= 1) return;
  const listTag = searchParentListTag(range.endContainer);
  const p = searchParentNodeForNodeName(range.endContainer, "P");

  switch (remainingNode.nodeName) {
    case "UL":
    case "OL":
    default:
      {
        if (listTag) {
          const pastePointRange = new Range();
          pastePointRange.selectNode(listTag);
          pastePointRange.collapse(false);
          pastePointRange.insertNode(remainingNode.node);
          const lastNode = searchLastChildForNodename(
            remainingNode.node,
            "SPAN"
          )?.firstChild?.parentElement;
          if (lastNode) {
            lastNode?.setAttribute("class", classNames.lastNode);
          }
          break;
        } else if (p) {
          const pastePointRange = new Range();
          pastePointRange.selectNode(p);
          pastePointRange.collapse(false);
          pastePointRange.insertNode(remainingNode.node);
          const lastNode = searchLastChildForNodename(
            remainingNode.node,
            "SPAN"
          )?.firstChild?.parentElement;
          if (lastNode) {
            lastNode?.setAttribute("class", classNames.lastNode);
          } else {
            console.error("need lastSpan");
          }
        }
      }
      break;
  }

  // {
  //   const lastNode = searchLastChildForNodename(remainingNode.node, "SPAN")
  //     ?.firstChild?.parentElement;
  //   if (lastNode) {
  //     lastNode?.setAttribute("class", classNames.lastNode);
  //   }

  //   range.insertNode(remainingNode.node);
  // }
  const lastNode = moveCursorToClassName(selection, classNames.lastNode);

  if (!!resultArray[index + 1])
    pasteRemainingNodes(lastNode, index + 1, resultArray, nodesBehindCursor);
  else {
    if (lastNode) insertNodesBehildCursor(lastNode, nodesBehindCursor);
  }
};
const insertNodesBehildCursor = (
  lastNode: Node,
  nodesBehindCursor?: Node | null
) => {
  if (nodesBehindCursor) {
    const newRange = new Range();
    const lastSpan = searchParentNodeForNodeName(lastNode, "SPAN");
    if (lastSpan) newRange.selectNode(lastSpan);
    newRange.collapse(false);
    const flattenNodes = postProcessAfterFlatten(
      flattenChildNodes(nodesBehindCursor)
    );
    const fragment = document.createDocumentFragment();
    for (const node of flattenNodes) {
      const newNode = node.node?.firstChild?.parentElement;
      if (newNode) {
        if (node.style) {
          copyAndPasteStyle(newNode, node.style);
        }
        fragment.appendChild(newNode);
      }
    }

    newRange.insertNode(fragment);
  }
};
export default pasteRemainingNodes;
