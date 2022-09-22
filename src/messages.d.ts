export type FigmaPluginMessage<T extends Message = AnyMessage> = { pluginId?: string; pluginMessage: T };

export type FigmaPluginMessageEvent<T extends Message = AnyMessage> = MessageEvent<FigmaPluginMessage<T>>;

export type MessageType = 'constrainSelection' | 'constrainChildren' | 'frameAndConstrainSelection' | 'watchMode' | 'constrainDescendants';

export interface Message {
	type: MessageType;
}

export interface AnyMessage extends Message {
	[k: string]: any;
}

export interface AutoConstrainSelfMessage extends Message {
	type: 'constrainSelection';
	// value: string;
}
