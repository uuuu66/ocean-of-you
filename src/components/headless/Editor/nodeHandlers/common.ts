import { TagName } from "@/components/headless/Editor";
import { copyAndPasteStyle } from "@/components/headless/Editor/nodeHandlers/addStyleToSelection";
import { flags } from "@/components/headless/Editor/configs";
import { searchParentNodeForNodeName } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import {
  FlattendNode,
  InsertTagNextToNodesArgs,
} from "@/components/headless/Editor/nodeHandlers/types";
import { CSSProperties, cloneElement } from "react";

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
//selection의 offset에 노드를 삽입하는 함수
const insertTagAtOffsets = ({
  styleKey,
  styleValue,
  node,
  startOffset = 0,
  endOffset = 0,
  content,
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

    if (styleKey && styleValue && targetNode.firstChild?.parentElement) {
      const style = targetNode.firstChild?.parentElement.style;

      copyAndPasteStyle(precededNode, style);
      if (selectedNode instanceof HTMLElement) {
        copyAndPasteStyle(selectedNode, style);
        selectedNode.style.setProperty(styleKey, styleValue);
      }
      copyAndPasteStyle(followedNode, style);
    }
    const fragment = document.createDocumentFragment();
    if (!!precededNode.textContent) fragment.appendChild(precededNode);
    if (!!selectedNode.textContent) fragment.appendChild(selectedNode);
    if (!!followedNode.textContent) fragment.appendChild(followedNode);
    ranges[1].deleteContents();
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
  const emptyTags = (root as HTMLElement).querySelectorAll(":empty");

  emptyTags.forEach(
    (tag) => tag.nodeName !== "BR" && tag.parentNode?.removeChild(tag)
  );
};
export {
  addIdToChildNodes,
  removeIdFromChildNodesBasedOnNodeName,
  insertTagAtOffsets,
  moveCursorToTargetNode,
  divideNodeIntoThreePart,
  removeEmptyNode,
  camelToKebab,
};
