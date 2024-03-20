import { classNames } from "@/components/headless/Editor/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { removeEmptyNode } from "@/components/headless/Editor/nodeHandlers/common";
import {
  copyAndPastePostSelectionContent,
  deleteSelectionContent,
  moveCursorToCutPoint,
} from "@/components/headless/Editor/nodeHandlers/cutNodes";
import { pasteNodesToSelection } from "@/components/headless/Editor/nodeHandlers/pasteNodes";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import {
  findAllTextNodes,
  searchParentNodeForNodeName,
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
        if (targetElement.textContent?.length === 0) e.preventDefault();
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
    const data = range?.cloneContents();
    const div = document.createElement("div");

    const parentSpan = searchParentNodeForNodeName(
      range.commonAncestorContainer,
      "SPAN"
    )?.firstChild?.parentElement;
    if (parentSpan) {
      const span = document.createElement("span");
      copyAndPasteStyle(span, parentSpan.style);
      span.appendChild(data);
      div.appendChild(span);
    } else {
      div.appendChild(data);
    }

    e.clipboardData.setData("text/html", div.innerHTML);
    //마우스 이동을 위한 클래스부여
    const startP = searchParentNodeForNodeName(startNode, "P");
    startP?.firstChild?.parentElement?.setAttribute("class", classNames.firstP);
    //선택한 영역 뒤에 있는 노드들을 복사한 후 커서 첫부분에 집어넣음
    copyAndPastePostSelectionContent();
    //선택한 영역을 삭제함
    deleteSelectionContent();
    //자른 후 커서 이동
    moveCursorToCutPoint();
    startP?.firstChild?.parentElement?.removeAttribute("class");
  }
};

export {
  handleEditorFocus,
  handleEditorAfterPaste,
  handleEditorKeyDown,
  handleEditorKeyUp,
  handleEditorCut,
};
