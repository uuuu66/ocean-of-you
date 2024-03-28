import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  searchFirstChildForNodename,
  searchParentListTag,
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { ListType } from "@/components/headless/Editor/nodeHandlers/common/types";
import {
  removeEmptyNode,
  removeEmptyTextNode,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import {
  flattenChildNodes,
  postProcessAfterFlatten,
} from "@/components/headless/Editor/nodeHandlers/flattenChildNodes";

const addListTagToSelection = (listType: ListType, listStyle?: string) => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  if (!selection) return;
  if (!range) return;
  let isListExit = false;
  const lis = document.querySelectorAll("li");
  for (let i = 0; i < lis.length; i += 1) {
    const li = lis[i];
    if (range.intersectsNode(li)) {
      isListExit = true;
      break;
    }
  }
  if (!isListExit) return;
  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
  if (!anchorNode || !focusNode) return;
  let startNode = anchorNode;
  let endNode = focusNode;
  let startOffset = anchorOffset;
  let endOffset = focusOffset;
  const isAnchorNodeStart =
    anchorNode?.compareDocumentPosition(focusNode) === 4;
  if (!isAnchorNodeStart) {
    startNode = focusNode;
    endNode = anchorNode;
    startOffset = focusOffset;
    endOffset = anchorOffset;
  }
  if (!startNode?.parentElement) {
    console.error("need startnodeParent");
    return;
  }
  if (!endNode?.parentElement) {
    console.error("need endnodeParent");
    return;
  }
  switch (listType) {
    case "NONE":
      if (range.collapsed) {
        const listTag = searchParentListTag(startNode);
        const p = searchParentNodeForNodeName(startNode, "P");
        searchParentNodeForNodeName(
          startNode,
          "SPAN"
        )?.firstChild?.parentElement?.setAttribute("id", classNames.firstNode);
        if (listTag) {
          const flattendNodes = postProcessAfterFlatten(
            flattenChildNodes(listTag)
          );
          const fragment = document.createDocumentFragment();
          let list = document.createElement(listTag.nodeName);
          if (listTag?.firstChild?.parentElement?.style)
            copyAndPasteStyle(list, listTag?.firstChild?.parentElement?.style);
          for (const flattendNode of flattendNodes) {
            if (flattendNode.node?.nodeName !== "LI") continue;
            const searchedP = searchFirstChildForNodename(
              flattendNode.node,
              "P"
            );
            if (searchedP?.isSameNode(p)) {
              if (list.hasChildNodes()) fragment.appendChild(list);
              fragment.appendChild(searchedP);
              list = document.createElement(listTag.nodeName);
              if (listTag?.firstChild?.parentElement?.style)
                copyAndPasteStyle(
                  list,
                  listTag?.firstChild?.parentElement?.style
                );
            } else {
              if (flattendNode.node) {
                list.appendChild(flattendNode.node);
              }
            }
          }
          fragment.appendChild(list);
          listTag.parentElement?.replaceChild(fragment, listTag);
          const newRange = new Range();
          const cursorPoint = document.getElementById(classNames.firstNode);
          if (cursorPoint) {
            const text = searchTextNode(cursorPoint);
            newRange.setStart(text, startOffset);
            newRange.setEnd(text, startOffset);
            selection.removeAllRanges();
            selection.addRange(newRange);
            cursorPoint.removeAttribute("id");
          }
        } else if (p) {
          return;
        } else {
          const p = document.createElement("p");
          const span = document.createElement("span");
          const br = document.createElement("br");
          span.appendChild(br);
          p.appendChild(span);
          searchParentNodeForNodeName(startNode, "DIV")?.appendChild(p);
          return;
        }
      } else {
        const newRange = range.cloneRange();
        const startListTag = searchParentListTag(startNode);
        const endListTag = searchParentListTag(endNode);
        const startPTag = searchParentNodeForNodeName(startNode, "P");

        for (let i = 0; i < lis.length; i += 1) {}
        if (!startListTag) {
          for (let i = 0; i < lis.length; i += 1) {
            const li = lis[i];
            if (newRange.intersectsNode(li)) {
              startNode = li;
              break;
            }
          }
          newRange.setStart(startNode, 0);
        }
        const clonedContents = newRange.extractContents();
        const flattendNodes = postProcessAfterFlatten(
          flattenChildNodes(clonedContents)
        );
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < flattendNodes.length; i += 1) {
          const { node } = flattendNodes[i];
          switch (node?.nodeName) {
            case "LI":
              {
                const p = searchFirstChildForNodename(node, "P");
                if (p) fragment.appendChild(p);
              }
              break;
            case "P":
              fragment.appendChild(node);
              break;
            default:
              break;
          }
        }
        const insertPointRange = new Range();
        if (startListTag) {
          insertPointRange.setStartAfter(startListTag);
          insertPointRange.setEndAfter(startListTag);
          insertPointRange.insertNode(fragment);
        } else if (startPTag) {
          insertPointRange.setStartAfter(startPTag);
          insertPointRange.setEndAfter(startPTag);
          insertPointRange.insertNode(fragment);
        }
        if (startListTag) removeEmptyTextNode(startListTag);
        if (endListTag) removeEmptyTextNode(endListTag);
        selection.getRangeAt(0)?.collapse(false);
      }

      break;
    default:
      if (range.collapsed) {
        const listTag = searchParentListTag(startNode);
        const p = searchParentNodeForNodeName(startNode, "P");
        if (listTag) {
        } else if (p) {
        } else {
        }
      } else {
        const listTag = searchParentListTag(startNode);
        const p = searchParentNodeForNodeName(startNode, "P");
        if (listTag) {
        } else if (p) {
        } else {
        }
      }
  }
};

export default addListTagToSelection;
