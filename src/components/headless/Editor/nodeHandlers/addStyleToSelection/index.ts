import { CSSProperties } from "react";
import {
  addIdToChildNodes,
  removeIdFromChildNodesBasedOnNodeName,
  insertTagAtOffsets,
  camelToKebab,
} from "@/components/headless/Editor/nodeHandlers/common/utils";
import { classNames } from "@/components/headless/Editor/nodeHandlers/common/configs";
import { searchParentNodeForNodeName } from "@/components/headless/Editor/nodeHandlers/common/searchNodes";
import { NodeName, TagName } from "@/components/headless/Editor";

interface CommonArgs {
  styleKey?: string;
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
const copyAndPasteStyle = (
  targetElement: HTMLElement,
  source: CSSStyleDeclaration
) => {
  const style = source;
  const keys = Object.keys(style);
  for (let i = 0; i < keys.length; i += 1) {
    targetElement?.style?.setProperty(
      camelToKebab(keys[i]),
      style.getPropertyValue(camelToKebab(keys[i]))
    );
  }
};
//anchorNode와 focusNode 사이의 노드들 가공하는 로직
const addStyleBetweenNodes = ({
  selection,
  styleKey,
  styleValue,
  containerNodeId,
  containerRef,
}: AddStyleToBetweenNodesArgs) => {
  let containerNode: HTMLElement | null = null;
  if (!styleKey) return;
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
  let startNode = anchorNode;
  let endNode = focusNode;
  if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
    startNode = focusNode;
    endNode = anchorNode;
  } else if (anchorNode?.compareDocumentPosition(focusNode) === 0) {
    startNode = focusNode;
    endNode = anchorNode;
  }
  const spans = document.querySelectorAll("span");
  spans.forEach((node) => {
    if (range.intersectsNode(node)) {
      if (
        !node.isSameNode(searchParentNodeForNodeName(startNode, "SPAN")) &&
        !node.isSameNode(searchParentNodeForNodeName(endNode, "SPAN"))
      )
        node.style.setProperty(styleKey, styleValue || "");
    }
  });
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
        console.log(
          startNode.nodeName,
          endNode.nodeName,
          startOffset,
          endOffset
        );
        if (anchorNode.isSameNode(focusNode)) {
          insertTagAtOffsets({
            styleKey,
            styleValue,
            node: startNode,
            startOffset,
            endOffset,
            tagName,
            className: classNames.firstSelectionPoint,
          });
          selection?.removeAllRanges();
          const rangeAfterStyleChange = new Range();
          const firstSelectionPoint = document.getElementsByClassName(
            classNames.firstSelectionPoint
          )[0];

          if (firstSelectionPoint) {
            rangeAfterStyleChange.setStart(
              firstSelectionPoint.firstChild || firstSelectionPoint,
              0
            );
            rangeAfterStyleChange.setEnd(
              firstSelectionPoint.firstChild || firstSelectionPoint,
              (firstSelectionPoint.firstChild as Text).data.length
            );
          }
          selection?.addRange(rangeAfterStyleChange);
          document.getElementById(classNames.firstNode)?.removeAttribute("id");
          firstSelectionPoint?.removeAttribute("class");
        } else {
          //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
          //2 뒤에서 앞으로

          searchParentNodeForNodeName(
            startNode,
            "SPAN"
          )?.firstChild?.parentElement?.setAttribute(
            "id",
            classNames.firstNode
          );
          searchParentNodeForNodeName(
            endNode,
            "SPAN"
          )?.firstChild?.parentElement?.setAttribute(
            "class",
            classNames.lastNode
          );
          insertTagAtOffsets({
            styleKey,
            styleValue,
            node: startNode,
            startOffset,
            endOffset: startNode.textContent?.length || 0,
            tagName,
            className: classNames.firstSelectionPoint,
          });
          insertTagAtOffsets({
            styleKey,
            styleValue,
            node: endNode,
            startOffset: 0,
            endOffset,
            tagName,
            className: classNames.secondSelectionPoint,
          });
          selection?.removeAllRanges();
          const rangeAfterStyleChange = new Range();
          const firstSelectionPoint = document.getElementsByClassName(
            classNames.firstSelectionPoint
          )[0];
          const secondSelectionPoint = document.getElementsByClassName(
            classNames.secondSelectionPoint
          )[0];
          if (firstSelectionPoint && secondSelectionPoint) {
            rangeAfterStyleChange.setStart(
              firstSelectionPoint.firstChild || firstSelectionPoint,
              0
            );
            rangeAfterStyleChange.setEnd(
              secondSelectionPoint.firstChild || secondSelectionPoint,
              (secondSelectionPoint.firstChild as Text).data.length
            );
          }
          document.getElementById(classNames.firstNode)?.removeAttribute("id");
          selection?.addRange(rangeAfterStyleChange);
          firstSelectionPoint.removeAttribute("class");
          secondSelectionPoint.removeAttribute("class");
        }
      }
    }
  } else {
  }
};
export default addStyleToSelection;

export { copyAndPasteStyle };
