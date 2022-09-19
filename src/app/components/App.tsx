import * as React from 'react';
import { AutoConstrainSelfMessage, FigmaPluginMessage } from '../../messages';
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

	// React.useEffect(() => {
	//     // This is how we read messages sent from the plugin controller
	//     window.onmessage = (event) => {
	//         const {type, message} = event.data.pluginMessage;
	//         if (type === 'create-rectangles') {
	//             console.log(`Figma Says: ${message}`);
	//         }
	//     };
	// }, []);

	const autoConstrainSelf = React.useCallback(() => {
		const message: FigmaPluginMessage<AutoConstrainSelfMessage> = {
			pluginMessage: { type: 'constrainSelection' },
		};
		parent.postMessage(message, '*');
	}, []);

	return (
		<div>
			<button onClick={autoConstrainSelf} children="Auto Constrain Selection" />
		</div>
	);
};

export default App;
