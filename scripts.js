// declare all elements needed
const laptopsElement = document.getElementById("laptops");
const bankBalanceElement = document.getElementById("bank-balance");
const loanBalanceElement = document.getElementById("loan-balance");
const getLoanElement = document.getElementById("get-loan");
const repayLoanElement = document.getElementById("repay-loan");
const workBalanceElement = document.getElementById("work-balance");
const transferElement = document.getElementById("transfer");
const workElement = document.getElementById("work");
const nameElement = document.getElementById("name");
const descriptionElement = document.getElementById("description");
const priceElement = document.getElementById("price");
const buyElement = document.getElementById("buy");

let laptops = [];
let bankBalance = 0.0;
let loanBalance = 0.0;
let workBalance = 0.0;

fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToSelect(laptops))

const addLaptopsToSelect = (laptops) => {
    laptops.forEach(x => addLaptop(x))

}

const addLaptop = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}