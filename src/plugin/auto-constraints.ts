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
	frameNode.fills = [];
	frameNode.clipsContent = false;

	// offset each child by the groupNode x y, or it gets double offset
	// TODO: consider rotation and transforms // maybe don't need to?
	const offsetX = groupNode.x;
	const offsetY = groupNode.y;

	groupNode.children.forEach((child) => {
		child.x = child.x - offsetX;
		child.y = child.y - offsetY;
		frameNode.insertChild(0, child);
	});

	// groupNode removes itself when it has no children
	// groupNode.remove()

	frameNode.children.forEach((childNode) => autoConstraints(childNode));
}

const autoConstraints = (node: SceneNode) => {
	const child = node;
	const parent = child.parent;

	// TODO:
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

	// 'STRETCH' seems pretty dangerous actually...

	// don't apply 'STRETCH' to any object with constrained proportions
	const noStretchAny = child.constrainProportions;

	// don't apply 'STRETCH' to auto layouts that hug, or have no children that fill
	const noStretchAutoLayoutHorizontal = noStretchAutoLayout(node, 'HORIZONTAL');
	const noStretchAutoLayoutVertical = noStretchAutoLayout(node, 'VERTICAL');

	// don't apply 'STRETCH' to text dynamic text sizing settings
	const noStretchTextHorizontal = 'textAutoResize' in child && child.textAutoResize === 'WIDTH_AND_HEIGHT';
	const noStretchTextVertical =
		'textAutoResize' in child && (child.textAutoResize === 'WIDTH_AND_HEIGHT' || child.textAutoResize === 'HEIGHT');

	const horizontal = autoConstraint(
		childHorizontal,
		parentHorizontal,
		noStretchAny || noStretchTextHorizontal || noStretchAutoLayoutHorizontal
	);
	const vertical = autoConstraint(
		childVertical,
		parentVertical,
		noStretchAny || noStretchTextVertical || noStretchAutoLayoutVertical
	);

	child.constraints = {
		horizontal,
		vertical,
	};
};

function noStretchAutoLayout(node: SceneNode, direction: BaseFrameMixin['layoutMode']): boolean {
	if (!('layoutMode' in node)) return false;
	const {
		layoutMode,
		counterAxisSizingMode,
		primaryAxisSizingMode,
		primaryAxisAlignItems,
		counterAxisAlignItems,
		children,
	} = node;
	if (layoutMode == 'NONE') return false;
	const isPrimaryAxis = direction === layoutMode;
	// console.log({ node });
	// console.log({
	// 	direction,
	// 	layoutMode,
	// 	counterAxisSizingMode,
	// 	primaryAxisSizingMode,
	// 	primaryAxisAlignItems,
	// 	isPrimaryAxis,
	// 	children,
	// });
	if (isPrimaryAxis) {
		// if spacing mode = space between, do stretch
		if (primaryAxisAlignItems === 'SPACE_BETWEEN') return false;

		// if resizing = hug, don't stretch
		if (primaryAxisSizingMode === 'AUTO') return true;

		// if any children resizing = fill, do stretch, else don't
		return !allowStretchAutoLayoutChildren(children, isPrimaryAxis);
	} else {
		// if text baseline alignment is on, don't stretch
		if (counterAxisAlignItems === 'BASELINE') return true;

		// if resizing = hug, don't stretch
		if (counterAxisSizingMode === 'AUTO') return true;

		// if any children resizing = fill, do stretch, else don't
		return !allowStretchAutoLayoutChildren(children, isPrimaryAxis);
	}
}
function allowStretchAutoLayoutChildren(children: readonly SceneNode[], isPrimaryAxis:boolean): boolean {
	console.log({ children });
	return (
		undefined !==
		children.find((node) => {
			if (!('layoutPositioning' in node)) return false;

			const {
				visible,
				name,
				layoutPositioning,
				layoutAlign,
				layoutGrow,
			} = node;
			console.log({
				node,
				isPrimaryAxis,
				visible,
				name,
				layoutPositioning,
				layoutAlign,
				layoutGrow,
			});

			// if node is absolutely positioned, ignore it
			if (node.layoutPositioning === 'ABSOLUTE') return false

			// if node is hidden, ignore it
			if (!visible) return false;

			if (isPrimaryAxis) {
				return layoutGrow > 0
			} else {
				return layoutAlign === 'STRETCH'
			}
		})
	);
}

function autoConstraint(childLine: Line, parentLine: Line, noStretch: boolean = false): ConstraintType {
	const parentLength = parentLine.end - parentLine.start;
	const childLength = childLine.end - childLine.start;

	if (isCentered(childLine, parentLine)) {
		if (noStretch || childLength < parentLength * 0.5) {
			return 'CENTER';
		} else {
			return 'STRETCH';
		}
	} else {
		const edgeTolerance = 0.15;
		const pinLeft = childLine.start < parentLength * edgeTolerance;
		const pinRight = childLine.end > parentLength * (1 - edgeTolerance);

		if (pinLeft && pinRight) {
			return noStretch ? 'CENTER' : 'STRETCH';
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

// function getIndexInParent(node: SceneNode) {
// 	return [...node.parent.children].reverse().findIndex((child) => node.id === child.id);
// }
