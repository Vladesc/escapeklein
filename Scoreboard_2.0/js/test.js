const video = document.getElementById('video');
const countdown = document.getElementById('countdown');
const startStopButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

let isCountdownRunning = false;
let interval;
let audio1 = new Audio("./media/1.mp3")
let audio2 = new Audio("./media/2.mp3")

startStopButton.addEventListener('click', toggleCountdown);

video.addEventListener('ended', () => {
    // video.classList.remove('fullscreen');
    video.parentElement.classList.remove("video-container_da")
    video.webkitExitFullscreen()
    startCountdown()
});

resetButton.addEventListener('click', () => {
    if (!isCountdownRunning) {
        clearInterval(interval);
        isCountdownRunning = false;
        countdown.textContent = '60:00';
        // zurücksetzen der progressbar
        let counter = document.querySelector(".counter")
        let strips = document.querySelectorAll('.block')
        startStopButton.classList.remove('stop')
        startStopButton.classList.add('start')
        strips.forEach(block => {

            if (block.classList.contains('erledigt'))
                block.remove("erledigt")
        })
        counter.innerText = 0
        counter.dataset.target = "0";
        zeichnen()
        NumberCounter()
    }
});

function startCountdown() {
    let timeLeft = 60 * 60; // 60 Minuten in Sekunden
    audio2.play()
    interval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(interval);
            countdown.textContent = '00:00';
            isCountdownRunning = false;
            startStopButton.classList.add('start')
        }
    }, 1000);
}

function toggleCountdown() {
    if (!isCountdownRunning) {
        video.play();
        video.parentElement.classList.add("video-container_da")
        video.webkitRequestFullscreen()
        isCountdownRunning = true;
        startStopButton.classList.remove('start')
        startStopButton.classList.add('stop')
    } else {
        clearInterval(interval);
        isCountdownRunning = false;
        startStopButton.classList.remove('stop')
        startStopButton.classList.add('start')
    }
}


/*************************************** Progress ****************************************************/

function zeichnen() {
    let rating = document.querySelector(".rating")
    let block = document.getElementsByClassName("block")
    let test = document.querySelector('.counter')
    let leuchte = Math.round(+test.getAttribute('data-target'))


    for (let i = 0; i < 100; i++) {
        rating.innerHTML += '<div class="block"></div>'
        block[i].style.transform = "rotate(" + 3.6 * i + "deg)"
        block[i].style.animationDelay = `${i / 90}s`
        block[i].id = i

        if (leuchte > i)
            block[i].classList.add('erledigt')
        else
            block[i].style.background = "#6B6B6BFF"

    }
}

function NumberCounter() {
    let counter = document.querySelector(".counter")
    let value = +counter.innerText
    let target = +counter.getAttribute('data-target')
    if (value < target) {
        if (+counter.innerText < 100)
            counter.innerText = Math.ceil(value + 1)
        setTimeout(() => {
            NumberCounter()
        }, 60)
    }
}

zeichnen()
NumberCounter()


document.getElementById('Fortschritt').addEventListener('click', () => {
    let count = document.querySelector(".counter")
    let counter = +document.querySelector(".counter").getAttribute("data-target")
    if (counter < 100 && isCountdownRunning) {
        counter = counter + 10 // Anzahl der klicks für den Fortschritt
        count.dataset.target = counter
        zeichnen()
        NumberCounter()
        audio1.play() //
    }

    if (counter > 99) {
        clearInterval(interval);
        isCountdownRunning = false;

    }

})
