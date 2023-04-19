import { autoConstraints } from './auto-constraints';

export function autoConstrainSelection(selection?: SceneNode[]) {
	selection = selection || (figma.currentPage.selection as SceneNode[]);
	selection.forEach((node) => autoConstraints(node));
	figma.notify('Auto Constraints Applied')
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
	figma.notify('Ungrouped and Auto Constrained')
}

export function frameAndAutoConstrainSelection() {
	// new frame insertion point should be at the first selected node
	const { selection } = figma.currentPage;
	const { parent } = selection[0];

	const groupInsertionIndex = getIndexInParent(selection[selection.length - 1]);
	const groupNode = figma.group(selection, parent, groupInsertionIndex);

	const frameNode = figma.createFrame();
	const frameInsertionIndex = getIndexInParent(groupNode);

	// copy groupNode dimensions
	frameNode.x = groupNode.x;
	frameNode.y = groupNode.y;
	frameNode.resize(groupNode.width, groupNode.height);
	frameNode.fills = [];
	frameNode.clipsContent = false;
	const frameIndex = getCurrentFrameIndex();
	frameNode.name = `AutoCon Frame ${frameIndex}`;

	// offset each child by the groupNode x y, or it gets double offset
	const offsetX = groupNode.x;
	const offsetY = groupNode.y;

	[...groupNode.children].reverse().forEach((child) => {
		frameNode.insertChild(0, child);
		child.x = child.x - offsetX;
		child.y = child.y - offsetY;
	});

	// groupNode.remove() // groupNode removes itself when it has no children
	// console.log({ parentLength: parent.children.length, frameInsertionIndex });

	parent.insertChild(frameInsertionIndex, frameNode);

	frameNode.children.forEach((childNode) => autoConstraints(childNode));

	figma.currentPage.selection = [frameNode];

	figma.notify('Selection Framed and Auto Constrained')
}

function getIndexInParent(node: SceneNode) {
	return node.parent.children.findIndex((child) => node.id === child.id);
}

const frameIndexKey = 'frameIndex';
function getCurrentFrameIndex() {
	let frameIndex: number = Number.parseInt(figma.currentPage.getPluginData(frameIndexKey));
	if (isNaN(frameIndex) || !frameIndex) frameIndex = 0;
	frameIndex++;
	figma.currentPage.setPluginData(frameIndexKey, frameIndex.toString());
	return frameIndex;
}
