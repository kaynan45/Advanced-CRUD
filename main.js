//This is a variable const, with a function saved inside it, that simply add a class to the modal element, this class is responsible to set the modal opacity to 1 (making it appear completely) and the Z-Index to 1 as well (making it overcome in front of any other things)
const openModal = () => {
  document.getElementById("modal").classList.add("active");
};

//This one is the opposite, it simply remove the 'active' class making the opacity 0, and the Z-Index to 0.
const closeModal = () => {
  document.getElementById("modal").classList.remove("active");
  clearFields();
};

//localStorage functions:
//This "?? []" means that if there is no db_client on the localStorage the value'll be an empty array, so the push method works properly.
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (db_client) =>
  localStorage.setItem("db_client", JSON.stringify(db_client));

//CRUD [DELETE]
//Create a variable that stores a function that receive a parameter being the index of the client that we want to delete.
const deleteClient = (index) => {
  //Here we're creating another scoped db_client variable that gets the hole array in the localStorage
  const db_client = readClient();
  //Here we're splicing the array, meaning that the given index will be deleted from the array, and the number "1" means that is only one of those items that we want to remove.
  db_client.splice(index, 1);
  setLocalStorage(db_client);
  console.log(readClient());
};

//CRUD [UPDATE]
//Create a variable const with a function inside it, that function gets 2 parameters, the index on the db_client array located on the localStorage, and the new object named "client".
const updateClient = (index, client) => {
  //Here we're creating another scoped db_client variable that gets the hole array in the localStorage
  const db_client = readClient();
  //We select the index based on the one given when we call the function, and make it equals to the new object, as well given when we call the function.
  db_client[index] = client;
  //And finally we set this new array to the localStorage again
  setLocalStorage(db_client);
};

//CRUD [READ]
const readClient = () => getLocalStorage();

//CRUD [CREATE]
const createClient = (client) => {
  //Take the local storage current array and 'unstringify', make it readable for the javaScript again. And save it on the db_client variable.
  const db_client = getLocalStorage();
  //Push the client (tempClient) trough the array db_client
  db_client.push(client);
  //And save the new db_client array in the local storage.
  setLocalStorage(db_client);
};

/* 
!Layout interaction
*/

const clearFields = () => {
  document.getElementById("js-client-name").value = "";
  document.getElementById("js-client-email").value = "";
  document.getElementById("js-client-phone").value = "";
  document.getElementById("js-client-city").value = "";
};

//Basically a function that checks if all the requirements ware fulfilled.
const isValidField = () => {
  //This reportValidity() method returns true when all the html required elements were fulfilled, and false in case of at least one weren't
  return document.getElementById("form").reportValidity();
};

const saveClient = () => {
  if (isValidField()) {
    const client = {
      name: document.getElementById("js-client-name").value,
      email: document.getElementById("js-client-email").value,
      phone: document.getElementById("js-client-phone").value,
      city: document.getElementById("js-client-city").value,
    };
    createClient(client);
    clearFields();
    closeModal();
    updateTable();
  }
  console.log(readClient());
};

//This function insert an html based on the client data.
const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td>${client.name}</td>
  <td>${client.email}</td>
  <td>${client.phone}</td>
  <td>${client.city}</td>
  <td>
      <button type="button" class="button green" id="edit-${index}">Edit</button>
      <button type="button" class="button red" id="delete-${index}">Delete</button>
  </td>
  `;
  document.querySelector("#js-clients-table>tbody").appendChild(newRow);
};

//This function clears the entire table, preventing that the rows get duplicated.
const clearTable = () => {
  const rows = document.querySelectorAll("#js-clients-table>tbody tr");
  rows.forEach((row) => (row.innerHTML = ""));
};

//This function first read all the clients saved on the local storage, and then clear the entire table, finally creating new rows adding the new client and maintaining the previous ones.
const updateTable = () => {
  const db_client = readClient();
  clearTable();
  db_client.forEach(createRow);
};

updateTable();

const editDelete = (event) => {
  if (event.target.type === "button") {

    //Here we're using the destruction to create two variables on the array created by "event.target.id.split('-')".The first (action) will store what button is been created, and the second (index) will store witch one of the multiple possibles buttons was clicked, in another words, taking the index of the clicked button.

    const [action, index] = event.target.id.split('-'); //This .split is transforming the id into an array, separating the values with the given "-".

    if (action === 'edit') {
      console.log('editing')
    } else {
      console.log('deleting')
    }
    
  }
};

/* 
!EVENTS */
//This event listener detect when the user clicks on the "cadastrarCliente" button and runs the "openModal" function
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

//Otherwise this one listen when the user clicks the "modalClose" button (that classic 'X' on top of the modal), and runs the "closeModal" function.
document.getElementById("modalClose").addEventListener("click", closeModal);

//This event listen when the save button is clicked, and runs the saveClient function
document.getElementById("js-save-button").addEventListener("click", saveClient);

document
  .querySelector("#js-clients-table>tbody")
  .addEventListener("click", editDelete);
