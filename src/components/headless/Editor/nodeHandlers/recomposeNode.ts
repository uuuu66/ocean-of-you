import { classNames } from "@/components/headless/Editor/configs";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";
import {
  FlattendNode,
  RecomposedNodes,
} from "@/components/headless/Editor/nodeHandlers/types";

//fragment 를 만든 후 Node안에 있는 childNode들을 가공한 후 fragment의 child에 추가함
const recomposeNodeToSpan = (node: Node): Node => {
  const fragment = document.createDocumentFragment();
  const { childNodes } = node;
  const nodeArray = Array.from(childNodes);

  for (let i = 0; i < nodeArray.length; i += 1) {
    const childNode = nodeArray[i];
    switch (childNode.nodeName) {
      case "#text":
        const span = document.createElement("span");
        span.textContent = (childNode as Text).data;
        if (span.textContent) fragment.appendChild(span);
        break;
      case "SPAN":
      default:
        const recomposedSpan = recomposeNodeToSpan(childNode);
        if (recomposedSpan.textContent) fragment.appendChild(recomposedSpan);
    }
  }

  return fragment;
};

const processNodeWithIndex = (flattenNode: FlattendNode) => {
  const { isNewLine, node, nodeIndex, nodeName, style, text } = flattenNode;

  const fragment = document.createDocumentFragment();

  return fragment;
};

const recomposeNode = (node: Node): RecomposedNodes => {
  const div = document.createElement("div");
  div.innerHTML = node.firstChild?.parentElement?.innerHTML || "";
  const flattendNodes = postProcessAfterFlatten(flattenChildNodes(div));
  const fragment = document.createDocumentFragment();
  console.log(flattendNodes);
  for (let i = 0; i < flattendNodes.length; i += 1) {
    const node = flattendNodes[i];
    if (node.isNewLine === true) {
      const p = document.createElement("p");
    }
    processNodeWithIndex(node);
  }
  return {
    firstNode: fragment.firstChild,
    lastNode: fragment.lastChild,
    originalNode: fragment,
  };
};
export { recomposeNode };
