import { describe } from "mocha";
import { add } from ".";
import { assert } from "./utils/assertUtils";

describe("Adds numbers", () => {
	it("Adds two and two", () => {
		assert.equal(add(2, 2), 4);
	});
});
