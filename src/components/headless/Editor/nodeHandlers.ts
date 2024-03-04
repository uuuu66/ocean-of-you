import { cloneElement } from "react";

//targetNode로 커서를 옮긴다
export const moveCursorToTargetNode = (targetNode: Node) => {
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
export const transformNodeStructure = (element?: EventTarget & Element) => {
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
