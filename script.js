const transactioUl = document.querySelector("#transactions");
const despesasDisplay = document.querySelector("#money-minus");
const receitaDisplay = document.querySelector("#money-plus");
const saldoDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));

let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [];


const removeTransaction = (idDelete) => {
    transactions = transactions.filter(({ id }) => id !== idDelete)
    updateLocalStorange();
    init();
}

const addTransactionIntoDOM = ({ id, nome, amount }) => {
    const operator = amount < 0 ? "-" : "+";
    const CSSClass = amount < 0 ? "minus" : "plus";
    const li = document.createElement("li");
    const amountWithoutOperator = Math.abs(amount);

    li.classList.add(CSSClass);
    li.innerHTML = `${nome} <span>${operator} R$${amountWithoutOperator} </span> 
						<button class="delete-btn" onclick="removeTransaction(${id})">
							x
						</button>`;
    transactioUl.append(li);
};

const getReceitas = transactionsAmaunt =>
    transactionsAmaunt
    .filter((amount) => amount > 0)
    .reduce((total, amount) => total + amount, 0)
    .toFixed(2);


const getDespesas = transactionsAmaunt => Math.abs(
    transactionsAmaunt
    .filter((amount) => amount < 0)
    .reduce((total, amount) => total + amount, 0)
).toFixed(2);

const getSaldo = transactionsAmaunt =>
    transactionsAmaunt
    .reduce((total, amount) => total + amount, 0)
    .toFixed(2);

const createTransaction = (despesas, receitas, saldo) => {
    despesasDisplay.textContent = `R$: ${despesas}`;
    receitaDisplay.textContent = `R$: ${receitas}`;
    saldoDisplay.textContent = `R$: ${saldo}`;
}

const updadeBalenceValues = () => {
    const transactionsAmaunt = transactions.map(({ amount }) => amount);

    const receitas = getReceitas(transactionsAmaunt);
    const despesas = getDespesas(transactionsAmaunt);
    const saldo = getSaldo(transactionsAmaunt);

    createTransaction(despesas, receitas, saldo);
};

const init = () => {
    transactioUl.innerHTML = "";
    transactions.forEach(addTransactionIntoDOM);
    updadeBalenceValues();
};


const updateLocalStorange = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
const genarateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    const transaction = {
        id: genarateID(),
        nome: transactionName,
        amount: Number(transactionAmount),
    };
    transactions.push(transaction);
}

const cleanInputs = () => {
    inputTransactionName.value = "";
    inputTransactionAmount.value = "";
}

const handleFormSubmit = () => {
    event.preventDefault();
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    console.log({ transactionName, transactionAmount });
    const isSomeInputEmpty = !transactionName || !transactionAmount;

    if (isSomeInputEmpty) {
        alert("Por favor, preencha tanto o nome quanto o valor da transação");
        return;
    }
    addToTransactionsArray(transactionName, transactionAmount);
    updateLocalStorange();
    init();
    cleanInputs();

};


init();
form.addEventListener("submit", handleFormSubmit)