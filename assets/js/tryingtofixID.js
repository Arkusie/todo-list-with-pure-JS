// declarations
let $list_item;
let id_value = 2;
let $span;
let $unordered_list;
let $add_button;
let $edit_button;
let delete_button;
let $editInput;
let $accept_button;
let $decline_button;
let $input_content;

let post_ID;
let edited_ID;
// let id_array = [];

function APIfetchToDo() {
  let UserListContent = new XMLHttpRequest();
  UserListContent.open("GET", "http://195.181.210.249:3000/todo/", true);

  UserListContent.onload = function() {
    const dataRecieved = JSON.parse(UserListContent.responseText);
    for (let index = 0; index < dataRecieved.length; index++) {
      let post_ID = dataRecieved[index].id;

      create_Task(post_ID);
      $span.innerHTML = dataRecieved[index].title;
      addTask();
    }
    // $span[0].innerText = dataRecieved[0].title;
  };
  UserListContent.send();
}
function main() {
  fix_DOM_elements();
  prepare_DOM_events();
  APIfetchToDo();
}
// global variables, assigning properties, search & prepare DOM elements
function fix_DOM_elements() {
  $unordered_list = document.getElementById("ul_element");
  $add_button = document.getElementById("add_button");
  $edit_button = document.getElementById("edit_button");
  $input_content = document.getElementById("inputLi");
  $span = document.getElementsByClassName("toDoText");
  $list_item = document.getElementsByClassName("li_element");
}
// adding all the listeners
function prepare_DOM_events() {
  $add_button.addEventListener("click", addTask_Manager);
  $unordered_list.addEventListener("click", listClickManager);
}
function listClickManager(dataFromJS) {
  let $span, $input, $editForm, $edit_button, $delete_button, $list_item;
  if (!dataFromJS.target.dataset.id) {
    return;
  }
  const ToDoId = dataFromJS.target.dataset.id;
  const selectedToDo = $unordered_list.querySelector('li[data-id="' + ToDoId + '"]');
  $span = selectedToDo.getElementsByClassName("toDoText")[0];
  $input = selectedToDo.getElementsByClassName("editInput")[0];
  $editForm = selectedToDo.getElementsByClassName("editForm")[0];
  $edit_button = selectedToDo.getElementsByClassName("editButton")[0];
  $delete_button = selectedToDo.getElementsByClassName("deleteButton")[0];
  $list_item = selectedToDo.getElementsByClassName("li_element")[0];

  if (dataFromJS.target.className === "editButton") {
    editManager($span, $editForm, $input, $edit_button, $delete_button, $list_item);
  } else if (dataFromJS.target.className === "acceptEdit") {
    acceptManager($span, $editForm, $input, $edit_button, $list_item);
  } else if (dataFromJS.target.className === "declineEdit") {
    declineManager($span, $editForm, $edit_button);
  } else if (dataFromJS.target.className === "deleteButton") {
    removeManager(selectedToDo);
  }
}
//
function removeManager(selectedToDo) {
  selectedToDo.remove();

  const deleteToDo = new XMLHttpRequest();
  const url_id = "http://195.181.210.249:3000/todo/" + edited_ID;
  deleteToDo.open("DELETE", url_id, true);

  deleteToDo.send();
  deleteToDo.onload = function() {
    console.log("del" + edited_ID);
  };
}

function editManager($span, $editForm, $input, $edit_button, $list_item) {
  edited_ID = $list_item.dataset.id;
  console.log(edited_ID);
  $span.style.display = "none";
  $input.value = $span.innerText;
  $editForm.style.display = "";
  $edit_button.style.display = "none";
}
function acceptManager($span, $editForm, $input, $edit_button, $list_item) {
  console.log("acceptManager id:" + edited_ID);

  $editForm.style.display = "none";
  $span.innerText = $input.value;
  $span.style.display = "";
  $edit_button.style.display = "";
  // console.log($list_item.className); // how to console log dataset data-id ?
  updateToDo(edited_ID);
}
function declineManager($span, $editForm, $edit_button) {
  $editForm.style.display = "none";
  $span.style.display = "";
  $edit_button.style.display = "";
}
// adds all the elements to html
function addTask(task, list) {
  $unordered_list.appendChild($list_item);
  $list_item.appendChild($edit_button);
  $list_item.appendChild($span);
  $list_item.appendChild($editForm);
  //
  $editForm.appendChild($editInput);
  $editForm.appendChild($accept_button);
  $editForm.appendChild($decline_button);
  $editForm.appendChild($delete_button);
}
// creates elements in js
function create_Task(post_ID) {
  console.log(post_ID);
  // li
  $list_item = document.createElement("li");
  $list_item.id = "li_element";
  $list_item.className = "li_element";
  $list_item.setAttribute("data-id", post_ID);
  // span for text
  $span = document.createElement("p");
  $span.className = "toDoText";
  $editForm = document.createElement("p");
  $editForm.className = "editForm";
  $editForm.style.display = "none";
  // button
  $edit_button = document.createElement("button");
  $edit_button.id = "edit_button";
  $edit_button.className = "editButton";
  $edit_button.setAttribute("data-id", post_ID);
  $edit_button.innerHTML = "E";

  $delete_button = document.createElement("button");
  $delete_button.id = "delete_button";
  $delete_button.className = "deleteButton";
  $delete_button.setAttribute("data-id", post_ID);
  $delete_button.innerHTML = "!";
  //accept and decline buttons
  $accept_button = document.createElement("button");
  $accept_button.className = "acceptEdit";
  $accept_button.setAttribute("data-id", post_ID);
  $accept_button.innerHTML = "✔";

  $decline_button = document.createElement("button");
  $decline_button.className = "declineEdit";
  $decline_button.setAttribute("data-id", post_ID);
  $decline_button.innerHTML = "✘";
  // creae input for new li
  $editInput = document.createElement("input");
  $editInput.className = "editInput";
  // getting content
  $span.innerHTML = $input_content.value;
  //incremet id for the next list elements
  id_value++;
}

function updateToDo() {
  const putToDo = new XMLHttpRequest();
  const url_id = "http://195.181.210.249:3000/todo/" + edited_ID;

  putToDo.open("PUT", url_id, true);
  putToDo.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  putToDo.onload = function(dataPut) {
    // console.log(dataPut);
  };
  putToDo.send("title=" + $span.innerText);
}

function postToDo() {
  const sendToDo = new XMLHttpRequest();
  sendToDo.open("POST", "http://195.181.210.249:3000/todo/", true);
  sendToDo.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  sendToDo.onload = function(data_post) {
    console.log(data_post);
  };
  sendToDo.send("title=" + $input_content.value + "&author=AreG&description=" + "workin on API");
  // clean input from the previous entry so placeholder can be displayed
  $input_content.value = "";
}
// executess creating and adding new elements
function addTask_Manager() {
  if ($input_content.value === "") {
  } else {
    let newTask = create_Task(title);
    addTask(newTask, $list_item);
    postToDo();
  }
}

document.addEventListener("DOMContentLoaded", main);
