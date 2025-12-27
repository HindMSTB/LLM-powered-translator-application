
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;


const englishTextArea = document.getElementById("englishText");
const darijaTextArea = document.getElementById("darijaText");
const startSpeechBtn = document.getElementById("startSpeechBtn");
const translateBtn = document.getElementById("translateBtn");

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        startSpeechBtn.textContent = '🔴 Stop Speaking';
        startSpeechBtn.style.backgroundColor = '#f44336';
        console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

       
        if (finalTranscript) {
            englishTextArea.value += finalTranscript;
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert(`Speech recognition error: ${event.error}`);
        stopListening();
    };

    recognition.onend = () => {
        if (isListening) {
            try {
                recognition.start();
            } catch (error) {
                console.error('Error restarting recognition:', error);
                stopListening();
            }
        } else {
            stopListening();
        }
    };
} else {
   
    startSpeechBtn.disabled = true;
    startSpeechBtn.textContent = '❌ Speech Not Supported';
    console.warn('Speech recognition not supported in this browser');
}


function stopListening() {
    isListening = false;
    startSpeechBtn.textContent = '🎤 Start Speaking';
    startSpeechBtn.style.backgroundColor = '#4CAF50';
}


startSpeechBtn.addEventListener("click", () => {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
        return;
    }

    if (isListening) {
        recognition.stop();
        stopListening();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            alert('Error starting speech recognition. Please try again.');
        }
    }
});


translateBtn.addEventListener("click", async () => {
    const text = englishTextArea.value.trim();

    if (!text) {
        alert("Please enter some text to translate.");
        return;
    }

    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";
    darijaTextArea.value = "⏳ Traduction en cours...";

  
    const credentials = btoa("hind:0000");

    try {
        const response = await fetch("http://localhost:8080/api/translator/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + credentials
            },
            body: JSON.stringify({ text })
        });

        const rawText = await response.text();

        if (!response.ok) {
            darijaTextArea.value = `❌ Erreur (${response.status}): ${rawText}`;
            console.error('Translation error:', response.status, rawText);
            return;
        }

   
        const data = JSON.parse(rawText);
        darijaTextArea.value = data.translation || "Pas de traduction reçue";
        console.log('Translation successful:', data);

    } catch (err) {
        darijaTextArea.value = `❌ Erreur de connexion: ${err.message}`;
        console.error('Connection error:', err);
        

        if (err.message.includes('Failed to fetch')) {
            alert('Cannot connect to the server. Make sure your backend is running on http://localhost:8080');
        }
    } finally {
        translateBtn.disabled = false;
        translateBtn.textContent = "Translate";
    }
});


englishTextArea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        translateBtn.click();
    }
});


function clearAll() {
    englishTextArea.value = '';
    darijaTextArea.value = '';
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clearAll };
}

console.log('Darija Translator initialized successfully');