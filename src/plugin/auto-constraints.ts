import { isNodeIgnored } from './watch-mode';

export function autoConstraints(node: SceneNode) {
	if (isNodeIgnored(node)) {
		figma.notify(`Node Ignored by Auto Constraints: ${node.name}`);
		// TODO: button to select? // message if there is more than one?
		return;
	}

	// if (!node.visible) return; // Maybe?

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
	const dontStretchAny = child.constrainProportions;

	// don't apply 'STRETCH' to auto layouts that hug, or have no children that fill
	const dontStretchAutoLayoutHorizontal = dontStretchAutoLayout(node, 'HORIZONTAL');
	const dontStretchAutoLayoutVertical = dontStretchAutoLayout(node, 'VERTICAL');

	// don't apply 'STRETCH' to text dynamic text sizing settings
	const dontStretchTextHorizontal = 'textAutoResize' in child && child.textAutoResize === 'WIDTH_AND_HEIGHT';
	const dontStretchTextVertical =
		'textAutoResize' in child && (child.textAutoResize === 'WIDTH_AND_HEIGHT' || child.textAutoResize === 'HEIGHT');

	const horizontal = autoConstraint(
		childHorizontal,
		parentHorizontal,
		dontStretchAny || dontStretchTextHorizontal || dontStretchAutoLayoutHorizontal
	);
	const vertical = autoConstraint(
		childVertical,
		parentVertical,
		dontStretchAny || dontStretchTextVertical || dontStretchAutoLayoutVertical
	);

	child.constraints = {
		horizontal,
		vertical,
	};
}

function dontStretchAutoLayout(node: SceneNode, direction: BaseFrameMixin['layoutMode']): boolean {
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

	if (isPrimaryAxis) {
		// if spacing mode = space between, do stretch
		if (primaryAxisAlignItems === 'SPACE_BETWEEN') return false;

		// if resizing = hug, don't stretch
		if (primaryAxisSizingMode === 'AUTO') return true;

		// if any children resizing = fill, do stretch, else don't
		return !dontStretchAutoLayoutChildren(children, isPrimaryAxis);
	} else {
		// if resizing = hug, don't stretch
		if (counterAxisSizingMode === 'AUTO') return true;

		// if text baseline alignment is on, don't stretch
		if (counterAxisAlignItems === 'BASELINE') return true;

		// if any children resizing = fill, do stretch, else don't
		return dontStretchAutoLayoutChildren(children, isPrimaryAxis);
	}
}
function dontStretchAutoLayoutChildren(children: readonly SceneNode[], isPrimaryAxis: boolean): boolean {
	return !children.find((node) => {
		if (!('layoutPositioning' in node)) return false;

		const { visible, layoutPositioning, layoutAlign, layoutGrow } = node;

		// if node is absolutely positioned, ignore it
		if (layoutPositioning === 'ABSOLUTE') return false;

		// if node is hidden, ignore it
		if (!visible) return false;

		if (isPrimaryAxis) {
			// if resizing = fill, allow stretch
			return layoutGrow > 0;
		} else {
			// if resizing = fill, allow stretch
			return layoutAlign === 'STRETCH';
		}
	});
}

function autoConstraint(childLine: Line, parentLine: Line, dontStretch: boolean = false): ConstraintType {
	const parentLength = parentLine.end - parentLine.start;
	const childLength = childLine.end - childLine.start;

	if (isCentered(childLine, parentLine)) {
		if (dontStretch || childLength < parentLength * 0.5) {
			return 'CENTER';
		} else {
			return 'STRETCH';
		}
	} else {
		const edgeTolerance = 0.15;
		const pinLeft = childLine.start < parentLength * edgeTolerance;
		const pinRight = childLine.end > parentLength * (1 - edgeTolerance);

		if (pinLeft && pinRight) {
			return dontStretch ? 'CENTER' : 'STRETCH';
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
