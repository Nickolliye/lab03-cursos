class UsuarioService {
    static gerarId(tabela) {
        const itens = listarRegistros(tabela);
        return itens.length > 0 ? itens[itens.length - 1][Object.keys(itens[0])[0]] + 1 : 1;
    }

    static salvarUsuario(nome, email, senha) {
        if(listarRegistros('usuarios').find(u => u.email === email)) {
            throw new Error('E-mail já está cadastrado!');
        }
        const usu = new Usuario(this.gerarId('usuarios'), nome, email, btoa(senha));
        inserirRegistro('usuarios', usu);
        return usu;
    }

    static listarUsuarios() {
        return listarRegistros('usuarios');
    }

    static matricularUsuario(idUsuario, idCurso) {
        const matriculas = listarRegistros('matriculas');
        if(matriculas.find(m => m.idUsuario === parseInt(idUsuario) && m.idCurso === parseInt(idCurso))) {
            throw new Error('Usuário já matriculado neste curso!');
        }
        const mat = new Matricula(this.gerarId('matriculas'), parseInt(idUsuario), parseInt(idCurso));
        inserirRegistro('matriculas', mat);
        return mat;
    }

    static listarMatriculas(idUsuario) {
        return listarRegistros('matriculas').filter(m => m.idUsuario === parseInt(idUsuario));
    }

    static marcarProgressoAula(idUsuario, idAula) {
        const progresso = new ProgressoAula(parseInt(idUsuario), parseInt(idAula), 'Concluído');
        const progressos = listarRegistros('progressoAulas');
        const existe = progressos.find(p => p.idUsuario === parseInt(idUsuario) && p.idAula === parseInt(idAula));
        if(!existe) {
            inserirRegistro('progressoAulas', progresso);
        }
        return progresso;
    }

    static listarProgressos(idUsuario) {
        return listarRegistros('progressoAulas').filter(p => p.idUsuario === parseInt(idUsuario));
    }

    static gerarCertificado(idUsuario, idCurso) {
        const certsDB = listarRegistros('certificados');
        let cert = certsDB.find(c => c.idUsuario === parseInt(idUsuario) && c.idCurso === parseInt(idCurso));
        
        if(!cert) {
            const cod = Math.random().toString(36).substring(2, 10).toUpperCase();
            cert = new Certificado(this.gerarId('certificados'), parseInt(idUsuario), parseInt(idCurso), null, cod);
            inserirRegistro('certificados', cert);
        }
        return cert;
    }
}
