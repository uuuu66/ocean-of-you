import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  insertTagAtOffsets,
  removeRangeContent,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import {
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";

const makePostSelectionRange = () => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
  if (anchorNode && focusNode) {
    let startNode = anchorNode;
    let endNode: Node | null = focusNode;
    let endOffset = focusOffset;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      startNode = focusNode;
      endNode = anchorNode;
      endOffset = anchorOffset;
    }
    const postSelectionRange = new Range();
    postSelectionRange.setStart(endNode, endOffset);
    startNode.firstChild?.parentElement?.setAttribute(
      "id",
      classNames.firstNode
    );
    //다음 형제 노드가 없을때까지 그 노드들을 선택해서 range에 추가함
    while (true) {
      if (!endNode) break;
      let parentSpan: HTMLElement | null =
        searchParentNodeForNodeName(endNode, "SPAN")?.firstChild
          ?.parentElement || null;
      if (endNode.nodeName === "P") {
        const textNode = searchTextNode(endNode);
        if (textNode) {
          parentSpan =
            searchParentNodeForNodeName(textNode, "SPAN")?.firstChild
              ?.parentElement || null;
        } else {
          parentSpan = endNode.firstChild?.firstChild?.parentElement || null;
        }
      }
      if (!parentSpan) {
        break;
      }
      if (parentSpan) postSelectionRange.setEndAfter(parentSpan);
      //노드 삭제를 위한 클래스부여
      if (!parentSpan?.nextElementSibling) {
        parentSpan.setAttribute("class", classNames.lastNode);
        break;
      }
      endNode = parentSpan?.nextElementSibling?.firstChild;
    }
    return postSelectionRange;
  }
};
const copyAndPastePostSelectionContent = () => {
  //선택한 부분 뒤에 있는 노드들 선택
  const postSelectionRange = makePostSelectionRange();
  if (!postSelectionRange) return;
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode } = selection;
  if (anchorNode && focusNode) {
    let startNode = anchorNode;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      startNode = focusNode;
    }
    const postSelectionContent = postSelectionRange.extractContents();

    //뒤에 있는 노드들 중 첫번째 노드
    const postSelectionFirstElement =
      postSelectionContent.firstChild?.firstChild?.parentElement;
    //뒤에 노드가 없을 경우
    if (
      postSelectionFirstElement?.className === classNames.lastNode &&
      !postSelectionFirstElement.textContent
    ) {
      removeRangeContent(range);
    }
    selection.removeAllRanges();
    selection.addRange(postSelectionRange);
    //첫번째 노드에 커서이동을 위한 아이디를 부여함
    postSelectionFirstElement?.setAttribute("id", classNames.firstNode);
    //현재 커서위치 복사
    const insertPointRange = range.cloneRange();
    //첫번째 포인트로 접음
    insertPointRange.collapse(true);
    if (insertPointRange.commonAncestorContainer.nodeName === "DIV") return;
    //복사한 뒷부분 노드들을 삽입함

    if (postSelectionContent.textContent?.trim()?.length)
      insertTagAtOffsets({
        node: searchTextNode(startNode),
        startOffset: insertPointRange.startOffset,
        endOffset: insertPointRange.startOffset,
        content: postSelectionContent,
      });
  }
};
const deleteSelectionContent = () => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode } = selection;
  if (anchorNode && focusNode) {
    let startNode = anchorNode;
    let endNode = focusNode;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      startNode = focusNode;
      endNode = anchorNode;
    }

    if (!startNode?.parentElement) {
      console.error("need startnodeParent");
      return;
    }
    if (!endNode?.parentElement) {
      console.error("need endnodeParent");
      return;
    }

    //makePostContent에서 마지막 노드에 부여한 클래스명을 찾아서 다음 노드 부터 삭제함
    const deleteStartPoint = document.getElementsByClassName(
      classNames.lastNode
    )[0];
    if (!deleteStartPoint) return;
    const deleteRange = new Range();
    deleteRange.setStartAfter(deleteStartPoint);
    deleteRange.setEndAfter(selection.getRangeAt(0).endContainer);
    selection.removeAllRanges();
    selection.addRange(deleteRange);
    deleteStartPoint.removeAttribute("class");
    removeRangeContent(selection.getRangeAt(0));
  }
};
const moveCursorToCutPoint = () => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode } = selection;
  if (anchorNode && focusNode) {
    let startNode = anchorNode;
    let endNode = focusNode;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      startNode = focusNode;
      endNode = anchorNode;
    }
    if (!startNode?.parentElement) {
      console.error("need startnodeParent");
      return;
    }
    if (!endNode?.parentElement) {
      console.error("need endnodeParent");
      return;
    }
    const cursorAfterCutRange = new Range();
    //잘라내기한 후 커서 이동로직
    //id로 커서 위치를 찾아냄
    const cursorAfterCutPoint = document.getElementById(classNames.firstNode);
    //노드가 존재하지않을 경우 endNode가 firstNode 였다거나 예외
    if (!cursorAfterCutPoint) {
      //startNode의 p태그를 찾아서 마지막 노드로 커서를 보냄
      const parentP = document.getElementsByClassName(classNames.firstP)[0];
      const span = document.createElement("span");
      const br = document.createElement("br");
      span.appendChild(br);
      parentP?.appendChild(span);
      cursorAfterCutRange.setStart(span, 1);
      cursorAfterCutRange.setEnd(span, 1);
      selection.removeAllRanges();
      selection.addRange(cursorAfterCutRange);
      parentP.removeAttribute("class");
      return;
    }
    cursorAfterCutRange.setStart(searchTextNode(cursorAfterCutPoint), 0);
    cursorAfterCutRange.setEnd(searchTextNode(cursorAfterCutPoint), 0);
    selection.removeAllRanges();
    selection.addRange(cursorAfterCutRange);
    cursorAfterCutPoint.removeAttribute("id");
  }
};

export {
  makePostSelectionRange,
  moveCursorToCutPoint,
  copyAndPastePostSelectionContent,
  deleteSelectionContent,
};
