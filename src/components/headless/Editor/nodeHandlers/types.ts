import { TagName } from "@/components/headless/Editor";
import { CSSProperties } from "react";

export interface InsertTagNextToNodesArgs {
  styleKey?: keyof CSSStyleDeclaration;
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
  isNewLine: boolean | null;
  text: string;
  nodeIndex: number[];
  nodeName: string;
}
export interface RecomposedNodes {
  firstNode: Node | null;
  lastNode: Node | null;
  originalNode: Node;
}
