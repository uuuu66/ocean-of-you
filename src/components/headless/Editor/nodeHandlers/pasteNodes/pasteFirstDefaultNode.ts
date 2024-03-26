import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  insertTagAtOffsets,
  removeRangeContent,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import { searchParentNodeForNodeName } from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import getNodesAfterSelection from "@/components/headless/Editor/nodeHandlers/pasteNodes/getNodesAfterSelection";

const pasteFirstDefaultNode = (
  firstChildNode: FlattendNode,
  selection: Selection,
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  const range = selection.getRangeAt(0);
  if (!range) {
    console.error("need range");
    return;
  }
  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  if (!anchorNode || !focusNode) {
    console.error("need AnchorNode or FocusNode");
    return;
  }

  let startNode = anchorNode;
  let startOffset = anchorOffset || 0;
  let endOffset = focusOffset || 0;
  let endNode = focusNode;
  if (!range.collapsed) {
    //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
    //2 뒤에서 앞으로
    if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
      startNode = focusNode;
      endNode = anchorNode;
      startOffset = focusOffset;
      endOffset = anchorOffset;
    } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
      startNode = focusNode;
      startOffset = Math.min(anchorOffset, focusOffset);
      endOffset = Math.max(anchorOffset, focusOffset);
    }
  }
  //선택된 범위 뒤에오는 노드
  const nodesAfterSelection = getNodesAfterSelection(endNode, endOffset);

  removeRangeContent(range);
  //셀렉션의 시작노드의 p태그를 찾음
  const parentP = searchParentNodeForNodeName(startNode, "P");
  endOffset = startOffset;

  // removeRangeContent(range);
  switch (startNode.nodeName) {
    //div일 경우는 p가 없거나 셀렉트가 잘못된 경우
    case "DIV":
      if (firstChildNode?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
          if (i === firstChildNode.childNodes?.length - 1) {
            //마지막 노드에 커서이동을 위한 클래스 부여
            firstChildNode.childNodes[i].setAttribute(
              "class",
              classNames.lastNode
            );
          }
          fragment.appendChild(firstChildNode.childNodes[i]);
        }
        const newRange = new Range();
        newRange.setStart(startNode, range.startOffset);
        newRange.setEnd(startNode, range.endOffset);
        const p = document.createElement("p");
        p.appendChild(fragment);
        range.insertNode(p);
      }
      break;
    //p일 경우는 br태그이거나 셀렉트가 잘못된 경우
    case "P":
      if (firstChildNode?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
          if (i === firstChildNode.childNodes?.length - 1) {
            //마지막 노드에 커서이동을 위한 클래스 부여
            firstChildNode.childNodes[i].setAttribute(
              "class",
              classNames.lastNode
            );
          }
          fragment.appendChild(firstChildNode.childNodes[i]);
        }
        range.insertNode(fragment);
      }
      break;
    default:
      switch (!!parentP) {
        case true:
          if (firstChildNode?.childNodes) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
              if (i === firstChildNode.childNodes?.length - 1) {
                //마지막 노드에 커서이동을 위한 클래스 부여
                firstChildNode.childNodes[i].setAttribute(
                  "class",
                  classNames.lastNode
                );
              }
              fragment.appendChild(firstChildNode.childNodes[i]);
            }

            insertTagAtOffsets({
              node: startNode,
              startOffset,
              endOffset,
              content: fragment,
            });
          }
          break;
        case false:
          {
            const p = document.createElement("p");
            if (firstChildNode?.childNodes) {
              const fragment = document.createDocumentFragment();
              for (let i = 0; i < firstChildNode?.childNodes?.length; i += 1) {
                if (i === firstChildNode?.childNodes?.length - 1)
                  //마지막 노드에 커서이동을 위한 클래스 부여
                  firstChildNode.childNodes[i].setAttribute(
                    "class",
                    classNames.lastNode
                  );
                fragment.appendChild(firstChildNode.childNodes[i]);
              }
              p.appendChild(fragment);
              if (
                targetElement &&
                targetElement.childNodes?.length === 1 &&
                targetElement.firstChild
              )
                targetElement.removeChild(targetElement.firstChild);
              range.insertNode(p);
            }
          }
          break;
      }
  }
  return nodesAfterSelection;
};

export default pasteFirstDefaultNode;
