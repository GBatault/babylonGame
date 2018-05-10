import * as GUI from 'babylonjs-gui';
import { Style } from '../datas/style';
import { Texture } from 'babylonjs';
import { Game } from './game';

export class Menu {

	private canvasElement : string;
	private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.FreeCamera;
	private light: BABYLON.Light;

	constructor(canvasElement : string) {
		// Create canvas and engine.
		this.canvasElement = canvasElement;
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this.engine = new BABYLON.Engine(this.canvas, true);
		
		// Create the scene.
		this.createScene();
		// Start render loop.
		this.doRender();
	}

	private createScene() : void {
		// Create a basic BJS Scene object.
		this.scene = new BABYLON.Scene(this.engine);
		let gui: GUI.AdvancedDynamicTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

		this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

		let background: GUI.Rectangle = new GUI.Rectangle();
		background.width = 1;
		background.height = 1;
		background.background = Style.menuBckgnd;
		gui.addControl(background);

		let panel: GUI.Rectangle = new GUI.Rectangle();
		panel.width = 0.9;
		panel.height = 0.5;
		panel.background = Style.panelBckgnd;
		panel.thickness = 0;
		panel.cornerRadius = 5;
		background.addControl(panel);
	
		let button: GUI.Button = GUI.Button.CreateSimpleButton("but", "New game");
		button.thickness = 0;
		button.cornerRadius = 3;
		button.width = "150px";
		button.height = "50px";
		button.color = Style.menuColor;
		button.background = Style.buttonBckgnd;
		button.shadowColor = "#000";
		button.shadowBlur = 5;
		button.shadowOffsetX = 2;
		button.shadowOffsetY = 2;
		panel.addControl(button);  

		button.onPointerClickObservable.add(this.newGame);
	}

	private newGame = () => {
		new Game(this.canvasElement);
	}

	private doRender() : void {
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