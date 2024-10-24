import { Brighten as filter } from 'konva/lib/filters/Brighten'
// import Ship from '../ships/ship/ship'
// import Spm from '../dock/spm/spm'
export default {
	applyHoverLightEvent() {
		this.on(
			'mouseover',
			function (e) {
				// console.log('in')
				var refreshParent = false
				if (
					this.constructor.name == 'Hatch' ||
					this.constructor.name == 'Deckhouse'
				) {
					refreshParent = true
				}
				if (refreshParent) this._parentGroupHoverOn.clearCache()

				// console.log(this._applyHoverOn.filters())
				var filters = this._applyHoverOn.filters()
				if (!filters) filters = []
				filters.push(filter)
				this._applyHoverOn.filters(filters)
				this._applyHoverOn.cache({ pixelRation: 5 })
				this._applyHoverOn.brightness(0.3)
				// this._applyHoverOn.clearCache()

				if (refreshParent)
					this._parentGroupHoverOn.cache({ pixelRation: 5 })
			},
			this
		)
		this.on(
			'mouseout',
			function (e) {
				// console.log('out')
				var filters = this._applyHoverOn.filters()
				if (!filters) return
				var index = filters.indexOf(filter)
				if (index > -1) filters.splice(index, 1)
				this._applyHoverOn.filters(filters)
				this._applyHoverOn.clearCache()
				this._applyHoverOn.cache({ pixelRation: 5 })
				if (this.constructor.name == 'Spm')
					this._applyHoverOn.clearCache()
			},
			this
		)
	},
	setFiltersApplyable(obj, parent = null) {
		this._applyHoverOn = obj
		this._parentGroupHoverOn = parent
	},
}
