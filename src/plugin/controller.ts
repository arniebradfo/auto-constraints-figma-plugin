import { Message } from '../messages';

figma.showUI(__html__);

const autoConstrainSelf = () => {
	// console.log(figma.currentPage.selection);

	// TODO: figma.currentPage.selection.forEach(child=>{});
	const child = figma.currentPage.selection[0];

	// if child.type === 'GROUP', get children recursively? or ignore?
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
    
    // TODO: need absoluteBoundingBox instead of height/width properties 
	const { parent, width: childWidth, height: childHeight, x: childX, y: childY } = child;
	console.log({ parent, child });
	if (parent.type === 'PAGE' || parent.type === 'DOCUMENT') return;

	const { width: parentWidth, height: parentHeight } = parent;

	const childSides: Sides = {
		top: childY,
		bottom: childY + childHeight,
		left: childX,
		right: childX + childWidth,
	};
	const parentSides: Sides = {
		top: 0,
		bottom: parentHeight,
		left: 0,
		right: parentWidth,
	};

	// console.log({ childSides, parentSides });
	console.log({ childWidth, childX });

	const childVertical: Line = {
		start: childY,
		end: childY + childHeight,
	};
	const childHorizontal: Line = {
		start: childX,
		end: childX + childWidth,
	};
	const parentVertical: Line = {
		start: 0,
		end: parentHeight,
	};
	const parentHorizontal: Line = {
		start: 0,
		end: parentWidth,
	};

	// horizontal first...
	// - if child centered in parent
	if (isCentered(childHorizontal, parentHorizontal)) {
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
	return marginStart >= marginEnd - 1 && marginStart <= marginStart + 1;
}

/* 
function hasConstraints(node: SceneNode) {
	return !(node.type === 'SLICE' || node.type === 'GROUP' || node.type === 'BOOLEAN_OPERATION' || isFigJamNode(node));
}
function isFigJamNode(node: SceneNode) {
	return (
		node.type === 'STICKY' ||
		node.type === 'CONNECTOR' ||
		node.type === 'SHAPE_WITH_TEXT' ||
		node.type === 'CODE_BLOCK' ||
		node.type === 'WIDGET' ||
		node.type === 'EMBED' ||
		node.type === 'MEDIA' ||
		node.type === 'LINK_UNFURL' ||
		node.type === 'SECTION' ||
		node.type === 'WASHI_TAPE'
	);
}
 */

function isEven(n) {
	return n % 2 == 0;
}
function isOdd(n) {
	return Math.abs(n % 2) == 1;
}
