function initFeatures(){
    document.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) { section.scrollIntoView({ behavior: 'smooth' }); }
      });
    });

    const boxes = document.querySelectorAll(".box");
    window.addEventListener("scroll", () => {
      boxes.forEach(box => {
        const rect = box.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) { box.classList.add("visible"); }
      });
    });

    const text = "Smart study assistant";
    let i = 0;
    function typeEffect() {
      if (i < text.length) {
        document.querySelector(".heading").innerHTML = text.substring(0, i+1);
        i++;
        setTimeout(typeEffect, 100);
      }
    }
    typeEffect();
  }

  window.onload = () => {
    setTimeout(() => {
      document.getElementById("preloader").style.opacity = "0";
      document.getElementById("preloader").style.visibility = "hidden";
      initFeatures();
    }, 2000);
  };
    function openModal(id) {
    document.getElementById(id).style.display = 'flex';
  }
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  // Close modal when clicking outside
  window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  }

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Hide previous messages
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'none';

    // Simple validation (you can customize these conditions)
    if (password.length < 6) {
        showSignupError('Password must be at least 6 characters long');
        return;
    }

    // For demonstration, let's assume any email with 'admin' fails
    if (email.includes('wrong') || password === 'wrong') {
        showSignupError('Invalid email or password. Please try again.');
        return;
    }

    // Success case
    showSignupSuccess('Account created successfully! Welcome to MyStudyLife!');

    // Optional: Close modal after success
    setTimeout(() => {
        closeModal('signupModal');
    }, 2000);
}

// Handle login form submission  
function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Hide previous messages
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'none';

    // Simple validation - customize these conditions as needed
    if (email === 'user@test.com' && password === 'password123') {
        showLoginSuccess('Login successful! Welcome back!');
        setTimeout(() => {
            closeModal('loginModal');
        }, 2000);
        return;
    }

    // Show error for wrong credentials
    showLoginError('Invalid email or password. Please check your credentials and try again.');
}

// Helper functions to show messages
function showSignupError(message) {
    const errorDiv = document.getElementById('signupError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSignupSuccess(message) {
    const successDiv = document.getElementById('signupSuccess');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showLoginSuccess(message) {
    const successDiv = document.getElementById('loginSuccess');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}