import { theme } from "@/styles/theme";
import React, { CSSProperties, useCallback, useRef } from "react";

interface InsertSpanAtAnchorNodeAndFocusNodeArgs {
  styleKey?: keyof CSSStyleDeclaration;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset: number;
  endOffset: number;
  containerNodeId?: string;
}
interface InsertSpanBetweenNodes
  extends Pick<
    InsertSpanAtAnchorNodeAndFocusNodeArgs,
    "styleKey" | "styleValue" | "containerNodeId"
  > {
  selection: Selection;
}
export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);
  //id 를 childnode들에게 부여
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
  //targetNode로 커서를 옮긴다
  const moveCursorToTargetNode = useCallback((targetNode: Node) => {
    const selection = window.getSelection();
    const targetRange = document.createRange();
    targetRange.selectNodeContents(targetNode);
    if (selection) {
      targetRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(targetRange);
    }
    return targetRange;
  }, []);

  //anchorNode와 focusNode 사이의 노드들 가공하는 로직
  const addStyleBetweenNodes = useCallback(
    ({
      selection,
      styleKey,
      styleValue,
      containerNodeId,
    }: InsertSpanBetweenNodes) => {
      let containerNode: HTMLElement | null = null;
      if (containerNodeId) {
        if (document.getElementById(containerNodeId))
          containerNode = document.getElementById(containerNodeId);
      } else if (containerRef.current) {
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
              const newSpan = document.createElement("span");
              Object.assign(newSpan.style, clonedStyle);
              newSpan.innerHTML = childNode.firstChild?.parentElement.innerHTML;
              if (styleKey && styleValue)
                newSpan.style[styleKey as any] = styleValue;
              fragment.appendChild(newSpan);
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
              const pElementInDocument = document.getElementById(id || "");
              const grandChildNodes = childNode.childNodes || [];
              //childNode가 startNode 혹은 endNode의 형제 요소일 경우
              if (pElementInDocument) {
                //grandChildNode는 p의 자식으로 오는 span들을 말합니다
                //grandChildNode가 span일 경우 새로 생성한 span에 span의 child를 복사한 후 실제 document에 있는 p에 넣습니다.
                for (let j = 0; j < grandChildNodes.length; j += 1) {
                  const grandChildNode = grandChildNodes[j];

                  if (grandChildNode)
                    switch (grandChildNode.nodeName) {
                      case "SPAN":
                        if (grandChildNode.firstChild?.parentElement) {
                          const grandChildNodeStyle = window.getComputedStyle(
                            grandChildNode.firstChild?.parentElement
                          );
                          const newSpan = document.createElement("span");
                          Object.assign(newSpan.style, grandChildNodeStyle);
                          if (styleKey && styleValue) {
                            newSpan.style[styleKey as any] = styleValue;
                            newSpan.innerHTML =
                              grandChildNode.firstChild?.parentElement.innerHTML;
                            if (id === firstId)
                              pElementInDocument.appendChild(newSpan);
                            if (id === lastId) {
                              pElementInDocument.insertBefore(
                                newSpan,
                                pElementInDocument.firstChild
                              );
                            }
                          }
                        }

                        break;
                      default:
                    }
                  else {
                  }
                }
                //childNode가 startNode 혹은 endNode의 형제 요소가 아닐 경우
              } else {
                //grandChildNode는 p의 자식으로 오는 span들을 말합니다
                //grandChildNode가 span일 경우 새로 생성한 span에 span의 child를 복사한 후  새로 만든  p에 넣습니다.
                //그 후 실제 document에 존재하는 p 중 lastId를 가지고 있는 p의 before에 추가합니다.
                const newP = document.createElement("p");
                for (let j = 0; j < grandChildNodes.length; j += 1) {
                  const grandChildNode = grandChildNodes[j];
                  switch (grandChildNode.nodeName) {
                    case "SPAN":
                      if (grandChildNode.firstChild?.parentElement) {
                        const grandChildNodeStyle = window.getComputedStyle(
                          grandChildNode.firstChild?.parentElement
                        );
                        const newSpan = document.createElement("span");
                        Object.assign(newSpan.style, grandChildNodeStyle);
                        if (styleKey && styleValue)
                          newSpan.style[styleKey as any] = styleValue;
                        newSpan.innerHTML =
                          grandChildNode.firstChild?.parentElement.innerHTML;
                        newP.appendChild(newSpan);
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
    },
    []
  );
  //anchorNode와 focusNode를 가공하는 로직
  const insertSpanIntoNode = useCallback(
    ({
      styleKey,
      styleValue,
      node,
      startOffset,
      endOffset,
    }: InsertSpanAtAnchorNodeAndFocusNodeArgs) => {
      if (!node) return null;
      if (!node?.parentElement) {
        return null;
      }
      switch (node?.parentElement?.tagName) {
        //span을 p안에 추가함
        case "P": {
          const range = new Range();
          range.setStart(node, startOffset);
          range.setEnd(node, endOffset);
          const clonedContents = range.cloneContents();
          range.deleteContents();
          const span = document.createElement("span");
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

        //targetNode하나를 잡고 앞뒤로 span을 만듬
        case "SPAN": {
          const ranges = [new Range(), new Range(), new Range()];
          ranges[0].setStart(node, 0);
          ranges[0].setEnd(node, startOffset);
          ranges[1].setStart(node, startOffset);
          ranges[1].setEnd(node, endOffset);
          ranges[2].setStart(node, endOffset);
          ranges[2].setEnd(node, node.textContent?.length || 0);

          if (node.parentNode) {
            const precededContent = ranges[0].cloneContents();
            const selectedContent = ranges[1].cloneContents();
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
            node.parentNode.parentNode?.replaceChild(fragment, node.parentNode);
          }
          return node.parentNode;
        }
      }
    },
    []
  );
  //선택된 부분에 span을 넣어서 원하는 스타일을 입히는 로직
  const addStyleToSelection = useCallback(
    (
      styleKey?: keyof CSSStyleDeclaration,
      styleValue?: string,
      containerNodeId?: string
    ) => {
      const selection = window.getSelection();
      //블록이 만들어진 곳이 있을 경우
      if (selection?.rangeCount) {
        const range = selection?.getRangeAt(0);
        const clonedRange = range?.cloneRange();
        if (range && selection && clonedRange) {
          const { anchorNode, anchorOffset, focusNode, focusOffset } =
            selection;

          if (focusNode && anchorNode) {
            // //anchorNode와 focusNode 사이에 있는 Node들 가공
            addStyleBetweenNodes({
              selection,
              styleKey,
              styleValue,
              containerNodeId,
            });
            let startNode = anchorNode;
            let endNode = focusNode;
            let startOffset = anchorOffset;
            let endOffset = focusOffset;
            //anchorNode와 focusNode들 가공하는 로직
            //anchorNode와 focusNode가 같은 부모 node를 가지는 경우

            if (anchorNode.isSameNode(focusNode)) {
              insertSpanIntoNode({
                styleKey,
                styleValue,
                node: anchorNode,
                startOffset,
                endOffset,
              });
            } else {
              //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
              //2 뒤에서 앞으로

              if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
                startNode = focusNode;
                endNode = anchorNode;
                startOffset = focusOffset;
                endOffset = anchorOffset;
              }
              insertSpanIntoNode({
                styleKey,
                styleValue,
                node: startNode,
                startOffset,
                endOffset: startNode.textContent?.length || 0,
              });
              insertSpanIntoNode({
                styleKey,
                styleValue,
                node: endNode,
                startOffset: 0,
                endOffset: endOffset,
              });
            }
          }
        }
      } else {
      }
      selection?.removeAllRanges();
    },
    [insertSpanIntoNode, addStyleBetweenNodes]
  );
  const handleChangeColorPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (containerRef.current) addStyleToSelection("color", e.target.value);
      alert("색변경!");
    },
    [addStyleToSelection]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (containerRef.current) {
        const { childNodes } = containerRef.current;
        for (let i = 0; i < childNodes.length; i += 1) {
          const p = document.createElement("p");
          const span = document.createElement("span");
          p.appendChild(span);
          if (childNodes[i].nodeType === 3) {
            span.appendChild(childNodes[i].cloneNode());
            containerRef.current.replaceChild(p, childNodes[i]);
            moveCursorToTargetNode(span);
          } else {
            p.remove();
          }
        }
      }
    },
    [moveCursorToTargetNode]
  );

  return (
    <section aria-label="edtior">
      <datalist id="list">
        {Object.values(theme.colors).map(
          (color) =>
            typeof color === "string" && <option key={color}>{color}</option>
        )}
      </datalist>
      <div>
        <div
          onKeyUp={handleKeyUp}
          contentEditable
          ref={containerRef}
          id="m-editor-div-element"
          className="border border-solid border-gray4 h-40 w-40 p-4 whitespace-pre-line"
        >
          <p>
            <span>1234567890</span>
          </p>
          <p>
            <span>222222222</span>
          </p>{" "}
          <p>
            <span>222222222</span>
          </p>{" "}
          <p>
            <span>33333333</span>
          </p>
        </div>
      </div>{" "}
      <input
        type="color"
        list={"list"}
        className="w-14"
        onInput={handleChangeColorPicker}
      />
    </section>
  );
}
// isSameNode isEqualNode 두개의 동작차이
// anchorNode와 focusNode를 자르는것은 잘되는 듯
// p노드들에게 id를 부여한 후 -> clone Content로  자른후 span들에게 style 부여 -> id들에게 다시 넣어준 후 p id 삭제
