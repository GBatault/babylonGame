import { Colors } from "../datas/colors";
import { Map } from "../datas/map";
import { Material, Vector3, serializeAsVector2 } from "babylonjs";

/** Build and manage the ground */
export class GroundBuilder {
	
	private scene: BABYLON.Scene;
	private multimat: BABYLON.MultiMaterial;
	public ground: BABYLON.Mesh;
	private map: Map;
	private hoverPos: BABYLON.Vector3;
	private selector: BABYLON.LinesMesh[] = [];

	constructor(scene: BABYLON.Scene, map: Map) {
		this.scene = scene;
		this.map = map;
		this.scene.clearColor = BABYLON.Color4.FromHexString(Colors.gameBckgnd);
		
		this.hoverPos = new BABYLON.Vector3(null,null,null);

		this.createGround();
		this.createSelector();
	}

	private createGround() {
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
		this.ground = BABYLON.Mesh.CreateTiledGround("Ground", xmin, zmin, xmax, zmax, subdivisions, null, this.scene);
		
		// Create materials 
		let matGrass = new BABYLON.StandardMaterial("L", this.scene);
		matGrass.diffuseColor = BABYLON.Color3.FromHexString(this.map.colorLight);
		let matWood = new BABYLON.StandardMaterial("D", this.scene);
		matWood.diffuseColor = BABYLON.Color3.FromHexString(this.map.colorDark);
		
		this.multimat = new BABYLON.MultiMaterial("multi", this.scene);
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
				let type = this.map.definition[row][col];
				//find submaterial
				let index: number = this.multimat.subMaterials.findIndex((mat: BABYLON.Material) => {
					return mat.id === type;
				});
				this.ground.subMeshes.push(new BABYLON.SubMesh(index, 0, verticesCount, base, tileIndicesLength, this.ground));
				base += tileIndicesLength;
			}
		}
	}

	/** Create selector */
	private createSelector() {
		//Create selector
		let points: BABYLON.Vector3[]  = [
			new BABYLON.Vector3(-0.5, 0, 0.5),
			new BABYLON.Vector3(0.5, 0, 0.5),
			new BABYLON.Vector3(0.5, 0, -0.5),
			new BABYLON.Vector3(-0.5, 0, -0.5),
			new BABYLON.Vector3(-0.5, 0, 0.5),
		];
		let selector: BABYLON.LinesMesh = BABYLON.MeshBuilder.CreateLines("selector", {points: points}, this.scene);
		selector.color = BABYLON.Color3.FromHexString(Colors.selectorColor);
		selector.alpha = 0;
		this.selector.push(selector);

		let selector2: BABYLON.LinesMesh = BABYLON.MeshBuilder.CreateLines("selector", {points: points}, this.scene);
		selector2.color = BABYLON.Color3.FromHexString(Colors.selectorColor);
		selector2.scaling = new BABYLON.Vector3(0.995, 0.995, 0.995);
		selector2.position =  new BABYLON.Vector3(0, 0.001, 0);
		selector2.alpha = 0;
		this.selector.push(selector2);
	}

	/** Get type of a mesh by Id */
	public getTypeOfMesh(id): string {
		return this.multimat.subMaterials[this.ground.subMeshes[id].materialIndex].id;
	}

	/** Show Current tile */
	public showCurrentTile() {
		let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);	
		if (pickResult.faceId > 0) {
			let position: BABYLON.Vector3 = pickResult.pickedPoint.subtract(this.ground.position);
			
			let x: number = Math.round(position.x);
			let z: number = Math.round(position.z);

			if (x !== this.hoverPos.x || z !== this.hoverPos.z) {
				this.selector[0].position = new BABYLON.Vector3(x, 0, z);
				this.selector[1].position = new BABYLON.Vector3(x, 0, z);
				this.selector[0].alpha = 1;
				this.selector[1].alpha = 1;
			}
			this.hoverPos = new Vector3(x, 0, z);
		}
	}

	/** Hide selector */
	public hideSelector() {
		this.selector[0].alpha = 0;
		this.selector[1].alpha = 0;
	}

}