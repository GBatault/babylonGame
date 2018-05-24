import "babylonjs-loaders";
import { Style } from "../datas/style";

/** Build and manage units */
export class UnitBuilder {
	
	private scene: BABYLON.Scene;
	private unitMesh: BABYLON.AbstractMesh; 
	
	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
	}

	/** Load assets */
	public loadAssets() {
		require("../assets/stl/unit.stl");
		BABYLON.SceneLoader.LoadAssetContainer("assets/stl/", "unit.stl", this.scene, (container) => {
			this.unitMesh = container.meshes[0];
			this.unitMesh.position = BABYLON.Vector3.Zero();
			let scale: number = 0.05;
			this.unitMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
			this.unitMesh.name = "unit";
			this.colorize();
		});
	}

	/** Place an unit */
	public placeUnit(position: BABYLON.Vector3) {
		//Set position
		this.unitMesh.position = position;
		//Find existing	
		let find = this.scene.meshes.find((x: BABYLON.AbstractMesh) => {
			return x.name === "unit";
		});
		if (!find) {
			this.scene.meshes.push(this.unitMesh);
		}
	}

	/** Colorize unit */
	private colorize() {
		
		let matUnit: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("unit",this.scene);
		matUnit.diffuseColor = BABYLON.Color3.FromHexString(Style.unitColor);
		let matEye = new BABYLON.StandardMaterial("eye",this.scene);
		matEye.diffuseColor = BABYLON.Color3.FromHexString(Style.unitEye);
		let multi: BABYLON.MultiMaterial = new BABYLON.MultiMaterial("unit", this.scene);
		multi.subMaterials.push(matUnit);
		multi.subMaterials.push(matEye);

		let verticesCount: number = this.unitMesh.getTotalVertices();
		this.unitMesh.subMeshes = [];
		//all
		this.unitMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 750, this.unitMesh));
		//eyes
		this.unitMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 330, 420, this.unitMesh));

		this.unitMesh.material = multi;

	}
}