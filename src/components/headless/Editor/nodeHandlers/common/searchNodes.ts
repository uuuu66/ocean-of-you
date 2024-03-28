import { listTags } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";

const searchTextNode = (node: Node): Text => {
  let target: Node | null = node;
  while (target?.firstChild) {
    if (!target) return target;
    if (target.nodeType === 3) {
      return target as Text;
    }
    target = target.firstChild;
  }
  return target as Text;
};
const searchParentNodeForNodeName = (node: Node | null, nodeName: string) => {
  let target: Node | null = node;
  while (target?.parentElement) {
    if (!target) return target;

    if (target.nodeName === nodeName) {
      return target;
    }
    target = target.parentElement;
  }
  return null;
};
const searchFlattenNodeIndex = (
  array: FlattendNode[],
  targetIndex: number[]
) => {
  let left = 0;
  let right = array.length - 1;
  const newArray = array
    .map((value, index) => ({ ...value, originalIndex: index }))
    .filter((node) => node.nodeIndex.length > 0 && node.nodeIndex[0] >= 0);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (
      JSON.stringify(newArray[mid]?.nodeIndex) === JSON.stringify(targetIndex)
    ) {
      return newArray[mid].originalIndex;
    } else if (isLessThan(newArray[mid]?.nodeIndex, targetIndex)) {
      left = mid + 1; // 중간값이 타겟보다 작으면 오른쪽 부분만 남김
    } else {
      right = mid - 1; // 중간값이 타겟보다 크면 왼쪽 부분만 남김
    }
  }

  return -1;
};
const findAllTextNodes = (node: Node, textNodes: Node[] = []) => {
  if (node.nodeType === Node.TEXT_NODE) {
    // 텍스트 노드인 경우, 배열에 추가
    textNodes.push(node);
  } else {
    // 텍스트 노드가 아닌 경우, 자식 노드를 재귀적으로 탐색
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      findAllTextNodes(childNode, textNodes);
    }
  }
  return textNodes;
};
const searchTextNodeAtOffset = (node: Node, offset: number) => {
  let sum = 0;

  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = searchTextNode(node.childNodes[i]);

    sum += (childNode as Text)?.data?.length || 0;
    if (sum >= offset) {
      return { sum, childNode, offset: sum - offset };
    }
  }
  return { sum: 0, childNode: searchTextNode(node.firstChild as Node) };
};
const searchFirstChildForNodename = (node: Node | null, nodeName: string) => {
  let target: Node | null = node;
  while (target?.firstChild) {
    if (!target) return target;

    if (target.nodeName === nodeName) {
      return target;
    }
    target = target.firstChild;
  }
  return null;
};
const searchLastChildForNodename = (node: Node | null, nodeName: string) => {
  let target: Node | null = node;
  while (target?.lastChild) {
    if (!target) return target;

    if (target.nodeName === nodeName) {
      return target;
    }
    target = target.lastChild;
  }
  return null;
};
const searchParentListTag = (node: Node | null) => {
  let target: Node | null = node;
  while (target?.parentElement) {
    if (!target) return target;
    if (listTags.includes(target.nodeName.toLowerCase())) {
      return target;
    }
    target = target.parentElement;
  }
  return null;
};
const searchEmptyNodes = (node: Node | null) => {
  const nodesWithoutChildren: Node[] = [];
  function traverse(targetNode: Node | null) {
    if (!targetNode) return null;
    // 텍스트 노드인 경우 무시합니다.
    if (targetNode.nodeType === Node.TEXT_NODE) {
      return;
    }

    // childNodes를 가지지 않는 노드인 경우, 배열에 추가합니다.
    if (!targetNode.hasChildNodes()) {
      nodesWithoutChildren.push(targetNode);
    }

    // 자식 노드가 있는 경우 재귀적으로 호출합니다.
    if (targetNode.childNodes && targetNode.childNodes.length > 0) {
      for (var i = 0; i < targetNode.childNodes.length; i++) {
        traverse(targetNode.childNodes[i]);
      }
    }
  }

  // 문서 전체를 시작점으로 탐색합니다.
  traverse(node);

  return nodesWithoutChildren;
};
const searchEmptyTextNodes = (targetElement: Node) => {
  const nodesWithoutChildren: Node[] = [];

  for (let i = 0; i < targetElement.childNodes.length; i += 1) {
    const targetNode = targetElement.childNodes[i];
    if (!targetNode) return null;

    if (
      searchFirstChildForNodename(targetNode, "BR") &&
      searchFirstChildForNodename(targetNode, "P")?.childNodes?.length === 1
    ) {
      return;
    }
    // childNodes를 가지지 않는 노드인 경우, 배열에 추가합니다.
    if (!targetNode.textContent) {
      nodesWithoutChildren.push(targetNode);
    }
  }

  // 문서 전체를 시작점으로 탐색합니다.

  return nodesWithoutChildren;
};
//targetA가 compareB보다 먼저오면 true
const isLessThan = (targetA: number[], compareB: number[]) => {
  const length = Math.max(targetA?.length, compareB?.length);
  for (let i = 0; i < length; i += 1) {
    if (
      !targetA[i] &&
      targetA[i] !== 0 &&
      (compareB[i] === 0 || !!compareB[i])
    ) {
      return true;
    } else if (
      !compareB[i] &&
      compareB[i] !== 0 &&
      (targetA[i] === 0 || !!targetA[i])
    ) {
      return false;
    }
    if (targetA[i] === compareB[i]) {
      continue;
    } else {
      return targetA[i] < compareB[i];
    }
  }
  return false;
};
export {
  searchParentNodeForNodeName,
  searchTextNode,
  searchFlattenNodeIndex,
  searchTextNodeAtOffset,
  searchFirstChildForNodename,
  searchLastChildForNodename,
  findAllTextNodes,
  searchParentListTag,
  searchEmptyNodes,
  searchEmptyTextNodes,
};
