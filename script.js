const body = document.body

const btnTheme = document.querySelector('.fa-moon')
const btnHamburger = document.querySelector('.fa-bars')

const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass)
  btnTheme.classList.add(btnClass)
}

const getBodyTheme = localStorage.getItem('portfolio-theme')
const getBtnTheme = localStorage.getItem('portfolio-btn-theme')

addThemeClass(getBodyTheme, getBtnTheme)

const isDark = () => body.classList.contains('dark')

const setTheme = (bodyClass, btnClass) => {
  body.classList.remove(localStorage.getItem('portfolio-theme'));
  btnTheme.classList.remove(localStorage.getItem('portfolio-btn-theme'));

  addThemeClass(bodyClass, btnClass);

  localStorage.setItem('portfolio-theme', bodyClass);
  localStorage.setItem('portfolio-btn-theme', btnClass);

  // Ensure no inline styles are applied to the education section
  const educationSection = document.querySelector('.education-section');
  if (educationSection) {
    educationSection.style.backgroundColor = ''; // Clear inline background color
    educationSection.style.color = ''; // Clear inline text color
  }
}

const toggleTheme = () =>
	isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun')

btnTheme.addEventListener('click', toggleTheme)

const displayList = () => {
	const navUl = document.querySelector('.nav__list')

	if (btnHamburger.classList.contains('fa-bars')) {
		btnHamburger.classList.remove('fa-bars')
		btnHamburger.classList.add('fa-times')
		navUl.classList.add('display-nav-list')
	} else {
		btnHamburger.classList.remove('fa-times')
		btnHamburger.classList.add('fa-bars')
		navUl.classList.remove('display-nav-list')
	}
}

btnHamburger.addEventListener('click', displayList)

const scrollUp = () => {
	const btnScrollTop = document.querySelector('.scroll-top')

	if (
		body.scrollTop > 500 ||
		document.documentElement.scrollTop > 500
	) {
		btnScrollTop.style.display = 'block'
	} else {
		btnScrollTop.style.display = 'none'
	}
}

document.addEventListener('scroll', scrollUp)

//  my script 

const texts = ["Front end Developer.", "Data Analyst.", "Python Enthusiast.","Machine Learning Enthusiast"];
let textIndex = 0;
let letterIndex = 0;

function typeEffect() {
  const typingElement = document.getElementById("typing-effect");
  if (letterIndex < texts[textIndex].length) {
    typingElement.textContent += texts[textIndex].charAt(letterIndex);
    letterIndex++;
    setTimeout(typeEffect, 50); // Adjust the typing speed here (in milliseconds)
  } else {
    // Move to the next text
    setTimeout(eraseEffect, 1000); // Wait for 2 seconds before erasing
  }
}

function eraseEffect() {
  const typingElement = document.getElementById("typing-effect");
  if (typingElement.textContent.length > 0) {
    typingElement.textContent = typingElement.textContent.slice(0, -1);
    setTimeout(eraseEffect, 50); // Adjust the erasing speed here (in milliseconds)
  } else {
    // Move to the next text or cycle back to the first one
    textIndex = (textIndex + 1) % texts.length;
    letterIndex = 0;
    setTimeout(typeEffect, 500); // Wait for 0.5 seconds before typing the next text
  }
}

// Start the typing effect when the page loads
document.addEventListener("DOMContentLoaded", typeEffect);

// slider

