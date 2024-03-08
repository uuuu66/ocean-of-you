const searchTextNode = (node: Node) => {
  let target: Node | null = node;
  while (target?.firstChild) {
    if (!target) return target;
    if (target.nodeType === 3) {
      return target;
    }
    target = target.firstChild;
  }
  return target;
};
const searchParentNodeForNodeName = (node: Node, nodeName: string) => {
  let target: Node | null = node;
  while (target?.parentElement) {
    if (!target) return target;
    if (target.nodeName === nodeName) {
      return target;
    }
    target = target.parentElement;
  }
  return target;
};
export { searchParentNodeForNodeName, searchTextNode };
