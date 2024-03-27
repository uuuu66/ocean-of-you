import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  removeEmptyNode,
  removeRangeContent,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import {
  copyAndPastePostSelectionContent,
  deleteSelectionContent,
  moveCursorToCutPoint,
} from "@/components/headless/Editor/nodeHandlers/cutNodes";
import { pasteNodesToSelection } from "@/components/headless/Editor/nodeHandlers/pasteNodes";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import {
  searchFirstChildForNodename,
  searchParentListTag,
  searchParentNodeForNodeName,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";

const handleEditorKeyDownCapture = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    console.error("need targetElement");
    return;
  }
};
const handleEditorKeyDown = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    switch (e.code) {
      case "KeyX":
        if (!!window.getSelection()?.getRangeAt(0).collapsed) {
          e.preventDefault();
          break;
        }
      case "MetaLeft":
      case "MetaRight":
      case "KeyF":
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
          break;
        }

        break;
      case "Backspace": {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const selectionP = searchParentNodeForNodeName(
          range?.startContainer || null,
          "P"
        );
        const listTag = searchParentListTag(selectionP);
        //지우려는 글자가 1개일 경우
        if (selectionP && (selectionP?.textContent?.length || 0) === 1) {
          if (listTag) {
          } else {
            e.preventDefault();
            selectionP.textContent = "";
            const span = document.createElement("span");
            const br = document.createElement("br");
            span.appendChild(br);
            selectionP.appendChild(span);
          }
          break;
        }
        if (
          listTag &&
          listTag.childNodes.length === 1 &&
          selectionP &&
          (selectionP?.textContent?.length || 0) === 0
        ) {
          e.preventDefault();
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          span.appendChild(br);
          p.appendChild(span);
          targetElement.replaceChild(p, listTag);
        }
        // 전체를 블록한 후 타이핑 시
        if (listTag) {
          const isSelectEntireList =
            selectionP &&
            selectionP?.textContent === range?.cloneContents().textContent;
          {
            if (!!range?.cloneContents().textContent && isSelectEntireList) {
              e.preventDefault();
              const p = document.createElement("p");
              const span = document.createElement("span");
              const br = document.createElement("br");
              span.appendChild(br);
              p.appendChild(span);
              listTag.parentElement?.replaceChild(p, listTag);
              break;
            }
          }
        } else {
          const isSelectEntireParent =
            selectionP &&
            selectionP?.textContent === range?.cloneContents().textContent;
          {
            if (!!range?.cloneContents().textContent && isSelectEntireParent) {
              e.preventDefault();
              selectionP.textContent = "";
              const span = document.createElement("span");
              const br = document.createElement("br");
              span.appendChild(br);
              selectionP?.appendChild(span);
              break;
            }
          }
        }
        if (targetElement.textContent?.length === 0 && selectionP) {
          if (listTag) {
            targetElement.removeChild(listTag);
          } else {
            targetElement.removeChild(selectionP);
          }
        }
        break;
      }

      default: {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const selectionP = searchParentNodeForNodeName(
          range?.startContainer || null,
          "P"
        );

        //p태그 안에 span이 없을 시
        if (!searchFirstChildForNodename(selectionP, "SPAN")) {
          const span = document.createElement("span");
          const br = document.createElement("br");
          span.appendChild(br);

          if (selectionP?.firstChild)
            selectionP?.replaceChild(span, selectionP.firstChild);
          else {
            selectionP?.appendChild(span);
          }
          break;
        }
        //안에 아무것도 없을 시
        if (!targetElement.innerHTML) {
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          p.appendChild(span);
          span.appendChild(br);
          targetElement.appendChild(p);
        }
        // 전체를 블록한 후 타이핑 시
        if (
          !!range?.cloneContents().textContent &&
          selectionP?.textContent === range?.cloneContents().textContent
        ) {
          e.preventDefault();
          selectionP.textContent = "";
          const span = document.createElement("span");
          const br = document.createElement("br");
          span.appendChild(br);
          selectionP.appendChild(span);
          break;
        }
      }
    }
  }
};
//issue list 일 때 엔터 시 동작
//p에서 글자를 없앤후 다시 입력하면 font 태그가 나옴
const handleEditorKeyUp = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    console.error("need targetElement");
    return;
  }
  const selection = window.getSelection();
  if (selection)
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      const selectionDiv = searchParentNodeForNodeName(
        range.startContainer,
        "DIV"
      );
      if (targetElement.isSameNode(selectionDiv)) return;
      const p = document.createElement("p");
      const span = document.createElement("span");
      const br = document.createElement("br");
      p.appendChild(span);
      span.appendChild(br);
      if (selectionDiv) targetElement.replaceChild(p, selectionDiv);
    }

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
const handleEditorPaste = (
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
    //남은 노드 비어있을 경우 처리
    if (startP?.firstChild && !startP?.firstChild?.textContent)
      startP?.replaceChild(
        document.createDocumentFragment(),
        startP?.firstChild
      );
    startP?.firstChild?.parentElement?.removeAttribute("class");
  }
};

export {
  handleEditorFocus,
  handleEditorPaste,
  handleEditorKeyDown,
  handleEditorKeyUp,
  handleEditorCut,
  handleEditorKeyDownCapture,
};
