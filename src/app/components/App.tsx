import * as React from 'react';
import '../styles/ui.css';

const App = ({}) => {
	// const runCommand = React.useCallback((type: CommandType) => {
	// 	const message: FigmaPluginMessage<Message> = {
	// 		pluginMessage: { type },
	// 	};
	// 	parent.postMessage(message, '*');
	// }, []);

	React.useEffect(() => {
		// This is how we read messages sent from the plugin controller
		// store the previous selection, change it on deselect
		// window.onmessage = (event) => {
			// const { type } = event.data.pluginMessage;
			// if (type === 'selectionChange') {
				// runCommand('constrainSelection')
				// console.log('selectionChange');
			// }
		// };
	}, []);

	return (
		<div>
			{/* <h4>Watch Mode is Running</h4> */}
			<p>
				Auto Constraints will be applied to every object selected, both before and after it's touched. Closing
				this window or running another plugin will quit Watch Mode.
			</p>
			{/* <button onClick={() => runCommand('constrainSelection')} children="Auto Constrain Selection" />
			<button onClick={() => runCommand('constrainChildren')} children="Auto Constrain Children" />
			<button onClick={() => runCommand('constrainDescendants')} children="Auto Constrain Descendants" />
			<button onClick={() => runCommand('frameAndConstrainSelection')} children="Frame And Constrain Selection" />
			<button onClick={() => runCommand('ignoreSelection')} children="Ignore Selection" /> */}
			{/* don't apply to root frames */}
			{/* <button children={'Hide this UI'} /> */}
		</div>
	);
};

export default App;
