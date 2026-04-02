// Lógica do Módulo de Alunos

let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuariosSelect();
});

document.getElementById('formUsuario').addEventListener('submit', btnSalvarUsuario);

function gerarId(tabela) {
    const itens = listarRegistros(tabela);
    return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
}

function btnSalvarUsuario(e) {
    e.preventDefault();
    const nome = document.getElementById('usuNome').value;
    const email = document.getElementById('usuEmail').value;
    const senha = document.getElementById('usuSenha').value; // Hash simplificado
    
    // Validacao extra de email (padrao html5 ja tem type=email), checando array
    if(listarRegistros('usuarios').find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    const usu = new Usuario(gerarId('usuarios'), nome, email, btoa(senha));
    inserirRegistro('usuarios', usu);
    
    alert('Usuário cadastrado!');
    document.getElementById('formUsuario').reset();
    carregarUsuariosSelect();
}

function carregarUsuariosSelect() {
    const usuarios = listarRegistros('usuarios');
    let html = '<option value="">-- Selecione o Usuário --</option>';
    usuarios.forEach(u => { html += `<option value="${u.idUsuario}">${u.nomeCompleto} (${u.email})</option>`; });
    document.getElementById('selectLogin').innerHTML = html;
}

function btnEntrar() {
    const id = document.getElementById('selectLogin').value;
    if(!id) return;
    
    const usuarios = listarRegistros('usuarios');
    usuarioLogado = usuarios.find(u => u.idUsuario === parseInt(id));
    
    document.getElementById('lblUsuLogado').innerText = usuarioLogado.nomeCompleto;
    document.getElementById('areaLogada').style.display = 'block';
    
    carregarCursosDisponiveis();
    renderizarMeusCursos();
}

function carregarCursosDisponiveis() {
    const cursos = listarRegistros('cursos');
    let html = '<option value="">Selecione o Curso</option>';
    cursos.forEach(c => { html += `<option value="${c.idCurso}">${c.titulo}</option>`; });
    document.getElementById('selectCursoMatricula').innerHTML = html;
}

function btnMatricular() {
    const idCurso = document.getElementById('selectCursoMatricula').value;
    if(!idCurso) return;
    
    const matriculas = listarRegistros('matriculas');
    if(matriculas.find(m => m.idUsuario === usuarioLogado.idUsuario && m.idCurso === parseInt(idCurso))) {
        alert('Você já matriculado neste curso!');
        return;
    }

    const mat = new Matricula(gerarId('matriculas'), usuarioLogado.idUsuario, parseInt(idCurso));
    inserirRegistro('matriculas', mat);
    
    alert('Matrícula realizada com sucesso!');
    renderizarMeusCursos();
}

function renderizarMeusCursos() {
    const minhasMats = listarRegistros('matriculas').filter(m => m.idUsuario === usuarioLogado.idUsuario);
    const todosCursos = listarRegistros('cursos');
    const aulas = listarRegistros('aulas');
    const modulos = listarRegistros('modulos');
    const progressos = listarRegistros('progressoAulas');
    
    const divAccordion = document.getElementById('listaMeusCursos');
    let html = '';

    minhasMats.forEach(mat => {
        const cur = todosCursos.find(c => c.idCurso === mat.idCurso);
        if(!cur) return;

        const modulosCurso = modulos.filter(m => m.idCurso === cur.idCurso);
        let htmlAulas = '';
        let totalAulasCur = 0;
        let concluidas = 0;

        modulosCurso.forEach(mod => {
            htmlAulas += `<h6>${mod.titulo}</h6><ul class="list-group mb-3">`;
            const aulasModulo = aulas.filter(a => a.idModulo === mod.idModulo);
            aulasModulo.forEach(a => {
                totalAulasCur++;
                const prog = progressos.find(p => p.idUsuario === usuarioLogado.idUsuario && p.idAula === a.idAula);
                const isConcluida = prog && prog.status === 'Concluído';
                if(isConcluida) concluidas++;

                htmlAulas += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${a.titulo}
                        <input type="checkbox" ${isConcluida ? 'checked disabled' : ''} onclick="btnMarcarAula(${a.idAula})">
                    </li>
                `;
            });
            htmlAulas += `</ul>`;
        });
        
        let botaoCertificado = '';
        if(totalAulasCur > 0 && concluidas === totalAulasCur) {
            botaoCertificado = `<button class="btn btn-success btn-sm mt-3" onclick="btnGerarCertificado(${cur.idCurso}, '${cur.titulo}')">Exibir Certificado</button>`;
        }

        html += `
            <div class="accordion-item mb-2">
                <h2 class="accordion-header" id="heading${cur.idCurso}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${cur.idCurso}">
                        Curso: ${cur.titulo} - Progresso: ${concluidas}/${totalAulasCur}
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

    divAccordion.innerHTML = html || '<p>Nenhuma matrícula encontrada.</p>';
}

function btnMarcarAula(idAula) {
    const progresso = new ProgressoAula(usuarioLogado.idUsuario, idAula, 'Concluído');
    inserirRegistro('progressoAulas', progresso);
    renderizarMeusCursos();
}

function btnGerarCertificado(idCurso, tituloCurso) {
    // Registra Certificado na memoria se nao existir
    const certsDB = listarRegistros('certificados');
    let cert = certsDB.find(c => c.idUsuario === usuarioLogado.idUsuario && c.idCurso === idCurso);
    
    if(!cert) {
        const cod = Math.random().toString(36).substring(2, 10).toUpperCase();
        cert = new Certificado(gerarId('certificados'), usuarioLogado.idUsuario, idCurso, null, cod);
        inserirRegistro('certificados', cert);
    }

    document.getElementById('certNome').innerText = usuarioLogado.nomeCompleto;
    document.getElementById('certCurso').innerText = tituloCurso;
    document.getElementById('certCodigo').innerText = cert.codigoVerificacao;
    
    new bootstrap.Modal(document.getElementById('modalCertificado')).show();
}
