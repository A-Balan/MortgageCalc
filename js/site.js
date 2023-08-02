// get numbers from inputs
function getValues() {
    // get values from each input
    let loanAmount = document.getElementById('amount').value;
    let loanLength = document.getElementById('term').value;
    let loanInterest = document.getElementById('rate').value;

    loanAmount = parseFloat(loanAmount);
    loanLength = parseInt(loanLength);
    loanInterest = parseFloat(loanInterest);

    // validate it-make sure values make sense
    if (/*nums dont make sense*/isNaN(loanAmount) || isNaN(loanLength) || isNaN(loanInterest) || loanAmount <= 0 || loanLength <= 0 || loanInterest <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: 'Please enter numbers only'
        });
    } else {
        // do something with inputs
        let loanTotals = calculateTotals(loanAmount, loanLength, loanInterest);
        displayTotals(loanTotals.monthlyPayment, loanAmount, loanTotals.totalInterest, loanTotals.totalCost);

        // need to call arguments so this function can use them - here's our array back
        let payments = calculatePayments(loanLength, loanTotals.monthlyPayment, loanAmount, loanInterest);
        // pass array of object to last function
        displayPayments(payments);
    }
}
// calc totals box
function calculateTotals(principal, term, rate) {
    // calc monthly payment
    let monthlyPayment = (principal * (rate / 1200)) / (1 - Math.pow((1 + rate / 1200), -term));
    // calc total cost
    let totalCost = monthlyPayment * term;
    // calc total interest (what i paid-what I borrowed)
    let totalInterest = totalCost - principal;

    let loanTotals = {
        monthlyPayment: monthlyPayment,
        totalCost: totalCost,
        totalInterest: totalInterest
    };
    return loanTotals;
}
// display totals for the loan
function displayTotals(monthlyPayment, principal, interest, cost) {
    // new object to turn number to currency
    let formatOptions = {
        style: 'currency',
        currency: 'USD'
    };
    document.getElementById('monthly-payment').textContent = monthlyPayment.toLocaleString('en-US', formatOptions);
    document.getElementById('total-principal').textContent = principal.toLocaleString('en-US', formatOptions);
    document.getElementById('total-interest').textContent = interest.toLocaleString('en-US', formatOptions);
    document.getElementById('total-cost').textContent = cost.toLocaleString('en-US', formatOptions);

}
// calc each month of payments in table
function calculatePayments(term, monthlyPayment, principal, rate) {
    // create for loop to calculate every month of payment

    // remaining balance starts as principal
    let remainingBalance = principal;
    let totalInterest = 0;
    let paymentsArray = [];

    for (let month = 1; month <= term; month += 1) {
        // inside for-loop, calc each column of table
        let interestPayment = remainingBalance * (rate / 1200);

        let principalPayment = monthlyPayment - interestPayment;

        totalInterest += interestPayment;

        remainingBalance -= principalPayment;

        // create an object to store 6 values
        let loanPayment = {
            month: month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            totalInterest: totalInterest,
            balance: remainingBalance
        };
        // put object into array that you created
        paymentsArray.push(loanPayment);
    }

    // return array to controller
    return paymentsArray;

}
// display each month of payments in the table
function displayPayments(payments) {
    const tableRowTemplate = document.getElementById('payment-row');
    const paymentsTable = document.getElementById('loan-table');

    // empty table content before making new table row
    paymentsTable.innerHTML = ''; 
    // for loops to get array items out
    for(let i = 0; i < payments.length; i++) {

        let currentMonthPayment = payments[i];
        /*
         let loanPayment = {
            month: month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            totalInterest: totalInterest,
            balance: remainingBalance
        };
        */

        let tableRow = tableRowTemplate.content.cloneNode(true);

        // this will return an array of selectors (just 1 query selector instead of 6)
        let tableCells = tableRow.querySelectorAll('td');

        let formatOptions = {
            style: 'currency',
            currency: 'USD'
        };
        // we want the first element of array td #1=[0]...
        tableCells[0].textContent = currentMonthPayment.month;
        tableCells[1].textContent = currentMonthPayment.payment.toLocaleString('en-US', formatOptions);
        tableCells[2].textContent = currentMonthPayment.principal.toLocaleString('en-US', formatOptions);
        tableCells[3].textContent = currentMonthPayment.interest.toLocaleString('en-US', formatOptions);
        tableCells[4].textContent = currentMonthPayment.totalInterest.toLocaleString('en-US', formatOptions);
        tableCells[5].textContent = Math.abs(currentMonthPayment.balance).toLocaleString('en-US', formatOptions);
        // <tr><td>/<td>.....</tr>

        // make the last row green to celebrate
        if (i == payments.length - 1) {
            tableRow.querySelector('tr').classList.add('table-success');
        }

        paymentsTable.appendChild(tableRow);
    }
    // stick them in glob of HTML
    // put glob on table


 }