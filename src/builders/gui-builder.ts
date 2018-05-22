import * as GUI from "babylonjs-gui";
import { Style } from "../datas/style";
import { Card } from "../datas/card";
import { Deck } from "../datas/deck";

export class GuiBuilder {
	
	private scene: BABYLON.Scene;
	private gui: GUI.AdvancedDynamicTexture;
	private toast: GUI.Rectangle;
	public dragging: boolean;
	public cardSelected: Card;
	public dragCard: GUI.Rectangle;

	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("debugGui");
		this.createActionPanel();
	}

	/** Create action panel */
	private createActionPanel() {
		let windW: number = window.innerWidth;
		let windH: number = window.innerHeight;

		let panel: GUI.Rectangle = new GUI.Rectangle();
		panel.width = windW;
		panel.height = "70px";
		panel.background = Style.panelBckgnd;
		panel.thickness = 0;
		panel.shadowColor = Style.shadowColor;
		panel.shadowBlur = 2;
		panel.shadowOffsetY = -1;
		panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.gui.addControl(panel);

		let stack = new BABYLON.GUI.StackPanel();
		stack.isVertical = false;
		stack.height = "70px";
		panel.addControl(stack);
		
		for(let card of Deck.cards) {
			let pCard: BABYLON.GUI.Rectangle = this.createCard(card);
			panel.addControl(pCard);
			pCard.onPointerDownObservable.add(() => {
				console.log()
				this.chooseCard(card, pCard.centerX, pCard.centerY);
			});
		}
	}

	/** Choose a card */
	private chooseCard(card: Card, x: number, y: number) {
		this.cardSelected = card;
		this.dragging = true;

		this.dragCard = this.createCard(card);
		this.dragCard.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.dragCard.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		this.dragCard.left = x - this.dragCard.widthInPixels/2;
		this.dragCard.top = y - this.dragCard.heightInPixels/2;;
		
		this.gui.addControl(this.dragCard);
	}

	private createCard(card: Card) {
		let pCard: BABYLON.GUI.Rectangle = new BABYLON.GUI.Rectangle(card.name);
			pCard.background = Style.card;
			pCard.width = "65px";
			pCard.height = "65px";
			pCard.thickness = 0;
			pCard.cornerRadius = 5;
			pCard.shadowBlur = 2;
			pCard.shadowOffsetX = 1;
			pCard.shadowOffsetY = 1;
		
		require("../assets/cards/" + card.img);
		let img: BABYLON.GUI.Image = new BABYLON.GUI.Image(card.name, "assets/cards/" + card.img);
		img.width = "60px";
		img.height = "60px";
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
		this.dragCard.top = y - this.dragCard.heightInPixels/2;
	}
	
}