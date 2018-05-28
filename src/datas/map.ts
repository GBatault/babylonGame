export class Map {

	public definition: string[][];
	public colorLight: string;
	public colorDark: string;

	constructor(definition: string[][], colorLight: string, colorDark: string) {
		this.definition = definition;
		this.colorLight = colorLight;
		this.colorDark = colorDark;
	}
} 