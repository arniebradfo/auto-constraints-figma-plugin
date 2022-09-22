import * as React from 'react';
import { FigmaPluginMessage, Message, CommandType } from '../../messages';
// import '../styles/ui.css';

const App = ({}) => {
	// const textbox = React.useRef<HTMLInputElement>(undefined);

	// const countRef = React.useCallback((element: HTMLInputElement) => {
	//     if (element) element.value = '5';
	//     textbox.current = element;
	// }, []);

	// const onCreate = () => {
	//     const count = parseInt(textbox.current.value, 10);
	//     parent.postMessage({pluginMessage: {type: 'create-rectangles', count}}, '*');
	// };

	// const onCancel = () => {
	//     parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
	// };

	const runCommand = React.useCallback((type: CommandType) => {
		const message: FigmaPluginMessage<Message> = {
			pluginMessage: { type },
		};
		parent.postMessage(message, '*');
	}, []);

	React.useEffect(() => {
		// This is how we read messages sent from the plugin controller
		// store the previous selection, change it on deselect
		window.onmessage = (event) => {
			const { type } = event.data.pluginMessage;
			if (type === 'selectionChange') {
				// runCommand('constrainSelection')
				console.log('selectionChange');
			}
		};
	}, []);

	return (
		<div>
			<button onClick={() => runCommand('constrainSelection')} children="Auto Constrain Selection" />
			<button onClick={() => runCommand('constrainChildren')} children="Auto Constrain Children" />
			<button onClick={() => runCommand('constrainDescendants')} children="Auto Constrain Descendants" />
			<button onClick={() => runCommand('frameAndConstrainSelection')} children="Frame And Constrain Selection" />
			<button onClick={() => runCommand('ignoreSelection')} children="Ignore Selection" />
			{/* don't apply to root frames */}
		</div>
	);
};

export default App;
