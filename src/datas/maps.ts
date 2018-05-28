import { Map } from "./map";

export class Maps {

	/** Green Map 
	 * http://colorhunt.co/c/117699 */
	public static maps: { [key: string]: Map } = { 
		"green" :  new Map([
			["D", "L", "D", "L", "D"],
			["L", "D", "L", "D", "L"],
			["D", "L", "D", "L", "D"],
			["L", "D", "L", "D", "L"],
			["D", "L", "D", "L", "D"]
		], "#7DC383", "#446E5C")
	}
} 