document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarioInfo();
    carregarCursosDisponiveis();
    renderizarMeusCursos();
});

function carregarUsuarioInfo() {
    const el = document.getElementById('infoPainelAluno');
    if(!el) return;

    if(!window.obterUsuarioLogado) return;
    const usu = window.obterUsuarioLogado();
    
    if(usu) {
        el.innerHTML = `<h4>Bem-vindo(a), ${usu.nomeCompleto}</h4><p>Gerencie seus cursos e emita seus certificados abaixo.</p>`;
    } else {
        el.innerHTML = `<h4 class="text-danger">Você não está logado!</h4><p>Por favor, vá para a tela de Contato e faça login.</p>`;
    }
}

function carregarCursosDisponiveis() {
    const select = document.getElementById('selectCursoMatricula');
    if(!select) return;

    const cursos = CursoService.listarCursos();
    let html = '<option value="">-- Selecione um Curso para Matricular --</option>';
    cursos.forEach(c => { html += `<option value="${c.idCurso}">${c.titulo}</option>`; });
    select.innerHTML = html;
}

window.btnMatricular = function() {
    const usu = window.obterUsuarioLogado ? window.obterUsuarioLogado() : null;
    if(!usu) {
        alert("Efetue o login para se matricular!");
        return;
    }

    const idCurso = document.getElementById('selectCursoMatricula').value;
    if(!idCurso) return;

    try {
        UsuarioService.matricularUsuario(usu.idUsuario, idCurso);
        alert('Matrícula realizada com sucesso!');
        renderizarMeusCursos();
    } catch (error) {
        alert(error.message);
    }
}

function renderizarMeusCursos() {
    const divAccordion = document.getElementById('listaMeusCursos');
    if(!divAccordion) return;

    const usu = window.obterUsuarioLogado ? window.obterUsuarioLogado() : null;
    if(!usu) {
        divAccordion.innerHTML = '<p>Faça login para ver seus cursos matriculados.</p>';
        return;
    }

    const matriculas = UsuarioService.listarMatriculas(usu.idUsuario);
    const todosCursos = CursoService.listarCursos();
    
    let html = '';

    matriculas.forEach(mat => {
        const cur = todosCursos.find(c => c.idCurso === mat.idCurso);
        if(!cur) return;

        const modulos = CursoService.listarModulos(cur.idCurso);
        let htmlAulas = '';
        let totalAulasCur = 0;
        let concluidas = 0;

        modulos.forEach(mod => {
            htmlAulas += `<h6 class="mt-3">${mod.titulo}</h6><ul class="list-group">`;
            const aulas = CursoService.listarAulas(mod.idModulo);
            
            aulas.forEach(a => {
                totalAulasCur++;

                const progressos = UsuarioService.listarProgressos(usu.idUsuario);
                const isConcluida = progressos.find(p => p.idAula === a.idAula && p.status === 'Concluído');
                if(isConcluida) concluidas++;

                htmlAulas += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${a.titulo}
                        <input class="form-check-input ms-2" type="checkbox" ${isConcluida ? 'checked disabled' : ''} onclick="window.btnMarcarAula(${a.idAula})">
                    </li>
                `;
            });
            htmlAulas += `</ul>`;
        });

        let botaoCertificado = '';
        if(totalAulasCur > 0 && concluidas === totalAulasCur) {
            botaoCertificado = `<button class="btn btn-success mt-3" onclick="window.btnGerarCertificado(${cur.idCurso}, '${cur.titulo}')">Baixar Certificado</button>`;
        }

        html += `
            <div class="accordion-item mb-2">
                <h2 class="accordion-header" id="heading${cur.idCurso}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${cur.idCurso}">
                        <strong>Curso:</strong> &nbsp; ${cur.titulo} &nbsp; | &nbsp; Progresso: ${concluidas}/${totalAulasCur}
                    </button>
                </h2>
                <div id="collapse${cur.idCurso}" class="accordion-collapse collapse" data-bs-parent="#listaMeusCursos">
                    <div class="accordion-body">
                        ${htmlAulas}
                        ${botaoCertificado}
                    </div>
                </div>
            </div>
        `;
    });

    divAccordion.innerHTML = html || '<p>Você ainda não possui matrículas.</p>';
}

window.btnMarcarAula = function(idAula) {
    const usu = window.obterUsuarioLogado();
    UsuarioService.marcarProgressoAula(usu.idUsuario, idAula);
    renderizarMeusCursos();
}

window.btnGerarCertificado = function(idCurso, tituloCurso) {
    const usu = window.obterUsuarioLogado();
    const cert = UsuarioService.gerarCertificado(usu.idUsuario, idCurso);

    document.getElementById('certNome').innerText = usu.nomeCompleto;
    document.getElementById('certCurso').innerText = tituloCurso;
    document.getElementById('certCodigo').innerText = cert.codigoVerificacao;
    
    new bootstrap.Modal(document.getElementById('modalCertificado')).show();
}
