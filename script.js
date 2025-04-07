const latinQuote = document.getElementById("latin-quote");
const italianTranslation = document.getElementById("italian-translation");
const newQuoteButton = document.getElementById("new-quote-button");


// script.js

const configButton = document.getElementById("config-button");
const configPanel = document.getElementById("config-panel");
const apiKeyInput = document.getElementById("api-key");

let apiKey = localStorage.getItem("apiKey") || "";
apiKeyInput.value = apiKey;

apiKeyInput.addEventListener("change", (event) => {
    apiKey = event.target.value;
    localStorage.setItem("apiKey", apiKey);
    console.log("apiKeyInput: API Key changed", apiKey);
});

configButton.addEventListener("click", () => {
    console.log("configButton: Clicked");
    configPanel.style.display = configPanel.style.display === "none" ? "block" : "none";
});

async function fetchQuote() {
    const apiKey = localStorage.getItem("apiKey") || "";
    const apiUrl = "https://openrouter.ai/api/v1";
    const model = "meta-llama/llama-4-maverick:free";
    const prompt = "Generate a random Latin quote with its Italian translation.";

    console.log("fetchQuote: API Key", apiKey);
    console.log("fetchQuote: Calling API");

    try {
        const response = await fetch(apiUrl + "/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    "role": "user",
                    "content": prompt
                }],
            }),
        });

        console.log("fetchQuote: API Response", response);

        const data = await response.json();

        console.log("fetchQuote: Parsed Response", data);

        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            latinQuote.textContent = data.choices[0].message.content;
            italianTranslation.textContent = "";
        } else {
            latinQuote.textContent = "Failed to fetch quote.";
            italianTranslation.textContent = "";
        }
    } catch (error) {
        console.error("Error fetching quote:", error);
        latinQuote.textContent = "Error fetching quote.";
        italianTranslation.textContent = "";
    }
}

newQuoteButton.addEventListener("click", fetchQuote);

fetchQuote();

// Service Worker for installability
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration);
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    });
}