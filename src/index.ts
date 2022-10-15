import { CommandType } from './messages';
import {
	autoConstrainSelection,
	autoConstrainSelectionChildren,
	autoConstrainSelectionDescendants,
	frameAndAutoConstrainSelection,
	unGroupAndAutoConstrainSelection,
} from './plugin/auto-constrain-selections';
import { ignoreSelection, includeSelection, watchMode } from './plugin/watch-mode';

figma.on('run', (event) => {
	const command = event.command as CommandType;
	if (command === 'watchMode') {
		figma.showUI(__html__, uiWindowOptions);
		watchMode();
	} else if (figma.currentPage.selection.length === 0) {
		figma.notify('Make a Selection to Auto Constrain');
		figma.closePlugin();
	} else {
		if (command === 'constrainSelection') autoConstrainSelection();
		if (command === 'constrainChildren') autoConstrainSelectionChildren();
		if (command === 'constrainDescendants') autoConstrainSelectionDescendants();
		if (command === 'frameAndConstrainSelection') frameAndAutoConstrainSelection(); // ctrl opt F
		if (command === 'unGroupAndConstrainSelection') unGroupAndAutoConstrainSelection(); // ctrl shift F
		if (command === 'includeSelection') includeSelection();
		if (command === 'ignoreSelection') ignoreSelection();
		figma.closePlugin();
	}
});

// if UI is running, figma.closePlugin(); has not been called and we are in watchMode.
figma.on('selectionchange', watchMode);

/* 
figma.ui.onmessage = (message: Message) => {
	const type = message.type as CommandType;
	if (type === 'constrainSelection') autoConstrainSelection();
	if (type === 'constrainChildren') autoConstrainSelectionChildren();
	if (type === 'constrainDescendants') autoConstrainSelectionDescendants();
	if (type === 'frameAndConstrainSelection') frameAndAutoConstrainSelection();

	// // This is how figma responds back to the ui
	// figma.ui.postMessage({
	// 	type: 'create-rectangles',
	// 	message: `Created ${message.count} Rectangles`,
	// });
};
 */

const uiWindowOptions: ShowUIOptions = {
	title: '(beta) Auto Constraints Watch Mode is Running...',
	themeColors: true,
	height: 0, // lol
	width: 340,
};
