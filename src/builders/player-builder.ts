export class PlayerBuilder {
	
	private scene: BABYLON.Scene;
	private player: BABYLON.Mesh;

	constructor(scene: BABYLON.Scene, position: BABYLON.Vector3) {
		this.scene = scene;
		
		// Add and manipulate meshes in the scene
		this.player = BABYLON.MeshBuilder.CreatePlane("player", {
			height:2, 
			width: 1, 
			sideOrientation: BABYLON.Mesh.DOUBLESIDE
		}, this.scene);

		this.player.position = position;
		
		//Creation of a material with an image texture
		let playerMaterial = new BABYLON.StandardMaterial("playerMat", this.scene);
		//playerMaterial.diffuseTexture = new BABYLON.Texture(require("../assets/images/player.svg"), this.scene);
		//player.material = playerMaterial;
		 
	}

	/** Move the player */
	public move(vector: BABYLON.Vector3) {
		this.player.position = vector;
	}
}