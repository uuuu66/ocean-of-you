import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  searchParentNodeForNodeName,
  searchFirstChildForNodename,
  searchParentListTag,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { removeRangeContent } from "@/components/headless/Editor/nodeHandlers/common/utils";

const pasteFirstListNode = (
  firstChildNode: FlattendNode,
  selection: Selection
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
  let endNode = focusNode;
  let startOffset = anchorOffset || 0;
  let endOffset = focusOffset || 0;
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

    //일단 선택한 부분을 없앰 없앤 후 flatten한 노드들을 재배치함
  }
  const newRange = new Range();
  newRange.setStart(endNode, endOffset);
  const lastRangePoint = searchParentNodeForNodeName(endNode, "P")?.lastChild;
  if (lastRangePoint) newRange.setEnd(lastRangePoint, 1);
  const remainingNodes = newRange.cloneContents();
  //셀렉션의 시작노드의 p태그를 찾음
  const startNodeParentP = searchParentNodeForNodeName(startNode, "P");
  removeRangeContent(range);
  const parentListNode = document.createElement(
    firstChildNode.nodeName.toLowerCase()
  );
  if (firstChildNode.node)
    switch (startNode.nodeName) {
      //div일 경우는 p가 없거나 셀렉트가 잘못된 경우
      case "P":
      case "DIV":
        if (firstChildNode?.childNodes) {
          if (firstChildNode.style)
            copyAndPasteStyle(parentListNode, firstChildNode.style);
          for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
            parentListNode.appendChild(firstChildNode.childNodes[i]);
          }
          const firstChildP = searchFirstChildForNodename(parentListNode, "P");
          if (!firstChildP) {
            console.error("li does not have p");
            return;
          }
          const targetP = startNode.childNodes.item(startOffset - 1);
          if (targetP?.lastChild) {
            const newRange = new Range();
            newRange.setEndAfter(targetP);
            newRange.setStartAfter(targetP);
            newRange.insertNode(parentListNode);
          } else {
            range.insertNode(parentListNode);
          }
        }
        break;

      default:
        switch (!!startNodeParentP) {
          case true:
            if (firstChildNode?.childNodes) {
              const listTag = searchParentListTag(startNodeParentP);

              if (firstChildNode.style)
                copyAndPasteStyle(parentListNode, firstChildNode.style);
              for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
                parentListNode.appendChild(firstChildNode.childNodes[i]);
              }
              const firstChildP = searchFirstChildForNodename(
                parentListNode,
                "P"
              );
              if (!firstChildP) {
                console.error("li does not have p");
                return;
              }
              if (listTag) {
                range.setStartAfter(listTag);
                range.setEndAfter(listTag);
              } else {
                range.setStartAfter(startNodeParentP as Node);
                range.setEndAfter(startNodeParentP as Node);
              }
              range.insertNode(parentListNode);
            }
            break;
          case false:
            if (firstChildNode?.childNodes) {
              if (firstChildNode.style)
                copyAndPasteStyle(parentListNode, firstChildNode.style);
              for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
                parentListNode.appendChild(firstChildNode.childNodes[i]);
              }
              const firstChildP = searchFirstChildForNodename(
                parentListNode,
                "P"
              );
              if (!firstChildP) {
                console.error("li does not have p");
                return;
              }
              range.insertNode(parentListNode);
            }
            break;
        }
    }
  range.collapse(false);
  if (parentListNode.lastChild?.nodeName === "LI") {
    const p = searchFirstChildForNodename(parentListNode.lastChild, "P");
    if (p)
      p.lastChild?.firstChild?.parentElement?.setAttribute(
        "class",
        classNames.lastNode
      );
  } else {
    parentListNode.lastChild?.firstChild?.parentElement?.setAttribute(
      "class",
      classNames.lastNode
    );
  }
  return remainingNodes;
};

export default pasteFirstListNode;
