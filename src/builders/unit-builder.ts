import 'babylonjs-loaders';

export class UnitBuilder {
	
	private scene: BABYLON.Scene;
	private unitMesh: BABYLON.AbstractMesh; 
	
	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
	}

	/** Load assets */
	public loadAssets() {
		require("../assets/stl/unit.stl");
		BABYLON.SceneLoader.LoadAssetContainer("../assets/stl/", "unit.stl", this.scene, (container) => {
			this.unitMesh = container.meshes[0];
			this.unitMesh.position = BABYLON.Vector3.Zero();
			let scale: number = 0.05;
			this.unitMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
		});
	}

	/** Place an unit */
	public placeUnit(position: BABYLON.Vector3) {	
		this.unitMesh.position = position;
		this.scene.meshes.push(this.unitMesh);
	}
}