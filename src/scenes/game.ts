import * as BABYLON from "babylonjs";
import { GroundBuilder } from "../builders/ground-builder";
import { UnitBuilder } from "../builders/unit-builder";
import { DeckBuilder } from "../builders/deck-builder";
import { StatusBuilder } from "../builders/status-builder";
import { AIManager } from "../ai/ai-manager";
import { Maps } from "../datas/maps";

export class Game {
	private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
	private light: BABYLON.Light;
	
	/** AI */
	private aiManager: AIManager;

	/** Builders */
	private groundBuilder: GroundBuilder;
	private unitBuilder: UnitBuilder;
	private deckBuilder: DeckBuilder;
	private statusBuilder: StatusBuilder;

	constructor(canvasElement : string) {
		// Create canvas and engine.
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.engine.disableManifestCheck = true;
		
		// Create the scene.
		this.createScene();
		// Start render loop.
		this.doRender();
	}

	private createScene() : void {
		// Create a basic BJS Scene object.
		this.scene = new BABYLON.Scene(this.engine);

		// Create a rotating camera
		this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/4, 8, BABYLON.Vector3.Zero(), this.scene);
		// Zoom limit
		this.camera.lowerRadiusLimit = 2;
		this.camera.upperRadiusLimit = 30;
		// Prevent rotate
		this.camera.lowerBetaLimit = Math.PI/4;
		this.camera.upperBetaLimit =  Math.PI/4;
		this.camera.lowerAlphaLimit = -Math.PI/2;
		this.camera.upperAlphaLimit = -Math.PI/2;

		// Attach the camera to the canvas.
		this.camera.attachControl(this.canvas, false);
	
		// Create a basic light, aiming 0,1,0 - meaning, to the sky.
		this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0,1,0), this.scene);
	
		// Create the ground
		this.groundBuilder = new GroundBuilder(this.scene, Maps.maps["green"]);

		// Center camera on ground 
		let meshCenter: BABYLON.Vector3 = this.groundBuilder.ground.getBoundingInfo().boundingBox.centerWorld;
		let size: BABYLON.Vector3 =  this.groundBuilder.ground.getBoundingInfo().boundingBox.extendSizeWorld; 
		let maxSize: number = size.x>size.z?size.x:size.z;
		this.camera.setTarget(meshCenter);
		let ratio: number = this.engine.getAspectRatio(this.camera);
    	let h: number = maxSize / (Math.tan (this.camera.fov / 2) * ratio);
		this.camera.setPosition(new BABYLON.Vector3(meshCenter.x, meshCenter.y +h, meshCenter.z+ maxSize*3));
		this.camera.beta = Math.PI/4;

		//AI
		this.aiManager = new AIManager(this.scene, Maps.maps["green"]);

		//Builders
		this.unitBuilder = new UnitBuilder(this.scene);
		//this.unitBuilder.loadAssets();
		this.deckBuilder = new DeckBuilder(this.scene, this.aiManager.playACard);
		this.statusBuilder = new StatusBuilder(this.scene);
		
		this.aiManager.callBackPlaceUnit = this.unitBuilder.placeUnit;
		this.aiManager.callBackEndAITurn = this.deckBuilder.endAITurn;
		this.aiManager.zFrontLine = this.groundBuilder.frontLineEnemy.position.z;
	}

	/** Click on a tile */
	private chooseTile() {
		let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);	
		if (pickResult.faceId > 0) {
			let position: BABYLON.Vector3 = pickResult.pickedPoint.subtract(this.groundBuilder.ground.position);

			let zFrontLine: number = this.groundBuilder.frontLineUser.position.z;
			this.unitBuilder.placeUnit(this.deckBuilder.cardSelected, position, true, zFrontLine).catch(()=>{});
		}
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

		window.addEventListener("pointermove", () => {
			if (this.deckBuilder.isDragging) {
				this.groundBuilder.showCurrentTile();
				this.deckBuilder.showCardDrag(this.scene.pointerX, this.scene.pointerY);
			}
		});

		window.addEventListener("pointerup", () => {
			if (this.deckBuilder.isDragging) {
				this.deckBuilder.isDragging = false;
				this.deckBuilder.dragCard.dispose();
				this.chooseTile();
				this.groundBuilder.hideOrShowSelector("OK", 0);
				this.groundBuilder.hideOrShowSelector("KO", 0);
			}
		});
		
	}
}