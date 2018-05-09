import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { GroundBuilder } from '../builders/ground-builder';

export class Menu {

	private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.FreeCamera;
	private light: BABYLON.Light;

	constructor(canvasElement : string) {
		// Create canvas and engine.
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this.engine = new BABYLON.Engine(this.canvas, true);
		
		// Create the scene.
		this.createScene();
		// Start render loop.
		this.doRender();
	}

	createScene() : void {
		// Create a basic BJS Scene object.
		this.scene = new BABYLON.Scene(this.engine);
		let gui: GUI.AdvancedDynamicTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

		this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

		let panel = new GUI.StackPanel();
		panel.width = 0.5
		gui.addControl(panel);   
	
		let button: GUI.Button = GUI.Button.CreateSimpleButton("but", "New game");
		button.width = 1;
		button.height = 1;
		button.color = "white";
		button.background = "green";
		panel.addControl(button);     

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