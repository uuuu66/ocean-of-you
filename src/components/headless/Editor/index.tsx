import React, { useCallback, useEffect, useRef } from "react";

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
  const insertSpanToNodesInRange = useCallback(
    (node: Node | null, startOffset: number = 0, endOffset: number = 0) => {
      if (!node?.parentElement) return null;
      switch (node.parentElement?.tagName) {
        case "DIV":
          {
            const range = new Range();
            range.setStart(node, startOffset);
            range.setEnd(node, endOffset);
            const clonedContents = range.cloneContents();
            range.deleteContents();
            const span = document.createElement("span");
            span.appendChild(clonedContents);
            range.insertNode(span);
          }
          break;
        case "SPAN":
          {
            const range = new Range();
            range.setStart(node, startOffset);
            range.setEnd(node, endOffset);
            const precededContent = range.cloneContents();

            if (node.parentNode) {
              const targetRange = moveCursorToTargetNode(node.parentNode);
              const span = document.createElement("span");
              span.appendChild(precededContent);
              targetRange.insertNode(span);
              node.parentNode.removeChild(node);
            }
          }
          break;
      }
    },
    [moveCursorToTargetNode]
  );

  const handleClickButton = useCallback(
    (e: React.MouseEvent) => {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const clonedRange = range?.cloneRange();
      if (range && selection && clonedRange) {
        const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
        if (focusNode && anchorNode) {
          if (anchorNode.isEqualNode(focusNode)) {
            insertSpanToNodesInRange(anchorNode, anchorOffset, focusOffset);
          } else {
            if (anchorNode?.compareDocumentPosition(focusNode) === 2) {
              insertSpanToNodesInRange(anchorNode, 0, anchorOffset);
              insertSpanToNodesInRange(
                focusNode,
                focusOffset,
                focusNode.textContent?.length || 0
              );
            } else {
              insertSpanToNodesInRange(
                anchorNode,
                anchorOffset,
                anchorNode.textContent?.length
              );
              insertSpanToNodesInRange(focusNode, 0, focusOffset);
            }
          }
        }
      }
    },
    [insertSpanToNodesInRange]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (contentRef.current) {
        const { childNodes } = contentRef.current;
        for (let i = 0; i < childNodes.length; i += 1) {
          const div = document.createElement("div");
          if (childNodes[i].nodeType === 3) {
            div.appendChild(childNodes[i].cloneNode());
            contentRef.current.replaceChild(div, childNodes[i]);
            moveCursorToTargetNode(div);
          } else {
            div.remove();
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
        >
          <div>123456789</div>
          <div>abcdefghhhj</div>
        </div>
      </div>
    </section>
  );
}
