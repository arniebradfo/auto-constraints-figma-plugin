import { Message } from '../messages';

figma.showUI(__html__);

const autoConstrainSelf = () => {
	// console.log(figma.currentPage.selection);

	// TODO: figma.currentPage.selection.forEach(child=>{});
	const child = figma.currentPage.selection[0];

	const parent = child.parent;

	// if child.type === 'GROUP', get children recursively? or ignore?

    // TODO: improve this
	if (
		child.type === 'SLICE' ||
		child.type === 'GROUP' ||
		child.type === 'BOOLEAN_OPERATION' ||
		// FigJam Nodes
		child.type === 'STICKY' ||
		child.type === 'CONNECTOR' ||
		child.type === 'SHAPE_WITH_TEXT' ||
		child.type === 'CODE_BLOCK' ||
		child.type === 'WIDGET' ||
		child.type === 'EMBED' ||
		child.type === 'MEDIA' ||
		child.type === 'LINK_UNFURL' ||
		child.type === 'SECTION' ||
		child.type === 'WASHI_TAPE'
	)
		return;
	if (
		parent.type === 'SLICE' ||
		parent.type === 'GROUP' ||
		parent.type === 'BOOLEAN_OPERATION' ||
		// FigJam Nodes
		parent.type === 'STICKY' ||
		parent.type === 'CONNECTOR' ||
		parent.type === 'SHAPE_WITH_TEXT' ||
		parent.type === 'CODE_BLOCK' ||
		parent.type === 'WIDGET' ||
		parent.type === 'EMBED' ||
		parent.type === 'MEDIA' ||
		parent.type === 'LINK_UNFURL' ||
		parent.type === 'SECTION' ||
		parent.type === 'WASHI_TAPE'
	)
        return;
    
    
	if (parent.type === 'PAGE' || parent.type === 'DOCUMENT') return;

	// TODO: need absoluteBoundingBox instead of height/width properties

	// const { width: childWidth, height: childHeight, x: childX, y: childY } = child;
	console.log({ parent, child });

	const childSides = getSides(child.absoluteBoundingBox, parent.absoluteBoundingBox);
	const parentSides: Sides = {
		top: 0,
		bottom: parent.absoluteBoundingBox.height,
		left: 0,
		right: parent.absoluteBoundingBox.width,
	};

	// console.log({ childSides, parentSides });
	// console.log({ childWidth, childX });

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

	// horizontal first...
	// - if child centered in parent
    if (isCentered(childHorizontal, parentHorizontal)) {
        console.log({isCentered:isCentered(childHorizontal, parentHorizontal)});
        
		const parentLength = parentHorizontal.end - parentHorizontal.start;
		const childLength = childHorizontal.end - childHorizontal.start;

		//   - if parent childWidth < 50% parentWidth
		if (childLength < parentLength * 0.5) {
			//     - then center
			child.constraints = {
				horizontal: 'CENTER',
				vertical: child.constraints.vertical,
			};
		} else {
			//     - else fix both sides
			child.constraints = {
				horizontal: 'STRETCH',
				vertical: child.constraints.vertical,
			};
		}
	} else {
		child.constraints = {
			horizontal: 'SCALE',
			vertical: child.constraints.vertical,
		};
		// - else if childSide is within 15% of ParentSide
		//   - then fix side
		//   - else center side
	}
};

figma.ui.onmessage = (message: Message) => {
	if (message.type === 'autoConstrainSelf') autoConstrainSelf();

	// if (message.type === 'create-rectangles') {
	//     const nodes = [];

	//     for (let i = 0; i < message.count; i++) {
	//         const rect = figma.createRectangle();
	//         rect.x = i * 150;
	//         rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
	//         figma.currentPage.appendChild(rect);
	//         nodes.push(rect);
	//     }

	//     figma.currentPage.selection = nodes;
	//     figma.viewport.scrollAndZoomIntoView(nodes);

	//     // This is how figma responds back to the ui
	//     figma.ui.postMessage({
	//         type: 'create-rectangles',
	//         message: `Created ${message.count} Rectangles`,
	//     });
	// }

	// figma.closePlugin();

	// console.log(figma.selection);
};

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
