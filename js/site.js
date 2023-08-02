function getValues() {

    let mortgageObj = {
        loanAmount: 0,
        loanTerm: 0,
        interestRate: 0
    };

    mortgageObj.loanAmount = parseInt(
        document.getElementById("loanAmount").value
    );
    mortgageObj.loanTerm = parseInt(
        document.getElementById("termMonths").value
    );
    mortgageObj.interestRate = parseInt(
        document.getElementById("interestRate").value
    );

    if (isNaN(loan) == true || isNaN(term) == true || isNaN(rate) == true){
        Swal.fire('No special characters; only numbers')
    }

    calcPayment(mortgageObj);
    generate(mortgageObj);
    displayTable(payments);
    displayTotals(payments);
}

// calc total monthly payment
function calcPayment(mortgageObj) {
    let theLoanAmount = mortgageObj.loanAmount;
    let theLoanTerm = mortgageObj.loanTerm;
    let theInterestRate = mortgageObj.interestRate;

    let totalMonthlyPayment = '';
    totalMonthlyPayment = (theLoanAmount * (theInterestRate / 1200)) / (1 - (1 + (theInterestRate / 1200)) ** -theLoanTerm);
    totalMonthlyPayment = mortgageObj;
    return mortgageObj;
}


function generate(mortgageObj) {
    // make a new payments array
    let payments = [];
    //set empty initial values to give to each payment obj
    let balance = mortgageObj.loanAmount;
    let totalInterest = 0;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    let totalMonthlyPayment = (loan * (rate / 1200)) / (1 - (1 + (rate / 1200)) ** -term);

    for (let month = 1; month <= mortgageObj.loanTerm; month++) {

        monthlyInterest = (balance * (mortgageObj.interestRate / 1200));

        totalInterest = totalInterest + monthlyInterest;

        monthlyPrincipal = totalMonthlyPayment - monthlyInterest;

        balance = balance - Math.abs(monthlyPrincipal);

        let tableObj = {
            monthNumber: month,
            payment: totalMonthlyPayment,
            principal: monthlyPrincipal,
            monthlyInterest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balance
        };

        payments.push(tableObj);
    }
    return payments;
}

function displayTable(payments) {
    const paymentTable = document.getElementById('calculations-table');
    const paymentTemplate = document.getElementById('table-row-template');

    paymentTable.innerHTML = '';
    
    for (let i = 0; i < payments.length; i++) {
        let row = payments[i];
        let tableRow = paymentTemplate.content.cloneNode(true);

        tableRow.querySelector('[data-id="month"]').innerText = row.monthNumber;
        tableRow.querySelector('[data-id="payment"]').innerText = row.payment;
        tableRow.querySelector('[data-id="principal"]').innerText = row.principal;
        tableRow.querySelector('[data-id="interest"]').innerText = row.monthlyInterest;
        tableRow.querySelector('[data-id="totalInterest"]').innerText = row.totalInterest;
        tableRow.querySelector('[data-id="balance"]').innerText = row.balance;

        paymentTable.appendChild(tableRow);
    }

}

function displayTotals(payments) {
    document.getElementById("monthlyPay").innerHTML = payments;
    document.getElementById('totalPrinciple').innerHTML = payments;
    document.getElementById('totalInterest').innerHTML = payments;
    document.getElementById('totalCost').innerText = payments;
}