import { Style } from "../datas/style";
import { Maps } from "../datas/maps";

export class GroundBuilder {
	
	private scene: BABYLON.Scene;
	public ground: BABYLON.Mesh;

	constructor(scene) {
		this.scene = scene;

		// Parameters
		let xmin = -3;
		let zmin = -3;
		let xmax =  3;
		let zmax =  3;
		let subdivisions = {
			'h' : 5,
			'w' : 5
		};
		// Create the Tiled Ground
		this.ground = BABYLON.Mesh.CreateTiledGround("Ground", xmin, zmin, xmax, zmax, subdivisions, null, scene);
		
		// Create materials 
		let matGrass = new BABYLON.StandardMaterial("G", scene);
		matGrass.diffuseColor = BABYLON.Color3.FromHexString(Style.grassColor1);
		let matWood = new BABYLON.StandardMaterial("W", scene);
		matWood.diffuseColor = BABYLON.Color3.FromHexString(Style.woodColor2);

		let multimat = new BABYLON.MultiMaterial("multi", scene);
		multimat.subMaterials.push(matGrass);
		multimat.subMaterials.push(matWood);
		this.ground.material = multimat;

		// Set Meshes
		let verticesCount = this.ground.getTotalVertices();
		let tileIndicesLength = this.ground.getIndices().length / (subdivisions.w * subdivisions.h);
		this.ground.subMeshes = [];
		let base = 0;
		for (let row = 0; row < subdivisions.h; row++) {
			for (let col = 0; col < subdivisions.w; col++) {
				//Get type from map
				let type = Maps.map1[row][col];
				//find submaterial
				let index: number = multimat.subMaterials.findIndex((a: BABYLON.Material) => {
					return a.id === type;
				});
				this.ground.subMeshes.push(new BABYLON.SubMesh(index, 0, verticesCount, base, tileIndicesLength, this.ground));
				base += tileIndicesLength;
			}
		}

	}
}