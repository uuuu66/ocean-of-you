import { classNames, nodeNames } from "@/components/headless/Editor/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { insertTagAtOffsets } from "@/components/headless/Editor/nodeHandlers/common/utils";
import insertDefaultNode from "@/components/headless/Editor/nodeHandlers/pasteNodes/pasteDefaultNodes";
import pasteListNodes from "@/components/headless/Editor/nodeHandlers/pasteNodes/pasteListNodes";
import {
  searchFirstChildForNodename,
  searchParentListTag,
  searchParentNodeForNodeName,
  searchTextNode,
  searchTextNodeAtOffset,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import _ from "lodash";

const pasteNodesToSelection = (
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  if (!resultArray) {
    console.error("need resultArray");
    return;
  }
  const selection = window.getSelection();
  if (!selection) {
    console.error("need selection");
    return;
  }
  if (!resultArray[0]) return;
  console.log(resultArray);
  pasteNode(selection, resultArray, targetElement);
};
const pasteNode = (
  selection: Selection,
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  while (resultArray[0]?.nodeName === nodeNames.BR_P) {
    resultArray.splice(0, 1);
  }

  const firstChildNode = resultArray[0];

  switch (firstChildNode.nodeName) {
    case "UL":
    case "OL":
      pasteListNodes(firstChildNode, selection);
      break;
    default: {
      //첫번째 줄은 기존에 존재하는 p태그의 child로 추가해야됨
      //따로 처리함
      insertDefaultNode(firstChildNode, selection, resultArray, targetElement);
    }
  }
};

export { pasteNodesToSelection };
