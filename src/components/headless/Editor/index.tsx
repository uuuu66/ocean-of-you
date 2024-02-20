import React, {
  CSSProperties,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface InsertSpanAtNodeArgs {
  styleKey?: keyof CSSStyleDeclaration;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset: number;
  endOffset: number;
}
export default function Editor() {
  const contentRef = useRef<HTMLDivElement>(null);
  const moveCursorToTargetNode = useCallback((targetNode: Node) => {
    const selection = window.getSelection();

    const targetRange = document.createRange();
    targetRange.selectNodeContents(targetNode);
    if (selection) {
      targetRange.collapse(false);
      // 현재 선택을 제거하고 새로운 선택을 설정합니다.
      selection.removeAllRanges();
      selection.addRange(targetRange);
    }
    return targetRange;
  }, []);
  const insertSpanAtNode = useCallback(
    ({
      styleKey,
      styleValue,
      node,
      startOffset,
      endOffset,
    }: InsertSpanAtNodeArgs) => {
      if (!node?.parentElement) return null;
      switch (node.parentElement?.tagName) {
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
        case "SPAN":
          {
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
              precededSpan.appendChild(precededContent);
              selectedSpan.appendChild(selectedContent);
              followedSpan.appendChild(followedContent);
              if (styleKey && styleValue) {
              }
              const fragment = document.createDocumentFragment();
              if (!!precededSpan.textContent)
                fragment.appendChild(precededSpan);
              if (!!selectedSpan.textContent)
                fragment.appendChild(selectedSpan);
              if (!!followedSpan.textContent)
                fragment.appendChild(followedSpan);
              node.parentNode.parentNode?.replaceChild(
                fragment,
                node.parentNode
              );
            }
          }
          break;
      }
    },
    []
  );

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
            //anchorNode와 focusNode가 같은 부모 node를 가지는 경우
            if (anchorNode.isEqualNode(focusNode)) {
              if (anchorOffset < focusOffset)
                insertSpanAtNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: anchorOffset,
                  endOffset: focusOffset,
                });
              else
                insertSpanAtNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: focusOffset,
                  endOffset: anchorOffset,
                });
            } else {
              //anchorNode,focusNode간의 위치 선후 관계를 비교한 후 분기
              if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
                insertSpanAtNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: 0,
                  endOffset: anchorOffset,
                });
                insertSpanAtNode({
                  styleKey,
                  styleValue,
                  node: focusNode,
                  startOffset: focusOffset,
                  endOffset: focusNode.textContent?.length || 0,
                });
              } else {
                insertSpanAtNode({
                  styleKey,
                  styleValue,
                  node: anchorNode,
                  startOffset: anchorOffset,
                  endOffset: anchorNode.textContent?.length || 0,
                });
                insertSpanAtNode({
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
    [insertSpanAtNode]
  );
  const handleClickButton = useCallback(
    (e: React.MouseEvent) => {
      insertSpanAtSelection("color", "red");
    },
    [insertSpanAtSelection]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (contentRef.current) {
        const { childNodes } = contentRef.current;
        for (let i = 0; i < childNodes.length; i += 1) {
          const p = document.createElement("p");
          if (childNodes[i].nodeType === 3) {
            p.appendChild(childNodes[i].cloneNode());
            contentRef.current.replaceChild(p, childNodes[i]);
            moveCursorToTargetNode(p);
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
      <button onClick={handleClickButton}>button</button>
      <div>
        <div
          onKeyUp={handleKeyDown}
          contentEditable
          ref={contentRef}
          id="editor"
          className="border border-solid border-gray4 h-40 w-40 p-4 whitespace-pre-line"
        ></div>
      </div>
    </section>
  );
}
