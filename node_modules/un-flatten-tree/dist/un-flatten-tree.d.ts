/**
 * Converts tree to list.
 *
 * @param tree Array-like object representing tree.
 * @param getChildNodes Function to return child nodes.
 * @param convertNode Function to modify each item of result list.
 * @param generateId Function to generate unique ids for each item of result list.
 * @return Returns list of out nodes.
 */
export declare function flatten<Node, OutNode, Id>(tree: ArrayLike<Node>, getChildNodes: (node: Node) => ArrayLike<Node>, convertNode?: (node: Node, parentNode?: Node, nodeId?: Id, parentNodeId?: Id) => OutNode, generateId?: (node: Node) => Id): OutNode[];
/**
 * Converts list to tree.
 *
 * @param list Array-like object representing list.
 * @param isChildNode Function to check for child-parent relation.
 * @param addChildNode Function to add out node to its parent node.
 * @param convertNode Function to modify each node of resulting tree.
 * @return Returns tree of out nodes.
 */
export declare function unflatten<Node>(list: ArrayLike<Node>, isChildNode: (node: Node, parentNode: Node) => boolean, addChildNode: (node: Node, parentNode: Node) => void): Node[];
export declare function unflatten<Node, OutNode>(list: ArrayLike<Node>, isChildNode: (node: Node, parentNode: Node) => boolean, addChildNode: (node: OutNode, parentNode: OutNode) => void, convertNode: (node: Node) => OutNode): OutNode[];
