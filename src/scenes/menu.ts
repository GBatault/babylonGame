import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { Game } from "./game";

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

		let windW: number = window.innerWidth;
		let windH: number = window.innerHeight;

		// Create a basic BJS Scene object.
		this.scene = new BABYLON.Scene(this.engine);
		let gui: GUI.AdvancedDynamicTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

		this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

		let background: GUI.Rectangle = new GUI.Rectangle();
		background.width = 1;
		background.height = 1;
		background.background = Colors.menuBckgnd;
		background.thickness = 0;
		gui.addControl(background);

		let panel: GUI.Rectangle = new GUI.Rectangle();
		panel.width = windW > 300 ? Sizes.menuWidth : 0.9;
		panel.height = windH > 300 ? Sizes.menuHeight : 0.8;
		panel.background = Colors.panelBckgnd;
		panel.thickness = 0;
		panel.shadowColor = Colors.shadowColor;
		panel.shadowBlur = 5;
		panel.shadowOffsetX = 2;
		panel.shadowOffsetY = 2;
		background.addControl(panel);
	
		let header: GUI.Rectangle = new GUI.Rectangle();
		header.width = 1;
		header.height = 0.2;
		header.background = Colors.headerBckgnd;
		header.thickness = 0;
		header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
		panel.addControl(header);

		let title: GUI.TextBlock = new GUI.TextBlock("title", "Card game");
		title.color = Colors.menuColor;;
		header.addControl(title);  

		let btnGameSmall: GUI.Button = this.createBtn("S");
		let btnGameLarge: GUI.Button = this.createBtn("L");
		panel.addControl(btnGameSmall);
		panel.addControl(btnGameLarge);
	}

	private createBtn(mapSize: string): GUI.Button {
		let text: string = mapSize === "S" ? "Small (5x5)" : "Large (7x7)";
		let top: string = mapSize === "S" ? Sizes.menuBtnSTop : Sizes.menuBtnLTop;
		let button: GUI.Button = GUI.Button.CreateSimpleButton("but", text);
		button.thickness = 0;
		button.width = Sizes.menuBtnWidth;
		button.height = Sizes.menuBtnHeight;
		button.color = Colors.menuColor;
		button.background = Colors.buttonBckgnd;
		button.shadowColor = Colors.shadowColor;
		button.shadowBlur = 5;
		button.shadowOffsetX = 2;
		button.shadowOffsetY = 2;
		button.fontSize = Sizes.menuBtnFontSize;
		button.top = top;
		button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

		button.onPointerDownObservable.add(() => {
			this.newGame(mapSize);
		});
		return button;
	}

	private newGame = (mapSize) => {
		new Game(this.canvasElement, mapSize);
		this.scene.dispose()
	}

	private doRender() : void {
		// Run the render loop.
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		// The canvas/window resize event handler.
		window.addEventListener("resize", () => {
			this.engine.resize();
		});
	}

}