$(document).ready(function(){
    $('.row').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: true,
      prevArrow: '<button type="button" class="slick-prev">Previous</button>',
      nextArrow: '<button type="button" class="slick-next">Next</button>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  });

////////////////////////// 

// Backend API URLs (Replace with your FastAPI server URLs)
const textApiUrl = "https://a218-34-125-133-139.ngrok-free.app/prompt";
const imageApiUrl = "https://a218-34-125-133-139.ngrok-free.app/generate";

// Load sound effects
const userMessageSound = new Audio('user-message.mp3');
const botMessageSound = new Audio('bot-response.mp3');
const toggleSound = new Audio('toggle-sound.mp3'); // Sound for toggle action

// Function to play user message sound
function playUserMessageSound() {
    userMessageSound.currentTime = 0; // Reset playback to start
    userMessageSound.play();
}

// Function to play bot message sound
function playBotMessageSound() {
    botMessageSound.currentTime = 0; // Reset playback to start
    botMessageSound.play();
}

// Function to play toggle sound
function playToggleSound() {
    toggleSound.currentTime = 0; // Reset playback to start
    toggleSound.play();
}

function saveChatHistory() {
    const chatHistory = document.getElementById('chatbot-response').innerHTML;
    localStorage.setItem('chatHistory', chatHistory);
}

const saveChatToggle = document.getElementById('saveChatToggle');
const chatbotResponse = document.getElementById('chatbot-response');
let isChatPersistenceEnabled = JSON.parse(localStorage.getItem('isChatPersistenceEnabled')) || false; // Load saved state or default to false

// Function to display the enable/disable message centered inside the chat space
function displayChatMessageCentered(text) {
    const message = document.createElement('div');
    message.classList.add('chat-message', 'centered-message');
    message.innerHTML = text;
    chatbotResponse.appendChild(message);
    chatbotResponse.scrollTop = chatbotResponse.scrollHeight; // Auto-scroll to the bottom

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Function to toggle save chat state and update local storage
saveChatToggle.addEventListener('click', () => {
    isChatPersistenceEnabled = !isChatPersistenceEnabled;
    localStorage.setItem('isChatPersistenceEnabled', JSON.stringify(isChatPersistenceEnabled)); // Save state

    playToggleSound(); // Play toggle sound

    if (isChatPersistenceEnabled) {
        saveChatToggle.innerHTML = '<i class="fas fa-folder-open"></i>';
        saveChatToggle.title = 'Save Chat is Enabled';
        displayChatMessageCentered('Save Chat is enabled');
        saveChatHistory(); // Save chat history when enabling
    } else {
        saveChatToggle.innerHTML = '<i class="fas fa-folder"></i>';
        saveChatToggle.title = 'Save Chat is Disabled';
        displayChatMessageCentered('Save Chat is disabled');
        localStorage.removeItem('chatHistory'); // Clear saved chat when disabling
    }
});

// Save chat history to local storage if persistence is enabled
function saveChatHistory() {
    if (isChatPersistenceEnabled) {
        const chatHistory = chatbotResponse.innerHTML;
        localStorage.setItem('chatHistory', chatHistory);
    }
}

// Load chat history from local storage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatbotResponse.innerHTML = savedHistory;
    }
}

// Add load and unload event listeners
window.addEventListener('beforeunload', saveChatHistory); // Save on unload

// Check if persistence is enabled and load the chat history on page load
window.addEventListener('load', () => {
    if (isChatPersistenceEnabled) { // Check if persistence was enabled
        loadChatHistory(); // Load saved history if enabled
    }

    // Set the correct icon and title based on the persistence state
    if (isChatPersistenceEnabled) {
        saveChatToggle.innerHTML = '<i class="fas fa-folder-open"></i>'; // Set icon for enabled state
        saveChatToggle.title = 'Save Chat is Enabled';
    } else {
        saveChatToggle.innerHTML = '<i class="fas fa-folder"></i>'; // Set icon for disabled state
        saveChatToggle.title = 'Save Chat is Disabled';
    }
});

// Toggle Overlay on Info Icon Click
const infoIcon = document.getElementById('info-icon');
const infoOverlay = document.getElementById('info-overlay');

infoIcon.addEventListener('click', () => {
infoOverlay.classList.toggle('show');
});

// Open/Close Chatbot
document.getElementById('open-chatbot').onclick = function() {
    const chatbot = document.getElementById('chatbot');

    // Toggle the 'show' class on the chatbot element
    chatbot.classList.toggle('show');

    // If chatbot just became visible, display the greeting message
    if (chatbot.classList.contains('show') && !chatbot.dataset.greetingDisplayed) {
        displayGreetingMessage();
        chatbot.dataset.greetingDisplayed = true;  // Mark that the greeting has been displayed
    }
};

// Image Preview Functionality
const imageInput = document.getElementById('image-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
imagePreviewContainer.classList.add('show');

imageInput.addEventListener('change', function() {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'flex';  // Show preview container
        };
        reader.readAsDataURL(file);
    }
});

// Close Image Preview
document.getElementById('close-preview').addEventListener('click', function() {
    imagePreviewContainer.style.display = 'none';
    imagePreviewContainer.classList.remove('show');
    document.getElementById('image-input').value = ''; // Clear input
});

