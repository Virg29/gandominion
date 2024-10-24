import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container'
import { Group } from 'konva/lib/Group'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'

export default class LayerManager {
	static layers: { layer: Group; name: string; zindex: number }[] = []
	static instance: LayerManager = null
	stage: Stage
	zindexMax: number
	globalLayer: Layer

	constructor(stage: Stage) {
		this.stage = stage
		this.zindexMax = 0
		this.globalLayer = new Konva.Layer()
		this.stage.add(this.globalLayer)
		LayerManager.instance = this
	}

	static CheckIfExists(layername: string, zindex: number) {
		if (!layername && !zindex) return false
		var filtered = LayerManager.layers.filter((l) => {
			return l.zindex == zindex || l.name == layername
		})
		return Boolean(filtered.length)
	}

	createLayer(
		conf: ContainerConfig,
		layername: string = null,
		zindex: number = null
	) {
		if (LayerManager.CheckIfExists(layername, zindex))
			throw new Error(
				'Layer with name=' +
					layername +
					', or zindex=' +
					zindex +
					' already exists!'
			)
		var layer = {
			layer: new Konva.Group(conf),
			name: layername
				? layername
				: zindex
				? String(zindex)
				: 'z' + this.zindexMax,
			zindex: zindex ? zindex : this.zindexMax,
		}
		this.globalLayer.add(layer.layer)
		// this.stage.add(layer.layer)
		layer.layer.zIndex(layer.zindex)
		LayerManager.layers.push(layer)
		// this.#updateIndexation()
		this.zindexMax = zindex
			? zindex >= this.zindexMax
				? zindex
				: this.zindexMax
			: this.zindexMax + 1
		return layer
	}

	getLayer(
		layername: string = null,
		zindex: number = null
	): Group | { layer: Group; name: string; zindex: number }[] | null {
		if (!layername && !zindex) return null
		var layersFilteredByName = LayerManager.layers.filter((l) => {
			return l.name == layername
		})
		if (layername && !zindex)
			return layersFilteredByName.length == 1
				? layersFilteredByName[0].layer
				: layersFilteredByName
		var layersFilteredByZindex = LayerManager.layers.filter((l) => {
			return l.zindex == zindex
		})
		if (!layername && zindex)
			return layersFilteredByZindex.length == 1
				? layersFilteredByZindex[0].layer
				: layersFilteredByZindex
		if (layername && zindex) return this.getLayer(layername, null)
	}

	static updateIndexation() {
		LayerManager.layers.sort((a, b) => {
			if (a.zindex < b.zindex) return -1
			if (a.zindex > b.zindex) return 1
			if (a.zindex == b.zindex) return 0
		})
		LayerManager.layers.forEach((l) => {
			l.layer.moveToTop()
		})
	}
}
