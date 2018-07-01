import { Colors } from "../datas/colors";
import { Map } from "../datas/map";
import { Unit } from "../datas/unit";

/** Build and manage the ground */
export class GroundBuilder {

	/** The scene */
	private scene: BABYLON.Scene;
	/** Number of tiles */
	private nbTiles: number = 5;
	/** X position max */
	private xMax: number = this.nbTiles/2;
	/** Multi material for the ground */
	private multimat: BABYLON.MultiMaterial;
	/** The ground */
	public ground: BABYLON.Mesh;
	/** The map */
	private map: Map;
	/** The position for cursor hover */
	private hoverPos: BABYLON.Vector3;
	/** The selectors */
	private selectorOK: BABYLON.Mesh[] = [];
	private selectorKO: BABYLON.Mesh[] = [];
	/** The front lines */
	public frontLineUser: BABYLON.Mesh;
	public frontLineEnemy: BABYLON.Mesh;
	
	constructor(scene: BABYLON.Scene, map: Map) {
		this.scene = scene;
		this.map = map;
		this.scene.clearColor = BABYLON.Color4.FromHexString(Colors.gameBckgnd);
		
		this.hoverPos = new BABYLON.Vector3(null,null,null);

		this.createGround();
		this.createSelectors();
		this.createFrontLines();
	}

	/** Create ground */
	private createGround() {
		// Parameters
		let xmin = - this.xMax;
		let zmin = - this.xMax;
		let xmax = this.xMax;
		let zmax = this.xMax;
		
		let subdivisions = {
			"h" : this.nbTiles,
			"w" : this.nbTiles
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
	private createSelectors() {
		//Selector OK
		let matOK: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("selector", this.scene);
		matOK.diffuseColor = BABYLON.Color3.FromHexString(Colors.selectorOK);

		let meshTop: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("selector", {width: 1, height: 0.01, depth: 0.02});
		meshTop.material = matOK;
		meshTop.position = new BABYLON.Vector3(0, 0, 0.5);
		
		let meshBottom: BABYLON.Mesh = meshTop.clone("selector");
		meshBottom.position = new BABYLON.Vector3(0, 0, -0.5);
		
		let meshRight: BABYLON.Mesh = meshTop.clone("selector");
		meshRight.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2);
		meshRight.position = new BABYLON.Vector3(0.5, 0, 0);

		let meshLeft: BABYLON.Mesh = meshTop.clone("selector");
		meshLeft.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2);
		meshLeft.position = new BABYLON.Vector3(-0.5, 0, 0);

		this.selectorOK.push(meshTop, meshBottom, meshRight, meshLeft);
		this.hideOrShowSelector("OK", 0);

		//Selector KO
		let matKO: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("selectorKO", this.scene);
		matKO.diffuseColor = BABYLON.Color3.FromHexString(Colors.selectorKO);

		let meshKO: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("selectorKO", {width: 0.8, height: 0.01, depth: 0.02});
		meshKO.material = matKO;
		meshKO.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/3.5);

		let meshKO2: BABYLON.Mesh = meshKO.clone("selectorKO");
		meshKO2.material = matKO;
		meshKO2.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2.5);

		this.selectorKO.push(meshKO, meshKO2);
		this.hideOrShowSelector("KO", 0);
	}

	/** Create front line */
	private createFrontLines() {
		let matUser: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("frontLineUser", this.scene);
		matUser.diffuseColor = BABYLON.Color3.FromHexString(Colors.selectorOK);
		let matEnemy: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("frontLineEnemy", this.scene);
		matEnemy.diffuseColor = BABYLON.Color3.FromHexString(Colors.statusEnemy);

		this.frontLineUser = BABYLON.MeshBuilder.CreateBox("frontLine", {width: this.nbTiles, height: 0.01, depth: 0.02}, this.scene);
		this.frontLineUser.material = matUser;
		this.frontLineUser.position = new BABYLON.Vector3(0, 0, -this.xMax + 1);
		
		this.frontLineEnemy = this.frontLineUser.clone("frontLine");
		this.frontLineEnemy.material = matEnemy;
		this.frontLineEnemy.position = new BABYLON.Vector3(0, 0, this.xMax - 1); 	
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
				this.moveSelector(x, z);
			}
			this.hoverPos = new BABYLON.Vector3(x, 0, z);
		}
	}

	/** Move the selector */
	private moveSelector(x: number, z: number) {
		let type: string = z < -this.frontLineUser.position.z ? "OK" : "KO";

		if (type === "OK") {
			this.hideOrShowSelector("OK", 1);
			this.selectorOK[0].position = new BABYLON.Vector3(x, 0, z - 0.5);
			this.selectorOK[1].position = new BABYLON.Vector3(x, 0, z + 0.5);
			this.selectorOK[2].position = new BABYLON.Vector3(x + 0.5, 0, z);
			this.selectorOK[3].position = new BABYLON.Vector3(x - 0.5, 0, z);
		} else {
			this.hideOrShowSelector("KO", 1);
			this.selectorKO[0].position = new BABYLON.Vector3(x, 0, z);
			this.selectorKO[1].position = new BABYLON.Vector3(x, 0, z);
		}
	}

	/** Hide selector */
	public hideOrShowSelector(type: string, visibility: number) {
		if (type === "OK") {
			for(let mesh of this.selectorOK) {
				mesh.visibility = visibility;
			}
		} else {
			for(let mesh of this.selectorKO) {
				mesh.visibility = visibility;
			}
		}
	}

	/** Move Front line */
	public moveFrontLine = (isUser: boolean) => {
		let meshes = this.scene.meshes.filter((mesh) => {
			return (mesh.metadata && (mesh.metadata as Unit).isUser === isUser);
		});

		let meshMax =  meshes.reduce((p: BABYLON.Mesh, v: BABYLON.Mesh) => {
			return ( p.position.z > v.position.z ? p : v );
		});

		let animation = new BABYLON.Animation("moveFrontLine", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
		var keys = []; 
		keys.push({
			frame: 0,
			value: this.frontLineUser.position.z
		});
		keys.push({
			frame: 10,
			value: meshMax.position.z + 0.5
		});
		animation.setKeys(keys);
		this.frontLineUser.animations = [];
		this.frontLineUser.animations.push(animation);
		this.scene.beginAnimation(this.frontLineUser, 0, 10);
		
	}

}