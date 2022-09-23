import { CommandType } from '../messages';
import { autoConstrainSelection } from './auto-constrain-selections';

let previousSelection: SceneNode[] = [];
export function watchMode() {
	figma.ui.postMessage({
		type: 'selectionChange' as CommandType,
	});
	addRelaunchData();
	const currentSelection = [...figma.currentPage.selection];
	autoConstrainSelection(previousSelection.filter((node) => !node.removed));
	autoConstrainSelection(currentSelection);
	previousSelection = currentSelection;
}

export function addRelaunchData() {
	figma.currentPage.selection.forEach((node) => {
		const { ignoreSelection, includeSelection } = node.getRelaunchData();
		if (ignoreSelection == null && includeSelection == null) node.setRelaunchData({ includeSelection: '' });
	});
}
export function includeSelection() {
	figma.currentPage.selection.forEach((node) => {
		node.setRelaunchData({ ignoreSelection: '' });
	});
}
export function ignoreSelection() {
	figma.currentPage.selection.forEach((node) => {
		node.setRelaunchData({ includeSelection: '' });
	});
}
export function isNodeIgnored(node: SceneNode) {
	return node.getRelaunchData().ignoreSelection != null;
}

/*
"relaunchButtons": [
	{
		"name": "✅ Manual Constraints",
		"command": "includeSelection",
		"multipleSelection": true
	},
	{
		"name": "□ Manual Constraints",
		"command": "ignoreSelection",
		"multipleSelection": true
	}
]
*/
