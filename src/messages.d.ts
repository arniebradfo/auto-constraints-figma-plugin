export type FigmaPluginMessage<T extends Message = AnyMessage> = { pluginId?: string; pluginMessage: T };

export type FigmaPluginMessageEvent<T extends Message = AnyMessage> = { data: FigmaPluginMessage<T> }; // shape of the UI-side MessageEvent

export type CommandType =
	| 'constrainSelection'
	| 'constrainChildren'
	| 'frameAndConstrainSelection'
	| 'unGroupAndConstrainSelection'
	| 'watchMode'
	| 'constrainDescendants'
	| 'includeSelection'
	| 'ignoreSelection';

export interface Message {
	type: CommandType;
}

export interface AnyMessage extends Message {
	[k: string]: any;
}

export interface AutoConstrainSelfMessage extends Message {
	type: 'constrainSelection';
	// value: string;
}
