const Storage = {
    getDestinations() {
        return JSON.parse(localStorage.getItem('destinations') || '[]');
    },
    saveDestinations(destinations) {
        localStorage.setItem('destinations', JSON.stringify(destinations));
    },
    getExpenses() {
        return JSON.parse(localStorage.getItem('expenses') || '[]');
    },
    saveExpenses(expenses) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
};

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString) {
    if(!dateString) return '';
    const date = new Date(dateString + 'T12:00:00'); // to avoid timezone shifting
    return new Intl.DateTimeFormat('pt-BR').format(date);
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
