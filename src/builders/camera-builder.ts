import * as GUI from "babylonjs-gui";
import { Colors } from "../datas/colors";
import { Sizes } from "../datas/sizes";

/** Build and manage the camera */
export class CameraBuilder {
	
	private gui: GUI.AdvancedDynamicTexture;
	private btnCamera: GUI.Button;
	private callBackSwitchFreeCamera: any;
	private isFreeCamera: boolean;

	constructor(callBackSwitchFreeCamera: any) {
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("status");
		this.callBackSwitchFreeCamera = callBackSwitchFreeCamera;
		this.createBtnFreeCamera();
	}

	/** Create button rotate */
	private createBtnFreeCamera() {
		require("../assets/icon/free-camera.svg");
		this.btnCamera = BABYLON.GUI.Button.CreateImageOnlyButton("but", "assets/icon/free-camera.svg");
		this.btnCamera.width = Sizes.btnCameraWidth;
		this.btnCamera.height = Sizes.btnCameraHeight;
		this.btnCamera.thickness = 0;
		this.btnCamera.color = Colors.menuColor;
		this.btnCamera.background = Colors.buttonBckgnd;
		this.btnCamera.shadowColor = Colors.shadowColor;
		this.btnCamera.shadowBlur = 7;
		this.btnCamera.shadowOffsetX = 2;
		this.btnCamera.shadowOffsetY = 2;
		this.btnCamera.fontSize = 8;

		this.btnCamera.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		this.btnCamera.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.btnCamera.top = Sizes.btnCameraTop;
		this.btnCamera.left = "5px";

		this.btnCamera.onPointerDownObservable.add(this.switchFreeCamera);
		this.gui.addControl(this.btnCamera);  
	}

	public switchFreeCamera = () => {
		this.isFreeCamera = !this.isFreeCamera;
		this.btnCamera.background = this.isFreeCamera ? Colors.isFreeCamera : Colors.buttonBckgnd;
		this.callBackSwitchFreeCamera();
		
	}

}