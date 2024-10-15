const csv = require("csv-parser");
const fs = require("fs");
const path = "hb_test.csv";
const ObjectsToCsv = require("objects-to-csv");

let products = [];

fs.createReadStream(path)
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
    const aggregatedProducts = aggregateProducts(products);
    const sortedProducts = sortProducts(aggregatedProducts);
    writeDataToCsv(sortedProducts);
  });

function aggregateProducts(products) {
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
}

function sortProducts(products) {
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
}

async function writeDataToCsv(products) {
  // format data for CSV output
  const data = products.map((product) => ({
    product_code: product.product_code,
    quantity: product.quantity,
    pick_location: `${product.bay} ${product.shelf}`,
  }));

  const outputFilename = "output.csv";
  const objToCsv = new ObjectsToCsv(data);
  await objToCsv.toDisk(`./${outputFilename}`);
  console.log(
    `Your products have been successfully sorted into ${outputFilename}!`
  );
}
