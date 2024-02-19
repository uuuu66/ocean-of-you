import React, { useCallback, useEffect, useRef } from "react";

export default function Editor() {
  const contentRef = useRef<HTMLDivElement>(null);
  const handleClickButton = useCallback((e: React.MouseEvent) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (range && selection) {
      const clonedContents = range.cloneContents();
      range?.deleteContents();
      const span = document.createElement("span");
      span.appendChild(clonedContents);
      console.log(span.textContent, span.innerHTML, span.childNodes);
    }
  }, []);
  const handleKeydown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // 엔터 키를 눌렀을 때
      e.preventDefault(); // 기본 동작을 막음
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range && selection && contentRef.current) {
        const textNode = document.createTextNode("\n ");
        range.insertNode(textNode);
        const p = document.createElement("p");
        contentRef.current?.appendChild(p);
        p.appendChild(textNode);
        range.setStartBefore(textNode);
        range.setEndBefore(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);
  return (
    <section aria-label="edtior">
      <button onClick={handleClickButton}>button</button>
      <div>
        <div
          onKeyDown={handleKeydown}
          contentEditable
          ref={contentRef}
          className="border border-solid border-gray4 h-40 w-40 p-4 whitespace-pre-line"
        ></div>
      </div>
    </section>
  );
}
