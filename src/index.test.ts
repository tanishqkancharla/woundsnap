import { describe } from "mocha";
import { assert } from "./utils/assertUtils";

// Simple test to verify test setup is working
describe("Basic Test Suite", () => {
	it("Should run basic assertion", () => {
		assert.equal(2 + 2, 4);
	});
});
