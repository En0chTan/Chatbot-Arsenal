const modelSelector = document.getElementById('modelSelector');
const content = document.getElementById('content');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const themeToggle = document.getElementById('themeToggle');

let isAnswerLoading = false;
let answerSectionId = 0;

// Apply saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

// Toggle theme between light and dark
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Event listeners for sending messages
sendButton.addEventListener('click', () => handleSendMessage());
chatInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') handleSendMessage();
});

// Handle sending user message
function handleSendMessage() {
    const question = chatInput.value.trim();
    if (question === '' || isAnswerLoading) return;

    sendButton.classList.add('send-button-nonactive');
    addQuestionSection(question);
    chatInput.value = '';

    getAnswer(question); // 🔥 This should go here
}

// Call OpenRouter API
function getAnswer(question) {
    const selectedModel = modelSelector.value;

    const payload = {
        model: selectedModel,
        messages: [
            {
                role: "user",
                content: question
            }
        ]
    };

    fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            const resultData = data.choices?.[0]?.message?.content || "[No response]";
            isAnswerLoading = false;
            addAnswerSection(resultData);
        })
        .catch(error => {
            isAnswerLoading = false;
            addAnswerSection("[Error: " + error.message + "]");
        })
        .finally(() => {
            scrollToBottom();
            sendButton.classList.remove('send-button-nonactive');
        });
}

// Display user question in the UI
function addQuestionSection(message) {
    isAnswerLoading = true;

    const sectionElement = document.createElement('section');
    sectionElement.className = 'question-section';
    sectionElement.textContent = message;
    content.appendChild(sectionElement);

    addAnswerSection(message);
    scrollToBottom();
}

// Display bot answer or loading animation
function addAnswerSection(message) {
    if (isAnswerLoading) {
        answerSectionId++;
        const sectionElement = document.createElement('section');
        sectionElement.className = 'answer-section';
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = answerSectionId;
        content.appendChild(sectionElement);
        getAnswer(message);
    } else {
        const answerSectionElement = document.getElementById(answerSectionId);
        answerSectionElement.textContent = message;
    }
}

// SVG loading animation
function getLoadingSvg() {
    return `<svg style="height: 25px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="40" cy="65">
            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
        </circle>
        <circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="100" cy="65">
            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
        </circle>
        <circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="160" cy="65">
            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
        </circle>
    </svg>`;
}

// Message scroll behavior
function scrollToBottom() {
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
    });
}
