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
const searchFlattenNodeIndex = (
  array: FlattendNode[],
  targetIndex: number[]
) => {
  let left = 0;
  let right = array.length - 1;
  const newArray = array.filter((node) => node.nodeIndex.length > 0);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (
      JSON.stringify(newArray[mid]?.nodeIndex) === JSON.stringify(targetIndex)
    ) {
      return mid;
    } else if (isLessThan(newArray[mid]?.nodeIndex, targetIndex)) {
      left = mid + 1; // 중간값이 타겟보다 작으면 오른쪽 부분만 남김
    } else {
      right = mid - 1; // 중간값이 타겟보다 크면 왼쪽 부분만 남김
    }
  }

  return -1;
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
export { searchParentNodeForNodeName, searchTextNode, searchFlattenNodeIndex };
