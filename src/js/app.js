//Url, по которому буду соединяться с сервером
let wsUrl = 'wss://echo-ws-service.herokuapp.com';

let sendMessage = document.querySelector('.data-input__send');
let getGeolocation = document.querySelector('.data-input__geolocation');
let chatList = document.querySelector('.chat-list');
let inputEl = document.querySelector('.data-input__input');
let statusEl = document.querySelector('.status');

//создаю функцию, которая принимает message и добавляет его в поле
function writeToOuptut(message) {
    let messageEl = document.createElement("li");
    messageEl.className = "chat-list__element";
    messageEl.innerHTML = message;
    chatList.appendChild(messageEl);
}

//создаю подключение
let websocket = new WebSocket(wsUrl);
websocket.onopen = function (event) {
    console.log("Connected");
    statusEl.innerHTML = "Статус подключения онлайн-чата: Connected";
}

websocket.close = function (event) {
    console.log("Disconnected");
    statusEl.innerHTML = "Статус подключения онлайн-чата: Disconnected";
}

//получение сообщения от сервера
websocket.onmessage = function(event){
    writeToOuptut('Сообщение от сервера: ' + event.data);
}

//в случае ошибки
websocket.onerror = function (event) {
    console.log("ERROR");
    statusEl.innerHTML = "Статус подключения онлайн-чата: ERROR";
}


//создаю обработчик кнопки "отправить сообщение"
sendMessage.addEventListener('click',
    () => {
        let message = inputEl.value;
        writeToOuptut('Ваше сообщение: ' + message);
        websocket.send(message);
        console.log(message);
        inputEl.value = '';
    }
    )

//добавляю элемент при фокусе на поле ввода
inputEl.addEventListener(
    'focus',
    () => {
        //создаю новый элемент и добавляю его с классом chat-list__element-focus
        let messageFocus = document.createElement("li");
        messageFocus.className = "chat-list__element chat-list__element-focus";
        messageFocus.innerHTML = '&#149; &#149; &#149; &#149; &#149;';
        chatList.appendChild(messageFocus);
    }
)


//удаляю элемент при отсутствии фокуса на поле ввода
inputEl.addEventListener(
    'blur',
    () => {
        //нахожу элемент с классом chat-list__element-focus и удаляю его
        let elementFocus = document.querySelector('.chat-list__element-focus');
        chatList.removeChild(elementFocus);
    }
)

//обработчик имитации печатания текста
inputEl.addEventListener(
    'keydown',
    () => {
        let elementFocus = document.querySelector('.chat-list__element-focus');
        let i = 0;
            if (elementFocus.innerHTML.length <= 8){
                elementFocus.innerHTML += '&#149; ';
                i++;
            }
            else
            {
                i = 0;
                elementFocus.innerHTML = '';
            }
        console.log(elementFocus.innerHTML.length);
    }
)

//создаю функцию для вывода ошибки о получении местоположения

let errorGeolocation = () => {
    let messageEl = document.createElement("li");
    messageEl.className = "chat-list__element";
    messageEl.innerHTML = "Невозможно получить ваше местоположение";
    chatList.appendChild(messageEl);
}

//создаю функцию при успешном получении местоположения

let successGeolocation = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let messageEl = document.createElement("li");
    messageEl.className = "chat-list__element";
    messageEl.innerHTML = `<a href="https://yandex.ru/maps/?ll=${longitude},${latitude}&z=17&l=sat" target="_blank">Ваша геопозиция</a>`;
    chatList.appendChild(messageEl);
}

//Навешиваю обработчик на кнопку получения геолокации и прописываю функцию

getGeolocation.addEventListener('click', () => {
    //проверяю, есть ли поддержка Geolocation
    if (!navigator.geolocation){
        let messageEl = document.createElement("li");
        messageEl.className = "chat-list__element";
        messageEl.innerHTML = "Нет поддержки Geolocation в браузере";
        chatList.appendChild(messageEl);
    }
    else {
        //передаю в качестве атрибутов два коллбэка - успешное и неуспешное выполнение запроса
        navigator.geolocation.getCurrentPosition(successGeolocation, errorGeolocation);
    }
})