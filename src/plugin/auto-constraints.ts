export function autoConstrainSelection() {
	figma.currentPage.selection.forEach((node) => autoConstraints(node));
}

export function autoConstrainSelectionChildren() {
	figma.currentPage.selection.forEach((node) => {
		if ('children' in node) node.children.forEach((childNode) => autoConstraints(childNode));
	});
}

export function autoConstrainSelectionDescendants() {
	console.warn('autoConstrainSelectionDescendants not implemented yet');
}

export function frameAndAutoConstrainSelectionChildren() {
	// new frame insertion point should be at the first selected node
	const { selection } = figma.currentPage;
	const insertionNode = selection[0].parent;
	
	// TODO: get correct insertionIndex
	const insertionIndex = 0; // getIndexInParent(selection[0])
	const groupNode = figma.group(selection, insertionNode, insertionIndex);

	const frameNode = figma.createFrame();
	insertionNode.insertChild(insertionIndex, frameNode);

	// copy groupNode dimensions
	frameNode.x = groupNode.x;
	frameNode.y = groupNode.y;
	frameNode.resize(groupNode.width, groupNode.height);

	// offset each child by the groupNode x y, or it gets double offset
	// TODO: consider rotation and transforms
	const offsetX = groupNode.x;
	const offsetY = groupNode.y;

	groupNode.children.forEach((child) => {
		child.x = child.x - offsetX;
		child.y = child.y - offsetY;
		frameNode.insertChild(0, child);
	});

	// groupNode removes itself when it has no children

	frameNode.children.forEach((childNode) => autoConstraints(childNode));
}

const autoConstraints = (node: SceneNode) => {
	const child = node;
	const parent = child.parent;

	// if child.type === 'GROUP', get children recursively - ignore for now
	// if parent.type === 'GROUP', get parent recursively - ignore for now

	if (!('constraints' in child && 'absoluteBoundingBox' in child && 'absoluteBoundingBox' in parent)) return;

	const childSides = getSides(child.absoluteBoundingBox, parent.absoluteBoundingBox);
	const parentSides: Sides = {
		top: 0,
		bottom: parent.absoluteBoundingBox.height,
		left: 0,
		right: parent.absoluteBoundingBox.width,
	};

	const childVertical: Line = {
		start: childSides.top,
		end: childSides.bottom,
	};
	const childHorizontal: Line = {
		start: childSides.left,
		end: childSides.right,
	};
	const parentVertical: Line = {
		start: parentSides.top,
		end: parentSides.bottom,
	};
	const parentHorizontal: Line = {
		start: parentSides.left,
		end: parentSides.right,
	};

	const horizontal = autoConstraint(childHorizontal, parentHorizontal);
	const vertical = autoConstraint(childVertical, parentVertical);
	child.constraints = {
		horizontal,
		vertical,
	};
};

function autoConstraint(childLine: Line, parentLine: Line): ConstraintType {
	const parentLength = parentLine.end - parentLine.start;
	const childLength = childLine.end - childLine.start;

	if (isCentered(childLine, parentLine)) {
		if (childLength < parentLength * 0.5) {
			return 'CENTER';
		} else {
			return 'STRETCH';
		}
	} else {
		const edgeTolerance = 0.15;
		const pinLeft = childLine.start < parentLength * edgeTolerance;
		const pinRight = childLine.end > parentLength * (1 - edgeTolerance);

		if (pinLeft && pinRight) {
			return 'STRETCH';
		} else if (pinLeft) {
			return 'MIN';
		} else if (pinRight) {
			return 'MAX';
		} else {
			return 'CENTER';
		}
	}
}

interface Sides {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

interface Line {
	start: number;
	end: number;
}

function isCentered(line1: Line, line2: Line): boolean {
	const marginStart = line2.start - line1.start;
	const marginEnd = line1.end - line2.end;
	// provide a pixel of leniency for centered odd widths and fractional widths
	return marginStart >= marginEnd - 1 && marginStart <= marginEnd + 1;
}

function getSides(rect: Rect, parentRect: Rect = defaultRect): Sides {
	const top = rect.y - parentRect.y;
	const bottom = top + rect.height;
	const left = rect.x - parentRect.x;
	const right = left + rect.width;
	return {
		top,
		bottom,
		left,
		right,
	};
}

const defaultRect: Rect = { x: 0, y: 0, height: 0, width: 0 };

function getIndexInParent(node: SceneNode) {
	return [...node.parent.children].reverse().findIndex((child) => node.id === child.id);
}
