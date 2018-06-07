import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { Card } from "../datas/card";
import { Deck } from "../datas/deck";
import { Size } from "babylonjs";

/** Build and manage a deck */
export class DeckBuilder {
	
	/** The scene */
	private scene: BABYLON.Scene;
	/** GUI container */
	private gui: GUI.AdvancedDynamicTexture;
	/** If a card is dragging */
	public isDragging: boolean;
	/** Card selected */
	public cardSelected: Card;
	/** The card graphic dragged */
	public dragCard: GUI.Rectangle;
	/** AI play a card action  */
	private aiPlayACard: any;
	/** If the deck is enable */
	private isEnable: boolean = true;
	/** Button end of Turn  */
	private btnEndTurn: GUI.Button;
	/** User Cards */
	private userCards: Card[];
	/** Stack for cards */
	private stack: BABYLON.GUI.StackPanel;

	constructor(scene: BABYLON.Scene, aiPlayACard: any) {
		this.scene = scene;
		this.aiPlayACard = aiPlayACard;
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("deck");
		this.userCards = Array.from(Deck.cards);

		this.createActionPanel();
		this.createBtnEndTurn();
	}

	/** Create action panel */
	private createActionPanel() {
		let windW: number = window.innerWidth;
		
		let panel: GUI.Rectangle = new GUI.Rectangle();
		panel.width = windW;
		panel.height = Sizes.deckHeight;
		panel.background = Colors.panelBckgnd;
		panel.thickness = 0;
		panel.shadowColor = Colors.shadowColor;
		panel.shadowBlur = 2;
		panel.shadowOffsetY = -1;
		panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.gui.addControl(panel);

		this.stack = new BABYLON.GUI.StackPanel();
		this.stack.isVertical = false;
		this.stack.height = Sizes.deckHeight;
		panel.addControl(this.stack);

		for(let card of this.userCards) {
			let pCard: BABYLON.GUI.Rectangle = this.createCard(card);
			this.stack.addControl(pCard);
			pCard.onPointerDownObservable.add(() => {
				this.chooseCard(card, pCard.centerX, pCard.centerY);
			});
		}
	}

	/** Choose a card */
	private chooseCard(card: Card, x: number, y: number) {
		if (this.isEnable) {
			this.cardSelected = card;
			this.isDragging = true;

			this.dragCard = this.createCard(card);
			this.dragCard.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
			this.dragCard.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
			this.dragCard.left = x - this.dragCard.widthInPixels/2;
			this.dragCard.top = y - this.dragCard.heightInPixels;
			
			this.gui.addControl(this.dragCard);
		}
	}

	/** Create a card */
	private createCard(card: Card) {
		let pCard: BABYLON.GUI.Rectangle = new BABYLON.GUI.Rectangle(card.name);
			pCard.background = Colors.card;
			pCard.width = Sizes.cardWidth;
			pCard.height = Sizes.cardHeight;
			pCard.thickness = 0;
			pCard.cornerRadius = 5;
			pCard.shadowBlur = 2;
			pCard.shadowOffsetX = 1;
			pCard.shadowOffsetY = 1;
			pCard.paddingLeft = Sizes.cardPadding;

		require("../assets/cards/" + card.img);
		let img: BABYLON.GUI.Image = new BABYLON.GUI.Image(card.name, "assets/cards/" + card.img);
		img.width = Sizes.cardImgWidth;
		img.height = Sizes.cardImgHeight;
		pCard.addControl(img);
		
		return pCard;
	}

	/** Debug Text */
	private debugText(text: string) {
		let textBlock: GUI.TextBlock = new GUI.TextBlock("debug", text);
		textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; 
		this.gui.addControl(textBlock);
	}

	/** Show Card on dragging*/
	public showCardDrag(x , y) {
		this.dragCard.left = x - this.dragCard.widthInPixels/2;
		this.dragCard.top = y - this.dragCard.heightInPixels;
	}

	/** Create */
	private createBtnEndTurn() {
		this.btnEndTurn = GUI.Button.CreateSimpleButton("but", "END TURN");
		this.btnEndTurn.thickness = 0;
		this.btnEndTurn.width = Sizes.btnEndTurnWidth;
		this.btnEndTurn.height = Sizes.btnEndTurnHeight;
		this.btnEndTurn.color = Colors.menuColor;
		this.btnEndTurn.background = Colors.buttonBckgnd;
		this.btnEndTurn.shadowColor = Colors.shadowColor;
		this.btnEndTurn.shadowBlur = 7;
		this.btnEndTurn.shadowOffsetX = 2;
		this.btnEndTurn.shadowOffsetY = 2;
		this.btnEndTurn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.btnEndTurn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		this.btnEndTurn.fontSize = 12;
		this.btnEndTurn.top = Sizes.btnEndTurnTop;
		this.btnEndTurn.paddingRight = "5px";
		
		this.btnEndTurn.onPointerClickObservable.add(this.endUserTurn);
		this.gui.addControl(this.btnEndTurn);  
	}

	/** End of user turn */
	private endUserTurn = () => {
		let text: BABYLON.GUI.TextBlock = this.btnEndTurn.children[0] as BABYLON.GUI.TextBlock;
		text.text = "ENEMY TURN";
		text.fontStyle = "italic";
		text.fontSize = 12;
		this.btnEndTurn.background = Colors.btnTurnAI;
		this.isEnable = false;
		this.aiPlayACard();
	}

	/** End of AI turn */
	public endAITurn = () => {
		setTimeout(()=> {
			let text: BABYLON.GUI.TextBlock = this.btnEndTurn.children[0] as BABYLON.GUI.TextBlock;
			text.text = "END TURN";
			text.fontStyle = "normal";
			text.fontSize = 12;
			this.btnEndTurn.background = Colors.buttonBckgnd;
			this.isEnable = true;
		}, 500);
	}

	/** Remove card */
	public removeCard(card: Card) {
		let pos: number = this.userCards.findIndex((c: Card) => {
			return c.name === card.name;
		});
		this.userCards.splice(pos, 1);

		let posGraph: number = this.stack.children.findIndex((c: GUI.Control) => {
			return c.name === card.name;
		});

		let control: GUI.Control = this.stack.children.find((c: GUI.Control) => {
			return c.name === card.name;
		});

		this.stack.removeControl(control)
	}
	
}