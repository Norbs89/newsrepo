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

  it("returns an object with author and article_id as a key-value pair, when passed an array", () => {
    const input = [
      {
        article_id: 28,
        title: "High Altitude Cooking",
        body:
          "Most backpacking trails vary only a few thousand feet elevation.",
        votes: 0,
        topic: "cooking",
        author: "happyamy2016",
        created_at: "2018 - 05 - 27T03: 32: 28.514Z"
      }
    ];
    const actual = makeRefObj(input);
    const expected = { "High Altitude Cooking": 28 };
    expect(actual).to.eql(expected);
  });
  it("works for multiple array entries", () => {
    const input = [
      {
        article_id: 27,
        title: "High Cooking",
        body:
          "Most backpacking trails vary only a few thousand feet elevation.",
        votes: 0,
        topic: "cooking",
        author: "happyamy2016",
        created_at: "2018 - 05 - 27T03: 32: 28.514Z"
      },
      {
        article_id: 28,
        title: "High Altitude Cooking",
        body:
          "Most backpacking trails vary only a few thousand feet elevation.",
        votes: 0,
        topic: "cooking",
        author: "happyamy2016",
        created_at: "2018 - 05 - 27T03: 32: 28.514Z"
      }
    ];
    const actual = makeRefObj(input);
    const expected = {
      "High Cooking": 27,
      "High Altitude Cooking": 28
    };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {});
