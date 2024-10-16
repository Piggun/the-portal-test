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
    throw new Error(`Error aggregating products: ${error}`);
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

module.exports = { aggregateProducts, sortProducts };
