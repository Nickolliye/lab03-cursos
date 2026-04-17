document.addEventListener('DOMContentLoaded', () => {
    carregarUsuariosSelect();
});

const formUsuario = document.getElementById('formUsuario');
if(formUsuario) {
    formUsuario.addEventListener('submit', btnSalvarUsuario);
}

function btnSalvarUsuario(e) {
    e.preventDefault();
    const nome = document.getElementById('usuNome').value;
    const email = document.getElementById('usuEmail').value;
    const senha = document.getElementById('usuSenha').value;
    
    try {
        UsuarioService.salvarUsuario(nome, email, senha);
        alert('Usuário cadastrado com sucesso!');
        formUsuario.reset();
        carregarUsuariosSelect();
    } catch (error) {
        alert(error.message);
    }
}

function carregarUsuariosSelect() {
    const selectLogin = document.getElementById('selectLogin');
    if(!selectLogin) return;

    const usuarios = UsuarioService.listarUsuarios();
    let html = '<option value="">-- Selecione o Usuário Logado (Simulação) --</option>';
    usuarios.forEach(u => { html += `<option value="${u.idUsuario}">${u.nomeCompleto} (${u.email})</option>`; });
    selectLogin.innerHTML = html;

    const logado = localStorage.getItem('usuarioLogadoId');
    if(logado) {
        selectLogin.value = logado;
    }
}

function btnEntrar() {
    const selectLogin = document.getElementById('selectLogin');
    if(!selectLogin) return;

    const id = selectLogin.value;
    if(!id) {
        localStorage.removeItem('usuarioLogadoId');
        alert('Você saiu do sistema (usuário deslogado).');
        return;
    }
    
    localStorage.setItem('usuarioLogadoId', id);
    alert('Sessão simulada com o usuário selecionado!');
}

window.obterUsuarioLogado = function() {
    const id = localStorage.getItem('usuarioLogadoId');
    if(!id) return null;
    const usuarios = UsuarioService.listarUsuarios();
    return usuarios.find(u => u.idUsuario === parseInt(id));
};
