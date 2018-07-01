import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { Card } from "../datas/card";
import { Deck } from "../datas/deck";
import { User } from "../datas/user";

/** Build and manage a deck */
export class DeckBuilder {
	
	/** User */
	private user: User;
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
	/** Attack action  */
	private attack: any;
	/** If the deck is enable */
	private isEnable: boolean = true;
	/** Button end of Turn  */
	private btnEndTurn: GUI.Button;
	/** Button Attack  */
	private btnAttack: GUI.Button;
	/** User Cards */
	private userCards: Card[];
	/** Stack for cards */
	private stack: BABYLON.GUI.StackPanel;
	/** Move front line */
	private moveFrontLine: any;
	/** Update Bar */
	private updateBar: any;
	
	constructor(
		user: User,
		aiPlayACard: any, 
		attack: any,
		moveFrontLine: any,
		updateBar: any) {

		this.user = user;
		this.aiPlayACard = aiPlayACard;
		this.attack = attack;
		this.moveFrontLine = moveFrontLine;
		this.updateBar = updateBar;

		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("deck");
		this.userCards = Array.from(Deck.cards);
		this.createActionPanel();
		this.createBtnEndTurn();
		this.createBtnAttack();
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
			this.createBtnCard(card);
		}
	}

	/** Create a button card */
	private createBtnCard(card: Card): BABYLON.GUI.Button {
		let rCard: BABYLON.GUI.Rectangle = this.createCard(card, false);
		require("../assets/cards/" + card.img);
		let btn = BABYLON.GUI.Button.CreateImageOnlyButton(card.name, "../assets/cards/" + card.img);
		btn.width = Sizes.cardImgWidth;
		btn.height = Sizes.cardImgHeight;
		btn.thickness = 0;
		btn.onPointerDownObservable.add(() => {
			this.chooseCard(card, btn.centerX, btn.centerY);
		});
		rCard.addControl(btn);
		this.stack.addControl(rCard);
		return btn;
	}

	/** Choose a card */
	private chooseCard(card: Card, x: number, y: number) {
		if (this.isEnable) {
			this.cardSelected = card;
			this.isDragging = true;
			this.dragCard = this.createCard(card, true);
			this.dragCard.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
			this.dragCard.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
			this.dragCard.left = x - this.dragCard.widthInPixels/2;
			this.dragCard.top = y - this.dragCard.heightInPixels;
			this.gui.addControl(this.dragCard);
		}
	}

	/** Remove drag card */
	public removeDragCard() {
		this.gui.removeControl(this.dragCard);
	}

	/** Create a card */
	private createCard(card: Card, isDrag: boolean): BABYLON.GUI.Rectangle {
		let dragSufix: string = isDrag ? "drag" : "";
		let rCard: BABYLON.GUI.Rectangle = new BABYLON.GUI.Rectangle(card.name + dragSufix);
			rCard.background = Colors.card;
			rCard.width = Sizes.cardWidth;
			rCard.height = Sizes.cardHeight;
			rCard.thickness = 0;
			rCard.cornerRadius = 5;
			rCard.shadowBlur = 2;
			rCard.shadowOffsetX = 1;
			rCard.shadowOffsetY = 1;
			rCard.paddingLeft = Sizes.cardPadding;
		
		if (isDrag) {
			require("../assets/cards/" + card.img);
			let img: BABYLON.GUI.Image = new BABYLON.GUI.Image(card.name + dragSufix, "assets/cards/" + card.img);
			img.width = Sizes.cardImgWidth;
			img.height = Sizes.cardImgHeight;
			rCard.addControl(img);
		}
		return rCard;
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

	/** Create button end turn */
	private createBtnEndTurn() {
		require("../assets/icon/end-turn.svg");
		this.btnEndTurn = BABYLON.GUI.Button.CreateImageButton("but", "END TURN", "assets/icon/end-turn.svg");
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
		this.btnEndTurn.children.find((x) => x.name === "but_icon").left = "5px";

		this.btnEndTurn.onPointerDownObservable.add(this.endUserTurn);
		this.gui.addControl(this.btnEndTurn);  
	}

	/** Create button attack */
	private createBtnAttack() {
		require("../assets/icon/attack.svg");
		this.btnAttack = BABYLON.GUI.Button.CreateImageButton("but", "ATTACK", "assets/icon/attack.svg");
		this.btnAttack.thickness = 0;
		this.btnAttack.width = Sizes.btnAttackWidth;
		this.btnAttack.height = Sizes.btnAttackHeight;
		this.btnAttack.color = Colors.menuColor;
		this.btnAttack.background = Colors.buttonBckgnd;
		this.btnAttack.shadowColor = Colors.shadowColor;
		this.btnAttack.shadowBlur = 7;
		this.btnAttack.shadowOffsetX = 2;
		this.btnAttack.shadowOffsetY = 2;
		this.btnAttack.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.btnAttack.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		this.btnAttack.fontSize = 12;
		this.btnAttack.top = Sizes.btnAttackTop;
		this.btnAttack.paddingRight = "5px";
		
		let icon: GUI.Control = this.btnAttack.children.find((x) => x.name === "but_icon");
		icon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		icon.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		icon.paddingTop = "-20px";
		icon.width = "30px";
		
		let text: GUI.Control = this.btnAttack.children.find((x) => x.name === "but_button")
		text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		text.paddingLeft = "5px";
		text.paddingTop = "35px";

		this.btnAttack.onPointerDownObservable.add(this.userAttack);
		this.gui.addControl(this.btnAttack);  

	}

	/** User attack action */
	private userAttack = () => {
		this.isEnable = false;
		this.attack(true).then(() => {
			this.isEnable = true;
			//Move front line
			this.moveFrontLine(true);
			//Decrement mana
			this.user.mana -= 1; 
			this.updateBar(this.user, true);
		}).catch(() => {
			this.isEnable = true;
		});
	}

	/** End of user turn */
	private endUserTurn = () => {
		this.isEnable = false;
		let text: BABYLON.GUI.TextBlock = this.btnEndTurn.children[0] as BABYLON.GUI.TextBlock;
		text.text = "ENEMY TURN";
		text.fontStyle = "italic";
		text.fontSize = 12;
		this.btnEndTurn.background = Colors.btnTurnAI;	
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

		let control: GUI.Control = this.stack.children.find((c: GUI.Control) => {
			return c.name === card.name;
		});

		this.stack.removeControl(control)
	}

}