import { notAllowedTagsInParagraph } from "@/components/headless/Editor/configs";
import { searchFlattenNodeIndex } from "@/components/headless/Editor/nodeHandlers/searchNodes";
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
          isParent: true,
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
          isParent: false,
          style: node?.parentElement
            ? window.getComputedStyle(node?.parentElement)
            : null,
          node: span,
          text: span.textContent || "",
          nodeIndex: nodeIndex ?? [],
          nodeName: span.nodeName,
          parentIndex,
        },
      ];
    }

    case "LI":
      {
        if (node.parentElement)
          array.push([
            {
              isParent: true,
              style: window.getComputedStyle(node?.parentElement),
              node,
              text: node.textContent || "",
              nodeIndex: nodeIndex ? [...nodeIndex] : [],
              nodeName: node.nodeName,
              parentIndex,
            },
          ]);
      }
      break;
    case "SPAN":
      if (node.childNodes.length === 1) {
        const span = document.createElement("span");
        span.textContent = node.textContent;
        return [
          {
            isParent: false,
            style: node?.parentElement
              ? window.getComputedStyle(node?.parentElement)
              : null,
            node: span,
            text: span.textContent || "",
            nodeIndex: nodeIndex ?? [],
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
        ) {
          array.push({
            isParent: true,
            style: childNode?.firstChild?.parentElement
              ? window.getComputedStyle(childNode?.firstChild?.parentElement)
              : null,
            node: childNode,
            text: "",
            nodeIndex: nodeIndex ? [...nodeIndex, i] : [i],
            nodeName: childNode.nodeName,
            parentIndex,
          });
        }
        array.push(
          flattenChildNodes(childNode, nodeIndex ? [...nodeIndex, i] : [i])
        );
      }
    }
  }
  return array.flat(Infinity);
};
const postProcessAfterFlatten = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  let resultNodes = eliminateConsecutiveRepeatBr(newNodes);
  resultNodes = eliminateConsecutiveRepeatNewLine(resultNodes);
  resultNodes = elminateEmptyTextNode(resultNodes);
  resultNodes = elimiateEmptyChildNodes(resultNodes);
  const searchResult = searchFlattenNodeIndex(flattendNodes, [0]);
  if (searchResult !== -1 && resultNodes[searchResult]?.nodeName === "META")
    resultNodes.splice(searchResult, 1);

  return resultNodes;
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
const elminateEmptyTextNode = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    if (!notAllowedTagsInParagraph.includes(node.nodeName.toLowerCase()))
      if (!node.text) newNodes.splice(i, 1);
  }
  return newNodes;
};
const eliminateConsecutiveRepeatNewLine = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (node?.isParent && node?.nodeName === prevNode.node?.nodeName) {
      newNodes.splice(i, 1);
      i = i - 1;
    }
  }
  return newNodes;
};
const elimiateEmptyChildNodes = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const { node } = newNodes[i];
    switch (node?.nodeName) {
      case "P":
        if (node?.childNodes?.length === 0) newNodes.splice(i, 1);
        if (
          node?.childNodes?.length === 1 &&
          node?.childNodes[0].nodeName === "SPAN" &&
          !node?.textContent
        )
          newNodes.splice(i, 1);
        break;
    }
  }
  return newNodes;
};
export { flattenChildNodes, postProcessAfterFlatten };
