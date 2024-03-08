import { notAllowedTagsInParagraph } from "@/components/headless/Editor/configs";
import { searchFlattenNode } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const flattenChildNodes = (
  node: Node,
  nodeIndex?: number[]
): FlattendNode[] => {
  const array: any[] = [];
  const parentIndex = nodeIndex ? nodeIndex.slice(0, -1) : [];
  switch (node.nodeName) {
    case "BR":
      return [
        {
          isNewLine: true,
          nodeIndex: nodeIndex ?? [],
          style: null,
          node,
          text: "",
          nodeName: node.nodeName,
          parentIndex,
        },
      ];
    case "#text": {
      const span = document.createElement("span");
      span.textContent = (node as Text).data;
      return [
        {
          isNewLine: false,
          style: node?.parentElement?.style ?? null,
          node: span,
          text: span.textContent || "",
          nodeIndex: nodeIndex ? [...nodeIndex] : [],
          nodeName: span.nodeName,
          parentIndex,
        },
      ];
    }
    case "SPAN":
      if (node.childNodes.length === 1) {
        const span = document.createElement("span");
        span.textContent = node.textContent;
        return [
          {
            isNewLine: false,
            style: node?.parentElement?.style ?? null,
            node: span,
            text: span.textContent || "",
            nodeIndex: nodeIndex ? [...nodeIndex] : [],
            nodeName: span.nodeName,
            parentIndex,
          },
        ];
      }
    default: {
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const childNode = node.childNodes.item(i);
        if (
          notAllowedTagsInParagraph.includes(childNode.nodeName.toLowerCase())
        )
          array.push({
            isNewLine: true,
            style: childNode?.firstChild?.parentElement?.style || null,
            node: childNode,
            text: "",
            nodeIndex: nodeIndex ? [...nodeIndex, i] : [i],
            nodeName: childNode.nodeName,
            parentIndex,
          });

        array.push(
          flattenChildNodes(childNode, nodeIndex ? [...nodeIndex, i] : [i])
        );
      }
    }
  }

  return array.flat(Infinity);
};

const postProcessAfterFlatten = (flattenNodes: FlattendNode[]) => {
  const newNodes = [...flattenNodes];
  let resultNode = elminateFirstIndexPTag(newNodes);
  resultNode = eliminateConsecutiveRepeatBr(resultNode);
  resultNode = eliminateConsecutiveRepeatNewLine(resultNode);
  const searchResult = searchFlattenNode(flattenNodes, [0]);
  if (searchResult !== -1 && resultNode[searchResult]?.nodeName === "META")
    resultNode.splice(searchResult, 1);

  return resultNode;
};
const eliminateConsecutiveRepeatBr = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (node?.nodeName === "BR" && node?.nodeName === prevNode.node?.nodeName) {
      newNodes.splice(i, 1);
      i = i - 1;
    }
  }
  return newNodes;
};
const eliminateConsecutiveRepeatNewLine = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (node?.isNewLine && node?.nodeName === prevNode.node?.nodeName) {
      newNodes.splice(i, 1);
      i = i - 1;
    }
  }
  return newNodes;
};
const elminateFirstIndexPTag = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  if (newNodes[0].node?.nodeName === "P") {
    newNodes.splice(0, 1);
  }
  return newNodes;
};

export { flattenChildNodes, postProcessAfterFlatten };
