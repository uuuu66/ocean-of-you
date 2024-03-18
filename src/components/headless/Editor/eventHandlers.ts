import { classNames } from "@/components/headless/Editor/configs";
import {
  divideNodeIntoThreePart,
  insertTagAtOffsets,
  removeEmptyNode,
} from "@/components/headless/Editor/nodeHandlers/common";
import {
  moveCursorToClassName,
  pasteNodesToSelection,
} from "@/components/headless/Editor/nodeHandlers/pasteNodes";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import {
  findAllTextNodes,
  searchParentNodeForNodeName,
  searchTextNode,
  searchTextNodeAtOffset,
} from "@/components/headless/Editor/nodeHandlers/searchNodes";

const handleEditorKeyDown = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    if (!targetElement.innerHTML) {
      const p = document.createElement("p");
      const span = document.createElement("span");
      const br = document.createElement("br");
      p.appendChild(span);
      span.appendChild(br);
      targetElement.appendChild(p);
    }

    switch (e.code) {
      case "KeyX":
        if (!!window.getSelection()?.getRangeAt(0).collapsed) {
          e.preventDefault();
          break;
        }
      case "MetaLeft":
      case "MetaRight":
      case "KeyD":
      case "KeyV":
      case "KeyC":
        if (e.ctrlKey || e.metaKey) break;
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowDown":
      case "ArrowUp":
        break;
      case "Enter":
        if (!targetElement.innerHTML) {
          e.preventDefault();
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          p.appendChild(span);
          span.appendChild(br);
          targetElement.appendChild(p);
        }
        break;

      case "Backspace":
        if (
          (targetElement.textContent?.length || 0) === 1 ||
          !targetElement.innerHTML
        ) {
          e.preventDefault();
          targetElement.textContent = "";
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          p.appendChild(span);
          span.appendChild(br);
          targetElement.appendChild(p);
        }
        if (
          !!window.getSelection()?.getRangeAt(0).cloneContents().textContent &&
          !!targetElement.textContent &&
          targetElement.textContent ===
            window.getSelection()?.getRangeAt(0).cloneContents().textContent
        ) {
          e.preventDefault();
          targetElement.textContent = "";
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          p.appendChild(span);
          span.appendChild(br);
          targetElement.appendChild(p);
        }
        break;
      default:
        if (
          !!window.getSelection()?.getRangeAt(0).cloneContents().textContent &&
          !!targetElement.textContent &&
          targetElement.textContent ===
            window.getSelection()?.getRangeAt(0).cloneContents().textContent
        ) {
          e.preventDefault();
          targetElement.textContent = "";
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          p.appendChild(span);
          span.appendChild(br);
          targetElement.appendChild(p);
        }
        if (
          targetElement.firstChild?.firstChild &&
          targetElement.firstChild.firstChild.nodeName === "BR"
        ) {
          const span = document.createElement("span");
          const br = document.createElement("br");
          span.appendChild(br);
          targetElement.firstChild.replaceChild(
            span,
            targetElement.firstChild.firstChild
          );
        }
    }
  }
};
const handleEditorKeyUp = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    console.log("need targetElement");
    return;
  }
  const textTags = findAllTextNodes(targetElement);
  textTags.forEach((tag) => {
    if (tag.parentNode?.nodeName !== "SPAN") {
      const span = document.createElement("span");
      span.appendChild(tag.cloneNode());
      tag.parentNode?.replaceChild(span, tag);
    }
  });
  removeEmptyNode(targetElement);
};
const handleEditorFocus = (
  e: React.FocusEvent,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    if (!targetElement.innerHTML) {
      const p = document.createElement("p");
      const span = document.createElement("span");
      const br = document.createElement("br");
      p.appendChild(span);
      span.appendChild(br);
      targetElement.appendChild(p);
    }
  }
};
const handleEditorAfterPaste = (
  e: React.ClipboardEvent<HTMLElement>,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    console.error("need targetElement");
    return;
  }
  e.preventDefault();

  const div = document.createElement("div");
  div.innerHTML = e.clipboardData.getData("text/html");
  const recomposedNode = recomposeNode(div);
  pasteNodesToSelection(recomposedNode, targetElement);
  removeEmptyNode(targetElement);
};
const handleEditorCut = (
  e: React.ClipboardEvent<HTMLElement>,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    console.error("need targetElement");
    return;
  }
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
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
    const data = range?.cloneContents();
    const div = document.createElement("div");
    div.appendChild(data);
    e.clipboardData.setData("text/html", div.innerHTML);
    range.deleteContents();
    const postSelectionRange = makePostSelectionRange();
    if (postSelectionRange)
      copyAndPastePostSelectionContent(postSelectionRange);
    deletePostSelectionContent();
    moveCursorToCutPoint();
  }
};
const makePostSelectionRange = () => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
  if (anchorNode && focusNode) {
    let endNode = focusNode;
    let endOffset = focusOffset;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      endNode = anchorNode;
      endOffset = anchorOffset;
    }
    const postSelectionRange = new Range();
    postSelectionRange.setStart(endNode, endOffset);
    while (true) {
      if (!endNode) break;
      let parentSpan = searchParentNodeForNodeName(endNode, "SPAN")?.firstChild
        ?.parentElement;
      if (endNode.nodeName === "P") {
        const textNode = searchTextNode(endNode);
        if (textNode) {
          parentSpan = searchParentNodeForNodeName(textNode, "SPAN")?.firstChild
            ?.parentElement;
        } else {
          parentSpan = endNode.firstChild?.firstChild?.parentElement;
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
      endNode = parentSpan?.nextElementSibling?.firstChild || endNode;
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
    )
      selection.deleteFromDocument();
    selection.removeAllRanges();
    selection.addRange(postSelectionRange);
    postSelectionContent.firstChild?.firstChild?.parentElement?.setAttribute(
      "id",
      classNames.firstNode
    );
    const insertPointRange = range.cloneRange();
    insertPointRange.collapse(true);

    if (insertPointRange.commonAncestorContainer.nodeName === "DIV") return;
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
    console.log(startNode, endNode);
    const cursorAfterCutRange = new Range();
    const cursorAfterCutPoint = document.getElementById(classNames.firstNode);
    if (!cursorAfterCutPoint) {
      const parentP = searchParentNodeForNodeName(startNode, "P");
      const span = document.createElement("span");
      const br = document.createElement("br");
      span.appendChild(br);
      parentP?.appendChild(span);
      cursorAfterCutRange.setStart(span, 1);
      cursorAfterCutRange.setEnd(span, 1);
      selection.removeAllRanges();
      selection.addRange(cursorAfterCutRange);
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
  handleEditorFocus,
  handleEditorAfterPaste,
  handleEditorKeyDown,
  handleEditorKeyUp,
  handleEditorCut,
};
