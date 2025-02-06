const apiUrl = "http://localhost:8080/users";

//Função para buscar e exibir todos os usuários
async function fetchUsers() {
    try {
        const response = await fetch(`${apiUrl}/all?page=0&size=10`);
        if (!response.ok) throw new Error("Erro ao buscar usuários");

        const data = await response.json();
        const users = data.content || data; // Verifica se vem paginado ou como lista direta

        const userTable = document.getElementById("usersTableBody");
        userTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.birthDate}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-warning" onclick="editUser(${user.id}, '${user.firstName}', '${user.lastName}', '${user.birthDate}', '${user.email}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">Excluir</button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

//Função para criar um novo usuário
async function createUser() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDay = document.getElementById("birthDay").value.padStart(2, '0');
    const birthMonth = document.getElementById("birthMonth").value.padStart(2, '0');
    const birthYear = document.getElementById("birthYear").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!firstName || !lastName || !birthDay || !birthMonth || !birthYear || !email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    try {
        const response = await fetch(`${apiUrl}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, birthDate, email, password })
        });

        if (!response.ok) throw new Error("Erro ao criar usuário");

        alert("Usuário cadastrado com sucesso!");
        document.getElementById("register-form").reset();
        fetchUsers(); // Atualiza a lista automaticamente

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
    }
}

//Função para editar um usuário (abrir modal)
function editUser(id, firstName, lastName, birthDate, email) {
    document.getElementById("editUserId").value = id;
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;

    const [year, month, day] = birthDate.split("-");
    document.getElementById("editBirthDay").value = day;
    document.getElementById("editBirthMonth").value = month;
    document.getElementById("editBirthYear").value = year;

    document.getElementById("editEmail").value = email;

    try {
        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    } catch (e) {
        console.warn("Bootstrap Modal não encontrado!");
    }
}

// Função para salvar edição do usuário
async function saveUserEdit() {
    const id = document.getElementById("editUserId").value;
    const firstName = document.getElementById("editFirstName").value;
    const lastName = document.getElementById("editLastName").value;
    const birthDay = document.getElementById("editBirthDay").value.padStart(2, '0');
    const birthMonth = document.getElementById("editBirthMonth").value.padStart(2, '0');
    const birthYear = document.getElementById("editBirthYear").value;
    const email = document.getElementById("editEmail").value;

    if (!firstName || !lastName || !birthDay || !birthMonth || !birthYear || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    try {
        const response = await fetch(`${apiUrl}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, birthDate, email })
        });

        if (!response.ok) throw new Error("Erro ao atualizar usuário");

        alert("Usuário atualizado com sucesso!");
        fetchUsers(); // Atualiza a lista

        // Fechar modal de edição
        const editModalEl = document.getElementById("editModal");
        if (editModalEl) {
            bootstrap.Modal.getInstance(editModalEl)?.hide();
        }

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
    }
}

//Função para excluir um usuário
async function deleteUser(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
        const response = await fetch(`${apiUrl}/delete/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Erro ao excluir usuário");

        alert("Usuário excluído com sucesso!");
        fetchUsers(); // Atualiza a lista

    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
    }
}

// Inicializar a lista de usuários ao carregar a página
document.addEventListener("DOMContentLoaded", fetchUsers);

