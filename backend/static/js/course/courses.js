var title = document.getElementById('title')
var languagesS = document.getElementById('languages')
var coursesInfo = document.getElementById('courses-info')

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
                var newselectedLangCode = languagesS.value;
                var newspeakerLang = languagesS.options[languagesS.selectedIndex].text;
                fetchGetCourses(newselectedLangCode, newspeakerLang);

                window.history.replaceState({}, `Language Courses for ${newspeakerLang} Speakers`, `/courses/${languagesS.value}/`);
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
                    if (course.is_learning == true) {
                        var cou = `
                            <div id="${course.id}" class="course form-control form-control-lg pointer">
                                <strong>${course.name_course}</strong>
                                <span style="margin:0 2% 0 2%;">${course.learners} learners</span>
                                <div class="badge bg-success">Learning</div>
                            </div> <hr> `
                    }
                    else {
                        var cou = `
                            <div id="${course.id}" class="course form-control form-control-lg pointer">
                                <strong style="margin-right: 2%;">${course.name_course}</strong>
                                <span>${course.learners} learners</span>                        
                            </div> <hr> `
                    }
                    coursesInfo.innerHTML = cou
                });
            }
            else {
                coursesInfo.innerHTML = `There is no course for ${speakerLang} speakers at this moment.`
            }
            if (speakerLang == "All languages") {
                title.innerHTML = `<h4>Language Courses</h4>`
            }
            else {
                title.innerHTML = `
                    <h4>Language Courses for ${speakerLang} Speakers</h4>
                    <span>I speak </span>`
            }
            const allCourses = document.querySelectorAll('.course');
            allCourses.forEach(cou => cou.addEventListener('click', event => {
                window.location = `/courses/${cou.id}/enroll/`;
            }));
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}
fetchGetLanguages();
