import { copyAndPasteStyle } from "@/components/headless/Editor/addStyleToSelection";
import { classNames } from "@/components/headless/Editor/configs";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";
import { searchFlattenNodeIndex } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const initializeParentNode = (parentNode: FlattendNode) => {
  const { nodeName, style } = parentNode;
  let newNode = null;

  switch (nodeName.toLowerCase()) {
    case "pre":
    case "div":
      newNode = document.createElement("p");
      break;
    default:
      newNode = document.createElement(nodeName.toLowerCase());
  }

  if (style) copyAndPasteStyle(newNode, style);
  return newNode;
};
const initializeChildNode = (node: FlattendNode): HTMLElement => {
  const { nodeName, style, text } = node;
  const span = document.createElement(nodeName.toLowerCase());
  span.textContent = text;
  if (style) copyAndPasteStyle(span, style);
  return span;
};
const recomposeNode = (node: Node) => {
  const div = document.createElement("div");
  div.innerHTML = node.firstChild?.parentElement?.innerHTML || "";
  const flattendNodes = postProcessAfterFlatten(flattenChildNodes(div));
  const resultArray: FlattendNode[] = [];
  const nodeArray = [...flattendNodes];
  for (let i = 0; i < nodeArray.length; i += 1) {
    const flattendNode = nodeArray[i];
    const { isParent, parentIndex, text } = flattendNode;
    let parentNodeIndex = -1;
    let targetIndex = parentIndex;
    while (true) {
      parentNodeIndex = searchFlattenNodeIndex(resultArray, targetIndex);
      targetIndex = targetIndex.slice(0, -1);
      if (targetIndex.length === 0) {
        break;
      }
      if (parentNodeIndex >= 0) {
        break;
      }
    }

    switch (isParent) {
      case true:
        {
          const node = initializeParentNode(flattendNode);

          const newFlattendNode: FlattendNode = {
            ...flattendNode,
            isParent,
            parentIndex,
            text,
            node: node,
            nodeName: node.nodeName,
            childNodes: [],
          };

          resultArray.push(newFlattendNode);
        }
        break;
      case false:
      default:
        {
          if (parentNodeIndex >= 0) {
            if (!text) continue;
            const span = initializeChildNode(flattendNode);
            const parentNode = resultArray[parentNodeIndex];
            parentNode.node?.appendChild(span);
            parentNode.childNodes?.push(span);
          } else {
            const isParentExist =
              resultArray[resultArray.length - 1]?.nodeIndex?.length === 0;
            if (isParentExist) {
              const parentNode = resultArray[resultArray.length - 1];
              const span = initializeChildNode(flattendNode);
              parentNode?.node?.appendChild(span);
              parentNode.childNodes?.push(span);
            } else {
              const newParent: FlattendNode = {
                isParent: true,
                nodeIndex: [],
                node: document.createElement("p"),
                nodeName: "P",
                parentIndex: [],
                style: null,
                text: "",
                childNodes: [],
              };
              const span = initializeChildNode(flattendNode);
              resultArray.push(newParent);
              resultArray[resultArray.length - 1].node?.appendChild(span);
              resultArray[resultArray.length - 1].childNodes?.push(span);
            }
          }
        }
        break;
    }
  }
  return resultArray;
};
export { recomposeNode };
