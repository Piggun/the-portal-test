const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");
const {
  aggregateProducts,
  sortProducts,
  processCsv,
  writeDataToCsv,
} = require("../index.js");

jest.mock("fs");
jest.mock("objects-to-csv");

describe("aggregateProducts()", () => {
  test("Checks that products get aggregated as intended", () => {
    const products = [
      { product_code: "1", quantity: 10, bay: "AB", shelf: "10" },
      { product_code: "2", quantity: 1, bay: "C", shelf: "8" },
      { product_code: "3", quantity: 1, bay: "AF", shelf: "7" },
      { product_code: "4", quantity: 4, bay: "AC", shelf: "5" },
      { product_code: "1", quantity: 10, bay: "AB", shelf: "10" },
      { product_code: "2", quantity: 5, bay: "C", shelf: "8" },
      { product_code: "3", quantity: 10, bay: "AF", shelf: "7" },
      { product_code: "4", quantity: 8, bay: "AC", shelf: "5" },
    ];
    const actual = aggregateProducts(products);
    const expected = [
      { product_code: "1", quantity: 20, bay: "AB", shelf: "10" },
      { product_code: "2", quantity: 6, bay: "C", shelf: "8" },
      { product_code: "3", quantity: 11, bay: "AF", shelf: "7" },
      { product_code: "4", quantity: 12, bay: "AC", shelf: "5" },
    ];
    expect(actual).toEqual(expected);
  });
  test("Checks that error gets thrown correctly", () => {
    expect(() => {
      aggregateProducts();
    }).toThrow(/^Error aggregating products: /);

    expect(() => {
      aggregateProducts();
    }).toThrow(Error);
  });
});

describe("sortProducts()", () => {
  test("Checks that products get sorted as intended", () => {
    const products = [
      { product_code: "1", quantity: 10, bay: "AB", shelf: "10" },
      { product_code: "2", quantity: 1, bay: "C", shelf: "8" },
      { product_code: "3", quantity: 1, bay: "AF", shelf: "7" },
      { product_code: "4", quantity: 4, bay: "AC", shelf: "5" },
      { product_code: "5", quantity: 3, bay: "Z", shelf: "5" },
      { product_code: "6", quantity: 1, bay: "AC", shelf: "4" },
      { product_code: "7", quantity: 1, bay: "A", shelf: "4" },
    ];
    const actual = sortProducts(products);
    const expected = [
      { product_code: "7", quantity: 1, bay: "A", shelf: "4" },
      { product_code: "2", quantity: 1, bay: "C", shelf: "8" },
      { product_code: "5", quantity: 3, bay: "Z", shelf: "5" },
      { product_code: "1", quantity: 10, bay: "AB", shelf: "10" },
      { product_code: "6", quantity: 1, bay: "AC", shelf: "4" },
      { product_code: "4", quantity: 4, bay: "AC", shelf: "5" },
      { product_code: "3", quantity: 1, bay: "AF", shelf: "7" },
    ];
    expect(actual).toEqual(expected);
  });
  test("Checks that error gets thrown correctly", () => {
    expect(() => {
      sortProducts();
    }).toThrow(/^Error sorting products: /);

    expect(() => {
      sortProducts();
    }).toThrow(Error);
  });
});

describe("processCsv()", () => {
  test("Checks that error gets thrown when input file doesn't exist", () => {
    fs.existsSync.mockReturnValue(false);
    expect(() => processCsv()).toThrow(`Error: hb_test.csv does not exist`);
  });
});

describe("writeDataToCsv()", () => {
  test("Check that the correct message is logged after data is written to CSV", async () => {
    const products = [{ product_code: "1", quantity: 3, bay: "Z", shelf: "5" }];
    ObjectsToCsv.prototype.toDisk = jest.fn().mockResolvedValue();

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await writeDataToCsv(products);

    expect(logSpy).toHaveBeenCalledWith(
      `Your products have been successfully sorted into output.csv!`
    );

    logSpy.mockRestore();
  });
  test("Check that error gets thrown correctly", () => {
    const products = [{ product_code: "1", quantity: 3, bay: "Z", shelf: "5" }];

    ObjectsToCsv.prototype.toDisk = jest.fn().mockRejectedValue(new Error());

    expect(async () => {
      await writeDataToCsv(products);
    }).rejects.toThrow(/^Error writing data to CSV: /);

    expect(async () => {
      await writeDataToCsv(products);
    }).rejects.toThrow(Error);
  });
});
