// js/details.js

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const destId = params.get('id');

    if (!destId) {
        window.location.href = 'index.html';
        return;
    }

    const dests = Storage.getDestinations();
    const destination = dests.find(d => d.id === destId);

    if (!destination) {
        alert('Destino não encontrado!');
        window.location.href = 'index.html';
        return;
    }

    const infoSection = document.getElementById('destination-info');
    const expensesList = document.getElementById('expenses-list');
    const spentLabel = document.getElementById('spent-label');
    const budgetLabel = document.getElementById('budget-label');
    const progressBar = document.getElementById('progress-bar');
    const modal = document.getElementById('modal-expense');
    const btnAdd = document.getElementById('btn-add-expense');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('form-expense');
    const modalTitle = document.getElementById('expense-modal-title');
    const srAnnouncer = document.getElementById('sr-announcer');

    function announce(message) {
        if(srAnnouncer) {
            srAnnouncer.textContent = message;
        }
    }

    function renderInfo() {
        infoSection.innerHTML = `
            <div class="hero-card-info">
                <h2>${destination.name} - ${destination.country}</h2>
                <p>📅 ${formatDate(destination.date)}</p>
            </div>
            <div>
                <img src="${destination.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}" alt="${destination.name}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
            </div>
        `;
        budgetLabel.textContent = `Orçamento: ${formatCurrency(destination.budget)}`;
    }

    function renderExpenses() {
        const allExps = Storage.getExpenses();
        const destExps = allExps.filter(e => e.destinationId === destId);

        let totalSpent = 0;
        expensesList.innerHTML = '';

        if (destExps.length === 0) {
            expensesList.innerHTML = '<li class="empty-state">Nenhuma despesa registrada.</li>';
        } else {
            destExps.forEach(exp => {
                totalSpent += exp.amount;
                const li = document.createElement('li');
                li.className = 'list-item';
                li.innerHTML = `
                    <div class="list-item-info">
                        <strong>${exp.description} <span class="sr-only">Categoria:</span><span>${exp.category}</span></strong>
                        <div style="margin-top: 4px; font-weight: 600; color: var(--danger);" aria-label="Valor: ${formatCurrency(exp.amount)}">${formatCurrency(exp.amount)}</div>
                    </div>
                    <div>
                        <button class="btn small btn-edit-exp" data-id="${exp.id}" aria-label="Editar despesa ${exp.description}">Editar</button>
                        <button class="btn danger small btn-delete-exp" data-id="${exp.id}" aria-label="Excluir despesa ${exp.description}">Excluir</button>
                    </div>
                `;
                expensesList.appendChild(li);
            });
        }

        spentLabel.textContent = `Gasto: ${formatCurrency(totalSpent)}`;

        let progress = (totalSpent / destination.budget) * 100;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        if (progress >= 90) {
            progressBar.classList.add('danger-bg');
        } else {
            progressBar.classList.remove('danger-bg');
        }

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.btn-edit-exp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openModal(id);
            });
        });

        document.querySelectorAll('.btn-delete-exp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir esta despesa?')) {
                    deleteExpense(id);
                }
            });
        });
    }

    function openModal(id = null) {
        modal.classList.remove('hidden');
        if (id) {
            modalTitle.textContent = 'Editar Despesa';
            const exps = Storage.getExpenses();
            const exp = exps.find(e => e.id === id);
            if (exp) {
                document.getElementById('exp-id').value = exp.id;
                document.getElementById('exp-desc').value = exp.description;
                document.getElementById('exp-amount').value = exp.amount;
                document.getElementById('exp-category').value = exp.category;
            }
        } else {
            modalTitle.textContent = 'Adicionar Despesa';
            form.reset();
            document.getElementById('exp-id').value = '';
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
        form.reset();
    }

    function deleteExpense(id) {
        let exps = Storage.getExpenses();
        exps = exps.filter(e => e.id !== id);
        Storage.saveExpenses(exps);
        renderExpenses();
        announce('Despesa excluída com sucesso.');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('exp-id').value;
        const newExp = {
            id: id || generateId(),
            destinationId: destId,
            description: document.getElementById('exp-desc').value,
            amount: parseFloat(document.getElementById('exp-amount').value),
            category: document.getElementById('exp-category').value
        };

        let exps = Storage.getExpenses();
        if (id) {
            const index = exps.findIndex(e => e.id === id);
            if (index > -1) exps[index] = newExp;
        } else {
            exps.push(newExp);
        }

        Storage.saveExpenses(exps);
        closeModal();
        renderExpenses();
        announce(id ? 'Despesa atualizada com sucesso.' : 'Nova despesa criada com sucesso.');
    });

    btnAdd.addEventListener('click', () => {
        openModal();
        setTimeout(() => document.getElementById('exp-desc').focus(), 100);
    });
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    renderInfo();
    renderExpenses();
});
