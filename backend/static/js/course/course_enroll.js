var startBtn = document.getElementById('start-btn')
startBtn.addEventListener('click', e => {
    e.preventDefault();
    fetch(enrollURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
        .then(response => response.json())
        .then(response => {
            const er_success = response.is_success
            if (er_success == true) {
                window.location = '/';
            }
            else{
                alert(`Oops! Something went wrong.`)
                location.reload();
            }
        })
        .catch((error) => {
        });
})

