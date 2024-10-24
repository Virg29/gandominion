export class MultipleListener {
	private _handlers: Map<any, any>
	private _eventsHolder: any
	private _isMultiListner: boolean
	private _preventSame: boolean
	private _cancelBubble: boolean
	private _prev_e: any

	initMultipleListener(obj: any, preventSame = true, cancelBubble = true) {
		this._eventsHolder = obj
		this._preventSame = preventSame
		this._cancelBubble = cancelBubble
		if (this._handlers) this._handlers.clear()
		this._handlers = new Map()

		this._isMultiListner = obj instanceof Array
		if (this._isMultiListner) {
			for (var cObj of obj) {
				this._handlers.set(cObj, new Map())
			}
		}
	}

	on(
		eventName: string,
		eventHandler: (e: any) => any,
		eventContext: any,
		exact_obj: any = undefined,
		priority = 0
	) {
		var _handlers = null
		if (this._isMultiListner && exact_obj) {
			_handlers = this._handlers.get(exact_obj)
		} else {
			_handlers = this._handlers
		}
		if (!_handlers.get(eventName)) {
			_handlers.set(eventName, [])
		}
		var handlers = _handlers.get(eventName)
		handlers.push({
			handler: eventHandler,
			context: eventContext,
			priority: priority,
		})
		handlers.sort((a: any, b: any) => {
			return a.priority > b.priority
				? -1
				: a.priority == b.priority
				? 0
				: 1
		})
		_handlers.set(eventName, handlers)
		if (this._isMultiListner && exact_obj) {
			this._handlers.set(exact_obj, _handlers)
		}
		var setListenerTo = this._eventsHolder
		if (this._isMultiListner && exact_obj) {
			setListenerTo = exact_obj
		}
		setListenerTo.on(eventName, (e: any) => {
			if (this._preventSame && this._prev_e === e) return
			this._prev_e = e
			e.cancelBubble = this._cancelBubble
			for (var handler of handlers) {
				if (typeof handler.handler === 'function') {
					handler.handler.apply(handler.context, [e])
				}
			}
		})
	}
}
