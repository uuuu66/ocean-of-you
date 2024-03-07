import { classNames } from "@/components/headless/Editor/configs";
import { flattenChildNodes } from "@/components/headless/Editor/nodeHandlers/common";

export interface RecomposedNodes {
  firstNode: Node | null;
  lastNode: Node | null;
  originalNode: Node;
}
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

const processNodeWithIndex = (
  node: Node,
  index: number,
  parentElement: Element
) => {
  const { nodeName } = node;
  const fragment = document.createDocumentFragment();
  const isFirstNode = index === 0;

  return fragment;
};
//첫번째 div나 p section은 무시함. 그 안에 div p가 있어도 일단 밖으로 꺼냄 . 그 후에 가공
const recomposeNode = (node: Node): RecomposedNodes => {
  const div = document.createElement("div");
  div.innerHTML = node.firstChild?.parentElement?.innerHTML || "";
  const { childNodes } = div;
  console.log("ori=>", div);
  console.log(flattenChildNodes(div));
  const fragment = document.createDocumentFragment();
  const section = document.createElement("section");
  //   for (let i = 0; i < nodeArray.length; i += 1) {
  //     const node = nodeArray[i];
  //     const processedNode = processNodeWithIndex(node, i, section);
  //     fragment.appendChild(processedNode);
  //     section.appendChild(processedNode);
  //   }

  return {
    firstNode: fragment.firstChild,
    lastNode: fragment.lastChild,
    originalNode: fragment,
  };
};
export { recomposeNode };
