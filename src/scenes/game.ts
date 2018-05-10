import * as BABYLON from 'babylonjs';
import { GroundBuilder } from '../builders/ground-builder';

export class Game {
	private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
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

		// Create a rotating camera
		this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3, 8, BABYLON.Vector3.Zero(), this.scene);
		
		this.camera.lowerRadiusLimit = 2;
		this.camera.upperRadiusLimit = 30;

		this.camera.lowerBetaLimit = 0;
		this.camera.upperBetaLimit = Math.PI/3 + 0.4;
		
		// Attach the camera to the canvas.
		this.camera.attachControl(this.canvas, false);
	
		// Create a basic light, aiming 0,1,0 - meaning, to the sky.
		this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);
	
		// Create the ground
		let groundBuilder: GroundBuilder = new GroundBuilder(this.scene);

		// Center camera on ground 
		let meshCenter: BABYLON.Vector3 = groundBuilder.ground.getBoundingInfo().boundingBox.centerWorld;
		let size: BABYLON.Vector3 = groundBuilder.ground.getBoundingInfo().boundingBox.extendSizeWorld; 
		let maxSize: number = size.x>size.z?size.x:size.z;

		this.camera.setTarget(meshCenter);
		let ratio: number = this.engine.getAspectRatio(this.camera);
    	let h: number = maxSize / (Math.tan (this.camera.fov / 2) * ratio);
		this.camera.setPosition(new BABYLON.Vector3(meshCenter.x  ,meshCenter.y +h,  meshCenter.z+ maxSize*2));
		this.camera.beta = Math.PI/3;
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