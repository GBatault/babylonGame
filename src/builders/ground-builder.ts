import { Style } from "../datas/style";
import { Maps } from "../datas/maps";
import { Material, Vector3 } from "babylonjs";

export class GroundBuilder {
	
	private scene: BABYLON.Scene;
	private multimat: BABYLON.MultiMaterial;
	public ground: BABYLON.Mesh;
	
	constructor(scene) {
		this.scene = scene;
		this.scene.clearColor = BABYLON.Color4.FromHexString(Style.gameBckgnd);
		
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
		this.ground.outlineWidth = 1;
		
		// Create materials 
		let matGrass = new BABYLON.StandardMaterial("L", scene);
		matGrass.diffuseColor = BABYLON.Color3.FromHexString(Style.greenMapLight);
		let matWood = new BABYLON.StandardMaterial("D", scene);
		matWood.diffuseColor = BABYLON.Color3.FromHexString(Style.greenMapDark);
		
		this.multimat = new BABYLON.MultiMaterial("multi", scene);
		this.multimat.subMaterials.push(matGrass);
		this.multimat.subMaterials.push(matWood);
		this.ground.material = this.multimat;

		// Set Meshes
		let verticesCount = this.ground.getTotalVertices();
		let tileIndicesLength = this.ground.getIndices().length / (subdivisions.w * subdivisions.h);
		this.ground.subMeshes = [];
		let base = 0;
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

	/** Get Start Position */
	public getMeshPosition(indice: number): BABYLON.Vector3 {

		let subMesh = this.ground.subMeshes[indice];
		
		let positions = subMesh.getMesh().getVerticesData(BABYLON.VertexBuffer.PositionKind);


		let indices = subMesh.getMesh().getIndices();
		let normals = subMesh.getMesh().getVerticesData(BABYLON.VertexBuffer.NormalKind);

		let resultPositions = [];
		let relIndex;
		let newIndex = 0;

		for (let index = subMesh.indexStart; index <  subMesh.indexStart + subMesh.indexCount; index+=3) {                    
			for (var vertexIndex = 0; vertexIndex<3; vertexIndex++) {
				relIndex = indices[index + vertexIndex];
				resultPositions.push(positions[3 * relIndex], positions[3 * relIndex + 1], positions[3 * relIndex + 2]);
			}
		}

		let vector: BABYLON.Vector3 = new BABYLON.Vector3(resultPositions[0], resultPositions[1], resultPositions[2]);
		
		return vector;
	}

}