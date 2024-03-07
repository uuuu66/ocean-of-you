const findTextNode = (node: Node) => {
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
const findParentPElement = (node: Node) => {
  let target: Node | null = node;
  while (target?.parentElement) {
    if (!target) return target;
    if (target.nodeName === "P") {
      return target;
    }
    target = target.parentElement;
  }
  return target;
};
export { findParentPElement, findTextNode };
