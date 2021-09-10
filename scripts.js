// declare variables from all needed HTML elements
const laptopsElement = document.getElementById("laptops");
const bankBalanceElement = document.getElementById("bank-balance");
const loanBalanceElement = document.getElementById("loan-balance");
const workBalanceElement = document.getElementById("work-balance");
const priceElement = document.getElementById("price");
const nameElement = document.getElementById("name");
const descriptionElement = document.getElementById("description");
const imageElement = document.getElementById("image");
const buyElement = document.getElementById("buy");
const specsElement = document.getElementById("specs");

// bool to check if person has bought laptop or not
let hasBoughtLaptop = false;

// bool to check if person has taken a loan
let hasTakenLoan = false;

// make empty laptops array to be used later
let laptops = [];

// get each computer from api
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptops(laptops))

// get titles for each laptop and add to laptopElement as option in Select
const addLaptopToSelect = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

// populate the select menu using addLaptopToSelect and show default values
const addLaptops = (laptops) => {
    laptops.forEach(x => addLaptopToSelect(x));
    setLaptopValues(laptops[0]);
    imageError(laptops[0]);
    loopThroughSpecs(laptops[0]);
}

// function to change laptop and show corresponding values
const selectLaptopChange = e => {
    specsElement.innerHTML = ""; // clear specs
    const selectedLaptop = laptops[e.target.selectedIndex];
    setLaptopValues(selectedLaptop);
    imageError(selectedLaptop);
    loopThroughSpecs(selectedLaptop);
}

