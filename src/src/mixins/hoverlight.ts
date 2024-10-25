import { Brighten as filter } from 'konva/lib/filters/Brighten'
import { MultipleListener } from './multiplelistener'

export interface Hoverlightable extends MultipleListener {}

export class Hoverlightable {
	applyHoverLightEvent() {
		this.on(
			'mouseover',
			function (e: any) {
				var filters = this._applyHoverOn.filters()
				if (!filters) filters = []
				filters.push(filter)
				this._applyHoverOn.filters(filters)
				this._applyHoverOn.cache({ pixelRation: 5 })
				this._applyHoverOn.brightness(0.3)
				
			},
			this
		)
		this.on(
			'mouseout',
			function (e: any) {
				var filters = this._applyHoverOn.filters()
				if (!filters) return
				var index = filters.indexOf(filter)
				if (index > -1) filters.splice(index, 1)
				this._applyHoverOn.filters(filters)
				this._applyHoverOn.clearCache()
				this._applyHoverOn.cache({ pixelRation: 5 })
				
			},
			this
		)
	}
	_applyHoverOn: any
	_parentGroupHoverOn:any
	setFiltersApplyable(obj: any, parent: any = null) {
		this._applyHoverOn = obj
		this._parentGroupHoverOn = parent
	}
}
