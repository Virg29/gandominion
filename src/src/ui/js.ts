import { Table } from './table'
import '../../assets/img/favicon.png'
import View from './view'

var shippane
var view = new View(() => {
	shippane = new Table()
})