// set laptop values to selected laptop
function setLaptopValues(selectedLaptop) {
    priceElement.innerText = selectedLaptop.price + " KR";
    nameElement.innerText = selectedLaptop.title;
    descriptionElement.innerText = selectedLaptop.description;
    imageElement.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`;
}

// loop through specs and add to specsElement
function loopThroughSpecs(selectedLaptop) {
    for (const spec of selectedLaptop.specs) {
        const specItem = document.createElement("li");
        specItem.innerText = spec;
        specsElement.appendChild(specItem);
    }
}

// if image does not work, show image of kitten
function imageError(selectedLaptop) {
    imageElement.onerror = function() { 
        alert(`Image of ${selectedLaptop.title} not found. Enjoy this image of a cat :)`)
        imageElement.src = "https://www.meme-arsenal.com/memes/bbbb950281d00566c68f1d23ff98fd1b.jpg"; 
    }
}

// event listener
laptopsElement.addEventListener("change", selectLaptopChange);

// function to get a loan
function getLoan() {
    // check if person already has a loan
    if (parseFloat(loanBalanceElement.value) > 0) {
        alert(`You cannot take a new loan before you have repayed your outstanding loan. ` +
            `You still need to repay ${loanBalanceElement.value} kr.`);
    // check if bank balance is 0
    } else if (parseFloat(bankBalanceElement.value) === 0) {
        alert("You cannot take loan when your bank balance is 0 kr! " + 
            "You should work a little before you take a loan :)")
    // check if user has already taken loan and not bought a laptop
    } else if (hasTakenLoan && !hasBoughtLaptop) {
        alert("You need to buy a laptop before you can take another loan!")
    }
    // if not, they can take a loan
    else {
        // ask how much user wants to loan
        const promptText = "How much would you like to loan?";
        let amount = prompt(promptText);
        while (true) {
            // check if user inputted number
            if(!isNaN(parseFloat(amount))) {
                // check if user is asking to loan too much
                if (parseFloat(amount) > (parseFloat(bankBalanceElement.value)*2)) {
                    amount = prompt(`You cannot loan more than double the amount for your bank balance. ` + 
                        `The amount you can currently loan is ${(parseFloat(bankBalanceElement.value))*2}` +
                        ` kr. \n ${promptText}`);
                // check if user is asking to loan 0 or less
                } else if (parseFloat(amount) <= 0) {
                    amount = prompt(`You cannot loan 0 kr or less. The amount you can currently loan is ` +
                        `${(parseFloat(bankBalanceElement.value))*2} kr. \n ${promptText}`);
                // if not, user can get a loan
                } else {
                    bankBalanceElement.value = parseFloat(bankBalanceElement.value) + parseFloat(amount);
                    loanBalanceElement.value = parseFloat(amount);
                    hasTakenLoan = true;
                    // make reapy loan button and loan amount appear
                    document.getElementById("repayloan-button").className = 'button'; 
                    document.getElementById("loan-amount").className = 'container-text'; 
                    break;
                }  
            // if user does not enter a number, prompt again
            } else {
                amount = prompt(`You need to enter a number. \n ${promptText}`);
            }
        }    
    }
}

// function to pay back loan - this button should only appear once user has taken a loan
function repayLoan() {
    // check if there is money in work balance
    if (parseFloat(workBalanceElement.value) === 0) {
        alert("You don't have any money to repay your loan! You need to work more to earn money.")
    // check if work balance is larger or equal to outstanding loan - then user can pay the whole loan down
    } else if (parseFloat(workBalanceElement.value) >= parseFloat(loanBalanceElement.value)) {
        workBalanceElement.value = parseFloat(workBalanceElement.value) - parseFloat(loanBalanceElement.value);
        loanBalanceElement.value = 0;
        alert("Congratulations, you repayed all your loan!!")
        // hide repay loan button
        document.getElementById("repayloan-button").className = 'hidden'; 
    // if not, there is less money in work blanace than outstanding loan
    } else {
        loanBalanceElement.value = parseFloat(loanBalanceElement.value) - parseFloat(workBalanceElement.value);
        workBalanceElement.value = 0;
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
        // if there is outstanding loan, 10% of salary must go to paying of loan
        if (parseFloat(loanBalanceElement.value) > 0) {
            const tenPercent = 0.10 * parseFloat(workBalanceElement.value);
            // check if loan balance becomes negative or not
            if (parseFloat(loanBalanceElement.value) - tenPercent >= 0) {
                loanBalanceElement.value = parseFloat(loanBalanceElement.value) - tenPercent;
                bankBalanceElement.value = parseFloat(bankBalanceElement.value) + (parseFloat(workBalanceElement.value) - tenPercent);
                workBalanceElement.value = 0;
            } else {
                // if 10% of work blanace is more than loan, find money left after paying down loan
                const difference = Math.abs(parseFloat(loanBalanceElement.value) - tenPercent);
                bankBalanceElement.value = parseFloat(bankBalanceElement.value) + (parseFloat(workBalanceElement.value) - tenPercent) + difference;
                workBalanceElement.value = 0;
                loanBalanceElement.value = 0;
            }
        // if no outstanding loan
        } else {
            bankBalanceElement.value = parseFloat(bankBalanceElement.value) + parseFloat(workBalanceElement.value);
            workBalanceElement.value = 0;
        }
    // if there is no money in work balance       
    } else {
        alert("You have no money to transfer! Get working")
    }
}

// function to buy a laptop
const buyLaptop = () => {
    const selectedLaptop = laptops[laptopsElement.selectedIndex];
    // use function to check if user has enough money
    if (UserHasEnoughMoneyForLaptop(selectedLaptop)) {
        alert(`You are now the proud owner of ${selectedLaptop.title}`);
        bankBalanceElement.value = parseFloat(bankBalanceElement.value) - parseFloat(selectedLaptop.price);
        hasBoughtLaptop = true;
    // if not, tell user to work more (or take a loan)
    } else {
        alert(`You do not have enough money to buy ${selectedLaptop.title} :( Get working or take a loan!`);
    }
}

// function to check if person has enough money to buy laptop
function UserHasEnoughMoneyForLaptop (selectedLaptop) {
    return parseFloat(bankBalanceElement.value) >= selectedLaptop.price;
}

// event listener
buyElement.addEventListener("click", buyElement)