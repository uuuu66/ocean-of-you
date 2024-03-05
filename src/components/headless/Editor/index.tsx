import { theme } from "@/styles/theme";
import React, { CSSProperties, useCallback, useRef, useState } from "react";
import addStyleToSelection from "./addStyleToSelection";
import {
  handleEditorAfterPaste,
  handleEditorKeyUp,
} from "@/components/headless/Editor/eventHandlers";
export type TagName = "span" | "strong" | "em";
export type NodeName = Uppercase<TagName>;
export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChangeColorPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (containerRef.current)
        addStyleToSelection({
          styleKey: "color",
          styleValue: e.target.value,
          containerRef: containerRef,
          tagName: "span",
        });
      alert("색변경!");
    },
    []
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
      <div>
        <div
          onPaste={(e) => handleEditorAfterPaste(e, containerRef.current)}
          onKeyUp={(e) => handleEditorKeyUp(e, containerRef.current)}
          contentEditable
          ref={containerRef}
          id="m-editor-div-element"
          className="border border-solid border-gray4  w-full h-full p-4 whitespace-pre-line"
        >
          <p>
            <span>12</span>
          </p>
          <p>
            <span>222해보자해보자222</span>
          </p>{" "}
          <p>
            <span>222222222</span>
          </p>{" "}
          <p>
            <span>12345678</span>
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
// 복붙할경우 => span으로 바꾸기 마크들  style별로 classname을 부여한 후 다시 가공해야 할듯
