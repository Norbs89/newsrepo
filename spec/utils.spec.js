const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Returns a new array when an empty array has been passed in", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("converts a UNIX timestamp key in one array index object, all other keys unchanged. ", () => {
    const input = [{ a: 1, b: 2, created_at: 1542284514171 }];
    const correctDate = new Date(1542284514171);
    const actual = formatDates(input);
    const expected = [{ a: 1, b: 2, created_at: correctDate }];
    expect(actual).to.eql(expected);
  });
  it("converts a UNIX timestamp key in multiple array index objects, all other keys unchanged. ", () => {
    const input = [
      { a: 1, b: 2, created_at: 1542284514171 },
      { a: 3, b: 2, created_at: 1542284514171 },
      { a: 4, b: 3, created_at: 1542284514171 }
    ];
    const correctDate = new Date(1542284514171);
    const actual = formatDates(input);
    const expected = [
      { a: 1, b: 2, created_at: correctDate },
      { a: 3, b: 2, created_at: correctDate },
      { a: 4, b: 3, created_at: correctDate }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {});
