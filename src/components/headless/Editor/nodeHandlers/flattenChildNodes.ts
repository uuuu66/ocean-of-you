import { notAllowedTagsInParagraph } from "@/components/headless/Editor/configs";
import { searchFlattenNodeIndex } from "@/components/headless/Editor/nodeHandlers/searchNodes";
import { FlattendNode } from "@/components/headless/Editor/nodeHandlers/types";

const flattenChildNodes = (
  node: Node,
  nodeIndex?: number[]
): FlattendNode[] => {
  const array: any[] = [];
  const parentIndex = nodeIndex ? nodeIndex.slice(0, -1) : [];

  switch (node.nodeName) {
    case "BR":
      return [
        {
          isParent: false,
          nodeIndex: nodeIndex ?? [],
          style: null,
          node,
          text: "",
          nodeName: node.nodeName,
          parentIndex,
        },
      ];
    case "#text": {
      const span = document.createElement("span");
      span.textContent = (node as Text).data;

      return [
        {
          isParent: false,
          style: node?.parentElement?.style || null,
          node: span,
          text: span.textContent || "",
          nodeIndex: nodeIndex ?? [],
          nodeName: span.nodeName,
          parentIndex,
        },
      ];
    }

    case "LI":
      {
        if (node.parentElement)
          array.push([
            {
              isParent: false,
              style: node?.firstChild?.parentElement?.style || null,
              node,
              text: node.textContent || "",
              nodeIndex: nodeIndex ? [...nodeIndex] : [],
              nodeName: node.nodeName,
              parentIndex,
            },
          ]);
      }
      break;

    case "OL":
    case "UL":
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const childNode = node.childNodes.item(i);
        if (
          notAllowedTagsInParagraph.includes(childNode.nodeName.toLowerCase())
        ) {
          array.push({
            isParent: true,
            style: node.firstChild?.parentElement?.style || null,
            node: childNode,
            text: "",
            nodeIndex: nodeIndex ? [...nodeIndex, i] : [i],
            nodeName: childNode.nodeName,
            parentIndex,
          });
        }
        array.push(
          flattenChildNodes(childNode, nodeIndex ? [...nodeIndex, i] : [i])
        );
      }
      break;
    case "SPAN":
      if (node.childNodes.length === 1) {
        if ((node.firstChild as HTMLElement).nodeName === "BR") {
        } else {
          const span = document.createElement("span");
          span.textContent = node.textContent;

          return [
            {
              isParent: false,
              style: node?.firstChild?.parentElement?.style || null,
              node: span,
              text: span.textContent || "",
              nodeIndex: nodeIndex ?? [],
              nodeName: span.nodeName,
              parentIndex,
              childNodes: [node.firstChild as HTMLElement],
            },
          ];
        }
      }
    default: {
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const childNode = node.childNodes.item(i);
        if (
          notAllowedTagsInParagraph.includes(childNode.nodeName.toLowerCase())
        ) {
          array.push({
            isParent: true,
            style: null,
            node: childNode,
            text: "",
            nodeIndex: nodeIndex ? [...nodeIndex, i] : [i],
            nodeName: childNode.nodeName,
            parentIndex,
          });
        }
        array.push(
          flattenChildNodes(childNode, nodeIndex ? [...nodeIndex, i] : [i])
        );
      }
    }
  }
  return array.flat(Infinity);
};
const postProcessAfterFlatten = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];

  let resultNodes = eliminateConsecutiveRepeatBr(newNodes);
  resultNodes = eliminateConsecutiveRepeatNewLine(resultNodes);
  resultNodes = eliminateEmptyTextNode(resultNodes);
  resultNodes = eliminateEmptyChildNodes(resultNodes);
  const searchResult = searchFlattenNodeIndex(flattendNodes, [0]);
  if (searchResult !== -1 && resultNodes[searchResult]?.nodeName === "META")
    resultNodes.splice(searchResult, 1);

  return resultNodes;
};

const eliminateConsecutiveRepeatBr = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];

  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (node?.nodeName === "BR" && node?.nodeName === prevNode.node?.nodeName) {
      newNodes.splice(i, 1);
      i = i + 1;
    }
  }
  return newNodes;
};
const eliminateEmptyTextNode = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 0; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    node.text = node.text.replaceAll("\n", "");
    if (node.nodeName === "BR") continue;
    if (!notAllowedTagsInParagraph.includes(node.nodeName.toLowerCase())) {
      if (!node.text) newNodes.splice(i, 1);
    }
  }
  return newNodes;
};
const eliminateConsecutiveRepeatNewLine = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const node = newNodes[i];
    const prevNode = newNodes[i - 1];
    if (node?.isParent && node?.nodeName === prevNode.node?.nodeName) {
      newNodes.splice(i, 1);
      i = i - 1;
    }
  }
  return newNodes;
};
const eliminateEmptyChildNodes = (flattendNodes: FlattendNode[]) => {
  const newNodes = [...flattendNodes];
  for (let i = 1; i < newNodes.length; i += 1) {
    const { node } = newNodes[i];
    switch (node?.nodeName) {
      case "P":
        if (node?.childNodes?.length === 0) newNodes.splice(i, 1);
        if (
          node?.childNodes?.length === 1 &&
          node?.childNodes[0].nodeName === "SPAN" &&
          !node?.textContent
        )
          newNodes.splice(i, 1);
        break;
    }
  }
  return newNodes;
};
export { flattenChildNodes, postProcessAfterFlatten };
