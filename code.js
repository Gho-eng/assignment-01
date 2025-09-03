document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("results");
  const userModal = new bootstrap.Modal(document.getElementById("userModal"));
  const generateBtn = document.getElementById("generate");
  const countInput = document.getElementById("count");
  const nameModeSelect = document.getElementById("nameMode");
  let selectedUserIndex = null;
  let users = [];

  function renderUsers(list) {
    results.innerHTML = "";
    users = list;

    const mode = nameModeSelect.value;

    users.forEach((u, i) => {
      const row = document.createElement("tr");
      const displayName = mode === "first" ? u.name.first : u.name.last;

      row.innerHTML = `
        <td>${displayName}</td>
        <td>${u.gender}</td>
        <td>${u.email}</td>
        <td>${u.location.country}</td>
      `;

      row.addEventListener("dblclick", () => {
        selectedUserIndex = i;
        showUserDetails(u);
        userModal.show();
      });

      results.appendChild(row);
    });
  }

  function showUserDetails(u) {
  const initials = `${u.name.first[0] || ""}${u.name.last[0] || ""}`.toUpperCase();
  document.getElementById("userAvatar").textContent = initials;
  document.getElementById("userName").textContent = `${u.name.title} ${u.name.first} ${u.name.last}`;
  document.getElementById("userAddress").textContent =
    `${u.location.street.number} ${u.location.street.name}, ${u.location.city}, ${u.location.state}, ${u.location.country}, ${u.location.postcode}`;
  document.getElementById("userEmail").textContent = u.email;
  document.getElementById("userPhone").textContent = u.phone;

  document.getElementById("userDob").textContent =
    u.dob.date ? new Date(u.dob.date).toLocaleDateString() : "";

  document.getElementById("userGender").textContent = u.gender;
}


  generateBtn.addEventListener("click", () => {
    const count = Number(countInput.value);
    if (!Number.isInteger(count) || count < 0 || count > 1000) return;

    if (count === 0) {
      users = [];
      results.innerHTML = "";
      return;
    }

    fetch(`https://randomuser.me/api/?results=${count}&inc=name,gender,email,location,phone,dob&noinfo=true`)
      .then(res => res.json())
      .then(data => renderUsers(data.results))
      .catch(err => console.error(err));
  });

  nameModeSelect.addEventListener("change", () => {
    if (users.length > 0) renderUsers(users);
  });

  const editBtn = document.getElementById("editUser");
  const saveBtn = document.getElementById("saveUser");

  editBtn.addEventListener("click", () => {
    const fields = {
      userName: document.getElementById("userName").textContent,
      userAddress: document.getElementById("userAddress").textContent,
      userEmail: document.getElementById("userEmail").textContent,
      userPhone: document.getElementById("userPhone").textContent,
      userDob: document.getElementById("userDob").textContent,
      userGender: document.getElementById("userGender").textContent
    };

    document.getElementById("userName").innerHTML =
      `<input id="editName" type="text" class="form-control text-center" value="${fields.userName}">`;
    document.getElementById("userAddress").innerHTML =
      `<input id="editAddress" type="text" class="form-control" value="${fields.userAddress}">`;
    document.getElementById("userEmail").innerHTML =
      `<input id="editEmail" type="email" class="form-control" value="${fields.userEmail}">`;
    document.getElementById("userPhone").innerHTML =
      `<input id="editPhone" type="text" class="form-control" value="${fields.userPhone}">`;
    document.getElementById("userDob").innerHTML =
      `<input id="editDob" type="text" class="form-control" value="${fields.userDob}">`;
    document.getElementById("userGender").innerHTML =
      `<select id="editGender" class="form-select">
         <option ${fields.userGender === "male" ? "selected" : ""}>male</option>
         <option ${fields.userGender === "female" ? "selected" : ""}>female</option>
       </select>`;

    editBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");
  });

  saveBtn.addEventListener("click", () => {
    if (selectedUserIndex === null) return;

    const updatedUser = users[selectedUserIndex];

    updatedUser.name.first = document.getElementById("editName").value.split(" ")[1] || updatedUser.name.first;
    updatedUser.name.last = document.getElementById("editName").value.split(" ")[2] || updatedUser.name.last;
    updatedUser.email = document.getElementById("editEmail").value;
    updatedUser.phone = document.getElementById("editPhone").value;
    updatedUser.dob.date = document.getElementById("editDob").value; // free text now
    updatedUser.gender = document.getElementById("editGender").value;

    updatedUser.location.full = document.getElementById("editAddress").value;

    showUserDetails(updatedUser);

    const row = results.rows[selectedUserIndex];
    const mode = nameModeSelect.value;
    row.cells[0].textContent =
      mode === "first" ? updatedUser.name.first : updatedUser.name.last;
    row.cells[1].textContent = updatedUser.gender;
    row.cells[2].textContent = updatedUser.email;
    row.cells[3].textContent = updatedUser.location.country;

    saveBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
  });

  document.getElementById("deleteUser").addEventListener("click", () => {
    if (selectedUserIndex !== null) {
      users.splice(selectedUserIndex, 1);
      results.deleteRow(selectedUserIndex);
      userModal.hide();
    }
  });
});
