import { notAllowedTagsInParagraph } from "@/components/headless/Editor/configs";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const flattenChildNodes = (
  node: Node,
  nodeIndex?: number[]
): FlattendNode[] => {
  if (node.nodeType === 3) {
    const span = document.createElement("span");
    span.textContent = (node as Text).data;
    return [
      {
        isParentNode: false,
        style: node.parentElement?.style || null,
        node: span,
        text: span.textContent,
        nodeIndex,
      },
    ];
  }
  if (node.nodeName === "BR") {
    return [{ isParentNode: false, style: null, node, text: "" }];
  }

  if (node.childNodes.length === 1) {
    if (node.firstChild?.nodeType === 3) {
      return [
        {
          isParentNode: false,
          style: node.firstChild.parentElement?.style || null,
          node: node,
          text: node.textContent || "",
          nodeIndex,
        },
      ];
    }
  }
  const array: any[] = [];
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = node.childNodes.item(i);
    if (notAllowedTagsInParagraph.includes(childNode.nodeName.toLowerCase()))
      array.push({
        isParentNode: true,
        style: childNode?.firstChild?.parentElement?.style || null,
        node: childNode,
        text: "",
        nodeIndex: nodeIndex ? [...nodeIndex, i] : [i],
      });
    array.push(
      flattenChildNodes(childNode, nodeIndex ? [...nodeIndex, i] : [i])
    );
  }
  return array.flat(Infinity);
};

const postProcessAfterFlatten = (flattenNodes: FlattendNode[]) => {
  const newNodes = [...flattenNodes];
  let resultNode = elminateFirstIndexPTag(newNodes);
  resultNode = eliminateConsecutiveRepeatBr(resultNode);
  return resultNode;
};
const eliminateConsecutiveRepeatBr = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (
      node.node?.nodeName === "BR" &&
      node.node?.nodeName === prevNode.node?.nodeName
    ) {
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
      return array[mid];
    } else if (
      array[mid].nodeIndex &&
      isLessThan(array[mid].nodeIndex || [], nodeIndex)
    ) {
      left = mid + 1; // 중간값이 타겟보다 작으면 오른쪽 부분 탐색
    } else {
      right = mid - 1; // 중간값이 타겟보다 크면 왼쪽 부분 탐색
    }
  }

  return null;
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
