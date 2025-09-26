const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    function sendMessage() {
      const message = userInput.value.trim();
      if (message === "") return;

      addMessage(message, "user");

      setTimeout(() => {
        addMessage("You said: " + message, "bot");
      }, 800);

      userInput.value = "";
    }

    function addMessage(text, sender) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
      messageElement.textContent = text;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });

    function slidbar() {
      document.body.classList.toggle("open");
    }



  // Replace with your Gemini API Key
  const API_KEY = "YOUR_GEMINI_API_KEY";

  async function getGeminiResponse(prompt) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "❌ Sorry, I couldn’t get a response.";
      }
    } catch (error) {
      console.error("Error:", error);
      return "⚠️ Error connecting to Gemini API.";
    }
  }

  // Override sendMessage function to use Gemini
  async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    userInput.value = "";

    // Show "typing..." temporarily
    const typingMessage = document.createElement("div");
    typingMessage.classList.add("message", "bot-message");
    typingMessage.textContent = "🤖 Typing...";
    chatBox.appendChild(typingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Get response from Gemini
    const reply = await getGeminiResponse(message);

    // Replace typing... with real reply
    typingMessage.remove();
    addMessage(reply, "bot");
  }