import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import {
  searchEmptyNodes,
  searchParentListTag,
  searchParentNodeForNodeName,
  searchTextNode,
} from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { InsertTagNextToNodesArgs } from "@/components/headless/Editor/nodeHandlers/common/types";
import {
  copyAndPastePostSelectionContent,
  deleteSelectionContent,
  moveCursorToCutPoint,
} from "@/components/headless/Editor/nodeHandlers/cutNodes";

const camelToKebab = (target: string) => {
  const result = target.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("-").toLowerCase();
};
//targetNode로 커서를 옮긴다
const moveCursorToTargetNode = (targetNode: Node) => {
  const selection = window.getSelection();
  const targetRange = document.createRange();
  targetRange.selectNodeContents(targetNode);
  if (selection) {
    targetRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(targetRange);
  }
  return targetRange;
};

const addIdToChildNodes = (
  targetElement: HTMLElement,
  nodeName: string,
  idPrefix: string = "m-editor-"
) => {
  const { childNodes } = targetElement;
  const ids = [];
  if (targetElement.hasChildNodes()) {
    for (let i = 0; i < childNodes.length; i += 1) {
      const childNode = childNodes.item(i);

      if (childNode.nodeName === nodeName) {
        if (childNode.firstChild?.parentElement)
          if (childNode.nodeName === nodeName) {
            const id = `${idPrefix}${i}`;

            childNode.firstChild.parentElement.id = id;

            ids.push(id);
          }
      }
    }
  }
  return ids;
};
//id 를 childnode들에게서 제거
const removeIdFromChildNodesBasedOnNodeName = (
  targetElement: HTMLElement,
  nodeName: string
) => {
  const { childNodes } = targetElement;
  if (targetElement.hasChildNodes()) {
    for (let i = 0; i < childNodes.length; i += 1) {
      const childNode = childNodes.item(i);

      if (childNode.nodeName === nodeName) {
        if (childNode.firstChild?.parentElement)
          if (childNode.nodeName === nodeName)
            childNode.firstChild.parentElement.removeAttribute("id");
      }
    }
  }
};
//선택한 부분을 제거하는 로직
const removeSelection = (targetElement: HTMLElement) => {
  if (!targetElement) {
    console.error("need targetElement");
    return;
  }

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  if (!selection) return;
  if (!range) return;
  const { anchorNode, focusNode } = selection;
  if (anchorNode && focusNode) {
    let startNode = anchorNode;
    let endNode = focusNode;
    const isAnchorNodeStart =
      anchorNode?.compareDocumentPosition(focusNode) === 4;
    if (!isAnchorNodeStart) {
      startNode = focusNode;
      endNode = anchorNode;
    }
    if (!startNode?.parentElement) {
      console.error("need startnodeParent");
      return;
    }
    if (!endNode?.parentElement) {
      console.error("need endnodeParent");
      return;
    }
    //마우스 이동을 위한 클래스부여
    const startP = searchParentNodeForNodeName(startNode, "P");
    startP?.firstChild?.parentElement?.setAttribute("class", classNames.firstP);
    //선택한 영역 뒤에 있는 노드들을 복사한 후 커서 첫부분에 집어넣음
    copyAndPastePostSelectionContent();
    //선택한 영역을 삭제함
    deleteSelectionContent();
    //자른 후 커서 이동
    moveCursorToCutPoint();
    //남은 노드 비어있을 경우 처리
    if (startP?.firstChild && !startP?.firstChild?.textContent)
      startP?.replaceChild(
        document.createDocumentFragment(),
        startP?.firstChild
      );
    startP?.firstChild?.parentElement?.removeAttribute("class");
    removeEmptyNode(targetElement);
  }
};
//selection의 offset에 노드를 삽입하는 함수
const insertTagAtOffsets = ({
  styleKey,
  styleValue,
  node,
  startOffset = 0,
  endOffset = 0,
  content,
  className,
}: InsertTagNextToNodesArgs) => {
  if (!node) return null;
  if (!node?.parentElement) {
    return null;
  }

  let targetNode = node;

  switch (targetNode.nodeName) {
    //targetNode하나를 잡고 앞뒤로 node을 만듬
    case "#text":
      targetNode = node.parentElement;

      break;
  }

  if (targetNode) {
    const ranges = divideNodeIntoThreePart(node, startOffset, endOffset);

    const precededContent = ranges[0].cloneContents();
    let selectedContent = ranges[1].cloneContents();
    const followedContent = ranges[2].cloneContents();
    const precededNode = document.createElement(targetNode.nodeName);
    let selectedNode: HTMLElement | DocumentFragment = document.createElement(
      targetNode.nodeName
    );

    if (content) {
      switch (content.nodeName) {
        default:
          selectedNode = document.createDocumentFragment();
          selectedContent = document.createDocumentFragment();
          selectedContent.appendChild(content);
      }
    }
    const followedNode = document.createElement(targetNode.nodeName);
    precededNode.textContent = "";
    followedNode.textContent = "";
    precededNode.appendChild(precededContent);
    selectedNode.appendChild(selectedContent);
    followedNode.appendChild(followedContent);
    const id = searchParentNodeForNodeName(
      node,
      "SPAN"
    )?.firstChild?.parentElement?.getAttribute("id");
    if (id) selectedNode.firstChild?.parentElement?.setAttribute("id", id);
    if (className) {
      selectedNode.firstChild?.parentElement?.setAttribute("class", className);
    }
    const style = searchParentNodeForNodeName(
      ranges[1].commonAncestorContainer,
      "SPAN"
    )?.firstChild?.parentElement?.style;
    if (style) {
      if (selectedNode instanceof HTMLElement)
        copyAndPasteStyle(selectedNode, style);
      copyAndPasteStyle(precededNode, style);
      copyAndPasteStyle(followedNode, style);
    }
    if (styleKey && styleValue) {
      if (selectedNode instanceof HTMLElement) {
        selectedNode.style.setProperty(styleKey, styleValue);
      }
    }

    const fragment = document.createDocumentFragment();
    if (!!precededNode.textContent) fragment.appendChild(precededNode);
    if (!!selectedNode.textContent) fragment.appendChild(selectedNode);

    if (!!followedNode.textContent) fragment.appendChild(followedNode);
    console.log(targetNode.parentNode, node);
    targetNode.parentNode?.replaceChild(fragment, targetNode);
    return { node: selectedNode };
  }
};
const divideNodeIntoThreePart = (
  node: Node,
  startOffset: number,
  endOffset: number
) => {
  const ranges = [new Range(), new Range(), new Range()];
  ranges[0].setStart(node, 0);
  ranges[0].setEnd(node, startOffset);
  ranges[1].setStart(node, startOffset);
  ranges[1].setEnd(node, endOffset);
  ranges[2].setStart(node, endOffset);
  ranges[2].setEnd(node, node.textContent ? node.textContent?.length : 0);
  return ranges;
};
const removeEmptyNode = (targetElement: HTMLElement) => {
  const root = targetElement;
  const emptyNodes = searchEmptyNodes(root);
  for (const node of emptyNodes) {
    if (node.nodeName === "BR") continue;
    node.parentElement?.removeChild(node);
  }
};
//class를 찾아서 커서이동
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
  //텍스트 노드가 없으면 lastChild
  if (!textNode) {
    newRange.setStart(targetNode?.lastChild, 0);
    newRange.setEnd(targetNode?.lastChild, 1);
    newRange.collapse(false);
    //텍스트가 있으면 텍스트노드의 전체 길이
  } else if (textNode?.textContent) {
    newRange.setStart(textNode, 0);
    newRange.setEnd(textNode, textNode.textContent?.length);
    newRange.collapse(false);
  }
  selection.addRange(newRange);
  targetNode.removeAttribute("class");
  return targetNode;
};
const removeRangeContent = (selection?: Selection) => {
  if (!selection) return;

  const { anchorNode, focusNode } = selection;
  let startNode = anchorNode;
  let endNode = focusNode;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  if (range.collapsed) return;
  if (!anchorNode || !focusNode) return;
  //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
  //2 뒤에서 앞으로
  if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
    startNode = focusNode;
    endNode = anchorNode;
  } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
    startNode = focusNode;
    endNode = anchorNode;
  }
  const startListTag = searchParentListTag(startNode);
  const endListTag = searchParentListTag(endNode);
  if (
    endListTag &&
    startListTag?.nodeName !== endListTag.nodeName &&
    !endListTag?.textContent
  )
    endListTag?.parentElement?.removeChild(endListTag);
  const startLiTag = searchParentNodeForNodeName(startNode, "LI");
  const endLiTag = searchParentNodeForNodeName(endNode, "LI");
  if (!endLiTag?.isSameNode(startLiTag))
    endLiTag?.parentElement?.removeChild(endLiTag);
  selection.deleteFromDocument();
};
export {
  addIdToChildNodes,
  removeIdFromChildNodesBasedOnNodeName,
  insertTagAtOffsets,
  moveCursorToTargetNode,
  divideNodeIntoThreePart,
  removeEmptyNode,
  removeRangeContent,
  camelToKebab,
  moveCursorToClassName,
  removeSelection,
};
