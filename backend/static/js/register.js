var title = document.getElementById('title')
var iSpeak = document.getElementById("i-speak")
var languagesS = document.getElementById('languages')
var coursesInfo = document.getElementById('courses-info')

var courseIDInput = document.getElementById("id_courseid")
var registerBtn = document.getElementById("register-btn")
registerBtn.addEventListener("click", (event) => {
    if (courseIDInput.value.length == 0) {
        alert("You need to choose a course first.")
        event.preventDefault()
    }
})
var coursesSelected = document.getElementById("courses-selected")
var registerSection = document.getElementById("register-section")
var courseSection = document.getElementById("course-section")
if (error) {
    registerSection.style.display = "block"
    courseSection.style.display = "none"
    coursesSelected.innerHTML = `{{ course }}`
}
var turnBackBtn = document.getElementById("turn-back-btn")
turnBackBtn.addEventListener("click", (event) => {
    registerSection.style.display = "none"
    courseSection.style.display = "block"
})

function fetchGetLanguages() {
    fetch(getLanguageURL, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(response => {
            const languageObj = response.language_dict
            for (var prop in languageObj) {
                languagesS.append(new Option(languageObj[prop], prop))
            }
            if (languageCode) {
                for (let i = 0; i < languagesS.length; i++) {
                    if (languagesS.options[i].value === languageCode)
                        languagesS.selectedIndex = languagesS.options[i].index
                }
            }
            else {
                languagesS.selectedIndex = "0";
            }
            var selectedLangCode = languagesS.value;
            var speakerLang = languagesS.options[languagesS.selectedIndex].text;

            languagesS.addEventListener('change', e => {
                coursesInfo.innerHTML = ''
                courseIDInput.value = ``
                var newselectedLangCode = languagesS.value;
                var newspeakerLang = languagesS.options[languagesS.selectedIndex].text;
                fetchGetCourses(newselectedLangCode, newspeakerLang);

                //window.history.replaceState({}, `Language Courses for ${newspeakerLang} Speakers`, `/courses/${languagesS.value}/register/`);
            });

            fetchGetCourses(selectedLangCode, speakerLang);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

function fetchGetCourses(selectedLangCode, speakerLang) {
    fetch(`/get-courses/${selectedLangCode}/`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(response => {
            const coursesArray = response.course_list
            if (coursesArray.length > 0) {
                coursesArray.map(course => {
                    var cou = `
                        <div class="form-control form-control-lg" style="display:flex">
                            <div id="${course.id}" class="course" style="cursor: pointer;">${course.name_course}</div>
                            <span style="margin-left: auto;">${course.learners} learners</span>
                        </div><hr> `
                    coursesInfo.innerHTML = cou
                });
            }
            else {
                coursesInfo.innerHTML = `There is no course for ${speakerLang} speakers at this moment.`
            }
            if (speakerLang == "All languages") {
                title.innerHTML = `<h4>Language Courses</h4>`
                iSpeak.style.display = "none"
            }
            else {
                title.innerHTML = `<h4>Language Courses for ${speakerLang} Speakers</h4>`
                iSpeak.style.display = "block"
            }
            const allCourses = document.querySelectorAll('.course');
            allCourses.forEach(cou => cou.addEventListener('click', event => {
                // fetch get info in course and show to user or nahhhh
                courseIDInput.value = cou.id
                coursesSelected.innerHTML = `Course: ${cou.innerHTML}`
                registerSection.style.display = "block"
                courseSection.style.display = "none"
                //window.location = `/courses/${selectedLangCode}/register?courseid=${cou.id}/`;
            }));
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}
fetchGetLanguages();

