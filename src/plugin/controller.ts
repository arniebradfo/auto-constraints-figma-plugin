import { Message } from '../messages';
import {
	autoConstrainSelection,
	autoConstrainSelectionChildren,
	autoConstrainSelectionDescendants,
	frameAndAutoConstrainSelectionChildren,
} from './auto-constraints';

figma.on('run', (event) => {
	if (event.command === 'watchMode') {
		figma.showUI(__html__);
	} else if (figma.currentPage.selection.length === 0) {
		figma.notify('Make a Selection to Auto Constrain');
		figma.closePlugin();
	} else {
		if (event.command === 'constrainSelection') autoConstrainSelection();
		if (event.command === 'constrainChildren') autoConstrainSelectionChildren();
		if (event.command === 'constrainDescendants') autoConstrainSelectionDescendants();
		if (event.command === 'frameAndConstrainChildren') frameAndAutoConstrainSelectionChildren();
		figma.closePlugin();
	}
});

figma.ui.onmessage = (message: Message) => {
	if (message.type === 'constrainSelection') autoConstrainSelection();
	if (message.type === 'constrainChildren') autoConstrainSelectionChildren();
	if (message.type === 'constrainDescendants') autoConstrainSelectionDescendants();
	if (message.type === 'frameAndConstrainSelection') frameAndAutoConstrainSelectionChildren();

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
