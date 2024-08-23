document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coletar os dados do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = "As senhas não coincidem.";
        return;
    }

    // Limpar mensagens de erro anteriores
    document.getElementById('confirmPasswordError').textContent = "";

    // Enviar os dados para o servidor
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('registrationForm').reset(); // Reseta o formulário
            window.location.href = '/login.html'; // Redirecionar para a página de login
        } else {
            alert('Erro ao cadastrar o usuário: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar o usuário. Tente novamente.');
    });
});


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar o envio padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirecionar para uma página de sucesso
            window.location.replace('/index.html')
        } else {
            // Exibir mensagem de erro
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
