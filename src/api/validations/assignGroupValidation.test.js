const Joi = require("joi");
const { familyValidation, assignFamilyValidation } = require("../validations/family");

describe("assignFamilyValidation", () => {

    // Dependency Island principal
    // VALID case
    test("should validate a valid family assignment data", () => {
        const data = {
        username: "john_doe",
        codeFamily: "ABC123"
        };
        const result = assignFamilyValidation(data);
        expect(result.error).toBeUndefined();
    });

// Dependency Island: USERNAME
describe("USERNAME validation", () => {

    // VALID case
    test("should validate a valid username", () => {
    const data = {
        username: "john_doe",
        codeFamily: "ABC123"
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeUndefined();
    });

    // INVALID cases
    test("should invalidate an empty username", () => {
    const data = {
        username: "",
        codeFamily: "ABC123"
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeDefined();
    });

    test("should invalidate a username exceeding the maximum length", () => {
    const data = {
        username: "INVALIDabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabc",
        codeFamily: "ABC123"
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeDefined();
    });

});

// Dependency Island: CODEFAMILY
describe("CODEFAMILY validation", () => {

    // VALID case
    test("should validate a valid codeFamily", () => {
    const data = {
        username: "john_doe",
        codeFamily: "ABC123"
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeUndefined();
    });

    // INVALID cases
    test("should invalidate an empty codeFamily", () => {
    const data = {
        username: "john_doe",
        codeFamily: ""
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeDefined();
    });

    test("should invalidate a codeFamily exceeding the maximum length", () => {
    const data = {
        username: "john_doe",
        codeFamily: "INVALIDabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabc"
    };
    const result = assignFamilyValidation(data);
    expect(result.error).toBeDefined();
    });

    });

});

