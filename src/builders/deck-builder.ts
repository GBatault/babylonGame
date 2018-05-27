import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { Card } from "../datas/card";
import { Deck } from "../datas/deck";
import { Size } from "babylonjs";

/** Build and manage a deck */
export class DeckBuilder {
	
	private scene: BABYLON.Scene;
	private gui: GUI.AdvancedDynamicTexture;
	private toast: GUI.Rectangle;
	public isDragging: boolean;
	public cardSelected: Card;
	public dragCard: GUI.Rectangle;
	private aiPlayACard: any;
	private isEnable: boolean = true;
	private btnEndTurn: GUI.Button;

	constructor(scene: BABYLON.Scene, aiPlayACard: any) {
		this.scene = scene;
		this.aiPlayACard = aiPlayACard;
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("deck");
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

		let stack: BABYLON.GUI.StackPanel = new BABYLON.GUI.StackPanel();
		stack.isVertical = false;
		stack.height = Sizes.deckHeight;
		panel.addControl(stack);
		
		for(let card of Deck.cards) {
			let pCard: BABYLON.GUI.Rectangle = this.createCard(card);
			stack.addControl(pCard);
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
	
}