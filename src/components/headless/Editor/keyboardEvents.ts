import { moveCursorToTargetNode } from "@/components/headless/Editor/nodeHandlers";

export const handleEditorKeyUp = (
  e: React.KeyboardEvent,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    const { childNodes } = targetElement;
    for (let i = 0; i < childNodes.length; i += 1) {
      const p = document.createElement("p");
      const span = document.createElement("span");
      p.appendChild(span);
      if (childNodes[i].nodeType === 3) {
        span.appendChild(childNodes[i].cloneNode());
        targetElement.replaceChild(p, childNodes[i]);
        moveCursorToTargetNode(span);
      } else {
        p.remove();
      }
    }
  }
};
