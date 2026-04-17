document.addEventListener('DOMContentLoaded', () => {

    if(document.getElementById('formCategoria')) {
        carregarCategoriasSelects();
        carregarCursosSelects();
        renderizarCursos();
    }
    
    if(document.getElementById('formTrilha')){
        carregarTrilhasSelect();
        renderizarTrilhas();
    }
});


const formCategoria = document.getElementById('formCategoria');
if(formCategoria) formCategoria.addEventListener('submit', btnSalvarCategoria);

const formCurso = document.getElementById('formCurso');
if(formCurso) formCurso.addEventListener('submit', btnSalvarCurso);

const formModulo = document.getElementById('formModulo');
if(formModulo) formModulo.addEventListener('submit', btnSalvarModulo);

const formAula = document.getElementById('formAula');
if(formAula) formAula.addEventListener('submit', btnSalvarAula);

function btnSalvarCategoria(e) {
    e.preventDefault();
    const nome = document.getElementById('catNome').value;
    const desc = document.getElementById('catDesc').value;
    CursoService.salvarCategoria(nome, desc);
    alert('Categoria salva!');
    formCategoria.reset();
    carregarCategoriasSelects();
}

function btnSalvarCurso(e) {
    e.preventDefault();
    const titulo = document.getElementById('curTitulo').value;
    const desc = document.getElementById('curDesc').value;
    const idCat = document.getElementById('curCategoria').value;
    const nivel = document.getElementById('curNivel').value;
    
    CursoService.salvarCurso(titulo, desc, idCat, nivel);
    alert('Curso salvo!');
    formCurso.reset();
    carregarCursosSelects();
    renderizarCursos();
}

function btnSalvarModulo(e) {
    e.preventDefault();
    const idCurso = document.getElementById('modCurso').value;
    const titulo = document.getElementById('modTitulo').value;
    const ordem = document.getElementById('modOrdem').value;
    
    CursoService.salvarModulo(idCurso, titulo, ordem);
    alert('Módulo salvo!');
    formModulo.reset();
    carregarModulosSelects();
}

function btnSalvarAula(e) {
    e.preventDefault();
    const idModulo = document.getElementById('aulaModulo').value;
    const titulo = document.getElementById('aulaTitulo').value;
    const ordem = document.getElementById('aulaOrdem').value;
    const duracao = document.getElementById('aulaDuracao').value;
    
    CursoService.salvarAula(idModulo, titulo, duracao, ordem);
    alert('Aula salva!');
    formAula.reset();
}

function carregarCategoriasSelects() {
    const cats = CursoService.listarCategorias();
    let html = '<option value="">Sem Categoria</option>';
    cats.forEach(c => { html += `<option value="${c.idCategoria}">${c.nome}</option>`; });
    
    if(document.getElementById('curCategoria')) document.getElementById('curCategoria').innerHTML = html;
    if(document.getElementById('filtroCursoCategoria')) {
        let htmlF = '<option value="">Todas</option>';
        cats.forEach(c => { htmlF += `<option value="${c.idCategoria}">${c.nome}</option>`; });
        document.getElementById('filtroCursoCategoria').innerHTML = htmlF;
    }
}

function carregarCursosSelects() {
    const cursos = CursoService.listarCursos();
    let html = '<option value="">Selecione o Curso</option>';
    cursos.forEach(c => { html += `<option value="${c.idCurso}">${c.titulo}</option>`; });
    
    if(document.getElementById('modCurso')) document.getElementById('modCurso').innerHTML = html;
}

window.carregarModulosSelects = function() {
    const idCurso = document.getElementById('modCurso').value || null;
    const modulos = CursoService.listarModulos();
    const cursos = CursoService.listarCursos();
    let html = '';
    modulos.forEach(m => { 
        const cNome = cursos.find(c => c.idCurso === m.idCurso)?.titulo || 'Desc';
        html += `<option value="${m.idModulo}">[${cNome}] ${m.titulo}</option>`; 
    });
    if(document.getElementById('aulaModulo')) document.getElementById('aulaModulo').innerHTML = html;
}

window.btnFiltrarCursos = function() {
    const idCat = document.getElementById('filtroCursoCategoria').value;
    renderizarCursos(idCat);
}

function renderizarCursos(filtroIdCat = null) {
    const listDiv = document.getElementById('listaCursosContainer');
    if(!listDiv) return;

    let cursos = CursoService.listarCursos(filtroIdCat);
    const cats = CursoService.listarCategorias();
    
    let html = '';
    cursos.forEach(c => {
        const catNome = cats.find(x => x.idCategoria === c.idCategoria)?.nome || 'Sem categoria';
        
        const imgSrc = c.imagem || './img/css.jpg';

        html += `
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
            <div class="card shadow-sm w-100 mb-4">
              <img src="${imgSrc}" class="card-img-top" alt="Imagem do curso ${c.titulo}" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary">${c.titulo}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Aulas: ${c.nivel} - ${catNome}</h6>
                <p class="card-text flex-grow-1">${c.descricao || 'Sem descrição cadastrada.'}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small class="text-muted">ID: ${c.idCurso}</small>
                  <a href="projetos.html" class="btn btn-outline-primary btn-sm">Ir para Matrícula</a>
                </div>
              </div>
            </div>
        </div>
        `;
    });
    
    listDiv.innerHTML = html || '<p>Nenhum curso encontrado no banco de dados.</p>';
}

const formTrilha = document.getElementById('formTrilha');
if(formTrilha) formTrilha.addEventListener('submit', btnSalvarTrilha);

function btnSalvarTrilha(e) {
    e.preventDefault();
    const titulo = document.getElementById('triTitulo').value;
    const desc = document.getElementById('triDesc').value;
    const idCat = document.getElementById('triCategoria').value;
    
    CursoService.salvarTrilha(titulo, desc, idCat);
    alert('Trilha salva com sucesso!');
    formTrilha.reset();
    renderizarTrilhas();
}

function carregarTrilhasSelect() {
    const cats = CursoService.listarCategorias();
    let html = '<option value="">Sem Categoria</option>';
    cats.forEach(c => { html += `<option value="${c.idCategoria}">${c.nome}</option>`; });
    
    if(document.getElementById('triCategoria')) {
        document.getElementById('triCategoria').innerHTML = html;
    }
}

function renderizarTrilhas() {
    const tbody = document.getElementById('listaTrilhas');
    if(!tbody) return;

    const trilhas = CursoService.listarTrilhas();
    const cats = CursoService.listarCategorias();

    let html = '';
    trilhas.forEach(t => {
        const catNome = cats.find(c => c.idCategoria === t.idCategoria)?.nome || 'N/A';
        html += `
            <tr>
                <td>${t.idTrilha}</td>
                <td>${t.titulo}</td>
                <td>${t.descricao || '-'}</td>
                <td><span class="badge bg-secondary">${catNome}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html || '<tr><td colspan="4" class="text-center">Nenhuma trilha encontrada.</td></tr>';
}
