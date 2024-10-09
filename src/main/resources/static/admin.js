let tableUsers = [];
let currentUser = "";
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let editModal = new bootstrap.Modal(document.getElementById('editModal'));
let request = new Request("/api/admin", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
    },
});

getUsers();

function getUsers() {
    fetch(request)
        .then(res => res.json())
        .then(data => {
            tableUsers = data.length > 0 ? data : [];
            showUsers(tableUsers);
        });
}

fetch("/api/admin/current")
    .then(res => res.json())
    .then(data => {
        currentUser = data;
        showOneUser(currentUser);
        document.getElementById("headUsername").innerText = currentUser.username;
        document.getElementById("headRoles").innerText = currentUser.roles.map(role => role.name).join(" ");
    });

function showUsers(table) {
    let temp = "";
    table.forEach(user => {
        temp += `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.name).join(" ")}</td>
            <td><a onclick='showEditModal(${user.id})' class="btn btn-outline-info" id="edit">Edit</a></td>
            <td><a onclick='showDeleteModal(${user.id})' class="btn btn-outline-danger" id="delete">Delete</a></td>
        </tr>`;
    });
    document.getElementById("allUsersBody").innerHTML = temp;
}

function getRoles(list) {
    let userRoles = [];
    for (let role of list) {
        if (role === 2 || role.id === 2) {
            userRoles.push("ADMIN");
        }
        if (role === 1 || role.id === 1) {
            userRoles.push("USER");
        }
    }
    return userRoles.join(" , ");
}

function showOneUser(user) {
    let temp = `<tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.roles.map(role => role.name).join(" ")}</td>
    </tr>`;
    document.getElementById("oneUserBody").innerHTML = temp;
}

function rolesUser(event) {
    let rolesAdmin = {};
    let rolesUser = {};
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('2')) {
        rolesAdmin["id"] = 2;
        rolesAdmin["name"] = "ROLE_ADMIN";
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('1')) {
        rolesUser["id"] = 1;
        rolesUser["name"] = "ROLE_USER";
        allRoles.push(rolesUser);
    }
    return allRoles;
}

document.getElementById('newUser').addEventListener('submit', addNewUser);

function addNewUser(form) {
    form.preventDefault();
    let newUserForm = new FormData(form.target);
    let user = {
        id: null,
        username: newUserForm.get('username'),
        password: newUserForm.get('password'),
        email: newUserForm.get('email'),
        roles: rolesUser("#roles")
    };

    let req = new Request("/api/admin", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fetch(req)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    // Отображение ошибок на странице
                    showErrorMessages(err);
                    throw new Error(err.message || 'Ошибка при добавлении пользователя');
                });
            }
            return getUsers();
        })
        .then(() => {
            form.target.reset();
            const triggerE1 = document.querySelector('#v-pills-tabContent button[data-bs-target="#nav-home"]');
            bootstrap.Tab.getInstance(triggerE1).show();
        })
        .catch(err => console.error(err));
}

function showErrorMessages(data) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorMessageContainer = document.getElementById('errorMessages');

    // Очищаем предыдущие сообщения об ошибках
    errorMessageContainer.innerHTML = '';

    // Добавляем новые сообщения об ошибках
    if (data.error) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('alert', 'alert-danger');
        errorMessage.innerText = data.error; // Добавляем текст ошибки
        errorMessageContainer.appendChild(errorMessage);
    }

    // Открываем модальное окно с ошибками
    errorModal.show();
}

function showDeleteModal(id) {
    document.getElementById('closeDeleteModal').setAttribute('onclick', () => {
        deleteModal.hide();
        document.getElementById('deleteUser').reset();
    });

    let request = new Request("/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request)
        .then(res => res.json())
        .then(deleteUser => {
            document.getElementById('idDel').setAttribute('value', deleteUser.id);
            document.getElementById('usernameDel').setAttribute('value', deleteUser.username);
            document.getElementById('passwordDel').setAttribute('value', deleteUser.password);
            document.getElementById('emailDel').setAttribute('value', deleteUser.email);

            if (getRoles(deleteUser.roles).includes("USER") && getRoles(deleteUser.roles).includes("ADMIN")) {
                document.getElementById('rolesDel1').setAttribute('selected', 'true');
                document.getElementById('rolesDel2').setAttribute('selected', 'true');
            } else if (getRoles(deleteUser.roles).includes("USER")) {
                document.getElementById('rolesDel1').setAttribute('selected', 'true');
            } else if (getRoles(deleteUser.roles).includes("ADMIN")) {
                document.getElementById('rolesDel2').setAttribute('selected', 'true');
            }
            deleteModal.show();
        });

    let isDelete = false;
    document.getElementById('deleteUser').addEventListener('submit', event => {
        event.preventDefault();
        if (!isDelete) {
            isDelete = true;
            let request = new Request("/api/admin/" + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetch(request)
                .then(() => {
                    getUsers();
                });
            deleteModal.hide();
        }
    });
}

function showEditModal(id) {
    let request = new Request("/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request)
        .then(res => res.json())
        .then(editUser => {
            document.getElementById('idRed').setAttribute('value', editUser.id);
            document.getElementById('usernameRed').setAttribute('value', editUser.username);
            document.getElementById('passwordRed').setAttribute('value', editUser.password);
            document.getElementById('emailRed').setAttribute('value', editUser.email);

            if (editUser.roles.map(role => role.id).includes(1) && editUser.roles.map(role => role.id).includes(2)) {
                document.getElementById('rolesRed1').setAttribute('selected', 'true');
                document.getElementById('rolesRed2').setAttribute('selected', 'true');
            } else if (editUser.roles.map(role => role.id).includes(1)) {
                document.getElementById('rolesRed1').setAttribute('selected', 'true');
            } else if (editUser.roles.map(role => role.id).includes(2)) {
                document.getElementById('rolesRed2').setAttribute('selected', 'true');
            }
            editModal.show();
        });

    document.getElementById('editUser').addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let redUserForm = new FormData(event.target);
    let user = {
        id: redUserForm.get('id'),
        username: redUserForm.get('username'),
        password: redUserForm.get('password'),
        email: redUserForm.get('email'),
        roles: rolesUser("#rolesRed")
    };

    let request = new Request("/api/admin", {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    // Отображение ошибок на странице
                    showErrorMessages(err);
                    throw new Error(err.message || 'Ошибка при редактировании пользователя');
                });
            }
            return getUsers();
        })
        .then(() => {
            event.target.reset();
            editModal.hide();
        })
        .catch(err => console.error(err));
}
