import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { getCardImageUrlByName } from './cards-images'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { MultipleListener } from '../mixins/multiplelistener'

const CARD_WIDTH_SIZE = 110


export default class Hand {
	drawOn: Group
	regionSize: Vector2d
	startPos: Vector2d
	cards: CardInHand[] = []

	constructor(drawOn: Group, startPos: Vector2d, size: Vector2d) {
		this.drawOn = drawOn
		;(this.startPos = startPos), (this.regionSize = size)

		this.updateHand([
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
	
		])
	}

	clear() {}

	async updateHand(cards: { name: string; amount: number }[]) {
		if (this.cards.length) this.cards.forEach((card) => card.destruct())

		const maxAmount = this.regionSize.x / CARD_WIDTH_SIZE
		console.log(this.regionSize.x)
		let i = 0
		const loadingPromises:Promise<CardInHand>[] = []
		for (const card of cards) {
			loadingPromises.push(
				new CardInHand(getCardImageUrlByName(card.name), {
					x:
						this.startPos.x +
						(cards.length < maxAmount? CARD_WIDTH_SIZE
							
							: this.regionSize.x/(cards.length+1)) *
							i,
					y: this.startPos.y,
				}).loadImage()
			)
			i++
		}
		const loadedCards = await Promise.all(loadingPromises)
		loadedCards.forEach((card) => {
			this.drawOn.add(card.image)
		})
	}

	playCard() {}
}

export interface CardInHand extends MultipleListener,Hoverlightable {}

export class CardInHand {
	image: Image
	url: string
	position: Vector2d

	constructor(
		url: string,
		position: Vector2d,
	) {
		this.url = url
		this.position = position
		
	}

	loadImage():Promise<CardInHand>{
		return new Promise((res,rej)=>{
			Image.fromURL(this.url, (img) => {
				img.scale({ x: 0.5, y: 0.5 })
				img.position(this.position)
				this.image = img
				this.initMultipleListener(this.image,true)
				this.setFiltersApplyable(this.image)
				this.applyHoverLightEvent()
				res(this)
			})
		})
		
	}

	destruct() {
		this.image.remove()
	}
}

applyMixins(CardInHand, [MultipleListener,Hoverlightable])