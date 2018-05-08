import * as BABYLON from 'babylonjs';
import { GroundBuilder } from './ground-builder';

class Game {
	private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
	private light: BABYLON.Light;
	
	constructor(canvasElement : string) {
		// Create canvas and engine.
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this.engine = new BABYLON.Engine(this.canvas, true);
	}

	createScene() : void {
		// Create a basic BJS Scene object.
		this.scene = new BABYLON.Scene(this.engine);

		// Create a rotating camera
		this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 8, BABYLON.Vector3.Zero(), this.scene);
	
		// Attach the camera to the canvas.
		this.camera.attachControl(this.canvas, false);
	
		// Create a basic light, aiming 0,1,0 - meaning, to the sky.
		this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);
	
		// Create a built-in "sphere" shape; with 16 segments and diameter of 2.
		//let sphere = BABYLON.MeshBuilder.CreateSphere('sphere',
		//							{segments: 16, diameter: 2}, this.scene);
	
		// Move the sphere upward 1/2 of its height.
		//sphere.position.y = 1;
	
		// Create the ground
		let ground = new GroundBuilder(this.scene);
	}

	doRender() : void {
		// Run the render loop.
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		// The canvas/window resize event handler.
		window.addEventListener('resize', () => {
			this.engine.resize();
		});
	}
}

window.addEventListener('DOMContentLoaded', () => {
	// Create the game using the 'renderCanvas'.
	let game = new Game('renderCanvas');

	// Create the scene.
	game.createScene();

	// Start render loop.
	game.doRender();
});