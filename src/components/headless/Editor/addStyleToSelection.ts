import { CSSProperties } from "react";
import { NodeName, TagName } from ".";
import {
  addIdToChildNodes,
  removeIdFromChildNodes,
  insertTagNextToNode,
} from "@/components/headless/Editor/nodeHandlers";

interface CommonArgs {
  styleKey?: keyof CSSStyleDeclaration;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset?: number;
  endOffset?: number;
  containerNodeId?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  tagName?: TagName;
}
interface AddStyleToSelectionArgs
  extends Pick<
    CommonArgs,
    "styleKey" | "styleValue" | "containerNodeId" | "containerRef" | "tagName"
  > {}
interface AddStyleToBetweenNodesArgs
  extends Pick<
    CommonArgs,
    "styleKey" | "styleValue" | "containerNodeId" | "containerRef" | "tagName"
  > {
  selection: Selection;
}

//anchorNode와 focusNode 사이의 노드들 가공하는 로직
const addStyleBetweenNodes = ({
  selection,
  styleKey,
  styleValue,
  containerNodeId,
  containerRef,
  tagName = "span",
}: AddStyleToBetweenNodesArgs) => {
  let containerNode: HTMLElement | null = null;
  if (containerNodeId) {
    if (document.getElementById(containerNodeId))
      containerNode = document.getElementById(containerNodeId);
  } else if (containerRef && containerRef.current) {
    containerNode = containerRef.current;
  }
  if (!containerNode) {
    console.error("need containerElement");
    return;
  }
  if (!selection) {
    console.error("need selection");
    return;
  }
  const range = selection.getRangeAt(0);
  if (!range) {
    console.error("need range");
    return;
  }
  const { anchorNode, focusNode } = selection;
  if (!anchorNode || !focusNode) {
    console.error("need anchorNode");
    return;
  }
  let startNode: Node = anchorNode;
  let endNode: Node = focusNode;

  if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
    startNode = focusNode;
    endNode = anchorNode;
  }
  range.setStartAfter(startNode);
  range.setEndBefore(endNode);
  //id들을 p node들에 임시적으로 부여하여 어디에 가공한 노드들을 넣을지 기억합니다.
  const ids = addIdToChildNodes(containerNode, "P");
  let firstId = ids[0];
  if (startNode.parentElement?.parentElement) {
    if (startNode.parentElement?.parentElement.nodeName === "P") {
      firstId = startNode.parentElement?.parentElement.id;
    }
  } else if (startNode.parentElement?.nodeName === "P") {
    firstId = startNode.parentElement.id;
  }
  let lastId = ids[ids.length - 1];
  if (endNode.parentElement?.parentElement) {
    if (endNode.parentElement?.parentElement.nodeName === "P") {
      lastId = endNode.parentElement?.parentElement.id;
    }
  } else if (endNode.parentElement?.nodeName === "P") {
    lastId = endNode.parentElement.id;
  }
  const clonedContents = range.cloneContents();
  range.deleteContents();

  if (clonedContents.hasChildNodes()) {
    //줄바꿈이 없을경우
    if (firstId === lastId) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < clonedContents.childNodes.length; i += 1) {
        const childNode = clonedContents.childNodes.item(i);

        if (childNode.firstChild?.parentElement) {
          const clonedStyle = window.getComputedStyle(
            childNode.firstChild?.parentElement
          );
          const newNode = document.createElement("span");
          Object.assign(newNode.style, clonedStyle);
          newNode.innerHTML = childNode.firstChild?.parentElement.innerHTML;
          if (styleKey && styleValue)
            newNode.style[styleKey as any] = styleValue;
          fragment.appendChild(newNode);
        } else {
          continue;
        }
      }

      range.insertNode(fragment);
    } //줄바꿈이 있을경우
    else
      for (let i = 0; i < clonedContents.childNodes.length; i += 1) {
        const childNode = clonedContents.childNodes.item(i);
        if (childNode.firstChild) {
          const id = childNode.firstChild.parentElement?.getAttribute("id");
          const siblingOfAnchorNodeOrFocusNode = document.getElementById(
            id || ""
          );
          const grandChildNodes = childNode.childNodes || [];
          //childNode가 startNode 혹은 endNode의 형제 요소일 경우
          if (siblingOfAnchorNodeOrFocusNode) {
            //grandChildNode는 p의 자식으로 오는 tag들을 말합니다
            //grandChildNode가 tag일 경우 새로 생성한 tag에 원본 tag의 child를 복사한 후  새로 만든  p에 넣습니다.
            for (let j = 0; j < grandChildNodes.length; j += 1) {
              const grandChildNode = grandChildNodes[j];
              if (grandChildNode)
                switch (grandChildNode.nodeName as NodeName) {
                  default:
                    if (grandChildNode.firstChild?.parentElement) {
                      const grandChildNodeStyle = window.getComputedStyle(
                        grandChildNode.firstChild?.parentElement
                      );
                      const newTag = document.createElement("span");
                      Object.assign(newTag.style, grandChildNodeStyle);
                      if (styleKey && styleValue) {
                        newTag.style[styleKey as any] = styleValue;
                        newTag.innerHTML =
                          grandChildNode.firstChild?.parentElement.innerHTML;
                        if (id === firstId)
                          siblingOfAnchorNodeOrFocusNode.appendChild(newTag);
                        if (id === lastId) {
                          siblingOfAnchorNodeOrFocusNode.insertBefore(
                            newTag,
                            siblingOfAnchorNodeOrFocusNode.firstChild
                          );
                        }
                      }
                    }
                    break;
                }
              else {
              }
            }
            //childNode가 startNode 혹은 endNode의 형제 요소가 아닐 경우
          } else {
            //grandChildNode는 p의 자식으로 오는 node들을 말합니다
            //grandChildNode가 tag일 경우 새로 생성한 tag에 원본 tag의 child를 복사한 후  새로 만든  p에 넣습니다.
            //그 후 실제 document에 존재하는 p 중 lastId를 가지고 있는 p의 before에 추가합니다.
            const newP = document.createElement("p");
            for (let j = 0; j < grandChildNodes.length; j += 1) {
              const grandChildNode = grandChildNodes[j];
              switch (grandChildNode.nodeName as NodeName) {
                case "STRONG":
                case "EM":
                case "SPAN":
                  if (grandChildNode.firstChild?.parentElement) {
                    const grandChildNodeStyle = window.getComputedStyle(
                      grandChildNode.firstChild?.parentElement
                    );

                    const newNode = document.createElement("span");
                    Object.assign(newNode.style, grandChildNodeStyle);
                    if (styleKey && styleValue)
                      newNode.style[styleKey as any] = styleValue;
                    newNode.innerHTML =
                      grandChildNode.firstChild?.parentElement.innerHTML;
                    newP.appendChild(newNode);
                  }
              }
            }
            const newRange = new Range();
            const lastP = document.getElementById(lastId);
            if (lastP) {
              newRange.setStartBefore(lastP);
              newRange.setEndBefore(lastP);
              newRange.insertNode(newP);
            }
          }
        } else continue;
      }
  } else {
  }

  removeIdFromChildNodes(containerNode, "P");
};

