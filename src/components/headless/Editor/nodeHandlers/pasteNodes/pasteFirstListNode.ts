import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import {
  searchParentNodeForNodeName,
  searchFirstChildForNodename,
  searchParentListTag,
  searchLastChildForNodename,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/common/types";
import { removeListContent } from "@/components/headless/Editor/nodeHandlers/common/utils";
import getNodesAfterSelection from "@/components/headless/Editor/nodeHandlers/pasteNodes/getNodesAfterSelection";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";

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
  removeListContent(selection);
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
          //넣을부분이 list tag
          if (listTag) {
            pasteFirstNodeToListTag(firstChildNode, startNodeParentP);
            //p태그
          } else if (targetP?.lastChild) {
            const newRange = new Range();
            newRange.setEndAfter(targetP);
            newRange.setStartAfter(targetP);
            newRange.insertNode(parentListNode);
            //그외
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
              } //넣을부분이 list tag
              if (listTag) {
                pasteFirstNodeToListTag(firstChildNode, startNodeParentP);
                //p태그
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
  return nodesAfterSelection;
};

const pasteFirstNodeToListTag = (
  firstChildNode: FlattendNode,
  startNodeParentP: Node | null
) => {
  const firstP = searchFirstChildForNodename(
    firstChildNode?.childNodes?.[0] || null,
    "P"
  );
  if (!firstP) return;
  const flattenPChildNodes = postProcessAfterFlatten(flattenChildNodes(firstP));
  for (let i = 0; i < flattenPChildNodes.length; i += 1) {
    const childNode = flattenPChildNodes[i];
    if (childNode.node) startNodeParentP?.appendChild(childNode.node);
    if (i === flattenPChildNodes.length - 1) {
      childNode.node?.firstChild?.parentElement?.setAttribute(
        "class",
        classNames.lastNode
      );
    }
  }
  const listTag = searchParentListTag(startNodeParentP);
  if (!listTag) {
    console.error("no listTag");
    return;
  }
  const lastNode = document.getElementsByClassName(classNames.lastNode)[0];

  for (let i = 1; i < (firstChildNode?.childNodes || [])?.length; i += 1) {
    const childNode = firstChildNode?.childNodes?.[i];
    if (childNode) {
      listTag.appendChild(childNode);
      if (i === (firstChildNode?.childNodes || [])?.length - 1) {
        const span = searchLastChildForNodename(childNode, "SPAN");
        if (span) {
          lastNode?.removeAttribute("class");
          span?.firstChild?.parentElement?.setAttribute(
            "class",
            classNames.lastNode
          );
        }
      }
    }
  }
};
export default pasteFirstListNode;
