import { pasteNodesToSelection } from "@/components/headless/Editor/nodeHandlers/pasteNodes";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import { searchTextNodeAtOffset } from "@/components/headless/Editor/nodeHandlers/searchNodes";

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
      case "MetaLeft":
      case "MetaRight":
      case "KeyD":
      case "KeyV":
      case "KeyC":
        if (e.ctrlKey || e.metaKey) break;
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
  if (targetElement) {
    e.preventDefault();

    const div = document.createElement("div");
    div.innerHTML = e.clipboardData.getData("text/html");
    const recomposedNode = recomposeNode(div);
    pasteNodesToSelection(recomposedNode, targetElement);
  }
};
const handleEditorCut = (
  e: React.ClipboardEvent<HTMLElement>,
  targetElement?: HTMLElement | null
) => {
  if (!targetElement) {
    return;
  }
  e.preventDefault();
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  if (!range) return;
  const data = range?.extractContents();
  const div = document.createElement("div");
  if (data) div.appendChild(data);

  e.clipboardData.setData("text/html", div.innerHTML);

  range?.collapse(true);
  const cursorFlag = document.createElement("span");
  cursorFlag.className = "hi";
  range.insertNode(cursorFlag);
  selection?.removeAllRanges();
  range.setStartBefore(cursorFlag);
  range.setEndBefore(cursorFlag);

  // cursorFlag.remove();
  selection?.addRange(range);
};

export {
  handleEditorFocus,
  handleEditorAfterPaste,
  handleEditorKeyDown,
  handleEditorCut,
};
