import { TagName } from "@/components/headless/Editor";
import { CSSProperties } from "react";

export interface InsertTagNextToNodesArgs {
  styleKey?: string;
  styleValue?: string;
  spanStyle?: CSSProperties;
  node: Node | null;
  startOffset?: number;
  endOffset?: number;
  content?: Node | null;
  tagName?: TagName;
}
export interface FlattendNode {
  node: Node | null;
  style: CSSStyleDeclaration | null;
  isParent: boolean | null;
  text: string;
  nodeIndex: number[];
  parentIndex: number[];
  nodeName: string;
  childNodes?: HTMLElement[];
}
