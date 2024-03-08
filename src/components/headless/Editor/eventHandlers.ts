import {
  moveCursorToTargetNode,
  pasteNodesToSelection,
} from "@/components/headless/Editor/nodeHandlers/common";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";

export const handleEditorKeyDown = (
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
      default:
    }
  }
};
export const handleEditorFocus = (
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
export const handleEditorAfterPaste = (
  e: React.ClipboardEvent<HTMLElement>,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    e.preventDefault();
    const div = document.createElement("div");
    div.innerHTML = e.clipboardData.getData("text/html");
    const recomposedNode = recomposeNode(div);
    pasteNodesToSelection(recomposedNode);
  }
};

// 붙여넣기 할때 => 노드들을 태그네임 속성 텍스트 위치로 분해해서 다시 재조립 하는게 나을듯
// 텍스트 /n
