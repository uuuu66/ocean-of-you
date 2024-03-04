import {
  moveCursorToTargetNode,
  transformNodeStructure,
} from "@/components/headless/Editor/nodeHandlers";
import { insertTagNextToNode } from "./addStyleToSelection";
import { start } from "repl";

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
    const hasNewline =
      e.clipboardData.getData("text/plain").split("\n").length > 2;
    e.preventDefault();
    const div = document.createElement("div");
    const firstSpan = document.createElement("span");
    div.innerHTML = e.clipboardData.getData("text/html");
    for (let i = 0; i < 2; i += 1) {
      if (div.firstChild) div.removeChild(div.firstChild);
    }
    firstSpan.innerHTML = firstWord;
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);

      const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

      if (anchorNode && focusNode) {
        let startNode = anchorNode;
        let endNode = focusNode;
        let startOffset = anchorOffset || 0;
        let endOffset = focusOffset || 0;
        let node = null;

        switch (hasNewline) {
          case true:
            break;
          case false:
            if (range.collapsed) {
              node = insertTagNextToNode({
                node: anchorNode,
                startOffset,
                endOffset,
                content: firstWord,
              });
            } else {
              //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
              //2 뒤에서 앞으로

              if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
                startNode = focusNode;
                endNode = anchorNode;
                startOffset = focusOffset;
                endOffset = anchorOffset;
              }
              console.log(startOffset, endOffset);
              const newRange = new Range();
              newRange.setStartAfter(startNode);
              newRange.setEndAfter(startNode);
              range.deleteContents();
              range.insertNode(firstSpan);
              console.log(range.startContainer.parentElement);
            }
        }

        selection.removeAllRanges();
        const newRange = new Range();
        if (node) {
          newRange.setStartAfter(node);
          newRange.setEndAfter(node);
          selection.addRange(newRange);
        }
      }
    }
  }
};
