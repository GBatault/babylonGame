import "babylonjs-loaders";
import { Colors } from "../datas/colors";
import { Deck } from "../datas/deck";
import { Vector3 } from "babylonjs-loaders";

/** Build and manage units */
export class UnitBuilder {
	
	private scene: BABYLON.Scene;
	private units: BABYLON.AbstractMesh[] = []; 
	
	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
	}

	/** Load assets */
	public loadAssets() {
		for(let card of Deck.cards) {
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
				//rotate
				//unitMesh.rotate(new BABYLON.Vector3(0, 1 , 0), Math.PI*3.5);
				this.units.push(unitMesh);
				
			});
		}
	}

	/** Place an unit */
	public placeUnit(name: string, position: BABYLON.Vector3) {
		
		let unit: BABYLON.AbstractMesh = this.units.find((unit: BABYLON.AbstractMesh) => {
			return unit.name === name;
		});
		//Set position
		unit.position = position;

		//Find existing	
		let meshInScene: BABYLON.AbstractMesh = this.scene.meshes.find((x: BABYLON.AbstractMesh) => {
			return x.name === name;
		});
		if (!meshInScene) {
			this.scene.meshes.push(unit);
		}
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