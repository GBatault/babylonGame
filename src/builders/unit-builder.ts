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
			// Adds all elements to the scene
			//container.addAllToScene();
			console.log(container.meshes[0])
		});
	}

	/** Place an unit */
	public placeUnit(position: BABYLON.Vector3) {
		
		console.log(this.unitMesh);
		this.scene.addMesh(this.unitMesh);
		
		// Add and manipulate meshes in the scene
		/*let player = BABYLON.MeshBuilder.CreatePlane("player", {
			height:2, 
			width: 1, 
			sideOrientation: BABYLON.Mesh.DOUBLESIDE
		}, this.scene);*/

		//player.position = position;

		//Creation of a material with an image texture
		//let playerMaterial = new BABYLON.StandardMaterial("playerMat", this.scene);
		//playerMaterial.diffuseTexture = new BABYLON.Texture(require("../assets/images/player.svg"), this.scene);
		//player.material = playerMaterial;



	}
}