const csv = require("csv-parser");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

const inputFilePath = "hb_test.csv";
const outputFilePath = "output.csv";

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

function aggregateProducts(products) {
  try {
    const aggregatedProducts = [];
    const aggregatedProductsMap = {};

    for (const product of products) {
      const id = product["product_code"];
      // If the product already exists increase its quantity
      if (aggregatedProductsMap[id]) {
        aggregatedProductsMap[id].quantity += product.quantity;
      } else {
        aggregatedProductsMap[id] = { ...product };
      }
    }
    for (const id in aggregatedProductsMap) {
      aggregatedProducts.push(aggregatedProductsMap[id]);
    }
    return aggregatedProducts;
  } catch (error) {
    throw new Error(`Error aggregating products : ${error}`);
  }
}

function sortProducts(products) {
  try {
    products.sort((a, b) => {
      // if bays are the same, order by shelf number
      if (a.bay.localeCompare(b.bay) === 0) {
        return a.shelf - b.shelf;
      }
      // if bays have the same amount of characters, order alphabetically
      if (a.bay.length === b.bay.length) {
        return a.bay.localeCompare(b.bay);
      }
      // order by bays with less characters first
      return a.bay.length - b.bay.length;
    });

    return products;
  } catch (error) {
    throw new Error(`Error sorting products: ${error}`);
  }
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
