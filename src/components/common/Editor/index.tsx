import React, { useCallback, useEffect, useRef } from "react";

export default function Editor() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeydown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // 엔터 키를 눌렀을 때
      e.preventDefault(); // 기본 동작을 막음

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range && selection) {
        range.deleteContents();
        const textNode = document.createTextNode("\n");
        range.deleteContents();
        range.insertNode(textNode);
        range.setEndAfter(textNode);
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);
  return (
    <section aria-label="edtior">
      <button>button</button>
      <div>
        <div
          onKeyDown={handleKeydown}
          contentEditable
          ref={contentRef}
          className="border border-solid border-gray4 h-40 w-40 p-4 whitespace-pre-line"
        >
          sssss<strong>hi</strong>
          <em>hi</em>ss
        </div>
      </div>
    </section>
  );
}
