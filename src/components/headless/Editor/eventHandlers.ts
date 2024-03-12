import { insertTagAtOffsets } from "@/components/headless/Editor/nodeHandlers/common";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import { searchParentNodeForNodeName } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";
import { start } from "repl";

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
  if (e.clipboardData.getData("text/plain") && targetElement) {
    e.preventDefault();
    const div = document.createElement("div");
    div.innerHTML = e.clipboardData.getData("text/html");
    const recomposedNode = recomposeNode(div);
    pasteNodesToSelection(recomposedNode, targetElement);
  }
};

// 붙여넣기 할때 => 노드들을 태그네임 속성 텍스트 위치로 분해해서 다시 재조립 하는게 나을듯
// 텍스트 /n
const pasteNodesToSelection = (
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  if (resultArray) {
    const selection = window.getSelection();
    const newRange = new Range();
    if (selection) {
      const range = selection.getRangeAt(0);
      const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
      if (anchorNode && focusNode) {
        let startNode = anchorNode;
        let startOffset = anchorOffset || 0;
        let endOffset = focusOffset || 0;
        let node:
          | {
              node: HTMLElement | DocumentFragment;
            }
          | null
          | undefined = null;
        if (!range.collapsed) {
          //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
          //2 뒤에서 앞으로
          if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
            startNode = focusNode;
            startOffset = focusOffset;
            endOffset = anchorOffset;
          } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
            startNode = focusNode;
            startOffset = Math.min(anchorOffset, focusOffset);
            endOffset = Math.max(anchorOffset, focusOffset);
          }
          range.deleteContents();
          selection.collapseToEnd();

          endOffset = startOffset;
        }
        const parentP = searchParentNodeForNodeName(startNode, "P");
        switch (!!parentP) {
          case true:
            if (resultArray[0]?.childNodes) {
              const fragment = document.createDocumentFragment();
              for (let i = 0; i < resultArray[0]?.childNodes?.length; i += 1)
                fragment.appendChild(resultArray[0].childNodes[i]);
              node = insertTagAtOffsets({
                node: startNode,
                startOffset,
                endOffset,
                content: fragment,
              });
              const newRange = new Range();

              selection.addRange(range);
            }

            break;
          case false:
            {
              const p = document.createElement("p");
              if (resultArray[0]?.childNodes) {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < resultArray[0]?.childNodes?.length; i += 1)
                  fragment.appendChild(resultArray[0].childNodes[i]);
                p.appendChild(fragment);
                if (
                  targetElement &&
                  targetElement.childNodes?.length === 1 &&
                  targetElement.firstChild
                )
                  targetElement.removeChild(targetElement.firstChild);
                range.insertNode(p);
              }
            }
            break;
        }
      }
    }
  }
};
