import * as React from 'react';
import { AutoConstrainSelfMessage, FigmaPluginMessage, Message, MessageType } from '../../messages';
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

	const autoConstrainSelf = React.useCallback((type: MessageType) => {
		const message: FigmaPluginMessage<Message> = {
			pluginMessage: { type },
		};
		parent.postMessage(message, '*');
	}, []);

	return (
		<div>
			<button onClick={()=>autoConstrainSelf('constrainSelection')} children="Auto Constrain Selection" />
			<button onClick={()=>autoConstrainSelf('constrainChildren')} children="Auto Constrain Children" />
			<button onClick={()=>autoConstrainSelf('constrainDescendants')} children="Auto Constrain Descendants" />
			<button onClick={()=>autoConstrainSelf('frameAndConstrainSelection')} children="Frame And Constrain Selection" />
		</div>
	);
};

export default App;
