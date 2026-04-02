// Lógica da Tela do Módulo Acadêmico

document.addEventListener('DOMContentLoaded', () => {
    carregarCategoriasSelects();
    carregarCursosSelects();
    carregarModulosSelects();
    renderizarCategorias();
    renderizarCursos();
});

// Eventos de Formulários
document.getElementById('formCategoria').addEventListener('submit', btnSalvarCategoria);
document.getElementById('formTrilha').addEventListener('submit', btnSalvarTrilha);
document.getElementById('formCurso').addEventListener('submit', btnSalvarCurso);
document.getElementById('formModulo').addEventListener('submit', btnSalvarModulo);
document.getElementById('formAula').addEventListener('submit', btnSalvarAula);
document.getElementById('filtroCursoCategoria').addEventListener('change', btnFiltrarCursos);

function gerarId(tabela) {
    const itens = listarRegistros(tabela);
    return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
}

function btnSalvarCategoria(e) {
    e.preventDefault();
    const nome = document.getElementById('catNome').value;
    const desc = document.getElementById('catDesc').value;
    
    const novaCat = new Categoria(gerarId('categorias'), nome, desc);
    inserirRegistro('categorias', novaCat);
    
    alert('Categoria salva com sucesso!');
    document.getElementById('formCategoria').reset();
    carregarCategoriasSelects();
    renderizarCategorias();
}

function btnSalvarTrilha(e) {
    e.preventDefault();
    const titulo = document.getElementById('triTitulo').value;
    const idCategoria = document.getElementById('triCategoria').value;
    
    const novaTri = new Trilha(gerarId('trilhas'), titulo, '', parseInt(idCategoria));
    inserirRegistro('trilhas', novaTri);
    
    alert('Trilha salva com sucesso!');
    document.getElementById('formTrilha').reset();
}

function btnSalvarCurso(e) {
    e.preventDefault();
    const titulo = document.getElementById('curTitulo').value;
    const idCat = parseInt(document.getElementById('curCategoria').value);
    const nivel = document.getElementById('curNivel').value;
    
    // Passando o ID do Usuario instanciador (Neste lab estamos simulando entao pode ser null/0)
    const novoCurso = new Curso(gerarId('cursos'), titulo, '', 0, idCat, nivel, 0, 0);
    inserirRegistro('cursos', novoCurso);
    
    alert('Curso salvo com sucesso!');
    document.getElementById('formCurso').reset();
    carregarCursosSelects();
    renderizarCursos();
}

function btnSalvarModulo(e) {
    e.preventDefault();
    const idCurso = parseInt(document.getElementById('modCurso').value);
    const titulo = document.getElementById('modTitulo').value;
    const ordem = parseInt(document.getElementById('modOrdem').value);
    
    const mod = new Modulo(gerarId('modulos'), idCurso, titulo, ordem);
    inserirRegistro('modulos', mod);
    
    alert('Módulo salvo com sucesso!');
    document.getElementById('formModulo').reset();
    carregarModulosSelects();
}

function btnSalvarAula(e) {
    e.preventDefault();
    const idModulo = parseInt(document.getElementById('aulaModulo').value);
    const titulo = document.getElementById('aulaTitulo').value;
    const ordem = parseInt(document.getElementById('aulaOrdem').value);
    const duracao = parseInt(document.getElementById('aulaDuracao').value);
    
    const aula = new Aula(gerarId('aulas'), idModulo, titulo, 'Vídeo', '', duracao, ordem);
    inserirRegistro('aulas', aula);
    
    alert('Aula salva com sucesso!');
    document.getElementById('formAula').reset();
}

// Funções de Renderização UI (Atualizar listas)
function carregarCategoriasSelects() {
    const cats = listarRegistros('categorias');
    let html = '<option value="">Sem Categoria</option>';
    cats.forEach(c => { html += `<option value="${c.idCategoria}">${c.nome}</option>`; });
    
    document.getElementById('triCategoria').innerHTML = html;
    document.getElementById('curCategoria').innerHTML = html;
    
    let htmlFiltro = '<option value="">Todas</option>';
    cats.forEach(c => { htmlFiltro += `<option value="${c.idCategoria}">${c.nome}</option>`; });
    document.getElementById('filtroCursoCategoria').innerHTML = htmlFiltro;
}

function carregarCursosSelects() {
    const cursos = listarRegistros('cursos');
    let html = '';
    cursos.forEach(c => { html += `<option value="${c.idCurso}">${c.titulo}</option>`; });
    document.getElementById('modCurso').innerHTML = html;
}

function carregarModulosSelects() {
    const modulos = listarRegistros('modulos');
    const cursos = listarRegistros('cursos');
    let html = '';
    modulos.forEach(m => { 
        const cNome = cursos.find(c => c.idCurso === m.idCurso)?.titulo || 'Desc';
        html += `<option value="${m.idModulo}">[${cNome}] ${m.titulo}</option>`; 
    });
    document.getElementById('aulaModulo').innerHTML = html;
}

function renderizarCategorias() {
    const tbody = document.getElementById('listaCategorias');
    const cats = listarRegistros('categorias');
    tbody.innerHTML = cats.map(c => `<tr><td>${c.idCategoria}</td><td>${c.nome}</td><td>${c.descricao || ''}</td></tr>`).join('');
}

function renderizarCursos(filtroIdCat = null) {
    const tbody = document.getElementById('listaCursos');
    let cursos = listarRegistros('cursos');
    const cats = listarRegistros('categorias');
    
    if (filtroIdCat) {
        cursos = cursos.filter(c => c.idCategoria === parseInt(filtroIdCat));
    }
    
    tbody.innerHTML = cursos.map(c => {
        const catNome = cats.find(x => x.idCategoria === c.idCategoria)?.nome || '-';
        return `<tr><td>${c.idCurso}</td><td>${c.titulo}</td><td>${catNome}</td><td>${c.nivel}</td></tr>`;
    }).join('');
}

function btnFiltrarCursos() {
    const idCat = document.getElementById('filtroCursoCategoria').value;
    renderizarCursos(idCat);
}
