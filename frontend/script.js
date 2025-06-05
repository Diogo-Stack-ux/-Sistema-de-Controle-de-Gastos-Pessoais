let graficoCategoria;
let graficoMensal;

const apiUrl = 'http://127.0.0.1:3000/api/despesas';
const form = document.getElementById('form-despesa');
const tabela = document.getElementById('tabela-despesas');
const totalSpan = document.getElementById('total');

let despesaEditandoId = null;

// ✅ Evento de adicionar ou editar
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const categoria = document.getElementById('categoria').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const descricao = document.getElementById('descricao').value;

    const despesa = { data, categoria, valor, descricao };

    try {
        if (despesaEditandoId) {
            // EDITAR
            await fetch(`${apiUrl}/${despesaEditandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(despesa)
            });
            despesaEditandoId = null;
        } else {
            // ADICIONAR
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(despesa)
            });
        }

        form.reset();
        carregarDespesas();
    } catch (error) {
        console.error('Erro ao salvar despesa:', error);
    }
});

// ✅ Carregar despesas
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
                   <button onclick="editarDespesa(${d.id}, '${d.data}', '${d.categoria}', ${d.valor}, '${d.descricao || ''}')">Editar</button>
                   <button onclick="removerDespesa(${d.id})">Excluir</button>
                </td>
            `;

            tabela.appendChild(tr);
            total += parseFloat(d.valor);
        });

        totalSpan.innerText = `Total: R$ ${total.toFixed(2)}`;

        gerarGraficos(despesas);

    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
    }
}

// ✅ Remover despesa
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

// ✅ Editar despesa
function editarDespesa(id, data, categoria, valor, descricao) {
    document.getElementById('data').value = data;
    document.getElementById('categoria').value = categoria;
    document.getElementById('valor').value = valor;
    document.getElementById('descricao').value = descricao;
    despesaEditandoId = id;
}

// ✅ Filtros
function aplicarFiltros() {
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value.trim().toLowerCase();

    const linhas = tabela.querySelectorAll('tr');

    linhas.forEach(linha => {
        const colunas = linha.querySelectorAll('td');
        if (colunas.length === 0) return;

        const dataTexto = colunas[0].innerText;
        const categoriaTexto = colunas[1].innerText.toLowerCase();

        let mostrar = true;

        if (filtroMes) {
            const [anoFiltro, mesFiltro] = filtroMes.split('-');
            const [dia, mes, ano] = dataTexto.split('/');

            if (ano !== anoFiltro || mes !== mesFiltro) {
                mostrar = false;
            }
        }

        if (filtroCategoria && !categoriaTexto.includes(filtroCategoria)) {
            mostrar = false;
        }

        linha.style.display = mostrar ? '' : 'none';
    });
}

function limparFiltros() {
    document.getElementById('filtroMes').value = '';
    document.getElementById('filtroCategoria').value = '';

    const linhas = tabela.querySelectorAll('tr');
    linhas.forEach(linha => {
        linha.style.display = '';
    });
}

// ✅ Gráficos
function gerarGraficos(despesas) {
    // Gráfico por categoria
    const categorias = {};
    despesas.forEach(d => {
        const cat = d.categoria;
        categorias[cat] = (categorias[cat] || 0) + parseFloat(d.valor);
    });

    const categoriasLabels = Object.keys(categorias);
    const categoriasValores = Object.values(categorias);

    if (graficoCategoria) graficoCategoria.destroy();

    graficoCategoria = new Chart(document.getElementById('graficoCategoria'), {
        type: 'pie',
        data: {
            labels: categoriasLabels,
            datasets: [{
                label: 'Gastos por Categoria',
                data: categoriasValores,
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff9f40'
                ]
            }]
        }
    });

    // Gráfico por mês
    const meses = {};
    despesas.forEach(d => {
        const data = new Date(d.data);
        const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
        meses[mesAno] = (meses[mesAno] || 0) + parseFloat(d.valor);
    });

    const mesesLabels = Object.keys(meses);
    const mesesValores = Object.values(meses);

    if (graficoMensal) graficoMensal.destroy();

    graficoMensal = new Chart(document.getElementById('graficoMensal'), {
        type: 'bar',
        data: {
            labels: mesesLabels,
            datasets: [{
                label: 'Gastos por Mês',
                data: mesesValores,
                backgroundColor: '#36a2eb'
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// 🚀 Carregar despesas quando abre a página
carregarDespesas();
