import { TagName } from "@/components/headless/Editor";
import { copyAndPasteStyle } from "@/components/headless/Editor/addStyleToSelection";
import { flags } from "@/components/headless/Editor/configs";
import { searchParentNodeForNodeName } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import {
  FlattendNode,
  InsertTagNextToNodesArgs,
} from "@/components/headless/Editor/nodeHandlers/types";
import { CSSProperties, cloneElement } from "react";

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
//selection의 offset에 노드를 삽입하는 함수
const insertTagAtOffsets = ({
  styleKey,
  styleValue,
  node,
  startOffset = 0,
  endOffset = 0,
  tagName = "span",
  content,
}: InsertTagNextToNodesArgs) => {
  if (!node) return null;
  if (!node?.parentElement) {
    return null;
  }

  switch (node?.parentElement?.tagName) {
    case "DIV": {
      const range = new Range();
      range.setStart(node, startOffset);
      range.setEnd(node, endOffset);
      const clonedContents = range.cloneContents();
      range.deleteContents();
      const p = document.createElement("p");
      const span = document.createElement(tagName);
      p.appendChild(span);
      if (content) {
        p.appendChild(content);
      } else {
        span.appendChild(clonedContents);
        p.appendChild(span);
      }
      if (styleKey && styleValue) span.style.setProperty(styleKey, styleValue);

      range.insertNode(p);
      return span;
    }
    case "P": {
      const range = new Range();
      range.setStart(node, startOffset);
      range.setEnd(node, endOffset);
      const clonedContents = range.cloneContents();
      range.deleteContents();
      const span = document.createElement(tagName);

      span.appendChild(clonedContents);

      if (styleKey && styleValue) span.style.setProperty(styleKey, styleValue);
      if (content) range.insertNode(content);
      else range.insertNode(span);
      return span;
    }

    //targetNode하나를 잡고 앞뒤로 node을 만듬
    default: {
      const ranges = [new Range(), new Range(), new Range()];
      ranges[0].setStart(node, 0);
      ranges[0].setEnd(node, startOffset);
      ranges[1].setStart(node, startOffset);
      ranges[1].setEnd(node, endOffset);
      ranges[2].setStart(node, endOffset);
      ranges[2].setEnd(node, node.textContent?.length || 0);
      if (node.parentNode) {
        const precededContent = ranges[0].cloneContents();
        let selectedContent = ranges[1].cloneContents();
        if (content) {
          selectedContent = document.createDocumentFragment();
          selectedContent.appendChild(content);
        }

        const followedContent = ranges[2].cloneContents();
        const precededSpan = document.createElement(node.parentNode.nodeName);
        const selectedSpan = document.createElement(node.parentNode.nodeName);
        const followedSpan = document.createElement(node.parentNode.nodeName);
        precededSpan.textContent = "";
        followedSpan.textContent = "";
        precededSpan.appendChild(precededContent);
        selectedSpan.appendChild(selectedContent);
        followedSpan.appendChild(followedContent);
        if (styleKey && styleValue) {
          const style = window.getComputedStyle(node.parentElement);
          copyAndPasteStyle(precededSpan, style);
          copyAndPasteStyle(selectedSpan, style);
          copyAndPasteStyle(followedSpan, style);
          selectedSpan.style.setProperty(styleKey, styleValue);
        }
        const fragment = document.createDocumentFragment();

        if (!!precededSpan.textContent) fragment.appendChild(precededSpan);
        if (!!selectedSpan.textContent) fragment.appendChild(selectedSpan);
        if (!!followedSpan.textContent) fragment.appendChild(followedSpan);
        ranges[1].deleteContents();

        node.parentNode.parentNode?.replaceChild(fragment, node.parentNode);
        return selectedSpan;
      }
    }
  }
};
//selection한 부분에 node를 붙여넣는 코드
const pasteNodesToSelection = (resultArray: FlattendNode[]) => {
  const selection = window.getSelection();
  if (selection) {
    const range = selection.getRangeAt(0);
    const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
    if (anchorNode && focusNode) {
      let startNode = anchorNode;
      let startOffset = anchorOffset || 0;
      let endOffset = focusOffset || 0;
      let node = null;
      if (range.collapsed) {
        node = insertTagAtOffsets({
          node: anchorNode,
          startOffset,
          endOffset,
          content: resultArray[0].node,
        });
      } else {
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
        const newRange = new Range();
        newRange.setStartAfter(startNode);
        newRange.setEndAfter(startNode);
        range.deleteContents();
        range.setStart(startNode, startOffset);
        range.setEnd(startNode, startOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        node = insertTagAtOffsets({
          node: startNode,
          startOffset,
          endOffset: startOffset,
          content: resultArray[0].node,
        });
      }

      selection.removeAllRanges();
      const newRange = new Range();
      if (node && node.parentNode) {
        newRange.selectNode(node);
        selection.addRange(newRange);
      }
    }
  }
};

export {
  addIdToChildNodes,
  removeIdFromChildNodesBasedOnNodeName,
  insertTagAtOffsets,
  moveCursorToTargetNode,
  pasteNodesToSelection,
};
