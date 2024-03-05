import { TagName } from "@/components/headless/Editor";
import { CSSProperties, cloneElement } from "react";

interface InsertTagNextToNodesArgs {
  styleKey?: keyof CSSStyleDeclaration;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset?: number;
  endOffset?: number;
  content?: string;
  tagName?: TagName;
}

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
const transformNodeStructure = (element?: EventTarget & Element) => {
  const fragment = document.createDocumentFragment();
  if (!element) {
    console.error("no editor");
    return fragment;
  }

  const { childNodes } = element;

  const childNodesLength = childNodes.length;
  for (let i = 0; i < childNodesLength; i += 1) {
    const childNode = childNodes.item(i);
    const fragment = document.createDocumentFragment();
    const node = processNodeBasedOnCriteria(childNode);

    fragment.appendChild(node);
  }
  return fragment;
};

const processNodeBasedOnCriteria = (node: Node) => {
  const { nodeName } = node;
  const fragment = document.createDocumentFragment();

  switch (nodeName) {
    case "P": {
    }

    case "SPAN": {
    }

    case "BR": {
    }
  }
  return fragment;
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
const removeIdFromChildNodes = (
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
//anchorNode와 focusNode를 가공하는 로직
const insertTagNextToNode = ({
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
    //tag를 p안에 추가함
    case "DIV":
    case "P": {
      const range = new Range();
      range.setStart(node, startOffset);
      range.setEnd(node, endOffset);
      const clonedContents = range.cloneContents();
      range.deleteContents();
      const span = document.createElement(tagName);
      span.appendChild(clonedContents);
      if (
        styleKey &&
        styleValue &&
        styleKey !== "length" &&
        styleKey !== "parentRule"
      )
        span.style[styleKey as any] = styleValue;
      range.insertNode(span);
      break;
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
          selectedContent.textContent = content;
        }

        const followedContent = ranges[2].cloneContents();
        const precededSpan = document.createElement("span");
        const selectedSpan = document.createElement("span");
        const followedSpan = document.createElement("span");

        precededSpan.textContent = "";
        followedSpan.textContent = "";

        precededSpan.appendChild(precededContent);
        selectedSpan.appendChild(selectedContent);
        followedSpan.appendChild(followedContent);
        if (styleKey && styleValue) {
          selectedSpan.style[styleKey as any] = styleValue;
          precededSpan.style[styleKey as any] =
            node.parentElement.style[styleKey as any];
          followedSpan.style[styleKey as any] =
            node.parentElement.style[styleKey as any];
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

//fragment 를 만든 후 span안에 있는 childNode들을 가공한 후 fragment의 child에 추가함
const processSpanBasedOnCriteria = (spanNode: Node) => {
  const span = document.createElement("span");
  if (spanNode.textContent) span.textContent = spanNode.textContent;
  else document.createDocumentFragment();
  return span;
};
//fragment 를 만든 후 p안에 있는 childNode들을 가공한 후 fragment의 child에 추가함
const processPBasedOnCriteria = (pNode: Node) => {
  const fragment = document.createDocumentFragment();
  const { childNodes } = pNode;
  const childNodesLength = childNodes.length;
  for (let i = 0; i < childNodesLength; i += 1) {
    fragment.appendChild(processNodeBasedOnCriteria(childNodes.item(i)));
  }
  return fragment;
};
export {
  addIdToChildNodes,
  removeIdFromChildNodes,
  insertTagNextToNode,
  moveCursorToTargetNode,
};