// Function to display greeting message with animation
function displayGreetingMessage() {
    const greetingMessage = "Greetings, how can I assist you today?";
    const responseDiv = document.getElementById('chatbot-response');
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = "message-container";

    const profileIcon = document.createElement('div');
    profileIcon.className = "profile-icon";

    // Add Font Awesome bot icon to profile icon div
    const botIcon = document.createElement('i');
    botIcon.className = "fas fa-robot";
    profileIcon.appendChild(botIcon);

    // Add bounce animation dynamically on hover
document.querySelectorAll('.profile-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.classList.add('fa-bounce');
    });

    icon.addEventListener('mouseleave', () => {
        icon.classList.remove('fa-bounce');
    });
});
    const botMessage = document.createElement('div');
    botMessage.className = "bot-message";

    botMessageDiv.appendChild(profileIcon);
    botMessageDiv.appendChild(botMessage);
    responseDiv.appendChild(botMessageDiv);

    let index = 0;
    const interval = setInterval(() => {
        if (index < greetingMessage.length) {
            botMessage.textContent += greetingMessage[index];
            index++;
        } else {
            clearInterval(interval);
        }
    }, 50); // Adjusted speed to 50ms for faster animation

    scrollToBottom(); // Scroll to the bottom after displaying the greeting message
}

// Send Message

let isProcessing = false; // Add this line


async function sendChatMessage() {
const textInput = document.getElementById('chatbot-input').value.trim();
const imageInputFile = document.getElementById('image-input').files[0];
const responseDiv = document.getElementById('chatbot-response');

// Add this line to prevent sending messages while processing
if (isProcessing || (!textInput && !imageInputFile)) return; 

// Set the processing flag to true to disable further inputs
isProcessing = true;

// Disable send button and Enter key during response generation
document.getElementById('chatbot-button').disabled = true;
document.getElementById('chatbot-input').disabled = true;

// Clear the input immediately
document.getElementById('chatbot-input').value = '';

// Hide image preview immediately
document.getElementById('image-preview-container').style.display = 'none';

    let formData = new FormData();
    let url = '';

    // If there's text input
    if (textInput) {
        responseDiv.innerHTML += `
            <div class="message-container">
                <div class="user-message">${textInput}</div>
                <div class="profile-icon"><i class="fas fa-user"></i></div> <!-- User icon on the right -->
            </div>`;
        playUserMessageSound(); // Play user message sound
        url = `${textApiUrl}?prompt=${encodeURIComponent(textInput)}`;

    } else if (imageInputFile) {
        // Handle Image Input
        const imageURL = URL.createObjectURL(imageInputFile);
        responseDiv.innerHTML += `
            <div class="message-container">
                <div class="user-message"><img src="${imageURL}" alt="Image" style="max-width: 100px;"></div>
                <div class="profile-icon"><i class="fas fa-user"></i></div> <!-- User icon on the right -->
            </div>`;
        playUserMessageSound(); // Play user message sound for image input
        formData.append('file', imageInputFile);
        url = imageApiUrl;
    } else {
        return;
    }

    responseDiv.innerHTML += '<div class="message-container"><div class="bot-message blinking-dots"></div></div>'; // Bot icon on the left (no profile icon)
    scrollToBottom();

    try {
        const response = await fetch(url, { method: 'POST', body: formData });
        const data = await response.json();

        // Remove waiting dots
        const waitingDots = document.querySelector('.blinking-dots');
        waitingDots.parentNode.removeChild(waitingDots);

        // Display the response
        if (data.response) {
            responseDiv.innerHTML += `
                <div class="message-container">
                    <div class="profile-icon"><i class="fas fa-robot"></i></div> <!-- Bot icon on the left -->
                    <div class="bot-message">${data.response}</div>
                </div>`;
            playBotMessageSound(); // Play bot message sound
        } else if (data.error) {
            responseDiv.innerHTML += `
                <div class="message-container">
                    <div class="profile-icon"><i class="fas fa-robot"></i></div> <!-- Bot icon on the left -->
                    <div class="bot-message">Error: ${data.error}</div>
                </div>`;
            playBotMessageSound(); // Play bot message sound for error
        }

        scrollToBottom();

        // Clear the image input
        document.getElementById('image-input').value = '';

    } catch (err) {
        console.error(err);
    }
    finally {
// Enable send button and Enter key after the response
document.getElementById('chatbot-button').disabled = false;
document.getElementById('chatbot-input').disabled = false;
isProcessing = false; // Reset the processing flag
}
}

// Trigger message on button click
document.getElementById('chatbot-button').addEventListener('click', sendChatMessage);

// Handle Enter key press
document.getElementById('chatbot-input').addEventListener('keydown', function(event) {
if (event.key === 'Enter' && !event.shiftKey && !isProcessing) { // Add the check for isProcessing
    event.preventDefault();
    sendChatMessage();
}
});

// Trigger file upload
document.getElementById('upload-button').addEventListener('click', () => {
    document.getElementById('image-input').click();
});

// Scroll chat to bottom
function scrollToBottom() {
    const chatbotBody = document.getElementById('chatbot-body');
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to the bottom of the chat body
}