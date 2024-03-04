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
export const handleEditorAfterPaste = (
  e: React.ClipboardEvent<HTMLElement>,
  targetElement?: HTMLElement | null
) => {
  if (targetElement) {
    const firstWord = e.clipboardData.getData("text/plain").split("\n")[0];
    e.preventDefault();
    const div = document.createElement("div");
    const firstSpan = document.createElement("span");
    div.innerHTML = e.clipboardData.getData("text/html");
    for (let i = 0; i < 2; i += 1) {
      if (div.firstChild) div.removeChild(div.firstChild);
    }
    firstSpan.innerHTML = firstWord;
    (e.nativeEvent.target as HTMLElement).parentElement?.appendChild(firstSpan);
    console.log(div.innerHTML, div.childNodes);
    console.log(transformNodeStructure(div));
    targetElement.appendChild(transformNodeStructure(div));
    //
  }
};
