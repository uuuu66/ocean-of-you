import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  searchLastChildForNodename,
  searchParentNodeForNodeName,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";

const getNodesAfterSelection = (endNode: Node, endOffset: number) => {
  //붙여넣기 할 부분의 뒤에 있는 노드 추출
  const newRange = new Range();
  newRange.setStart(endNode, endOffset);
  const endNodeParentP = searchParentNodeForNodeName(endNode, "P");
  const lastRangePoint = searchLastChildForNodename(endNodeParentP, "SPAN");
  console.log(lastRangePoint);
  if (lastRangePoint) {
    newRange.setEnd(lastRangePoint, 1);
  } else {
    const span = document.createElement("span");
    const br = document.createElement("br");
    span.appendChild(br);
    endNodeParentP?.appendChild(span);
    newRange.setEnd(span, 1);
  }
  const remainingNodes = newRange.extractContents();

  return remainingNodes;
};
export default getNodesAfterSelection;
