import { Colors } from "../datas/colors";
import { Maps } from "../datas/maps";
import { Material, Vector3 } from "babylonjs";

/** Build and manage the ground */
export class GroundBuilder {
	
	private scene: BABYLON.Scene;
	private multimat: BABYLON.MultiMaterial;
	public ground: BABYLON.Mesh;

	constructor(scene) {
		this.scene = scene;
		this.scene.clearColor = BABYLON.Color4.FromHexString(Colors.gameBckgnd);
		
		// Parameters
		let xmin = -2.5;
		let zmin = -2.5;
		let xmax =  2.5;
		let zmax =  2.5;
		
		let subdivisions = {
			"h" : 5,
			"w" : 5
		};
		// Create the Tiled Ground
		this.ground = BABYLON.Mesh.CreateTiledGround("Ground", xmin, zmin, xmax, zmax, subdivisions, null, scene);
		
		// Create materials 
		let matGrass = new BABYLON.StandardMaterial("L", scene);
		matGrass.diffuseColor = BABYLON.Color3.FromHexString(Colors.greenMapLight);
		let matWood = new BABYLON.StandardMaterial("D", scene);
		matWood.diffuseColor = BABYLON.Color3.FromHexString(Colors.greenMapDark);
		
		this.multimat = new BABYLON.MultiMaterial("multi", scene);
		this.multimat.subMaterials.push(matGrass);
		this.multimat.subMaterials.push(matWood);
		this.ground.material = this.multimat;

		// Set Meshes
		let verticesCount: number = this.ground.getTotalVertices();
		let tileIndicesLength: number = this.ground.getIndices().length / (subdivisions.w * subdivisions.h);
		this.ground.subMeshes = [];
		let base: number = 0;
		for (let row = 0; row < subdivisions.h; row++) {
			for (let col = 0; col < subdivisions.w; col++) {
				//Get type from map
				let type = Maps.greenMap[row][col];
				//find submaterial
				let index: number = this.multimat.subMaterials.findIndex((mat: BABYLON.Material) => {
					return mat.id === type;
				});
				this.ground.subMeshes.push(new BABYLON.SubMesh(index, 0, verticesCount, base, tileIndicesLength, this.ground));
				base += tileIndicesLength;
			}
		}
	}

	/** Get type of a mesh by Id */
	public getTypeOfMesh(id): string {
		return this.multimat.subMaterials[this.ground.subMeshes[id].materialIndex].id;
	}

}