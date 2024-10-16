# The Portal Test
## Overview
This application's purpose is to streamline the picking process for a fictional warehouse department.
Given a CSV input file with 3 columns: **product_code, quantity, location**; the application finds the optimal picking route through the warehouse.

### Warehouse Layout:
- The warehouse contains 52 bays, lettered from A to AZ.
- Each bay has 10 shelves, numbered 1 to 10 (1 being the lowest shelf, 10 being the highest).

### Key Features:
- The application sorts the items by bay (A to AZ) and within each bay by shelf (1-10).
- Duplicate products are aggregated, with their quantities summed up.


**TL;DR**: Takes a CSV input file, rearranges its items for optimal picking, and writes the result into `output.csv`

## Setup
1. Run `git clone https://github.com/Piggun/the-portal-test.git` in your terminal, to clone the repo at your desired location
2. Run `cd the-portal-test` to navigate into the project directory
3. Run `npm install` to install all the required dependencies


## Running the Program
To execute the program run `node index.js`

This will create a new file called `output.csv` inside the root folder, containing the sorted products.

## Running Tests
To run unit-tests run `npm test`
