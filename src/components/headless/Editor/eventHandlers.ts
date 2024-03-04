import {
  moveCursorToTargetNode,
  transformNodeStructure,
} from "@/components/headless/Editor/nodeHandlers";

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
      switch (childNodes[i].nodeName) {
        case "#text":
          span.appendChild(childNodes[i].cloneNode());
          targetElement.replaceChild(p, childNodes[i]);
          moveCursorToTargetNode(span);
          break;
        case "P":
          if (childNodes[i].firstChild?.nodeName === "BR") {
            childNodes[i].remove();
          } else {
            p.remove();
            span.remove();
          }
          break;
        default:
          p.remove();
          span.remove();
      }
    }
  }
};
export const handleEditorAfterPaste = (e: React.FormEvent<HTMLElement>) => {
  console.log(e.currentTarget);
  transformNodeStructure(e.currentTarget);
};
