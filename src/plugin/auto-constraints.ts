export function autoConstrainSelection() {
	figma.currentPage.selection.forEach((node) => autoConstraints(node));
}

export function autoConstrainSelectionChildren() {
	figma.currentPage.selection.forEach((node) => {
		if ('children' in node) node.children.forEach((childNode) => autoConstraints(childNode));
	});
}

export function frameAndAutoConstrainSelectionChildren() {
	console.log('frameAndConstrainChildren');
}

const autoConstraints = (node: SceneNode) => {
	console.log(figma.currentPage.selection);

	const child = node;
	const parent = child.parent;

	// if child.type === 'GROUP', get children recursively - ignore for now
	// if parent.type === 'GROUP', get parent recursively - ignore for now

	if (!('constraints' in child && 'absoluteBoundingBox' in child && 'absoluteBoundingBox' in parent)) return;

	console.log({ parent, child });

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
	console.log({ marginEnd, marginStart, line1, line2 });
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
