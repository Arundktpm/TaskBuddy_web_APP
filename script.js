//variables declare and intialization
const InputValue = document.getElementById('inputbox');
const inpuFormEl = document.querySelector(".Input-container");
const OutputEl = document.getElementById('taskShow-box');
const alertMsg = document.getElementById('alert');
const sectionEl = document.getElementById('TaskSection');
const totalTask = document.getElementById('TotalTasks');
const completedTask = document.getElementById("CompletedTasks");
const taskDasboard = document.querySelector('div.TaskDasboard');
const ImageEl = document.querySelector("#TaskSection>.image");
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const sloganEL=document.querySelector(".extra-slogan>h4");

//create elements for alert message
const alertMessage = document.createElement('div');
alertMessage.className = "msg";
const closeBtn = document.createElement('button');
closeBtn.className = "alertClosebtn";
closeBtn.textContent = "X";

//mobile device <li> element size control(IIFE) 
(function mobileLiSize() {
    let List = document.querySelectorAll('.List-box');
    List.forEach((listItem) => {
        if (screen.availWidth < 500) listItem.style.width = "110%";
    });
})();

//<ListSection-box> element create
function ListElcreate(listvalue, classLi) {
    const ulElement = document.createElement("ul");
    ulElement.className = "List-box";

    const liElement = document.createElement("li");
    liElement.textContent = listvalue;

    if (classLi !== "undefined") liElement.classList.add(classLi);

    const spanElement = document.createElement("span");
    spanElement.className = "removebtn";
    spanElement.textContent = "❌";

    ulElement.append(liElement, spanElement);
    OutputEl.append(ulElement);
}

// current date and time show
function setTime() {
    //date and month
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hours = time.getHours();
    const hoursForClock = hours >= 13 ? hours % 12 : hours;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`
    dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
}
setInterval(setTime, 1000);

//update Values function for Task planner..
function UpdateAlert(ev) {
    ev.preventDefault();
    alertMsg.classList.remove("success", "error", "show"); 
    alertMsg.style.display = 'flex';
    if (InputValue.value.trim() != "") {
        //update input value..
        ListElcreate(InputValue.value.trim(), "undefined");
        //pop-up alert message
        alertMsg.classList.add('success');
        alertMessage.textContent = "✅ succesful plan is added!";
    }
    else {
        // alert;
        alertMsg.classList.add("error");
        alertMessage.textContent = "❌ Failure Give input corrently!";
    }
    alertMsg.innerHTML = "";
    alertMsg.append(alertMessage, closeBtn);

    // Auto-hide alert after 5s (fade-out)
    setTimeout(() => {
        alertMsg.classList.add('show');
        setTimeout(() => {
            alertMsg.classList.remove("show");
            setTimeout(() => (alertMsg.style.display = "none"), 500);
        }, 5000);
    }, 5);
    InputValue.value = "";
    LstoreUirefresh();
}
//update value click event..
inpuFormEl.addEventListener("submit", UpdateAlert);

//alert message close button event..
closeBtn.addEventListener('click', () => {
    alertMsg.classList.remove('show');
    setTimeout(() => { alertMsg.style.display = "none" }, 500);
});
function taskOperationHandle(event) {
    if (event.target.classList.contains('removebtn')) {
        event.target.parentNode.remove();//remove in UI
        const targetval = event.target.parentNode.children[0];
        //localstorage remove
        const fetchedTaskRemove = [...JSON.parse(localStorage.getItem("Tasks"))];
        fetchedTaskRemove.forEach((item) => {
            if (item.Task === targetval.innerText) fetchedTaskRemove.splice(fetchedTaskRemove.indexOf(item), 1);
        });
        //update after remove
        localStorage.setItem("Tasks", JSON.stringify(fetchedTaskRemove));
    }
    //completed Task strike operation
    if (event.target.tagName === 'LI') {
        event.target.classList = "completed";
        event.target.parentNode.style.setProperty("--display", "block");
    }
    LstoreUirefresh();
}
//event listener for remove list and completed...
OutputEl.addEventListener('click', taskOperationHandle);

function LstoreUirefresh() {
    //LocalStorage store Taskdata
    let TaskListEl = document.querySelectorAll(".List-box>li");
    const taskbox = [];
    TaskListEl.forEach((item) => {
        taskbox.push({
            Task: item.innerText,
            Completed: item.classList.contains('completed')
        })
    });
    localStorage.setItem("Tasks", JSON.stringify(taskbox));

    //Taskcompleted count operation
    let TaskCountFetched = [...JSON.parse(localStorage.getItem("Tasks"))];
    let completedCount = TaskCountFetched.filter((item) => {
        return (item.Completed === true);
    });
    //task counters dasboard
    totalTask.innerHTML = `Total Task: ${OutputEl.children.length}`;
    completedTask.innerHTML = `Completed Task: ${completedCount.length}`;

    //outputel display control
    if (OutputEl.children.length > 0) {
        OutputEl.style.display = "flex";
        taskDasboard.style.display = "flex";
        ImageEl.style.display = "none"
    }
    else {
        OutputEl.style.display = "none";
        taskDasboard.style.display = "none"
        ImageEl.style.display = "block";
    }
}

//fetch data from local storage
document.addEventListener("DOMContentLoaded", () => {
    const fetchedTask = [...JSON.parse(localStorage.getItem("Tasks"))];
    fetchedTask.forEach((taskKey) => {
        if (taskKey.Completed === true) {
            ListElcreate(taskKey.Task, "completed");//list create
            let ulElement = [...document.querySelectorAll(".List-box")];
            ulElement.forEach((ul) => {
                (ul.children[0].classList.contains("completed")) ? (ul.style.setProperty("--display", "block")) : (ul.style.setProperty("--display", "none"));
            });
        }
        else ListElcreate(taskKey.Task, "undefined");
        //display control and store Local
        LstoreUirefresh();
    });
});
