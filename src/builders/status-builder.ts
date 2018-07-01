import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { User } from "../datas/user";

/** Build and manage the status */
export class StatusBuilder {
	
	private scene: BABYLON.Scene;
	private gui: GUI.AdvancedDynamicTexture;
	private userPanel: GUI.Rectangle;
	private user: User;
	private enemy: User;
	private userManaText: GUI.TextBlock;
	private userManaBar: GUI.Rectangle;
	
	constructor(scene: BABYLON.Scene, user: User, enemy: User) {
		this.scene = scene
		this.user = user;
		this.enemy = enemy;
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("status");
		this.createStatus();
	}

	/** Create status panel */
	private createStatus() {
		this.userPanel  = this.createPanel(
			this.user,
			Colors.panelBckgnd, 
			Colors.headerBckgnd);
		this.userPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.gui.addControl(this.userPanel);

		let enemyPanel: GUI.Rectangle = this.createPanel(
			this.enemy, 
			Colors.statusEnemy, 
			Colors.statusEnemyHeader);
		enemyPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		this.gui.addControl(enemyPanel);
	}

	/** Create a panel */
	private createPanel(user: User, 
		background: string, 
		headerBckgnd: string): GUI.Rectangle {

		let windW: number = window.innerWidth;

		let panel: GUI.Rectangle = new GUI.Rectangle();
		panel.width = windW > 500 ? 0.25 : Sizes.statusWidth;
		panel.height = Sizes.statusHeight;
		panel.background = background;
		panel.thickness = 0;
		panel.shadowColor = Colors.shadowColor;
		panel.shadowBlur = 5;
		panel.shadowOffsetY = 2;
		panel.shadowOffsetY = 2;
		panel.paddingTop = Sizes.statusPadding
		panel.paddingLeft = Sizes.statusPadding;
		panel.paddingRight = Sizes.statusPadding;
		panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		
		let header: GUI.Rectangle = new GUI.Rectangle();
		header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		header.width = 1;
		header.height = Sizes.statusHeaderHeight
		header.background = headerBckgnd;
		header.thickness = 0;
		panel.addControl(header);

		let title: GUI.TextBlock = new GUI.TextBlock("title", user.name);
		title.color = Colors.menuColor;
		title.fontSize = Sizes.statusHeaderFontSize;
		header.addControl(title);
		
		let lifeBar: GUI.Rectangle = this.createBar(false, user);
		panel.addControl(lifeBar);

		let manaBar: GUI.Rectangle =  this.createBar(true, user);
		panel.addControl(manaBar);	
		
		return panel;
	}

	/** Create a bar */
	private createBar(isMana: boolean, user: User): GUI.Rectangle {
		let top: string = Sizes.lifeBarTop;
		let color: string = Colors.lifeBar;
		if (isMana) {
			top = Sizes.manaBarTop;
			color = Colors.manaBar;
		}
		let bar: GUI.Rectangle = new GUI.Rectangle();
		bar.width = Sizes.barWidth;
		bar.height = Sizes.barHeigth;
		bar.thickness = 0;
		bar.background = color;
		bar.shadowColor = Colors.shadowColor;
		bar.shadowOffsetY = 1;
		bar.shadowOffsetY = 1;
		bar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		bar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		bar.top = top;
		bar.left = Sizes.barLeft;

		let text: GUI.TextBlock = new GUI.TextBlock("lifeText", "10");
		text.color = Colors.menuColor;
		text.paddingTop = "1px";
		text.fontSize = Sizes.barFontSize;
		text.shadowColor = Colors.shadowColor;
		bar.addControl(text);
		
		if (!user.isAI && isMana) {
			this.userManaText = text;
			this.userManaBar = bar;
		}
		return bar;
	}

	/** Update bar */
	public updateBar = (user: User, isMana: boolean) => {
		let bar: GUI.Rectangle;
		// Update the text
		if(!user.isAI && isMana) {
			this.userManaText.text = user.mana.toString();
			bar = this.userManaBar;
		}
		// Animate the bar
		let oldSize: number = Number((bar.width as string).replace("%",""))/100;
		let newSize: number = Sizes.barWidth * user.mana / user.manaStart;
		newSize =  Math.round(newSize * 10)/10;
		console.log(oldSize, newSize);

		var animation = new BABYLON.Animation("animBar", "width", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keys = []; 
		keys.push({
			frame: 0,
			value: oldSize
		});
		keys.push({
			frame: 10,
			value: newSize
		});
		animation.setKeys(keys);
		(bar as any).animations = [];
		(bar as any).animations.push(animation);
		this.scene.beginAnimation(bar, 0, 10);
	}
}