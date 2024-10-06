$(document).ready(function() {
    // Slideshow
    let slideIndex = 0;
    const slides = document.getElementsByClassName("mySlides");
    slides[0].classList.add('active'); // Make the first slide active initially
    
    function showSlides() {
        let prevIndex = slideIndex;
        slideIndex++;
        if (slideIndex >= slides.length) {slideIndex = 0}

        // Remove active and prev classes from all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active', 'prev');
        }

        // Add prev class to the previous slide
        slides[prevIndex].classList.add('prev');

        // Add active class to the current slide
        slides[slideIndex].classList.add('active');

        setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

    // Start the slideshow after a delay to allow the first image to be visible
    setTimeout(showSlides, 5000);

    // Countdown timer
    const weddingDate = new Date("Nov 15, 2025 16:00:00").getTime();

    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("timer").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "¡Es el gran día!";
        }
    }, 1000);

    /* RSVP form submission (placeholder - needs backend)
    $("#rsvp-form").submit(function(e) {
        e.preventDefault();
        alert("Woohoo");
    });*/
});

document.addEventListener('DOMContentLoaded', function() {
    //const url "http://localhost:5000"
    // const url = "https://melbran-wed-invite.onrender.com"
    // Get the query string from the current URL
    const queryString = window.location.search;
    // Create a URLSearchParams object
    const urlParams = new URLSearchParams(queryString);
    // Get the value of a specific query parameter (e.g., "name")
    const name = urlParams.get('familyCode');

    const form = document.getElementById('rsvp-form');
    const familyNameInput = document.getElementById('family-name');
    const sheetLineInput = document.getElementById('sheet-line');
    const inviteInfo = document.getElementById('invite-info');
    const numPersonsSpan = document.getElementById('num-persons');
    const attendanceSelect = document.getElementById('attendance');
    const numAttendingInput = document.getElementById('num-attending');
    const submitButton = document.getElementById('submit-button');

    /*familyNameInput.addEventListener('blur', async function() {
        console.log("Family name input:", familyNameInput);
        const familyName = this.value;*/
    async function getInviteInfo(fCode){
        if (fCode) {
            try {
                const response = await fetch(`/api/invite-info?familyCode=${fCode}`);
                const data = await response.json();
                if (response.ok) {
                    inviteInfo.style.display = 'block';
                    numPersonsSpan.textContent = data.numPersons;
                    familyNameInput.value = data.familyName;
                    sheetLineInput.value = data.sheetLine;
                    familyNameInput.disabled = true;
                    familyNameInput.style.border = 'none';
                    if (data.accept == "accept" || data.accept == "decline") {
                        attendanceSelect.style.display = 'none';
                        submitButton.disabled = true;
                        submitButton.style.backgroundColor = '#ccc';
                        submitButton.innerHTML = 'Gracias por confirmar'
                        numPersonsSpan.innerText = 'Confirmaste ' + data.confirmNumber + ' personas'
                        if(data.accept == "decline"){
                            submitButton.innerHTML = 'Gracias por responder';
                            inviteInfo.style.display = 'none';
                        }
                    }
                    for (let i = 0; i < data.numPersons; i++) {
                        const option = document.createElement('option');
                        option.value = i + 1;
                        option.textContent = i + 1;
                        numAttendingInput.appendChild(option);
                    }
                } else {
                    familyNameInput.style.display = 'none';
                    attendanceSelect.style.display = 'none';
                    submitButton.style.display = 'none';
                    inviteInfo.style.display = 'block';
                    inviteInfo.innerHTML = '<p>Por favor confirma tu asistencia por alguno de los siguientes medios:</p><li>81 1587 5573</li><li>81 1587 5573</li>';
                }
            } catch (error) {
                familyNameInput.style.display = 'none';
                attendanceSelect.style.display = 'none';
                submitButton.style.display = 'none';
                inviteInfo.style.display = 'block';
                inviteInfo.innerHTML = '<p>Por favor confirma tu asistencia por alguno de los siguientes medios:</p><li>81 1587 5573</li><li>81 1587 5573</li>';
            }
        }
    }

    let load = getInviteInfo(name);

    attendanceSelect.addEventListener('change', function() {
        numAttendingInput.style.display = this.value === 'accept' ? 'block' : 'none';
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const familyCode = name;
        const status = attendanceSelect.value;
        const numAttending = numAttendingInput.value;
        const sheetLine = sheetLineInput.value;
        try {
            const response = await fetch(`/api/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "familyCode": familyCode, 
                    "confirm": status, 
                    "numAttending": numAttending,
                    "sheetLine": sheetLine
                }),
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                attendanceSelect.style.display = 'none';
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#ccc';
                submitButton.innerHTML = 'Gracias por confirmar'
                attendanceSelect.style.display = 'none';
                numAttendingInput.style.display = 'none';
                numPersonsSpan.innerText = 'Confirmaste ' + numAttending + ' personas'
            } else {
                //alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar tu confirmación.');
        }
    });
});