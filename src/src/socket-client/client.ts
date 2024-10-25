import { io } from "socket.io-client"

const socket = io('http://localhost:3000')

// Listen for connection
socket.on('connect', () => {
	console.log('Connected to the server')
})

// Listen for custom events
socket.on('someEvent', (data) => {
	console.log('Received someEvent:', data)
})

// You can listen to any other events as needed
socket.on('anotherEvent', (data) => {
	console.log('Received anotherEvent:', data)
})

// Handle disconnect
socket.on('disconnect', () => {
	console.log('Disconnected from the server')
})
