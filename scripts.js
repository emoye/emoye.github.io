// declare all elements needed
const laptopsElement = document.getElementById("laptops");
const bankBalanceElement = document.getElementById("bank-balance");
const loanBalanceElement = document.getElementById("loan-balance");
const workBalanceElement = document.getElementById("work-balance");
const priceElement = document.getElementById("price");
const nameElement = document.getElementById("name");
const descriptionElement = document.getElementById("description");
const imageElement = document.getElementById("image");
let laptops = [];

// bool to check if person has bought laptop or not
let hasBoughtLaptop = false;

// bool to check if person has taken a loan
let hasTakenLoan = false;

// get each computer from api
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptops(laptops))

// get laptop titles for each laptop and add to laptops array
const addLaptop = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

// add laptops to the select menu and show default values
const addLaptops = (laptops) => {
    laptops.forEach(x => addLaptop(x));
    priceElement.innerText = laptops[0].price + " KR";
    descriptionElement.innerText = laptops[0].description;
    nameElement.innerText = laptops[0].title;
    imageElement.innerText = laptops[0].image;
}

// function to change laptop and show corresponding values
const selectLaptopChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    priceElement.innerText = selectedLaptop.price + " KR";
    nameElement.innerText = selectedLaptop.title;
    descriptionElement.innerText = selectedLaptop.description;
    imageElement.innerText = selectedLaptop.image;
}

laptopsElement.addEventListener("change", selectLaptopChange);

// function to get a loan
function getLoan()
{
    // check if person already has a loan, or if there bank balance is 0, or if they already have taken a loan and have not bought a laptop
    if (parseFloat(loanBalanceElement.value) > 0) {
        alert("You cannot take a new loan before you have repayed your outstanding loan. " + "You still need to repay " + loanBalanceElement.value + "kr.");
    } else if (parseFloat(bankBalanceElement.value) === 0) {
        alert("You cannot take loan when your bank balance is 0 kr! You should work a little before you take a loan :)")
    } else if (hasTakenLoan && !hasBoughtLaptop) {
        alert("You need to buy a laptop before you can take another loan!")
    }
    // if not, they can take a loan
    else {
        const promptText = "How much would you like to loan?";
        let amount = prompt(promptText);
    
        while (true) {
            // check if person can loan inputted amount
            if (parseFloat(amount) > (parseFloat(bankBalanceElement.value)*2)) {
                amount = prompt("You cannot loan more than double the amount for your bank balance. " + "The amount you can currently loan is " + (parseFloat(bankBalanceElement.value))*2 + " kr. \n" + promptText);
            } else if (parseFloat(amount) <= 0) {
                amount = prompt("You cannot loan 0 kr or less. " + "The amount you can currently loan is " + (parseFloat(bankBalanceElement.value))*2 + " kr. \n" + promptText);
            }
            else {
                bankBalanceElement.value = parseFloat(bankBalanceElement.value) + parseFloat(amount);
                loanBalanceElement.value = parseFloat(amount);
                alert("Wohoo you got a loan of " + amount + " kr! Don't forget to pay it back..");
                hasTakenLoan = true;
                // make reapy loan button and loan amount appear
                document.getElementById("repayloan-button").className = 'button'; 
                document.getElementById("loan-amount").className = 'container-text'; 
                break;
            }
        }
    }
}

// function to pay back loan - this button should only appear one you have taken a loan
function repayLoan() {
    // check if there is money i work balance
    if (parseFloat(workBalanceElement.value) === 0) {
        alert("You don't have any money to repay your loan! You need to work more to earn money.")
    // check if work balance is larger or equal to outstanding loan - then you can pay the whole loan down
    } else if (parseFloat(workBalanceElement.value) >= parseFloat(loanBalanceElement.value)) {
        loanBalanceElement.value = 0;
        workBalanceElement.value = 0;
        workBalanceElement.value = parseFloat(workBalanceElement.value) - parseFloat(loanBalanceElement.value);
        alert("Congratulations, you repayed all your loan!!")
        // hide repay loan button
        document.getElementById("repayloan-button").className = 'hidden'; 
    // if not, there is less money in work blanace than outstanding loan
    } else {
        workBalanceElement.value = 0;
        loanBalanceElement.value = parseFloat(loanBalanceElement.value) - parseFloat(workBalanceElement.value);
    }
}

// function to add 100kr when clicking "work"
function increasePay()
{
    workBalanceElement.value = parseInt(workBalanceElement.value) + 100;
}

// function to transfer money from work balance to bank balance
function transferMoney() {
    // check if there is money in work balance
    if (parseFloat(workBalanceElement.value) > 0) {
        // check if person has outstanding loan
        if (parseFloat(loanBalanceElement.value) === 0) {
            bankBalanceElement.value = parseFloat(bankBalanceElement.value) + parseFloat(workBalanceElement.value);
            workBalanceElement.value = 0;
        // if there is outstanding loan, 10% of salary must go to paying of loan
        } else {
            const temp = 0.10 * parseFloat(workBalanceElement.value);
            workBalanceElement.value = 0;
            loanBalanceElement.value = parseFloat(loanBalanceElement.value) - temp;
            bankBalanceElement.value = parseFloat(bankBalanceElement.value) + (parseFloat(workBalanceElement.value) - temp);
        }       
    } else {
        alert("You have no money to transfer! Get working")
    }
}

// // function to buy a laptop
// function buyLaptop() {
//     // check if person has enough money to buy laptop
//     if (parseFloat(bankBalanceElement.value) >= parseFloat(priceElement.value)) {
//         alert("You are now the proud new owner of " + laptop.title);
//         bankBalanceElement.value = parseFloat(bankBalanceElement.value) - parseFloat(priceElement.value);
//     } else {
//         alert("You do not have enough money to buy " + laptop.title + " :( Get working or take a loan!")
//     }
// }
