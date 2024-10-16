const csv = require("csv-parser");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");
const { aggregateProducts, sortProducts } = require("./utils.js");

const inputFilePath = "hb_test.csv";
const outputFilePath = "output.csv";

function processCsv() {
  let products = [];

  if (!fs.existsSync(inputFilePath)) {
    throw new Error(`Error: ${inputFilePath} does not exist`);
  }

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on("data", (row) => {
      const [bay, shelf] = row.pick_location.split(" ");
      products.push({
        product_code: row.product_code,
        quantity: Number(row.quantity),
        bay: bay,
        shelf: shelf,
      });
    })
    .on("end", () => {
      if (products.length === 0) {
        throw new Error(`Error: there are no products to process`);
      }

      const aggregatedProducts = aggregateProducts(products);
      const sortedProducts = sortProducts(aggregatedProducts);
      writeDataToCsv(sortedProducts);
    })
    .on("error", (error) => {
      throw new Error(`Error reading CSV file: ${error}`);
    });
}

async function writeDataToCsv(products) {
  try {
    // format data for CSV output
    const data = products.map((product) => ({
      product_code: product.product_code,
      quantity: product.quantity,
      pick_location: `${product.bay} ${product.shelf}`,
    }));

    const objToCsv = new ObjectsToCsv(data);
    await objToCsv.toDisk(`./${outputFilePath}`);
    console.log(
      `Your products have been successfully sorted into ${outputFilePath}!`
    );
  } catch (error) {
    throw new Error(`Error writing data to CSV: ${error}`);
  }
}

if (require.main === module) {
  processCsv();
}

module.exports = {
  aggregateProducts,
  sortProducts,
  processCsv,
  writeDataToCsv,
};
