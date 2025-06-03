const apiUrl = 'http://127.0.0.1:3000/api/despesas';

const form = document.getElementById('form-despesa');
const tabela = document.getElementById('tabela-despesas');
const totalSpan = document.getElementById('total');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const categoria = document.getElementById('categoria').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const descricao = document.getElementById('descricao').value;

    const despesa = { data, categoria, valor, descricao };

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(despesa)
        });

        form.reset();
        carregarDespesas();
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
    }
});

async function carregarDespesas() {
    try {
        const resposta = await fetch(apiUrl);
        const despesas = await resposta.json();

        tabela.innerHTML = '';
        let total = 0;

        despesas.forEach(d => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${new Date(d.data).toLocaleDateString('pt-BR')}</td>
                <td>${d.categoria}</td>
                <td>R$ ${Number(d.valor).toFixed(2)}</td>
                <td>${d.descricao || ''}</td>
                <td>
                    <button onclick="removerDespesa(${d.id})">Excluir</button>
                </td>
            `;

            tabela.appendChild(tr);
            total += parseFloat(d.valor);
        });

        totalSpan.textContent = total.toFixed(2);
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }
}

async function removerDespesa(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        carregarDespesas();
    } catch (error) {
        console.error('Erro ao remover despesa:', error);
    }
}

// Carregar despesas ao abrir a página
carregarDespesas();
