var scrollUpBtn = document.getElementById("scroll-up-btn")
window.onscroll = () => {
    if (document.body.scrollTop > 220 || document.documentElement.scrollTop > 220) {
        scrollUpBtn.style.display = "block";
    } else {
        scrollUpBtn.style.display = "none";
    }
};

scrollUpBtn.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})

var lessonNameInput = document.getElementById("lesson-name-input")
var createLessonBtn = document.getElementById('create-lesson-btn');
lessonNameInput.addEventListener("input", function (event) {
    if (this.value.length > 0) {
        if (createLessonBtn.disabled == true)
            createLessonBtn.disabled = false;
    }
    else if (this.value.length === 0) {
        createLessonBtn.disabled = true;
    }
});

lessonNameInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (this.value.length > 0) {
            //this.disabled = true;
            event.preventDefault()
            fetchCreateLesson(lessonNameInput.value);
        }
    }
});

var createLessonOverlay = document.getElementById("create-lesson-overlay")
var createLessonShowBtn = document.getElementById("create-lesson-show-btn")
createLessonShowBtn.addEventListener("click", function (event) {
    createLessonOverlay.style.display = "block";
    lessonNameInput.focus()
});

var cancelCreateLessonBtns = document.querySelectorAll('.cancel-create-lesson-btn');
cancelCreateLessonBtns.forEach(cancelCreateLessonBtn => cancelCreateLessonBtn.addEventListener("click", () => {
    createLessonOverlay.style.display = "none";
}));

createLessonBtn.addEventListener("click", function (event) {
    event.preventDefault()
    fetchCreateLesson(lessonNameInput.value);
});

var removeLessonOverlay = document.getElementById("remove-lesson-overlay")
var deleteLessonOverlay = document.getElementById("delete-lesson-overlay")
window.onclick = function (event) {
    if (event.target == createLessonOverlay) {
        createLessonOverlay.style.display = "none";
    }
    else if (event.target == removeLessonOverlay) {
        removeLessonOverlay.style.display = "none";
    }
    else if (event.target == deleteLessonOverlay) {
        deleteLessonOverlay.style.display = "none";
    }
}


function removeFunc(lessonId, lessonName) {
    var removeConfirmSection = document.getElementById("remove-confirm-section")
    removeConfirmSection.innerHTML = `
        <div class="cancel-remove-lesson-btn btn" style="color: whitesmoke;"><u>Cancel</u></div>
        <button style="margin-left: 10px;" id="remove-lesson-btn" class="btn btn-outline-danger">Remove</button>`

    var cancelRemoveLessonBtns = document.querySelectorAll('.cancel-remove-lesson-btn');
    cancelRemoveLessonBtns.forEach(cancelRemoveLessonBtn => cancelRemoveLessonBtn.addEventListener("click", () => {
        removeLessonOverlay.style.display = "none";
    }));

    var removeLessonBtn = document.getElementById('remove-lesson-btn');
    removeLessonBtn.addEventListener("click", function (event) {
        fetchRemoveLesson(lessonId)
    });

    var removeLessonName = document.getElementById("remove-lesson-name")
    removeLessonOverlay.style.display = "block";
    removeLessonName.innerText = lessonName
}

function deleteFunc(lessonId, lessonName) {
    var deleteConfirmSection = document.getElementById("delete-confirm-section")
    deleteConfirmSection.innerHTML = `
        <div class="cancel-delete-lesson-btn btn" style="color: whitesmoke;"><u>Cancel</u></div>
        <button style="margin-left: 10px;" id="delete-lesson-btn" class="btn btn-outline-danger">Delete</button>`

    var cancelDeleteLessonBtns = document.querySelectorAll('.cancel-delete-lesson-btn');
    cancelDeleteLessonBtns.forEach(cancelDeleteLessonBtn => cancelDeleteLessonBtn.addEventListener("click", () => {
        deleteLessonOverlay.style.display = "none";
    }));

    var deleteLessonBtn = document.getElementById('delete-lesson-btn');
    deleteLessonBtn.addEventListener("click", function (event) {
        fetchDeleteLesson(lessonId)
    });

    var deleteLessonName = document.getElementById("delete-lesson-name")
    deleteLessonOverlay.style.display = "block";
    deleteLessonName.innerText = lessonName
}

function fetchCreateLesson(lessonName) {
    fetch(createLessonURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'lesson_name': lessonName,
        }),
    })
        .then(response => response.json())
        .then(response => {
            var createAleartDiv = document.getElementById("create-alert-div")
            const crt_success = response.success
            if (crt_success == true) {
                const redirectUrl = response.redirect_url
                window.location = redirectUrl;
                // const newLessonName = response.new_lesson_name
                // const lessonAuthor = `{{ request.user }}`
                // var lessonsTbody = document.getElementById("lessons-tbody")
                // lessonsTbody.innerHTML += `
                // <tr>
                //     <td><a href="/lessons/${newLessonId}/detail/" class="link-dark" title="View/Edit Lesson">${newLessonName}</a></td>
                //     <td></td>
                //     <td>0 minute ago</td>
                //     <td><a href="/profile/${lessonAuthor}/" class="link-dark">${lessonAuthor}</a></td>
                //     <td><a href="/lessons/${newLessonId}/learn/" class="link-dark">Learn</a></td>
                //     <td><a href="/lessons/${newLessonId}/detele/" class="link-danger">Delete</a></td>
                // </tr> `

                // createAleartDiv.innerHTML = `
                // <div class="alert alert-success alert-dismissible fade show" role="alert">
                //     <strong>Success!</strong> Created lesson name '${newLessonName}'
                //     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                // </div>  `
                // lessonNameInput.value = ''
                // lessonNameInput.focus()
            }
            else {
                createAleartDiv.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Oops!</strong> Something went wrong.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>  `
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchRemoveLesson(lessonId) {
    removeLessonURL = `/lessons/${lessonId}/remove/`
    fetch(removeLessonURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
        }),
    })
        .then(response => response.json())
        .then(response => {
            const rmv_success = response.success
            if (rmv_success == true) {
                var lessonTable = document.getElementById("lesson-table")
                var lessonTr = document.getElementById(`lesson-tr-${lessonId}`)
                var lessonsLearningCounter = document.getElementById("lessons-learning-counter")

                lessonCounter = parseInt(lessonsLearningCounter.textContent)
                lessonsLearningCounter.innerHTML = lessonCounter - 1
                removeLessonOverlay.style.display = "none"
                lessonTable.deleteRow(lessonTr.rowIndex)
            }
            else {
                alert(`Oops! Something went wrong.`)
                location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchDeleteLesson(lessonId) {
    deleteLessonURL = `/lessons/${lessonId}/delete/`
    fetch(deleteLessonURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
        }),
    })
        .then(response => response.json())
        .then(response => {
            const dlt_success = response.success
            if (dlt_success == true) {
                var lessonTable = document.getElementById("lesson-table")
                var lessonTr = document.getElementById(`lesson-tr-${lessonId}`)
                var lessonsLearningCounter = document.getElementById("lessons-learning-counter")

                lessonCounter = parseInt(lessonsLearningCounter.textContent)
                lessonsLearningCounter.innerHTML = lessonCounter - 1
                deleteLessonOverlay.style.display = "none"
                lessonTable.deleteRow(lessonTr.rowIndex)
                //window.location = `/learn`;
            }
            else {
                alert(`Oops! Something went wrong.`)
                location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
