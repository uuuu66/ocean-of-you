import { classNames } from "@/components/headless/Editor/configs";
import { insertTagAtOffsets } from "@/components/headless/Editor/nodeHandlers/common";
import {
  searchParentNodeForNodeName,
  searchTextNodeAtOffset,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

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
      console.log("hi");
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
  const parentP = searchParentNodeForNodeName(startNode, "P");
  const firstChildNode = resultArray[0];
  console.log(startNode.nodeName);
  switch (startNode.nodeName) {
    case "DIV":
      if (firstChildNode?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
          if (i === firstChildNode.childNodes?.length - 1) {
            firstChildNode.childNodes[i].className = classNames.lastNode;
          }
          fragment.appendChild(firstChildNode.childNodes[i]);
        }
        const targetP = startNode.childNodes.item(startOffset - 1);
        if (targetP?.lastChild) {
          const newRange = new Range();
          newRange.setEndAfter(targetP.lastChild);
          newRange.setStartAfter(targetP.lastChild);
          newRange.insertNode(fragment);
        } else {
          const p = document.createElement("p");
          p.appendChild(fragment);
          range.insertNode(p);
        }
      }
      break;
    case "P":
      if (firstChildNode?.childNodes) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
          if (i === firstChildNode.childNodes?.length - 1) {
            firstChildNode.childNodes[i].className = classNames.lastNode;
          }
          fragment.appendChild(firstChildNode.childNodes[i]);
        }
        range.insertNode(fragment);
      }
      break;
    default:
      switch (!!parentP) {
        case true:
          if (firstChildNode?.childNodes) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
              if (i === firstChildNode.childNodes?.length - 1) {
                firstChildNode.childNodes[i].className = classNames.lastNode;
              }
              fragment.appendChild(firstChildNode.childNodes[i]);
            }
            insertTagAtOffsets({
              node: startNode,
              startOffset,
              endOffset,
              content: fragment,
            });
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
  }
  const lastNode = moveCursorToClassName(selection, classNames.lastNode);

  insertRemainingNodes(lastNode, selection, resultArray);
};

const insertRemainingNodes = (
  lastNode: Node | null,
  selection: Selection,
  resultArray: FlattendNode[]
) => {
  if (resultArray.length <= 1) return;
  if (!lastNode) {
    console.error("need lastNode");
    return;
  }
  const lastTextNode = searchTextNode(lastNode);
  if (!lastTextNode) {
    console.error("need lastTextNode");
    return;
  }
  const range = new Range();
  const firstLineParentP = searchParentNodeForNodeName(lastNode, "P");
  if (!firstLineParentP) {
    console.error("need firstLineParentP", lastNode.parentElement);
    return;
  }
  //뒤에 남아있는 노드들 추출하기
  range.setStartAfter(lastNode);
  if (firstLineParentP?.lastChild)
    range.setEndAfter(firstLineParentP?.lastChild);
  const remainingNodes = range.cloneContents();
  range.deleteContents();
  //p태그들 집어넣기
  let nextPastePoint = new Range();
  nextPastePoint.setEndAfter(firstLineParentP);
  nextPastePoint.setStartAfter(firstLineParentP);
  for (let i = 1; i < resultArray.length; i += 1) {
    const { node } = resultArray[i];
    if (!node) break;
    node.firstChild?.parentElement?.setAttribute("class", classNames.lastNode);
    nextPastePoint.insertNode(node);
    const lastAddedNode = moveCursorToClassName(selection, classNames.lastNode);

    const parentP = searchParentNodeForNodeName(node, "P");
    if (!parentP) break;
    nextPastePoint.setStartAfter(parentP);
    nextPastePoint.setEndAfter(parentP);
    parentP.lastChild?.parentElement?.setAttribute(
      "class",
      classNames.lastNode
    );
    moveCursorToClassName(selection, classNames.lastNode);
    //마지막 p에 추출한 노드들 집어넣기
    if (i === resultArray.length - 1 && lastAddedNode?.lastChild) {
      range.setStartAfter(lastAddedNode.lastChild);
      range.setEndAfter(lastAddedNode.lastChild);
      range.insertNode(remainingNodes);
    }
  }
};
const moveCursorToClassName = (selection: Selection, className: string) => {
  const targetNode = document.getElementsByClassName(className)[0];
  selection.removeAllRanges();
  const newRange = new Range();
  if (!targetNode) {
    console.error("no targetNode");
    return null;
  }
  if (!targetNode?.lastChild) {
    console.error("no lastChild", targetNode);
    return null;
  }
  const textNode = searchTextNode(targetNode?.lastChild);
  if (!textNode) return null;
  if (textNode?.textContent) {
    newRange.setStart(textNode, 0);
    newRange.setEnd(textNode, textNode.textContent?.length);
    newRange.collapse(false);

    selection.addRange(newRange);
    targetNode.removeAttribute("class");
  }
  return targetNode;
};
export { pasteNodesToSelection, moveCursorToClassName };
