import { theme } from "@/styles/theme";
import React, { CSSProperties, useCallback, useRef, useState } from "react";
import addStyleToSelection from "./addStyleToSelection";
export type TagName = "span" | "strong" | "em";
export type NodeName = Uppercase<TagName>;
export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

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
  const [tagName, setTagName] = useState<TagName>("span");
  const handleChangeColorPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (containerRef.current)
        addStyleToSelection({
          styleKey: "color",
          styleValue: e.target.value,
          containerRef: containerRef,
          tagName,
        });
      alert("색변경!");
    },
    [tagName]
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
      <datalist id="select"></datalist>
      <select
        value={tagName}
        onChange={(e) => {
          setTagName(e.target.value as TagName);
        }}
      >
        <option>span</option>
        <option>strong</option>
        <option>em</option>
      </select>
      넣을 노드 {tagName}
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
