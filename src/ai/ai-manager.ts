import { Map } from "../datas/map";

/** Manage AI */
export class AIManager {

	private map: Map;
	public callBackPlaceUnit: any;

	constructor(map: Map) {
		this.map = map;
	}

	/** AI play a card */
	public playACard = () => {

		let colInc = -2;
		//Find a position avaliable
		//for (let row = 0; row < this.map.definition.length; row++) {
		for (let col of this.map.definition[0]) {
			console.log(colInc);
			let position: BABYLON.Vector3 = new BABYLON.Vector3(colInc, 0, 2);
			colInc++;

			if (this.callBackPlaceUnit("brownie", position)) {
				return;
			}
		}
	}
}