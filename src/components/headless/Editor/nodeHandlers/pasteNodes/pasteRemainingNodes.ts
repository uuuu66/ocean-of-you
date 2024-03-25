import {
  nodeNames,
  classNames,
} from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  searchTextNode,
  searchParentNodeForNodeName,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { moveCursorToClassName } from "@/components/headless/Editor/nodeHandlers/common/utils";

const pasteRemainingNodes = (
  lastNode: Node | null,
  selection: Selection,
  resultArray: FlattendNode[],
  nodesBehindCursor?: Node | null
) => {
  if (resultArray.length <= 1) return;
  if (!lastNode) {
    console.error("need lastNode");
    return;
  }
  const lastTextNode = searchTextNode(lastNode);
  if (!lastTextNode) {
    console.error("need lastTextNode");
    return;
  }
  const firstLineParentP = searchParentNodeForNodeName(lastNode, "P");
  if (!firstLineParentP) {
    console.error("need firstLineParentP", lastNode.parentElement);
    return;
  }
  console.log(resultArray);
};
export default pasteRemainingNodes;
