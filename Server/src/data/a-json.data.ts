import { AJsonModel } from "../models/a-json.model"

const getAJson = function () {
	// get data
	const obj = {
		key1: "value 1",
		// "key 2": "value 2", // "key 2" is excluded on purpose, this is a valid case where the data may not contain it
		nonExistingModelProp: "who cares" // key does not exist in the model, but the data may contain it 
	};

	// construct the model from data, using either the function or class, whichever style you implemented
	let ret = new AJsonModel(obj);

	return ret;
}

export { getAJson }
