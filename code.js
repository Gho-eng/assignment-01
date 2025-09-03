document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("results");
  const userModal = new bootstrap.Modal(document.getElementById("userModal"));
  const generateBtn = document.getElementById("generate");
  const countInput = document.getElementById("count");
  const nameMode = document.getElementById("nameMode"); 
  let selectedUserIndex = null;
  let users = [];

  function renderUsers(list) {
    results.innerHTML = "";
    users = list;

    users.forEach((u, i) => {
      const row = document.createElement("tr");

      // Show either first or last name depending on dropdown
      const displayName =
        nameMode.value === "first" ? u.name.first : u.name.last;

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
  }

  generateBtn.addEventListener("click", () => {
    const count = Number(countInput.value);
    if (!Number.isInteger(count) || count < 0 || count > 1000) return;

    if (count === 0) {
      users = [];
      results.innerHTML = "";
      return;
    }

    fetch(`https://randomuser.me/api/?results=${count}&inc=name,gender,email,location&noinfo=true`)
      .then(res => res.json())
      .then(data => renderUsers(data.results))
      .catch(err => console.error(err));
  });

  // re-render if dropdown is changed
  nameMode.addEventListener("change", () => {
    if (users.length > 0) {
      renderUsers(users);
    }
  });

  const editBtn = document.getElementById("editUser");
  const saveBtn = document.getElementById("saveUser");

  editBtn.addEventListener("click", () => {
    const userName = document.getElementById("userName");
    const currentName = userName.textContent;
    userName.innerHTML = `<input id="editName" type="text" class="form-control text-center" value="${currentName}">`;

    editBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");
  });

  saveBtn.addEventListener("click", () => {
    const editInput = document.getElementById("editName");
    if (editInput && selectedUserIndex !== null) {
      const newName = editInput.value.trim();
      if (newName) {
        document.getElementById("userName").textContent = newName;

        const parts = newName.split(" ");
        users[selectedUserIndex].name.first = parts[1] || users[selectedUserIndex].name.first;
        users[selectedUserIndex].name.last = parts[2] || users[selectedUserIndex].name.last;

        // makes sure table updates based on dropdown mode
        results.rows[selectedUserIndex].cells[0].textContent =
          nameMode.value === "first"
            ? users[selectedUserIndex].name.first
            : users[selectedUserIndex].name.last;
      }
    }

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
