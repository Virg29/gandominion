import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { applyMixins } from '../common/utils/apply-mixins'
import { Hoverlightable } from '../mixins/hoverlight'
import { MultipleListener } from '../mixins/multiplelistener'
import Piles from './piles'

import BuyButtonImg from '../../assets/img/bb.jpg'

export interface BuyButton extends MultipleListener, Hoverlightable {}
export class BuyButton {
	image: Image
	name: string
	piles: Piles

	constructor(drawOn: Group, piles: Piles, position: Vector2d) {
		this.piles = piles
		this.initializeImage(drawOn, position)
	}

	private initializeImage(drawOn: Group, position: Vector2d) {
		Image.fromURL(BuyButtonImg, (img) => {
			img.scale({ x: 0.3, y: 0.3 })
			img.position(position)
			drawOn.add(img)
			this.image = img
			this.setupImageEvents()
		})
	}

	private setupImageEvents() {
		this.initMultipleListener(this.image, true)
		this.setFiltersApplyable(this.image)
		this.applyHoverLightEvent()
		this.applyClickEvents()
	}

	private applyClickEvents() {
		const triggerBuy = () => this.piles.buyAll()
		this.on('click', triggerBuy, this)
		this.on('tap', triggerBuy, this)
	}

	destruct() {
		this.image?.destroy()
	}
}

applyMixins(BuyButton, [MultipleListener, Hoverlightable])
