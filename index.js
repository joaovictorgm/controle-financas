let transactions = [] 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm')
    const transactionList = document.getElementById('transactionList')
    const balanceAmount = document.getElementById('balanceAmount')

    //Atualiza a lista de transações e o saldo total
    const updateTransactionsAndBalance = async () => {
        const transactions = await fetch('http://localhost:3000/transactions').then(res => res.json())

        // Limpa a lista de transações
        transactionList.innerHTML = ''

        // Calcula o saldo total
        let totalBalance = 0

        transactions.forEach(transaction => {
            // Adiciona cada transação à lista
            const li = document.createElement('li')
            li.innerHTML = `<span>${transaction.name}</span> <span>${transaction.value}</span><button class="delete-button" data-id="${transaction.id}">Remover</button>`

            transactionList.appendChild(li)

            // Soma os valores para calcular o saldo total
            totalBalance += parseFloat(transaction.value)
        })

        // Atualiza o saldo total na tela
        balanceAmount.textContent = totalBalance.toFixed(2)

        //Adiciona os ouvintes de evento aos botões de exclusão
        const deleteButtons = document.querySelectorAll('.delete-button')
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const transactionId = button.dataset.id

                //Envia uma requisição DELETE para excluir a transação
            await fetch(`http://localhost:3000/transactions/${transactionId}`,{
                method: 'DELETE'
            })
            })
        })
    }

    // Formulário de envio de transação
    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const transactionName = document.getElementById('transactionName').value
        const transactionValue = document.getElementById('transactionValue').value

        // Envia a nova transação para o servidor
        await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: transactionName,
                value: transactionValue,
            })
        })

        //Atualiza a lista de transações e o saldo total
        updateTransactionsAndBalance()

        //Limpa o formulário
        form.reset()
    })

    // Atualiza a lista de transações e o saldo total ao carregar a página
    updateTransactionsAndBalance()
})
