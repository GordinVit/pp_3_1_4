let currentUser = "";



fetch("/api/user/current")
    .then(res => res.json())
    .then(data => {
        currentUser = data;
        console.log(data)
        showOneUser(currentUser);
        document.getElementById("headUsername").innerText= currentUser.username;
        document.getElementById("headRoles").innerText = currentUser.roles.map(role => role.name).join(" ");
    })

function showOneUser(user) {
    let temp = "";
    temp += "<tr>"
    temp += "<td>" + user.id + "</td>"
    temp += "<td>" + user.username + "</td>"
    temp += "<td>" + user.email + "</td>"
    temp += "<td>" + user.roles.map(role => role.name).join(" ") + "</td>"
    temp += "</tr>"
    document.getElementById("oneUserBody").innerHTML = temp;
}