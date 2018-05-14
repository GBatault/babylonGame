export class UnitBuilder {
	
	private scene: BABYLON.Scene;

	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
	}

	/** Place an unit */
	public placeUnit(position: BABYLON.Vector3) {
		// Add and manipulate meshes in the scene
		let player = BABYLON.MeshBuilder.CreatePlane("player", {
			height:2, 
			width: 1, 
			sideOrientation: BABYLON.Mesh.DOUBLESIDE
		}, this.scene);

		player.position = position;

		//Creation of a material with an image texture
		//let playerMaterial = new BABYLON.StandardMaterial("playerMat", this.scene);
		//playerMaterial.diffuseTexture = new BABYLON.Texture(require("../assets/images/player.svg"), this.scene);
		//player.material = playerMaterial;
	}
}