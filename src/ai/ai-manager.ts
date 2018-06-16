import { Map } from "../datas/map";
import { Deck } from "../datas/deck";
import { Card } from "../datas/card";

/** Manage AI */
export class AIManager {

	/** The scene */
	private scene: BABYLON.Scene;
	/** The map */
	private map: Map;
	/** Callback to place unit */
	public callBackPlaceUnit: any;
	/** Callback for end of turn  */
	public callBackEndAITurn: any;
	/** Number of max try */
	private maxTry: number = 25;
	/** Current try number */
	private currentTry: number = 0;
	/** Column max position */	
	private colMax: number = 2;
	/** Z position of the frontLine */
	public zFrontLine: number;
	/** Line max position */
	private lineMax: number = 2;
	/** Tried positions */
	private triedPos: BABYLON.Vector3[] = [];
	/** Enemy Cards */
	private enemyCards: Card[];

	constructor(scene: BABYLON.Scene, map: Map) {
		this.scene = scene;
		this.map = map;
		this.enemyCards = Array.from(Deck.cards);
	}

	/** AI play a card */
	public playACard = () => {
		this.findPos();
	}

	/** Find a position avaliable */
	private findPos() {
		
		this.currentTry++;
		if (this.currentTry > this.maxTry) {
			this.callBackEndAITurn();
			return;
		}

		if (this.enemyCards.length === 0) {
			this.callBackEndAITurn();
			return;
		}

		let randIndex = Math.floor(Math.random() * this.enemyCards.length);
		
		let card: Card = this.enemyCards[randIndex];
		let x: number = Math.floor(Math.random() * (this.colMax+1));
		x *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

		let lineMin = Math.floor(-this.zFrontLine) + 1;
		let z: number = Math.floor(Math.random() * (this.lineMax - lineMin +1)) + lineMin;
		//z *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

		let position: BABYLON.Vector3 = new BABYLON.Vector3(x, 0, z);
		
		let alreadyTried = this.triedPos.find((pos : BABYLON.Vector3) => {
			return (pos.x === position.x && pos.y === position.y && pos.z === position.z)
		});
	
		//console.log(randIndex, x, z, alreadyTried)

		if (alreadyTried) {
			return;
		}

		this.triedPos.push(position);

		this.callBackPlaceUnit(card, position, false, null).then(() => {
			this.removeCard(card);
			this.callBackEndAITurn();
			return;
		}, () => {
			this.findPos();
		});
	}

	/** Remove card */
	private removeCard(card: Card) {
		let pos: number = this.enemyCards.findIndex((c: Card) => {
			return c.name === card.name;
		});
		this.enemyCards.splice(pos, 1);
	}

}