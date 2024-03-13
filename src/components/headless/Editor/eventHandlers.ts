import { classNames } from "@/components/headless/Editor/configs";
import { insertTagAtOffsets } from "@/components/headless/Editor/nodeHandlers/common";
import { recomposeNode } from "@/components/headless/Editor/nodeHandlers/recomposeNode";
import {
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";
import { ZCOOL_KuaiLe } from "next/font/google";
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

const pasteNodesToSelection = (
  resultArray: FlattendNode[],
  targetElement?: HTMLElement | null
) => {
  if (!resultArray) {
    console.error("need resultArray");
    return;
  }
  const selection = window.getSelection();
  if (!selection) {
    console.error("need selection");
    return;
  }
  const range = selection.getRangeAt(0);
  if (!range) {
    console.error("need range");
    return;
  }
  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  if (!anchorNode || !focusNode) {
    console.error("need AnchorNode or FocusNode");
    return;
  }
  let startNode = anchorNode;
  let startOffset = anchorOffset || 0;
  let endOffset = focusOffset || 0;
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
    endOffset = startOffset;
  }
  let parentP = searchParentNodeForNodeName(startNode, "P");
  switch (!!parentP) {
    case true:
      if (resultArray[0]?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < resultArray[0]?.childNodes?.length; i += 1) {
          if (i === resultArray[0]?.childNodes?.length - 1) {
            resultArray[0].childNodes[i].className = classNames.lastNode;
          }
          fragment.appendChild(resultArray[0].childNodes[i]);
        }

        insertTagAtOffsets({
          node: startNode,
          startOffset,
          endOffset,
          content: fragment,
        });
        console.log("hi2");
      }

      break;
    case false:
      {
        const p = document.createElement("p");
        if (resultArray[0]?.childNodes) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < resultArray[0]?.childNodes?.length; i += 1) {
            if (i === resultArray[0]?.childNodes?.length - 1)
              resultArray[0].childNodes[i].className = classNames.lastNode;
            fragment.appendChild(resultArray[0].childNodes[i]);
          }
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
  selection.addRange(range);
  const lastNode = moveCursorToLastNode(selection);

  if (lastNode) {
    parentP = searchParentNodeForNodeName(lastNode, "P");
  }
  if (resultArray.length > 1) {
    if (parentP) {
      const newRange = new Range();
      newRange.setEndAfter(parentP);
      newRange.setStartAfter(parentP);
      for (let i = resultArray.length - 1; i >= 1; i -= 1) {
        const { node } = resultArray[i];
        if (!node) break;
        if (i === resultArray.length - 1 && node?.firstChild?.parentElement) {
          node.firstChild?.parentElement?.setAttribute(
            "class",
            classNames.lastNode
          );
        }
        newRange.insertNode(node);
      }
    }

    moveCursorToLastNode(selection);
  }
};
const moveCursorToLastNode = (selection: Selection) => {
  const lastNode = document.getElementsByClassName(classNames.lastNode)[0];
  selection.removeAllRanges();
  const newRange = new Range();
  if (!lastNode?.lastChild) {
    console.error("no lastChild", lastNode);
    return null;
  }
  const targetNode = searchTextNode(lastNode?.lastChild);

  if (!targetNode) return null;
  if (targetNode?.textContent) {
    newRange.setStart(targetNode, 0);
    newRange.setEnd(targetNode, targetNode.textContent?.length);
    newRange.collapse(false);
    selection.addRange(newRange);
    lastNode.removeAttribute("class");
  }
  return lastNode;
};
