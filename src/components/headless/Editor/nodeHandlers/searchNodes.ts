import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const searchTextNode = (node: Node) => {
  let target: Node | null = node;
  while (target?.firstChild) {
    if (!target) return target;
    if (target.nodeType === 3) {
      return target;
    }
    target = target.firstChild;
  }
  return target;
};
const searchParentNodeForNodeName = (node: Node, nodeName: string) => {
  let target: Node | null = node;
  while (target?.parentElement) {
    if (!target) return target;
    if (target.nodeName === nodeName) {
      return target;
    }
    target = target.parentElement;
  }
  return target;
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
export { searchParentNodeForNodeName, searchTextNode, searchFlattenNode };
