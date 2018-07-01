export class User {

	public name: string;
	public life: number;
	public mana: number;
	public isAI: boolean;

	constructor(name: string, life: number, mana: number, isAI: boolean) {
		this.name = name;
		this.life = life;
		this.mana = mana;
		this.isAI = isAI;
	}
}