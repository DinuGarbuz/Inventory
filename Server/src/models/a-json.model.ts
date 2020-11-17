export class AJsonModel {
	key1: string;
	"key 2": string;
	constructor(model?: any) {
		if (model) {
			this.key1 = model.key1;
			this["key 2"] = model["key 2"];
		} else {
			this.key1 = "value 1";
			this["key 2"] = "value 2";
		}
	}
}