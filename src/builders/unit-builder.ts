import "babylonjs-loaders";
import { Colors } from "../datas/colors";
import { Card } from "../datas/card";
import { Unit } from "../datas/unit";

/** Build and manage units */
export class UnitBuilder {
	
	/** The scene */
	private scene: BABYLON.Scene;
	/** Line max position */
	private lineMax: number = 2;

	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
	}

	/** Load assets */
	public loadAsset(card: Card):  Promise<BABYLON.AbstractMesh>  {
		let defer: Promise<BABYLON.AbstractMesh> = new Promise((resolve, reject) => {
			require("../assets/stl/" + card.stl);
			BABYLON.SceneLoader.LoadAssetContainer("assets/stl/", card.stl, this.scene, (container) => {
				let unitMesh: BABYLON.AbstractMesh = container.meshes[0];
				unitMesh.name = card.name;
				//position
				unitMesh.position = BABYLON.Vector3.Zero();
				//scale
				let scale: number = 0.05;
				unitMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
				//colors
				this.colorize(unitMesh);
				resolve(unitMesh)
			});	
		});
		return defer;
	}
	

	/** Place an unit */
	public placeUnit = (card: Card, 
		position: BABYLON.Vector3, 
		isUser: boolean, 
		zFrontLine: number): Promise<void>  => {

		let defer: Promise<void> = new Promise((resolve, reject) => {
			
			if (isUser) {
				position.x = Math.round(position.x) + 0.2;
			} else {
				position.x = Math.round(position.x) - 0.2;
			}
			position.z = Math.round(position.z);
			position.y = 0;
			
			let isBehindFrontLine: boolean = true;
			if (zFrontLine > 0 && position.z > zFrontLine) {
				isBehindFrontLine = false;
			}

			if (!this.isUnitHere(position) && isBehindFrontLine) {
				
				this.placeEffect(position);

				this.loadAsset(card).then((mesh: BABYLON.AbstractMesh) =>{
					//Set position
					mesh.position = position;
					//Set metadatas
					mesh.metadata = new Unit(isUser);
					//Rotate
					if (isUser) {
						mesh.rotate(new BABYLON.Vector3(0, 1 , 0), Math.PI);
					}
					this.scene.meshes.push(mesh);
					resolve();
				});
			} else {
				reject();
			}
		});
		return defer;
	}

	/** If there is an unit a this position*/
	private isUnitHere(position: BABYLON.Vector3): boolean  {
		return !!(this.scene.meshes.find((mesh: BABYLON.AbstractMesh) => {
			return (Math.round(mesh.position.x) === Math.round(position.x)
				&& mesh.position.y === position.y
				&& Math.round(mesh.position.z) === Math.round(position.z))
				&& mesh.name !== "selector"
				&& mesh.name !== "frontLine";
		}));
	}

	/** Colorize */
	private colorize(unitMesh: BABYLON.AbstractMesh) {

		let verticesCount: number = unitMesh.getTotalVertices();
		let multi: BABYLON.MultiMaterial = new BABYLON.MultiMaterial("multi", this.scene);
		let matAll: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("all",this.scene);
		let matSecond = new BABYLON.StandardMaterial("second",this.scene);
		multi.subMaterials.push(matAll);
		multi.subMaterials.push(matSecond);
		//console.log(verticesCount)

		switch(unitMesh.name) {			
			case "brownie":	
				//all
				matAll.diffuseColor = BABYLON.Color3.FromHexString(Colors.brownieColor);
				//eyes
				matSecond.diffuseColor = BABYLON.Color3.FromHexString(Colors.brownieEye);

				unitMesh.subMeshes = [];
				//all
				unitMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 750, unitMesh));
				//eyes
				unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 330, 420, unitMesh));
				unitMesh.material = multi;
				break;
			case "knight":
				//all
				matAll.diffuseColor = BABYLON.Color3.FromHexString(Colors.knightColor);
				//sword
				matSecond.diffuseColor = BABYLON.Color3.FromHexString(Colors.knightSword);

				unitMesh.subMeshes = [];
				//all
				unitMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 843, unitMesh));
				//sword
				unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 660, 183, unitMesh));
				unitMesh.material = multi;
				break;
			case "frog":
				//all
				matAll.diffuseColor = BABYLON.Color3.FromHexString(Colors.frogColor);
				//eyes
				matSecond.diffuseColor = BABYLON.Color3.FromHexString(Colors.frogEye);

				unitMesh.subMeshes = [];
				//all
				unitMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 1638, unitMesh));
				//eyes
				unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 1464, 174, unitMesh));
				
				unitMesh.material = multi;
				break;
			case "mage":
				//all
				matAll.diffuseColor = BABYLON.Color3.FromHexString(Colors.mageColor);
				//eyes
				matSecond.diffuseColor = BABYLON.Color3.FromHexString(Colors.mageStick);

				unitMesh.subMeshes = [];
				//all
				unitMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 5508, unitMesh));
				//stick
				unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 4881, 100, unitMesh));
				//eyes
				unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 5508, 72, unitMesh));

				unitMesh.material = multi;
				break;
		}
	}

	/** Effect when placing */
	private placeEffect(position: BABYLON.Vector3) {
		// Particles
		let particleSystem = new BABYLON.ParticleSystem("particles", 20, this.scene);
		particleSystem.emitter = position;
		// Size
		particleSystem.minSize = 0.05;
		particleSystem.maxSize = 0.07;
		// Texture of each particle
		require("../assets/particle/square-particle.svg");
		particleSystem.particleTexture = new BABYLON.Texture("assets/particle/square-particle.svg", this.scene);
		particleSystem.direction1 = new BABYLON.Vector3(0, 2, 0);
		// Color
		particleSystem.color1 = BABYLON.Color4.FromHexString(Colors.particle);
		particleSystem.color2 = BABYLON.Color4.FromHexString(Colors.particle);
		// Speed
		particleSystem.minEmitPower = 1;
		particleSystem.maxEmitPower = 1;
		particleSystem.updateSpeed = 0.04;
		// Start
		particleSystem.start();
		setTimeout(() => { particleSystem.stop() }, 500);
	}

	/** Attack action */
	public attack = (isUser: boolean): Promise<any> => {
		let animation = new BABYLON.Animation("moveUnit", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
		let defer: Promise<any> = new Promise((resolve, reject) => {
			let meshes = this.scene.meshes.filter((mesh) => {
				return (mesh.metadata && (mesh.metadata as Unit).isUser === isUser);
			});
			let move = new BABYLON.Vector3(0,0,1);
			let cnt: number = 1;
			let animatable: BABYLON.Animatable;
			if (meshes.length === 0) {
				reject();
			}
			for (let mesh of meshes) {
				if (mesh.position.z + 1 <= this.lineMax) {
					var keys = []; 
					keys.push({
						frame: 0,
						value: mesh.position.z
					});
					keys.push({
						frame: 10,
						value: mesh.position.z + 1
					});
					animation.setKeys(keys);
					mesh.animations = [];
					mesh.animations.push(animation);
					animatable = this.scene.beginAnimation(mesh, 0, 10);
				}
				if (cnt === meshes.length) {
					if (animatable) {
						animatable.onAnimationEnd = resolve;	
					} else {
						reject();
					}
				}
				cnt++;
			}
		});
		return defer;
	}
	
}