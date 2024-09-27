import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from 'izitoast';
import 'iziToast/dist/css/iziToast.min.css';

// Inicjalizacja przycisku na disabled od początku
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

//zmienna do przechowywania wybranej daty
let userSelectedDate;

// Konfiguracja flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: (selectedDates) => {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    
    if (userSelectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      console.log("Great, you chose a correct date:", userSelectedDate);
      startBtn.disabled = false;
    }
  }
};

flatpickr("#datetime-picker", options);

// Funkcja do aktualizacji timera
function updateTimer() {

  //sprawdzenie czy funkcja wybrała datę, jeśli nie, kończy działanie
  if (!userSelectedDate) return;

  const currentDate = new Date();
  const finalTime = userSelectedDate - currentDate;
  
  //jeśli finalTime jest mniejszy bądź równy zero zatrzymuje licznik i wyrównuje go do zera
  if (finalTime <= 0) {
    clearInterval(countdownInterval);
    document.querySelector('[data-days]').textContent = '00';
    document.querySelector('[data-hours]').textContent = '00';
    document.querySelector('[data-minutes]').textContent = '00';
    document.querySelector('[data-seconds]').textContent = '00';
    return;
  }

  const timeLeft = convertMs(finalTime);
  
    function addLeadingZero(value) {

      const strValue = String(value);
      const leadingZero = strValue.padStart(2, '0');
      
      return leadingZero;
    }

    const timeWithLeadingZero = {
      days: addLeadingZero(timeLeft.days),
      hours: addLeadingZero(timeLeft.hours),
      minutes: addLeadingZero(timeLeft.minutes),
      seconds: addLeadingZero(timeLeft.seconds),
    };

    document.querySelector('[data-days]').textContent = timeWithLeadingZero.days;
    document.querySelector('[data-hours]').textContent = timeWithLeadingZero.hours;
    document.querySelector('[data-minutes]').textContent = timeWithLeadingZero.minutes;
    document.querySelector('[data-seconds]').textContent = timeWithLeadingZero.seconds;

  
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

startBtn.addEventListener('click', () => {
  setInterval(updateTimer, 1000);
});