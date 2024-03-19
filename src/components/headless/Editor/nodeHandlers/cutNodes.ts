import { classNames } from "@/components/headless/Editor/configs";
import { insertTagAtOffsets } from "@/components/headless/Editor/nodeHandlers/common";
import {
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/searchNodes";

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
      if (!parentSpan?.nextElementSibling) {
        parentSpan.setAttribute("class", classNames.lastNode);
        break;
      }
      endNode = parentSpan?.nextElementSibling?.firstChild;
    }
    return postSelectionRange;
  }
};
const copyAndPastePostSelectionContent = (postSelectionRange: Range) => {
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
    if (
      postSelectionContent.firstChild?.firstChild?.parentElement?.className ===
        classNames.lastNode &&
      !postSelectionContent.firstChild.textContent
    ) {
      selection.deleteFromDocument();
    }
    selection.removeAllRanges();
    selection.addRange(postSelectionRange);
    postSelectionContent.firstChild?.firstChild?.parentElement?.setAttribute(
      "id",
      classNames.firstNode
    );
    const insertPointRange = range.cloneRange();
    insertPointRange.collapse(true);
    if (insertPointRange.commonAncestorContainer.nodeName === "DIV") return;

    if (postSelectionContent.childNodes.length > 0)
      insertTagAtOffsets({
        node: searchTextNode(startNode),
        startOffset: insertPointRange.startOffset,
        endOffset: insertPointRange.startOffset,
        content: postSelectionContent,
      });
  }
};
const deletePostSelectionContent = () => {
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
    selection.deleteFromDocument();
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
    const cursorAfterCutPoint = document.getElementById(classNames.firstNode);
    if (!cursorAfterCutPoint) {
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
  deletePostSelectionContent,
};
