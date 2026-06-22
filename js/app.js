// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('destinations-grid');
    const modal = document.getElementById('modal-destination');
    const btnAdd = document.getElementById('btn-add-destination');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('form-destination');
    const modalTitle = document.getElementById('modal-title');
    const srAnnouncer = document.getElementById('sr-announcer');
    const searchInput = document.getElementById('search-dest');

    let currentFilter = '';

    function announce(message) {
        if(srAnnouncer) {
            srAnnouncer.textContent = message;
        }
    }

    function renderDestinations() {
        let dests = Storage.getDestinations();
        
        if (currentFilter) {
            dests = dests.filter(d => 
                d.name.toLowerCase().includes(currentFilter.toLowerCase()) || 
                d.country.toLowerCase().includes(currentFilter.toLowerCase())
            );
        }

        grid.innerHTML = '';

        if (dests.length === 0) {
            if (currentFilter) {
                grid.innerHTML = '<div class="empty-state card" style="grid-column: 1 / -1;"><h3>Nenhum resultado</h3><p>Não encontramos destinos correspondentes à sua busca.</p></div>';
            } else {
                grid.innerHTML = '<div class="empty-state card" style="grid-column: 1 / -1;"><h3>Nenhum destino ainda</h3><p>Clique em "Novo Destino" para começar a planejar!</p></div>';
            }
            return;
        }

        dests.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const imgUrl = dest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

            card.innerHTML = `
                <div class="card-img" style="background-image: url('${imgUrl}')" role="img" aria-label="Imagem de ${dest.name}"></div>
                <div class="card-content">
                    <h3>${dest.name} - ${dest.country}</h3>
                    <p>📅 ${formatDate(dest.date)}</p>
                    <p>💰 Orçamento: ${formatCurrency(dest.budget)}</p>
                    <div class="card-actions" style="margin-top: auto;">
                        <button class="btn primary small btn-details" data-id="${dest.id}" aria-label="Abrir detalhes de ${dest.name}">Abrir</button>
                        <button class="btn small btn-edit" data-id="${dest.id}" aria-label="Editar ${dest.name}">Editar</button>
                        <button class="btn danger small btn-delete" data-id="${dest.id}" aria-label="Excluir ${dest.name}">Excluir</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.href = `details.html?id=${id}`;
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openModal(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este destino?')) {
                    deleteDestination(id);
                }
            });
        });
    }

    function openModal(id = null) {
        modal.classList.remove('hidden');
        if (id) {
            modalTitle.textContent = 'Editar Destino';
            const dests = Storage.getDestinations();
            const dest = dests.find(d => d.id === id);
            if (dest) {
                document.getElementById('dest-id').value = dest.id;
                document.getElementById('dest-name').value = dest.name;
                document.getElementById('dest-country').value = dest.country;
                document.getElementById('dest-date').value = dest.date;
                document.getElementById('dest-budget').value = dest.budget;
                document.getElementById('dest-image').value = dest.image || '';
            }
        } else {
            modalTitle.textContent = 'Adicionar Destino';
            form.reset();
            document.getElementById('dest-id').value = '';
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
        form.reset();
    }

    function deleteDestination(id) {
        let dests = Storage.getDestinations();
        dests = dests.filter(d => d.id !== id);
        Storage.saveDestinations(dests);
        
        // Also delete related expenses
        let exps = Storage.getExpenses();
        exps = exps.filter(e => e.destinationId !== id);
        Storage.saveExpenses(exps);

        renderDestinations();
        announce('Destino excluído com sucesso.');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('dest-id').value;
        const newDest = {
            id: id || generateId(),
            name: document.getElementById('dest-name').value,
            country: document.getElementById('dest-country').value,
            date: document.getElementById('dest-date').value,
            budget: parseFloat(document.getElementById('dest-budget').value),
            image: document.getElementById('dest-image').value
        };

        let dests = Storage.getDestinations();
        if (id) {
            const index = dests.findIndex(d => d.id === id);
            if (index > -1) dests[index] = newDest;
        } else {
            dests.push(newDest);
        }

        Storage.saveDestinations(dests);
        closeModal();
        renderDestinations();
        announce(id ? 'Destino atualizado com sucesso.' : 'Novo destino criado com sucesso.');
    });

    btnAdd.addEventListener('click', () => {
        openModal();
        setTimeout(() => document.getElementById('dest-name').focus(), 100);
    });
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter = e.target.value;
            renderDestinations();
        });
    }

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    renderDestinations();
});
