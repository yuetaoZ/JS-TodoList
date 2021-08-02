// 1. Show how many active tasks left at the left of footer
// 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// 4. Type in the input, press enter key to add the task (listen to 'keyup' event)
// 5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// 6. During editing, press enter key to save the task( listen to 'keyup' event)
// 7. Close and reopen the application, it should keep all the previous tasks. // localStorage

// [{
//    id: 123142345,
//   value: '123',
//   checked: true
// }, {
//    id: 12321123142345,
//   value: '456',
//   checked: false
// }]

const model = {
  todos: [],
  showTag: "All",
};

const getListContainer = () => document.querySelector(".list-container");

const getTodoCount = () => model.todos.filter((todo) => !todo.checked).length;

const createTodoNode = (todo) => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = todo.checked;
  const span = document.createElement("span");
  span.innerHTML = todo.content;
  if (todo.checked) {
    span.className = "checked";
  }
  const editDiv = document.createElement("div");
  editDiv.className = "edit-icon";
  editDiv.innerHTML = "&#9998;";
  const deleteDiv = document.createElement("div");
  deleteDiv.className = "delete-icon";
  deleteDiv.innerHTML = "&#10005";

  li.id = todo.id;
  li.append(checkbox);
  li.append(span);
  li.append(editDiv);
  li.append(deleteDiv);

  return li;
};

const updateList = () => {
  const listContainer = getListContainer();
  listContainer.innerHTML = "";
  model.todos
    .filter((todo) => {
      switch (model.showTag) {
        case "All":
          return todo;
        case "Active":
          return todo.checked === false;
        case "Completed":
          return todo.checked === true;
        default:
          return todo;
      }
    })
    .forEach((todo) => {
      const li = createTodoNode(todo);
      listContainer.appendChild(li);
    });
};

const updateCount = () => {
  const todoCount = document.querySelector("#todo-count");
  const count = getTodoCount();
  if (count <= 1) {
    todoCount.innerHTML = count + " item left";
  } else {
    todoCount.innerHTML = count + " items left";
  }
};

const updateShowButton = () => {
  const selectAllButton = document.querySelector("#select-all-btn");
  const selectActiveButton = document.querySelector("#select-active-btn");
  const selectCompletedButton = document.querySelector("#select-completed-btn");

  if (selectAllButton.classList.contains("selected")) {
    selectAllButton.classList.remove("selected");
  } else if (selectActiveButton.classList.contains("selected")) {
    selectActiveButton.classList.remove("selected");
  } else if (selectCompletedButton.classList.contains("selected")) {
    selectCompletedButton.classList.remove("selected");
  }

  switch (model.showTag) {
    case "All":
      selectAllButton.classList.add("selected");
      break;
    case "Active":
      selectActiveButton.classList.add("selected");
      break;
    case "Completed":
      selectCompletedButton.classList.add("selected");
      break;
    default:
      selectAllButton.classList.add("selected");
  }
};

const updateView = () => {
  updateList();
  updateCount();
  updateShowButton();
  localStorage.setItem("todoList", JSON.stringify(model.todos));
};

const loadState = () => {
  const todoListStr = localStorage.getItem("todoList");
  if (todoListStr) {
    model.todos = JSON.parse(todoListStr);
  }
  updateView();
};

const handleAddController = () => {
  const input = document.querySelector(".text-input");
  const inputValue = input.value;
  const newTodoObj = {
    id: new Date().valueOf(),
    content: inputValue,
    checked: false,
  };
  model.todos.push(newTodoObj);
  input.value = "";

  updateView();
};

const handleClearAllController = () => {
  model.todos = [];
  updateView();
  const input = document.querySelector(".text-input");
  input.value = "";
};

const handleDeleteDivController = (element) => {
  const li = element.parentNode;
  model.todos = model.todos.filter((todo) => {
    return todo.id !== Number(li.id);
  });
  updateView();
};

const handleCheckboxConctroller = (element) => {
  const li = element.parentNode;
  const id = Number(li.id);
  model.todos.forEach((todo) => {
    if (todo.id === id) {
      todo.checked = !todo.checked;
    }
  });
  updateView();
};

