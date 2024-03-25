import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { classNames, nodeNames } from "@/components/headless/Editor/configs";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";
import { searchFlattenNodeIndex } from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { camelToKebab } from "@/components/headless/Editor/nodeHandlers/common/utils";

const initializeParentNode = (parentNode: FlattendNode) => {
  const { nodeName, style } = parentNode;
  let newNode = null;

  switch (nodeName.toLowerCase()) {
    case "ol":
      newNode = document.createElement("ol");

      break;
    case "ul":
      newNode = document.createElement("ul");
      break;
    case "dl":
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
  const childNode = document.createElement(nodeName.toLowerCase());
  childNode.textContent = text;
  if (style) copyAndPasteStyle(childNode, style);
  return childNode;
};
const recomposeNode = (node: Node) => {
  const div = document.createElement("div");
  div.innerHTML = node.firstChild?.parentElement?.innerHTML || "";
  const flattendNodes = postProcessAfterFlatten(flattenChildNodes(div));
  const resultArray: FlattendNode[] = [];
  const nodeArray = [...flattendNodes];
  for (let i = 0; i < nodeArray.length; i += 1) {
    const flattendNode = nodeArray[i];
    const {
      isParent,
      parentIndex,
      text,
      nodeName: flattendNodeName,
    } = flattendNode;
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
          switch (flattendNodeName) {
            case "BR":
              {
                const newParent: FlattendNode = {
                  isParent: true,
                  node: document.createElement("p"),
                  nodeIndex: [-1],
                  nodeName: nodeNames.BR_P,
                  parentIndex: [],
                  style: null,
                  text: "",
                  childNodes: [],
                };
                const span = document.createElement("span");
                const br = initializeChildNode(flattendNode);
                span.appendChild(br);
                resultArray.push(newParent);
                resultArray[resultArray.length - 1].node?.appendChild(span);
                resultArray[resultArray.length - 1].childNodes?.push(span);
              }
              break;
            case "LI":
              {
                if (!flattendNode.node) break;
                const li = document.createElement("li");
                const p = document.createElement("p");
                let flattenedLi: FlattendNode[] = [];
                flattendNode?.node.childNodes.forEach(
                  (node) =>
                    (flattenedLi = [...flattenedLi, ...flattenChildNodes(node)])
                );

                for (let i = 0; i < flattenedLi?.length; i += 1) {
                  const childNode = flattenedLi[i];
                  p.appendChild(initializeChildNode(childNode));
                }
                li.appendChild(p);

                const parentNode = resultArray[parentNodeIndex];

                if (parentNode) {
                  parentNode.node?.appendChild(li);
                  parentNode.childNodes?.push(li);
                } else {
                }
              }
              break;
            default:
              if (parentNodeIndex >= 0) {
                if (!text) continue;

                const childNode = initializeChildNode(flattendNode);
                const parentNode = resultArray[parentNodeIndex];

                parentNode.node?.appendChild(childNode);
                parentNode.childNodes?.push(childNode);
              } else {
                //아닐경우 새로운 p를 만든 후 그 p에 텍스트를 넣음 새로운 p는 nodeIndex의 length가 0임 (index를 부여하지 않음 )
                const isParentExist =
                  resultArray[resultArray.length - 1]?.nodeIndex?.length === 0;
                //새로만든 p가 존재할경우
                if (isParentExist) {
                  const parentNode = resultArray[resultArray.length - 1];
                  const span = initializeChildNode(flattendNode);
                  parentNode?.node?.appendChild(span);
                  parentNode.childNodes?.push(span);
                  //아닐 경우
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
        }
        break;
    }
  }
  //정리되지 않은 노드들이 있을 경우 후처리
  for (let i = 0; i < resultArray.length; i += 1) {
    const { nodeName, childNodes } = resultArray[i];
    switch (nodeName) {
      case "BR":
        if (i === 0) resultArray.splice(i, 1);
        break;
      case "P":
        {
          if (childNodes?.length === 0) {
            resultArray.splice(i, 1);
          }
        }
        break;
    }
  }
  return resultArray;
};
export { recomposeNode };
