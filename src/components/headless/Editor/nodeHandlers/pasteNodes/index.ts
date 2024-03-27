import {
  classNames,
  nodeNames,
} from "@/components/headless/Editor/nodeHandlers/common/configs";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import _ from "lodash";
import pasteFirstDefaultNode from "@/components/headless/Editor/nodeHandlers/pasteNodes/pasteFirstDefaultNode";
import pasteFirstListNode from "@/components/headless/Editor/nodeHandlers/pasteNodes/pasteFirstListNode";
import { moveCursorToClassName } from "@/components/headless/Editor/nodeHandlers/common/utils";
import pasteRemainingNodes from "@/components/headless/Editor/nodeHandlers/pasteNodes/pasteRemainingNodes";

const pasteNodesToSelection = (
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  console.log(resultArray);
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

  //첫번째 노드를 검사 후 따로 처리
  switch (firstChildNode.nodeName) {
    case "UL":
    case "OL":
      {
        //첫번째 노드를 검사 후 따로 처리
        const nodesBehindCursor = pasteFirstListNode(firstChildNode, selection);
        console.log(firstChildNode, ">>", nodesBehindCursor);
        //커서 이동후 마지막 노드를 가져옴
        const lastNode = moveCursorToClassName(selection, classNames.lastNode);
        //첫번째노드 삽입 후  남아있는 노드들을 추가함

        pasteRemainingNodes(lastNode, 1, resultArray, nodesBehindCursor);
      }
      break;
    default:
      {
        //첫번째 노드를 검사 후 따로 처리
        const nodesBehindCursor = pasteFirstDefaultNode(
          firstChildNode,
          selection,
          resultArray,
          targetElement
        );
        //커서 이동후 마지막 노드를 가져옴
        const lastNode = moveCursorToClassName(selection, classNames.lastNode); //커서 이동후 마지막 노드를 가져옴
        //첫번째노드 삽입 후  남아있는 노드들을 추가함

        pasteRemainingNodes(lastNode, 1, resultArray, nodesBehindCursor);
      }
      break;
  }
};

export { pasteNodesToSelection };
