export default class DecomposedNode {
  constructor(node: Node | null) {
    const range = new Range();
    if (node) {
      range.selectNode(node);
      console.log(range);
      this.offset = [range.startOffset || 0, range.endOffset || 0];
    } else {
      this.offset = [];
    }

    this.nodeName = node?.nodeName || "";
    this.textContent = node?.textContent || "";
    this.isEmptyContent = !node?.textContent;
    this.style = node?.firstChild?.parentElement?.style;
  }
  nodeName: string;
  textContent: string;
  offset: [number, number] | [];
  isEmptyContent: boolean;
  style: CSSStyleDeclaration | undefined;
}
