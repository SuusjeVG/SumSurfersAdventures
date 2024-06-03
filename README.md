# SumSurferAdventures

**SumSurferAdventures** is an educational game developed for the **GrowthMoves** project, aimed at teaching children in a fun and interactive way. The game uses motion tracking to allow children to control the character with their body, engaging in educational activities through gameplay. SumSurferAdventures is an endless runner web game built with Three.js.

## Used Modules

The project utilizes the following modules:

- **three.js**: For 3D graphics and rendering.
- **cannon-es**: For physics simulations.
- **gsap.js**: For animations.
- **mediapipe**: For motion tracking and hand recognition.

## Project Structure

The project structure is as follows:

- **root**: The main directory of the project.
  - **public**: Contains the view files.
  - **src**: Contains all the core components of the game.
    - **assets**: Contains all necessary assets like images, sounds, models, etc.
    - **gamescene**: Contains the game logic and scenes.
    - **components**: Contains various components and modules used in the game.

## Running the Game on Your PC

Follow these steps to run SumSurferAdventures locally on your PC:

1. **Clone the repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/SuusjeVG/SumSurfersAdventures.git
   ```
2. Install node_modules
   ```bash
   npm install
   ```
3. Open website

    you can open the game in your browser withouth using a builder. This is because of the importmap
   ```html
    <script type="importmap">
        {
            "imports": {
                "three": "/node_modules/three/build/three.module.js",
                "three/addons/": "/node_modules/three/examples/jsm/",
                "cannon-es": "/node_modules/cannon-es/dist/cannon-es.js",
                "gsap": "/node_modules/gsap/index.js"
            }
        }
    </script>
   ```
   You can use live server. It's also ready to be added to a live invoirment on the internet.

# Contribution

We welcome contributions to the project. Feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.

# License

This project is licensed under the MIT License. See the LICENSE file for more information.
