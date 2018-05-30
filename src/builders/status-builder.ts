import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";
import { Size } from "babylonjs";

/** Build and manage the status */
export class StatusBuilder {
	
	private scene: BABYLON.Scene;
	private gui: GUI.AdvancedDynamicTexture;
	private userPanel: GUI.Rectangle;

	constructor(scene) {
		this.scene = scene;
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("status");
		this.createStatus();
	}

	/** Create status panel */
	private createStatus() {
		this.userPanel  = this.createPanel("YOU", 
			Colors.panelBckgnd, 
			Colors.headerBckgnd);
		this.userPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.gui.addControl(this.userPanel);

		let enemyPanel: GUI.Rectangle = this.createPanel("ENEMY", 
			Colors.statusEnemy, 
			Colors.statusEnemyHeader);
		enemyPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		this.gui.addControl(enemyPanel);
	}

	/** Create a panel */
	private createPanel(userName: string, 
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
		header.height = 0.5;
		header.background = headerBckgnd;
		header.thickness = 0;
		panel.addControl(header);

		let title: GUI.TextBlock = new GUI.TextBlock("title", userName);
		title.color = Colors.menuColor;
		title.fontSize = 12;
		header.addControl(title); 

		return panel;
	}
}