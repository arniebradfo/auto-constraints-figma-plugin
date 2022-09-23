export type FigmaPluginMessage<T extends Message = AnyMessage> = { pluginId?: string; pluginMessage: T };

export type FigmaPluginMessageEvent<T extends Message = AnyMessage> = MessageEvent<FigmaPluginMessage<T>>;

export type CommandType =
	| 'constrainSelection'
	| 'constrainChildren'
	| 'frameAndConstrainSelection'
	| 'unGroupAndConstrainSelection'
	| 'watchMode'
	| 'constrainDescendants'
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