const createEditableTodoNode = (todo) => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = todo.checked;
  checkbox.disabled = true;
  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.setAttribute("value", todo.content);
  // autofocus doesn't works good,
  // it only works for the first item first time rendered
  //   editInput.autofocus = true;
  editInput.focus();
  const doneDiv = document.createElement("div");
  doneDiv.className = "done-icon";
  doneDiv.innerHTML = "&#10003";
  editInput.addEventListener("keyup", handleEditKeyupController);

  li.id = todo.id;
  li.append(checkbox);
  li.append(editInput);
  li.append(doneDiv);
  return li;
};

const updateListEdit = (id) => {
  const listContainer = getListContainer();
  listContainer.innerHTML = "";
  model.todos
    .filter((todo) => {
      switch (model.showTag) {
        case "All":
          return todo;
        case "Active":
          return todo.checked === false;
        case "Completed":
          return todo.checked === true;
        default:
          return todo;
      }
    })
    .forEach((todo) => {
      if (todo.id === Number(id)) {
        const li = createEditableTodoNode(todo);
        listContainer.appendChild(li);
      } else {
        const li = createTodoNode(todo);
        listContainer.appendChild(li);
      }
    });
};

const handleEditDivController = (element) => {
  const li = element.parentNode;
  const id = li.id;

  updateListEdit(id);
};

const handleDoneDivController = (element) => {
  const li = element.parentNode;
  const id = Number(li.id);
  const editValue = li.querySelector(".edit-input").value;
  model.todos.forEach((todo) => {
    if (todo.id === Number(id)) {
      todo.content = editValue;
    }
  });

  updateView();
};

// event bubbling and event delegation
const handleListContainerClickController = (e) => {
  if (e.target.classList.contains("delete-icon")) {
    handleDeleteDivController(e.target);
  } else if (e.target.type === "checkbox") {
    handleCheckboxConctroller(e.target);
  } else if (e.target.classList.contains("edit-icon")) {
    handleEditDivController(e.target);
  } else if (e.target.classList.contains("done-icon")) {
    handleDoneDivController(e.target);
  }
};

const handleShowAllController = () => {
  model.showTag = "All";
  updateView();
};

const handleShowActiveController = () => {
  model.showTag = "Active";
  updateView();
};

const handleShowCompletedController = () => {
  model.showTag = "Completed";
  updateView();
};

const setAllTodoToChecked = () => {
  model.todos.forEach((todo) => {
    todo.checked = true;
  });
  updateView();
};

const setAllTodoToUnchecked = () => {
  model.todos.forEach((todo) => {
    todo.checked = false;
  });
  updateView();
};

const handleCheckButtonController = () => {
  if (getTodoCount() > 0) {
    setAllTodoToChecked();
  } else {
    setAllTodoToUnchecked();
  }
};

const handleInputKeyupController = (e) => {
  if (`${e.code}` === "Enter") {
    handleAddController();
  }
};

const handleEditKeyupController = (e) => {
  if (`${e.code}` === "Enter") {
    handleDoneDivController(e.target);
  }
};

const loadEvents = () => {
  const checkButton = document.querySelector("#check-btn");
  const input = document.querySelector(".text-input");
  const addButton = document.querySelector("#add-btn");
  const listContainer = getListContainer();
  const clearButton = document.querySelector("#clear-btn");
  const selectAllButton = document.querySelector("#select-all-btn");
  const selectActiveButton = document.querySelector("#select-active-btn");
  const selectCompletedButton = document.querySelector("#select-completed-btn");

  checkButton.addEventListener("click", handleCheckButtonController);
  input.addEventListener("keyup", handleInputKeyupController);
  addButton.addEventListener("click", handleAddController);
  listContainer.addEventListener("click", handleListContainerClickController);
  clearButton.addEventListener("click", handleClearAllController);
  selectAllButton.addEventListener("click", handleShowAllController);
  selectActiveButton.addEventListener("click", handleShowActiveController);
  selectCompletedButton.addEventListener(
    "click",
    handleShowCompletedController
  );
};

loadEvents();
loadState();
