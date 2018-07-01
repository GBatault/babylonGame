export class User {

	/** Name of the user */
	public name: string;
	/** Life of the user */
	public life: number;
	/** Mana of the user */
	public mana: number;
	/** Mana at start */
	public manaStart: number;
	/** If it is an AI */
	public isAI: boolean;

	constructor(name: string, life: number, manaStart: number, isAI: boolean) {
		this.name = name;
		this.life = life;
		this.manaStart = manaStart;
		this.mana = manaStart;
		this.isAI = isAI;
	}
}