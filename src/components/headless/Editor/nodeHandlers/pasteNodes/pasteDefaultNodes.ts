import { classNames, nodeNames } from "@/components/headless/Editor/configs";
import {
  insertTagAtOffsets,
  moveCursorToClassName,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import {
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";

const pasteDefaultNode = (
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
    //일단 선택한 부분을 없앰 없앤 후 flatten한 노드들을 재배치함
    range.deleteContents();

    endOffset = startOffset;
  }
  const newRange = new Range();
  newRange.setStart(endNode, endOffset);
  const lastRangePoint = searchParentNodeForNodeName(endNode, "P")?.lastChild;
  if (lastRangePoint) newRange.setEnd(lastRangePoint, 1);
  const remainingNodes = newRange.cloneContents();
  //셀렉션의 시작노드의 p태그를 찾음
  const parentP = searchParentNodeForNodeName(startNode, "P");
  range.deleteContents();
  switch (startNode.nodeName) {
    //div일 경우는 p가 없거나 셀렉트가 잘못된 경우
    case "DIV":
      if (firstChildNode?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
          if (i === firstChildNode.childNodes?.length - 1) {
            //마지막 노드에 커서이동을 위한 클래스 부여
            firstChildNode.childNodes[i].className = classNames.lastNode;
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
            firstChildNode.childNodes[i].className = classNames.lastNode;
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
                firstChildNode.childNodes[i].className = classNames.lastNode;
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

            if (resultArray[0]?.childNodes) {
              const fragment = document.createDocumentFragment();
              for (let i = 0; i < resultArray[0]?.childNodes?.length; i += 1) {
                if (i === resultArray[0]?.childNodes?.length - 1)
                  //마지막 노드에 커서이동을 위한 클래스 부여
                  resultArray[0].childNodes[i].className = classNames.lastNode;
                fragment.appendChild(resultArray[0].childNodes[i]);
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
  //커서 이동후 마지막 노드를 가져옴
  const lastNode = moveCursorToClassName(selection, classNames.lastNode);
  //첫번째노드 삽입 후  남아있는 노드들을 추가함
  pasteRemainingNodes(lastNode, selection, resultArray, remainingNodes);
};

const pasteRemainingNodes = (
  lastNode: Node | null,
  selection: Selection,
  resultArray: FlattendNode[],
  remainingNodes: Node | null
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
  const postEndNodeRange = new Range();
  const firstLineParentP = searchParentNodeForNodeName(lastNode, "P");
  if (!firstLineParentP) {
    console.error("need firstLineParentP", lastNode.parentElement);
    return;
  }

  postEndNodeRange.setStartAfter(lastNode);
  if (firstLineParentP?.lastChild)
    postEndNodeRange.setEndAfter(firstLineParentP?.lastChild);

  postEndNodeRange.deleteContents();
  //p태그들 집어넣기

  //p태그들을 집어넣을 커서 포인트
  let nextPastePointRange = new Range();
  nextPastePointRange.setEndAfter(firstLineParentP);
  nextPastePointRange.setStartAfter(firstLineParentP);
  const lastResultNode = resultArray[resultArray?.length - 1];
  const isLastNodeIsBr = lastResultNode.nodeName === nodeNames.BR_P;
  console.log(remainingNodes);
  for (let i = 1; i < resultArray.length; i += 1) {
    const { node } = resultArray[i];
    if (!node) break;

    node.firstChild?.parentElement?.setAttribute("class", classNames.lastNode);
    nextPastePointRange.insertNode(node);
    const lastAddedNode = moveCursorToClassName(selection, classNames.lastNode);
    //추가한 노드의 p태그를 찾음
    const parentP = searchParentNodeForNodeName(node, "P");
    if (!parentP) break;
    nextPastePointRange.setStartAfter(parentP);
    nextPastePointRange.setEndAfter(parentP);
    //추가한 p태그에 커서 이동을 위한 클래스 부여
    parentP.lastChild?.parentElement?.setAttribute(
      "class",
      classNames.lastNode
    );
    moveCursorToClassName(selection, classNames.lastNode);
    //마지막 p에 뒤에 남아있던 노드들 집어넣기
    //마지막 p가 br태그일 경우 새로운 노드를 만듬

    if (i === resultArray.length - 1 && lastAddedNode?.lastChild) {
      if (isLastNodeIsBr) {
        const p = document.createElement("p");
        if (remainingNodes) p.appendChild(remainingNodes);
        nextPastePointRange.insertNode(p);
        nextPastePointRange.setStartAfter(lastAddedNode);
        nextPastePointRange.setEndAfter(lastAddedNode);
        selection.removeAllRanges();
        selection.addRange(nextPastePointRange);
      } else {
        postEndNodeRange.setStartAfter(lastAddedNode.lastChild);
        postEndNodeRange.setEndAfter(lastAddedNode.lastChild);
        if (remainingNodes) postEndNodeRange.insertNode(remainingNodes);
      }
    }
  }
};
export default pasteDefaultNode;
