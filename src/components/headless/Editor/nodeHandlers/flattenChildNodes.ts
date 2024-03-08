import { notAllowedTagsInParagraph } from "@/components/headless/Editor/configs";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const flattenChildNodes = (
  node: Node,
  nodeIndex?: number[]
): FlattendNode[] => {
  const array: any[] = [];
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
const searchFlattenNode = (array: FlattendNode[], nodeIndex: number[]) => {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (JSON.stringify(array[mid].nodeIndex) === JSON.stringify(nodeIndex)) {
      return mid;
    } else if (
      array[mid].nodeIndex &&
      isLessThan(array[mid].nodeIndex || [], nodeIndex)
    ) {
      left = mid + 1; // 중간값이 타겟보다 작으면 오른쪽 부분 탐색
    } else {
      right = mid - 1; // 중간값이 타겟보다 크면 왼쪽 부분 탐색
    }
  }

  return -1;
};
const isLessThan = (compareA: number[], compareB: number[]) => {
  const length = Math.min(compareA.length, compareB.length);
  for (let i = 0; i < length; i += 1) {
    if (
      compareA[i] !== 0 &&
      compareB[i] !== 0 &&
      (!compareA[i] || !compareB[i])
    ) {
      return true;
    }
    if (compareA[i] < compareB[i]) return true;
    else if (compareA[i] === compareB[i]) {
      continue;
    } else if (compareA[i] > compareB[i]) return false;
  }
  return false;
};
export { flattenChildNodes, postProcessAfterFlatten, searchFlattenNode };
