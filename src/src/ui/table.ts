import * as $ from 'jquery'
import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { Vector2d } from 'konva/lib/types'
import * as webix from 'webix'
import { applyMixins } from '../common/utils/apply-mixins'
import { MultipleListener } from '../mixins/multiplelistener'
import LayerManager from './layermanager'
import { Image } from 'konva/lib/shapes/Image'
import img from '../../assets/img/bg.jpg'
import Piles from './piles'
import { Rect } from 'konva/lib/shapes/Rect'
import Hand from './hand'
import GameManager from './game-manager'
import { PlayButton } from './play-button'
import { PlayArea } from './play-area'
import { ClarificatePlayMenu } from './clarificate-play'

Konva.pixelRatio = 1

export const PLAY_AREA_POS = { x: 50, y: 550 }
export const PLAY_AREA_SIZE = { x: 1100, y: 200 }

export interface Table extends MultipleListener {}

export class Table {
	static instance: Table | null = null
	static hand: Hand | null = null
	static piles: Piles | null = null

	width: number
	height: number
	stage: Stage
	layerManager: LayerManager
	activeKeys: string[]
	key: string
	stagePos: Vector2d

	gameManager: GameManager

	static showMessage(text: string, type = 'error') {
		webix.message({
			text: text,
			type: type, //'error' а других нам и не надо
			expire: 10000,
		})
	}

	constructor() {
		Table.instance = this
		this.width = $('#container').innerWidth()
		this.height = $('#container').innerHeight()

		this.stage = new Konva.Stage({
			container: 'container',
			width: this.width,
			height: this.height,
			draggable: true,
		})
		$(window).resize(() => {
			this.stage.size({
				width: $('#container').innerWidth(),
				height: $('#container').innerHeight(),
			})
		})
		this.layerManager = new LayerManager(this.stage)
		this.createLayers()

		this.activeKeys = []
		this.key = 'Space'
		this.stagePos = this.stage.position()
		this.gameManager = new GameManager()

		this.init()
	}
	createLayers() {
		this.layerManager.createLayer({ listening: false }, 'backplate')
		this.layerManager.createLayer({ listening: false }, 'areas')
		this.layerManager.createLayer({}, 'table-decks')
		this.layerManager.createLayer({}, 'hand')
		// this.layerManager.createLayer({}, 'buttons')
	}

	getSize() {
		return { width: this.stage.width(), height: this.stage.height() }
	}

	init() {
		this.applyDefaultScale()
		this.drawBackground()
		this.initMultipleListener(this.stage)
		this.applyDefaultOnWheel()
		this.initPiles()
		this.drawPlayArea()
		this.drawPlayButton()
		this.initHand()
		this.startListenButton()
		this.initClarificateModal()
	}

	startListenButton() {
		console.log($('#megabutton'))
		$('#megabutton').on('click', () => {
			const address = $('#address').val().toString().split(':')
			const name = $('#name').val().toString()
			const room = $('#room').val().toString()
			const players = Number($('#players').val().toString())
			console.log(address, name, room, players)
			this.gameManager.init(address[0], address[1], name, room, players)
			$('#overlayForm').hide()
		})
	}

	initClarificateModal() {
		const handGroupLayer = this.layerManager.getLayer('hand')
		if ('add' in handGroupLayer) new ClarificatePlayMenu(handGroupLayer)
	}

	initHand() {
		const handGroupLayer = this.layerManager.getLayer('hand')
		if ('add' in handGroupLayer) {
			const hand = new Hand(
				handGroupLayer,
				{ x: 50, y: 800 },
				{ x: 900, y: 0 }
			)
			hand.setPlayOnMatRegion(PLAY_AREA_POS, PLAY_AREA_SIZE)
		}
	}

	initPiles() {
		const tableDecksLayer = this.layerManager.getLayer('table-decks')
		if ('add' in tableDecksLayer)
			new Piles(tableDecksLayer, { x: 50, y: 50 }, { x: 1100, y: 500 })
	}

	drawBackground() {
		const grpLayer = this.layerManager.getLayer('backplate')
		if ('add' in grpLayer) {
			Konva.Image.fromURL(img, (image) => {
				// image is Konva.Image instance
				image.width(1920)
				image.height(1080)
				grpLayer.add(image)
			})
		}
	}

	drawPlayArea() {
		const tableDecksLayer = this.layerManager.getLayer('table-decks')
		if ('add' in tableDecksLayer) new PlayArea(tableDecksLayer)
	}

	drawPlayButton() {
		const grpLayer = this.layerManager.getLayer('table-decks')
		if ('add' in grpLayer) new PlayButton(grpLayer, { x: 1400, y: 550 })
	}

	applyDefaultScale() {
		this.stage.scale({ x: 0.4, y: 0.4 })
	}

	changeScale(changeOn: number) {
		var newScale = this.stage.scaleX() + changeOn
		this.stage.scale({ x: newScale, y: newScale })
	}
	rotation(rot: number = null, rad: boolean = false) {
		if (rot == null)
			return rad
				? (this.stage.rotation() * Math.PI) / 180
				: this.stage.rotation()
		this.stage.rotation(rot)
	}

	changeView(
		x: number = null,
		y: number = null,
		rot: number = null,
		scale: number = null
	) {
		if (scale != null) {
			this.stage.scale({ x: scale, y: scale })
		}
		if (x != null && y != null) {
			this.stage.position({ x: x, y: y })
			this.stagePos = this.stage.position()
		}
		if (rot != null) {
			this.rotation(rot)
		}
	}

	applyDefaultOnWheel() {
		this.on(
			'wheel',
			function (e: any) {
				// stop default scrolling
				// console.log(this.stage.position(), this.stage.scale())
				e.evt.preventDefault()
				//с зажатым пробелом
				// if (this.activeKeys.indexOf(this.key) == -1) return
				var scaleBy = 1.05

				var oldScale = this.stage.scaleX()
				var pointer = this.stage.getPointerPosition()

				var mousePointTo = {
					x: (pointer.x - this.stage.x()) / oldScale,
					y: (pointer.y - this.stage.y()) / oldScale,
				}

				// how to scale? Zoom in? Or zoom out?
				let direction = e.evt.deltaY > 0 ? -1 : 1

				// when we zoom on trackpad, e.evt.ctrlKey is true
				// in that case lets revert direction
				if (e.evt.ctrlKey) {
					direction = -direction
				}

				var newScale =
					direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

				this.stage.scale({ x: newScale, y: newScale })

				var newPos = {
					x: pointer.x - mousePointTo.x * newScale,
					y: pointer.y - mousePointTo.y * newScale,
				}
				this.stage.absolutePosition(newPos)

				this.stagePos = this.stage.position()
			},
			this
		)
	}
	applyDefaultOnDrag() {
		this.on(
			'dragmove',
			function (e: any) {
				// if (this.activeKeys.indexOf(this.key) == -1) {
				// 	this.stage.position(this.stagePos)
				// } else {
				this.stagePos = this.stage.position()
				// }
				//с зажатым пробелом
			},
			this
		)
	}
}

applyMixins(Table, [MultipleListener])