//선택된 부분에 node를 넣어서 원하는 스타일을 입히는 로직
const addStyleToSelection = ({
  styleKey,
  styleValue,
  containerNodeId,
  containerRef,
  tagName,
}: AddStyleToSelectionArgs) => {
  const selection = window.getSelection();
  //블록이 만들어진 곳이 있을 경우
  if (selection?.rangeCount) {
    const range = selection?.getRangeAt(0);
    const clonedRange = range?.cloneRange();
    if (range && selection && clonedRange) {
      const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

      if (focusNode && anchorNode) {
        // //anchorNode와 focusNode 사이에 있는 Node들 가공
        addStyleBetweenNodes({
          selection,
          styleKey,
          styleValue,
          containerNodeId,
          containerRef,
        });
        let startNode = anchorNode;
        let endNode = focusNode;
        let startOffset = anchorOffset;
        let endOffset = focusOffset;
        if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
          startNode = focusNode;
          endNode = anchorNode;
          startOffset = focusOffset;
          endOffset = anchorOffset;
        } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
          startNode = focusNode;
          endNode = anchorNode;
          startOffset = Math.min(anchorOffset, focusOffset);
          endOffset = Math.max(anchorOffset, focusOffset);
        }

        //anchorNode와 focusNode들 가공하는 로직
        //anchorNode와 focusNode가 같은 부모 node를 가지는 경우

        if (anchorNode.isSameNode(focusNode)) {
          insertTagNextToNode({
            styleKey,
            styleValue,
            node: startNode,
            startOffset,
            endOffset,
            tagName,
          });
        } else {
          //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
          //2 뒤에서 앞으로

          insertTagNextToNode({
            styleKey,
            styleValue,
            node: startNode,
            startOffset,
            endOffset: startNode.textContent?.length || 0,
            tagName,
          });
          insertTagNextToNode({
            styleKey,
            styleValue,
            node: endNode,
            startOffset: 0,
            endOffset,
            tagName,
          });
        }
      }
    }
  } else {
  }
  selection?.removeAllRanges();
};
export default addStyleToSelection;

export {};
