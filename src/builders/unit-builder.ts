import "babylonjs-loaders";
import { Colors } from "../datas/colors";
import { Deck } from "../datas/deck";
import { Vector3 } from "babylonjs-loaders";
import { Card } from "../datas/card";

/** Build and manage units */
export class UnitBuilder {
	
	private scene: BABYLON.Scene;
	//private units: BABYLON.AbstractMesh[] = []; 
	
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
				//this.units.push(unitMesh);
				resolve(unitMesh)
			});	
		});
		return defer;
	}
	

	/** Place an unit */
	public placeUnit = (card: Card, position: BABYLON.Vector3, user: boolean): Promise<void>  => {

		let defer: Promise<void> = new Promise((resolve, reject) => {
			
			if (user) {
				position.x = Math.round(position.x) + 0.2;
			} else {
				position.x = Math.round(position.x) - 0.2;
			}
			position.z = Math.round(position.z);
			position.y = 0;

			//Find mesh at this position
			let meshHere: BABYLON.AbstractMesh = this.scene.meshes.find((mesh: BABYLON.AbstractMesh) => {
				return (Math.round(mesh.position.x) === Math.round(position.x)
					&& mesh.position.y === position.y
					&& Math.round(mesh.position.z) === Math.round(position.z))
					&& mesh.name !== "selector";
			});
			
			if (!meshHere) {
				this.loadAsset(card).then((mesh: BABYLON.AbstractMesh) =>{
					//Set position
					mesh.position = position;
					//Rotate
					if (user) {
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

	/** Colorize */
	private colorize(unitMesh: BABYLON.AbstractMesh) {

		let verticesCount: number = unitMesh.getTotalVertices();
		let multi: BABYLON.MultiMaterial = new BABYLON.MultiMaterial("multi", this.scene);
		let matAll: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("all",this.scene);
		let matSecond = new BABYLON.StandardMaterial("second",this.scene);
		multi.subMaterials.push(matAll);
		multi.subMaterials.push(matSecond);

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
		}
	}
}