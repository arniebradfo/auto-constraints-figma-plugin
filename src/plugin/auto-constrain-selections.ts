import { autoConstraints } from "./auto-constraints";

export function autoConstrainSelection(selection?: SceneNode[]) {
	selection = selection || (figma.currentPage.selection as SceneNode[]);
	selection.forEach((node) => autoConstraints(node));
}

// UNUSED //
export function autoConstrainSelectionChildren() {
	figma.currentPage.selection.forEach((node) => {
		if ('children' in node) node.children.forEach((childNode) => autoConstraints(childNode));
	});
}

// UNUSED //
export function autoConstrainSelectionDescendants() {
	console.warn('autoConstrainSelectionDescendants not implemented yet');
}

export function unGroupAndAutoConstrainSelection() {
	figma.currentPage.selection.forEach((node) => {
		if (node.type === 'GROUP' || node.type === 'FRAME') {
			const children = figma.ungroup(node);
			children.forEach((childNode) => autoConstraints(childNode));
		}
	});
}

export function frameAndAutoConstrainSelection() {
	// new frame insertion point should be at the first selected node
	const { selection } = figma.currentPage;
	const { parent } = selection[0];

	const groupInsertionIndex = getIndexInParent(selection[selection.length - 1]);
	const groupNode = figma.group(selection, parent, groupInsertionIndex);

	const frameNode = figma.createFrame();
	const frameInsertionIndex = getIndexInParent(groupNode);
	parent.insertChild(frameInsertionIndex, frameNode);

	// copy groupNode dimensions
	frameNode.x = groupNode.x;
	frameNode.y = groupNode.y;
	frameNode.resize(groupNode.width, groupNode.height);
	frameNode.fills = [];
	frameNode.clipsContent = false;
	frameNode.name = 'Auto Constraints Frame'; // TODO: +index

	// offset each child by the groupNode x y, or it gets double offset
	const offsetX = groupNode.x;
	const offsetY = groupNode.y;

	[...groupNode.children].reverse().forEach((child) => {
		child.x = child.x - offsetX;
		child.y = child.y - offsetY;
		frameNode.insertChild(0, child);
	});

	// groupNode removes itself when it has no children
	// groupNode.remove()

	frameNode.children.forEach((childNode) => autoConstraints(childNode));

	figma.currentPage.selection = [frameNode];
}

function getIndexInParent(node: SceneNode) {
	return node.parent.children.findIndex((child) => node.id === child.id);
}