
# Gandominium

A web-based GUI for the Dominion game server. This application provides an interactive interface for managing and playing Dominion games online, built with [Konva.js](https://konvajs.org/) for canvas rendering, using TypeScript. It is bundled with Webpack and leverages a modern stack for a responsive, efficient gameplay experience.

## Features

- Interactive Dominion gameplay interface
- Real-time communication with the game server using Socket.IO
- Built with TypeScript and Konva.js for smooth canvas-based interactions

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Virg29/gandominion.git
   cd gandominion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

This project uses Webpack for bundling and development. You can run the following commands:

- **Build** the project:
  ```bash
  npm run build
  ```

- **Serve** the project in development mode with hot-reloading:
  ```bash
  npm run serve
  ```

By default, the application will be available at `http://localhost:8080`. You can open it in a web browser to access the Dominion GUI.

### Connecting to the Dominion Game Server

To use the Gandominium client, ensure the Dominion game server is running and accessible. The client connects automatically to the server specified in the application's settings.

## Project Structure

The main files are as follows:

- `src/` - The TypeScript source files for the application.
- `webpack.config.js` - The Webpack configuration file for bundling.
- `index.html` - The main HTML file for the application.

## Technologies Used

- **Konva.js** for canvas rendering
- **TypeScript** for type-safe development
- **Webpack** for bundling
- **Socket.IO** for real-time server communication
- **jQuery** and **Webix** for UI enhancements

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add a new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Issues

If you encounter any issues, please report them at [Gandominium Issues](https://github.com/Virg29/gandominion/issues).

---

Happy gaming with **Gandominium**! 🎮
