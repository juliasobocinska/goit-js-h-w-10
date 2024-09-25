// Opisany w dokumentacji
import iziToast from "izitoast";
// Kolejny import stylów
import "izitoast/dist/css/iziToast.min.css";

document.querySelector(".form").addEventListener("submit", function(event) {
    event.preventDefault();

    //pobieranie danych z formularza
    const delay = parseInt(event.target.delay.value);
    const state = event.target.state.value;
    
    const promise = new Promise ((fulfilled, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                fulfilled(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
    
    promise
    .then(value => {
        iziToast.success({
            title: false,
            icon: false,
            message: `✅ Fulfilled promise in ${delay}ms.`,
            position: 'topRight',
        });
    })
    .catch(error => {
        iziToast.error ({
            title: false,
            icon: false,
            message: `❌ Rejected promise in ${delay}ms.`,
            position: 'topRight',
        });
    });
});