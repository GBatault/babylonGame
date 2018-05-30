import { Map } from "../datas/map";
import { Deck } from "../datas/deck";

/** Manage AI */
export class AIManager {

	private scene: BABYLON.Scene;
	private map: Map;
	public callBackPlaceUnit: any;
	public callBackEndAITurn: any;

	constructor(scene: BABYLON.Scene, map: Map) {
		this.scene = scene;
		this.map = map;
	}

	/** AI play a card */
	public playACard = () => {

		let colInc: number = -2;	
		let colMax: number = 2;

		this.findPos(colInc, colMax);
	
	}

	/** Find a position avaliable */
	private findPos(colInc: number, colMax: number) {
		if (colInc <= colMax) {	
			let position: BABYLON.Vector3 = new BABYLON.Vector3(colInc, 0, 2);
			this.callBackPlaceUnit(Deck.cards[0], position, false, null).then(() => {
				this.callBackEndAITurn();
				return;
			}, () => {
				colInc++;
				this.findPos(colInc, colMax);
			});
		} else {
			return;
		}
	}

}