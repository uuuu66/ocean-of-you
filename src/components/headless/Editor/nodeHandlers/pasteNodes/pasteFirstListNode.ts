import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  searchParentNodeForNodeName,
  searchFirstChildForNodename,
  searchParentListTag,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { removeRangeContent } from "@/components/headless/Editor/nodeHandlers/common/utils";
import getNodesAfterSelection from "@/components/headless/Editor/nodeHandlers/pasteNodes/getNodesAfterSelection";

const pasteFirstListNode = (
  firstChildNode: FlattendNode,
  selection: Selection
) => {
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
  let endNode = focusNode;
  let startOffset = anchorOffset || 0;
  let endOffset = focusOffset || 0;
  if (!range.collapsed) {
    //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
    //2 뒤에서 앞으로
    if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
      startNode = focusNode;
      endNode = anchorNode;
      startOffset = focusOffset;
      endOffset = anchorOffset;
    } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
      startNode = focusNode;
      startOffset = Math.min(anchorOffset, focusOffset);
      endOffset = Math.max(anchorOffset, focusOffset);
    }
  }

  //셀렉션의 시작노드의 p태그를 찾음
  const nodesAfterSelection = getNodesAfterSelection(endNode, endOffset);

  const startNodeParentP = searchParentNodeForNodeName(startNode, "P");

  const parentListNode = document.createElement(
    firstChildNode.nodeName.toLowerCase()
  );
  removeRangeContent(selection);
  endOffset = startOffset;
  if (firstChildNode.node)
    switch (startNode.nodeName) {
      //div일 경우는 p가 없거나 셀렉트가 잘못된 경우
      case "P":
      case "DIV":
        if (firstChildNode?.childNodes) {
          if (firstChildNode.style)
            copyAndPasteStyle(parentListNode, firstChildNode.style);
          for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
            parentListNode.appendChild(firstChildNode.childNodes[i]);
          }
          const firstChildP = searchFirstChildForNodename(parentListNode, "P");
          if (!firstChildP) {
            console.error("li does not have p");
            return;
          }
          const listTag =
            searchParentListTag(startNode)?.firstChild?.parentElement;
          const targetP = startNode.childNodes.item(startOffset - 1);
          if (listTag) {
            pasteFirstNodeToListTag(listTag, parentListNode);
          } else if (targetP?.lastChild) {
            const newRange = new Range();
            newRange.setEndAfter(targetP);
            newRange.setStartAfter(targetP);
            newRange.insertNode(parentListNode);
          } else {
            range.insertNode(parentListNode);
          }
        }
        break;
      default:
        switch (!!startNodeParentP) {
          case true:
            if (firstChildNode?.childNodes) {
              const listTag =
                searchParentListTag(startNode)?.firstChild?.parentElement;
              if (firstChildNode.style)
                copyAndPasteStyle(parentListNode, firstChildNode.style);
              for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
                parentListNode.appendChild(firstChildNode.childNodes[i]);
              }
              const firstChildP = searchFirstChildForNodename(
                parentListNode,
                "P"
              );
              if (!firstChildP) {
                console.error("li does not have p");
                return;
              }
              if (listTag) {
                pasteFirstNodeToListTag(listTag, parentListNode);
              } else {
                range.setStartAfter(startNodeParentP as Node);
                range.setEndAfter(startNodeParentP as Node);
                range.insertNode(parentListNode);
              }
            }
            break;
          case false:
            if (firstChildNode?.childNodes) {
              if (firstChildNode.style)
                copyAndPasteStyle(parentListNode, firstChildNode.style);
              for (let i = 0; i < firstChildNode.childNodes?.length; i += 1) {
                parentListNode.appendChild(firstChildNode.childNodes[i]);
              }
              const firstChildP = searchFirstChildForNodename(
                parentListNode,
                "P"
              );
              if (!firstChildP) {
                console.error("li does not have p");
                return;
              }
              range.insertNode(parentListNode);
            }
            break;
        }
    }
  range.collapse(false);

  return nodesAfterSelection;
};

const pasteFirstNodeToListTag = (
  targetListTag: HTMLElement,
  parentListNode: HTMLElement
) => {
  const isFisrtNodeIsSameListNode =
    targetListTag.nodeName === parentListNode.nodeName;
  // 커서이동을 위한 클래스명 부여
  if (parentListNode.lastChild?.nodeName === "LI") {
    const p = searchFirstChildForNodename(parentListNode.lastChild, "P");
    if (p)
      p.lastChild?.firstChild?.parentElement?.setAttribute(
        "class",
        classNames.lastNode
      );
  } else {
    parentListNode.lastChild?.firstChild?.parentElement?.setAttribute(
      "class",
      classNames.lastNode
    );
  }
  const targetListFirstP = searchFirstChildForNodename(targetListTag, "P");
  const listFirstP = searchFirstChildForNodename(parentListNode, "P");
  if (targetListFirstP) {
    for (let i = 0; i < (listFirstP?.childNodes || []).length; i += 1) {
      if (listFirstP?.childNodes?.item(i))
        targetListFirstP.appendChild(listFirstP?.childNodes?.item(i));
    }
  }
  // if (isFisrtNodeIsSameListNode) {
  //   const firstP = searchFirstChildForNodename(listTag, "P");
  //   if (firstP) {
  //     searchFirstChildForNodename(parentListNode, "P")?.childNodes.forEach(
  //       (node) => {
  //         console.log(node, firstP);
  //         firstP.appendChild(node);
  //       }
  //     );
  //     for (
  //       let i = 1;
  //       i < (parentListNode?.childNodes || []).length || 0;
  //       i += 1
  //     ) {
  //       if (parentListNode?.childNodes?.item(i))
  //         listTag.appendChild(parentListNode?.childNodes?.item(i));
  //     }
  //   } else {
  //     for (
  //       let i = 0;
  //       i < (parentListNode?.childNodes || []).length || 0;
  //       i += 1
  //     ) {
  //       if (parentListNode?.childNodes?.item(i))
  //         listTag.appendChild(parentListNode?.childNodes?.item(i));
  //     }
  //   }
  // } else {
  //   const newRange = new Range();
  //   newRange.setStartAfter(listTag);
  //   newRange.setEndAfter(listTag);
  //   if (parentListNode) newRange.insertNode(parentListNode);
  // }
};
export default pasteFirstListNode;
