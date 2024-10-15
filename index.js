const csv = require("csv-parser");
const fs = require("fs");
const path = "hb_test.csv";

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
    const summedProducts = aggregateProducts(products);
    console.log(summedProducts);
  });

function aggregateProducts(products) {
  const aggregatedProducts = {};
  for (const product of products) {
    const key = product["product_code"];
    // If the product already exists
    if (aggregatedProducts[key]) {
      aggregatedProducts[key].quantity += product.quantity;
    } else {
      aggregatedProducts[key] = product;
    }
  }
  return aggregatedProducts;
}
