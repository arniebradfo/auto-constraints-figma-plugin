import { CommandType, Message } from '../messages';
import {
	addRelaunchData,
	autoConstrainSelection,
	autoConstrainSelectionChildren,
	autoConstrainSelectionDescendants,
	frameAndAutoConstrainSelection,
	ignoreSelection,
	includeSelection,
	unGroupAndAutoConstrainSelection,
} from './auto-constraints';

let watchMode = false;
figma.on('run', (event) => {
	const command = event.command as CommandType;
	if (command === 'watchMode') {
		figma.showUI(__html__);
		watchMode = true;
	} else if (figma.currentPage.selection.length === 0) {
		figma.notify('Make a Selection to Auto Constrain');
		if (!watchMode) figma.closePlugin();
	} else {
		if (command === 'constrainSelection') autoConstrainSelection();
		if (command === 'constrainChildren') autoConstrainSelectionChildren();
		if (command === 'constrainDescendants') autoConstrainSelectionDescendants();
		if (command === 'frameAndConstrainSelection') frameAndAutoConstrainSelection(); // ctrl opt F
		if (command === 'unGroupAndConstrainSelection') unGroupAndAutoConstrainSelection(); // ctrl shift F
		if (command === 'includeSelection') includeSelection();
		if (command === 'ignoreSelection') ignoreSelection();
		if (!watchMode) figma.closePlugin();
	}
});

let previousSelection: SceneNode[] = [];
figma.on('selectionchange', () => {
	figma.ui.postMessage({
		type: 'selectionChange' as CommandType,
	});
	addRelaunchData();
	const currentSelection = [...figma.currentPage.selection];
	autoConstrainSelection(previousSelection);
	autoConstrainSelection(currentSelection);
	// console.log({ previousSelection, currentSelection });
	previousSelection = currentSelection;
});

figma.ui.onmessage = (message: Message) => {
	const type = message.type as CommandType;
	if (type === 'constrainSelection') autoConstrainSelection();
	if (type === 'constrainChildren') autoConstrainSelectionChildren();
	if (type === 'constrainDescendants') autoConstrainSelectionDescendants();
	if (type === 'frameAndConstrainSelection') frameAndAutoConstrainSelection();

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
