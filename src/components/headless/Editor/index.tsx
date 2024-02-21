import React, { CSSProperties, useCallback, useRef } from "react";

interface InsertSpanAtAnchorNodeAndFocusNodeArgs {
  styleKey?: keyof CSSStyleDeclaration;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset: number;
  endOffset: number;
}
interface InsertSpanBetweenNodes
  extends Pick<
    InsertSpanAtAnchorNodeAndFocusNodeArgs,
    "styleKey" | "styleValue"
  > {
  anchorNode: Node | null;
  focusNode: Node | null;
}
export default function Editor() {
  const contentRef = useRef<HTMLDivElement>(null);
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
  const insertSpanBetweenNodes = useCallback(
    ({
      anchorNode,
      focusNode,
      styleKey,
      styleValue,
    }: InsertSpanBetweenNodes) => {
      if (!focusNode || !anchorNode) return null;
      const newRange = new Range();
      if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
        newRange.setEndBefore(anchorNode);
        newRange.setStartAfter(focusNode);
      } else {
        newRange.setStartAfter(anchorNode);
        newRange.setEndBefore(focusNode);
      }
      const clonedContents = newRange.cloneContents();

      for (let i = 0; i < clonedContents.childNodes.length; i += 1) {
        const node = clonedContents.childNodes[i];

        if (!!node) {
          if (!!node.textContent) {
            switch (node.nodeName) {
              case "SPAN":
                {
                  const range = new Range();
                  const newSpan = document.createElement("span");
                  if (styleKey && styleValue)
                    newSpan.style[styleKey as any] = styleValue;
                  newSpan.appendChild(
                    document.createTextNode(node.textContent)
                  );
                  range.selectNode(node);
                  range.deleteContents();
                  range.insertNode(newSpan);
                }
                break;
              case "P":
                {
                  const { childNodes } = node;

                  for (let i = 0; i < childNodes.length; i += 1) {
                    const childNode = childNodes[i];
                    if (childNode.textContent) {
                      const range = new Range();
                      const newSpan = document.createElement("span");
                      if (styleKey && styleValue)
                        newSpan.style[styleKey as any] = styleValue;
                      newSpan.appendChild(
                        document.createTextNode(childNode.textContent || "")
                      );

                      range.selectNode(childNode);
                      range.deleteContents();
                    }
                  }
                }
                break;
            }
          }
        }
      }
    },
    []
  );
  //anchorNode와 focusNode들 가공하는 로직
  const insertSpanAtAnchorNodeAndFocusNode = useCallback(
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
        case "P":
          {
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
          }
          break;
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
          break;
        }
      }
    },
    []
  );
  //선택된 부분에 span을 넣어서 원하는 스타일을 입히는 로직
  const insertSpanAtSelection = useCallback(
    (styleKey?: keyof CSSStyleDeclaration, styleValue?: string) => {
      const selection = window.getSelection();
      //블록이 만들어진 곳이 있을 경우
      if (selection?.rangeCount) {
        const range = selection?.getRangeAt(0);
        const clonedRange = range?.cloneRange();
        if (range && selection && clonedRange) {
          const { anchorNode, anchorOffset, focusNode, focusOffset } =
            selection;

          if (focusNode && anchorNode) {
            //anchorNode와 focusNode 사이에 있는 Node들 가공
            insertSpanBetweenNodes({
              anchorNode,
              focusNode,
              styleKey,
              styleValue,
            });
            //anchorNode와 focusNode들 가공하는 로직
            //anchorNode와 focusNode가 같은 부모 node를 가지는 경우
            if (anchorNode.isEqualNode(focusNode)) {
              if (anchorOffset < focusOffset)
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: anchorOffset,
                  endOffset: focusOffset,
                });
              else
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: focusOffset,
                  endOffset: anchorOffset,
                });
            } else {
              //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
              //2 뒤에서 앞으로
              if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: 0,
                  endOffset: anchorOffset,
                });
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: focusNode,
                  startOffset: focusOffset,
                  endOffset: focusNode.textContent?.length || 0,
                });
              } else {
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: anchorOffset,
                  endOffset: anchorNode.textContent?.length || 0,
                });
                insertSpanAtAnchorNodeAndFocusNode({
                  styleKey,
                  styleValue,
                  node: focusNode,
                  startOffset: 0,
                  endOffset: focusOffset,
                });
              }
            }
          }
          selection?.removeAllRanges();
        }
      } //없을 경우
      else {
      }
    },
    [insertSpanAtAnchorNodeAndFocusNode, insertSpanBetweenNodes]
  );
  const handleClickRedButton = useCallback(
    (e: React.MouseEvent) => {
      insertSpanAtSelection("color", "red");
    },
    [insertSpanAtSelection]
  );
  const handleClickBlueButton = useCallback(
    (e: React.MouseEvent) => {
      insertSpanAtSelection("color", "blue");
    },
    [insertSpanAtSelection]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (contentRef.current) {
        const { childNodes } = contentRef.current;
        for (let i = 0; i < childNodes.length; i += 1) {
          const p = document.createElement("p");
          const span = document.createElement("span");
          p.appendChild(span);
          if (childNodes[i].nodeType === 3) {
            span.appendChild(childNodes[i].cloneNode());
            contentRef.current.replaceChild(p, childNodes[i]);
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
      <button onClick={handleClickRedButton}>red</button>
      <button onClick={handleClickBlueButton}>blue</button>
      <div>
        <div
          onKeyUp={handleKeyDown}
          contentEditable
          ref={contentRef}
          id="editor"
          className="border border-solid border-gray4 h-40 w-40 p-4 whitespace-pre-line"
        >
          <p>
            <span>1234567890</span>
          </p>
          <p>
            <span>222222222</span>
          </p>{" "}
          <p>
            <span>33333333</span>
          </p>
        </div>
      </div>
    </section>
  );
}
