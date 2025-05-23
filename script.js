// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjY-pE5jxQJgKqDZrcE7Im66_5r-X_mRA",
  authDomain: "setup-login-page.firebaseapp.com",
  databaseURL: "https://setup-login-page-default-rtdb.firebaseio.com",
  projectId: "setup-login-page",
  storageBucket: "setup-login-page.firebasestorage.app",
  messagingSenderId: "341251531099",
  appId: "1:341251531099:web:f4263621455541ffdc3a7e",
  measurementId: "G-ZXFC7NR9HV"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Initialize jsPDF
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const originalTextEl = document.getElementById('originalText');
  const userTextEl = document.getElementById('userText');
  const compareBtn = document.getElementById('compareBtn');
  const showFullTextBtn = document.getElementById('showFullTextBtn');
  const backToResultsBtn = document.getElementById('backToResultsBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const closeResultsBtn = document.getElementById('closeResultsBtn');
  const resultsSection = document.getElementById('results');
  const fullTextSection = document.getElementById('fullTextSection');
  const comparisonResultEl = document.getElementById('comparisonResult');
  const statsEl = document.getElementById('stats');
  const feedbackEl = document.getElementById('feedback');
  const originalDisplayEl = document.getElementById('originalDisplay');
  const userDisplayEl = document.getElementById('userDisplay');
  const resultDateEl = document.getElementById('resultDate');
  const originalTextGroup = document.getElementById('originalTextGroup');
  const timerOptions = document.getElementById('timerOptions');
  const timerDisplay = document.getElementById('timerDisplay');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('userInfo');
  const userPhoto = document.getElementById('userPhoto');
  const userName = document.getElementById('userName');
  const loginPrompt = document.getElementById('loginPrompt');
  const customTestSection = document.getElementById('customTestSection');
  const globalTestsSection = document.getElementById('globalTestsSection');
  const leaderboardSection = document.getElementById('leaderboardSection');
  const leaderboardList = document.getElementById('leaderboardList');
  const leaderboardFilter = document.getElementById('leaderboardFilter');
  const testNameFilter = document.getElementById('testNameFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const testCategoryFilter = document.getElementById('testCategoryFilter');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const leaderboardPagination = document.getElementById('leaderboardPagination');
  const saveBtn = document.getElementById('saveTestBtn');
  const clearBtn = document.getElementById('clearTestsBtn');
  const customTitle = document.getElementById('customTitle');
  const customOriginal = document.getElementById('customOriginal');
  const customVideoUrl = document.getElementById('customVideoUrl');
  const customCategory = document.getElementById('customCategory');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const emailLoginBtn = document.getElementById('emailLoginBtn');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const registerName = document.getElementById('registerName');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const deleteLeaderboardBtn = document.getElementById('deleteLeaderboardBtn');
  
  // Edit test elements
  const editTestModal = document.getElementById('editTestModal');
  const editTestTitle = document.getElementById('editTestTitle');
  const editTestCategory = document.getElementById('editTestCategory');
  const editTestText = document.getElementById('editTestText');
  const editTestVideoUrl = document.getElementById('editTestVideoUrl');
  const cancelEditTest = document.getElementById('cancelEditTest');
  const saveEditedTest = document.getElementById('saveEditedTest');
  const deleteTest = document.getElementById('deleteTest');

  // Timer variables
  let timerInterval;
  let endTime;
  let testActive = false;
  let timerButtons = document.querySelectorAll('.timer-option');
  
  // Leaderboard variables
  let currentPage = 1;
  const entriesPerPage = 10;
  let allAttempts = [];
  let filteredAttempts = [];
  let uniqueTestNames = new Set();
  let currentSortColumn = 'accuracy';
  let currentSortDirection = 'desc';
  let selectedLeaderboardRows = [];
  
  // Admin state
  let isAdmin = false;

  // Initialize typing timer
  let startTime = null;
  userTextEl.addEventListener('input', function() {
    if (!startTime) {
      startTime = new Date();
    }
  });

  // Toggle between login and register forms
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Email/password login handler
  emailLoginBtn.addEventListener('click', () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Login successful');
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      });
  });

  // Registration handler
  registerBtn.addEventListener('click', () => {
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    const confirm = confirmPassword.value.trim();
    
    if (!name || !email || !password || !confirm) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      alert('Password should be at least 6 characters');
      return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential.user.updateProfile({
          displayName: name
        });
      })
      .then(() => {
        alert('Registration successful! You are now logged in.');
        registerName.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
        confirmPassword.value = '';
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
      });
  });

  // Google login handler
  googleLoginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .catch(error => {
        console.error('Google login error:', error);
        alert('Google login failed. Please try again.');
      });
  });

  // Auth state listener
  auth.onAuthStateChanged(user => {
    if (user) {
      loginBtn.classList.add('hidden');
      userInfo.classList.remove('hidden');

      if (user.photoURL) {
        userPhoto.src = user.photoURL;
      } else {
        userPhoto.src = 'https://www.gravatar.com/avatar/' + user.uid + '?d=identicon';
      }

      userName.textContent = user.displayName || 'User';
      loginPrompt.classList.add('hidden');

      const adminEmails = [
        "anishkumar18034@gmail.com",
        "anishkumar1803@gmail.com",
        "admin2@example.com"
      ];

      isAdmin = adminEmails.includes(user.email);

      if (isAdmin) {
        customTestSection.classList.remove('hidden');
        deleteLeaderboardBtn.classList.remove('hidden');
      }

      globalTestsSection.classList.remove('hidden');
      leaderboardSection.classList.remove('hidden');

      loadGlobalTests();
      loadLeaderboard();
      cleanupOldData();
    } else {
      loginBtn.classList.remove('hidden');
      userInfo.classList.add('hidden');
      loginPrompt.classList.remove('hidden');
      customTestSection.classList.add('hidden');
      globalTestsSection.classList.add('hidden');
      leaderboardSection.classList.add('hidden');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      deleteLeaderboardBtn.classList.add('hidden');
      isAdmin = false;
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });

  // Leaderboard filter change handlers
  leaderboardFilter.addEventListener('change', () => {
    currentPage = 1;
    loadLeaderboard();
  });

  testNameFilter.addEventListener('change', () => {
    currentPage = 1;
    loadLeaderboard();
  });

  categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    loadLeaderboard();
  });

  // Test category filter for community tests
  testCategoryFilter.addEventListener('change', () => {
    loadGlobalTests();
  });

  // Pagination button handlers
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredAttempts.length / entriesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });

  // Delete leaderboard entries handler
  deleteLeaderboardBtn.addEventListener('click', () => {
    if (selectedLeaderboardRows.length === 0) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete ${selectedLeaderboardRows.length} selected leaderboard entries? This action cannot be undone.</p>
        <div class="modal-buttons">
          <button id="cancelDeleteLeaderboard" class="secondary-btn">Cancel</button>
          <button id="confirmDeleteLeaderboard" class="danger-btn">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#cancelDeleteLeaderboard').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#confirmDeleteLeaderboard').addEventListener('click', () => {
      const updates = {};
      selectedLeaderboardRows.forEach(id => {
        updates[`attempts/${id}`] = null;
      });
      
      database.ref().update(updates)
        .then(() => {
          alert(`${selectedLeaderboardRows.length} entries deleted successfully.`);
          selectedLeaderboardRows = [];
          document.body.removeChild(modal);
          loadLeaderboard();
        })
        .catch(error => {
          console.error('Error deleting leaderboard entries:', error);
          alert('Failed to delete entries. Please try again.');
        });
    });
  });

  // Load leaderboard data with pagination
  function loadLeaderboard() {
    const filter = leaderboardFilter.value;
    const category = categoryFilter.value;
    let query = database.ref('attempts').orderByChild('timestamp');
    
    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      query = query.startAt(oneWeekAgo.getTime());
    } else if (filter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      query = query.startAt(oneMonthAgo.getTime());
    }

    query.once('value')
      .then(snapshot => {
        const attempts = snapshot.val();
        if (!attempts) {
          leaderboardList.innerHTML = '<p>No attempts recorded yet. Be the first to complete a test!</p>';
          leaderboardPagination.innerHTML = '';
          return;
        }

        allAttempts = Object.entries(attempts).map(([id, attempt]) => ({
          id,
          ...attempt
        }));
        
        sortAttempts(currentSortColumn, currentSortDirection);
        updateTestNameFilter(allAttempts);
        
        filteredAttempts = allAttempts.filter(attempt => {
          const nameMatch = testNameFilter.value === 'all' || attempt.testTitle === testNameFilter.value;
          const categoryMatch = category === 'all' || attempt.category === category;
          return nameMatch && categoryMatch;
        });
          
        updatePagination();
      })
      .catch(error => {
        console.error('Error loading leaderboard:', error);
        leaderboardList.innerHTML = '<p>Error loading leaderboard. Please try again later.</p>';
        leaderboardPagination.innerHTML = '';
      });
  }

  function sortAttempts(column, direction) {
    allAttempts.sort((a, b) => {
      let aValue, bValue;
      
      switch (column) {
        case 'accuracy':
        case 'wpm':
        case 'totalOriginal':
        case 'totalUser':
        case 'halfMistakes':
        case 'fullMistakes':
        case 'timeTaken':
          aValue = a.stats[column];
          bValue = b.stats[column];
          break;
        case 'userName':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        case 'testTitle':
          aValue = (a.testTitle || 'Custom Test').toLowerCase();
          bValue = (b.testTitle || 'Custom Test').toLowerCase();
          break;
        case 'date':
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(bValue);
      }
    });
  }

  function updateTestNameFilter(attempts) {
    uniqueTestNames = new Set(attempts.map(attempt => attempt.testTitle || 'Custom Test'));
    const currentTestFilter = testNameFilter.value;
    
    testNameFilter.innerHTML = '<option value="all">All Tests</option>';
    uniqueTestNames.forEach(testName => {
      const option = document.createElement('option');
      option.value = testName;
      option.textContent = testName;
      testNameFilter.appendChild(option);
    });
    
    if (currentTestFilter !== 'all' && uniqueTestNames.has(currentTestFilter)) {
      testNameFilter.value = currentTestFilter;
    } else {
      testNameFilter.value = 'all';
    }
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredAttempts.length / entriesPerPage);
    const startIdx = (currentPage - 1) * entriesPerPage;
    const endIdx = startIdx + entriesPerPage;
    const pageAttempts = filteredAttempts.slice(startIdx, endIdx);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    leaderboardPagination.innerHTML = `Showing ${startIdx + 1}-${Math.min(endIdx, filteredAttempts.length)} of ${filteredAttempts.length} entries`;
    
    renderLeaderboardTable(pageAttempts, startIdx + 1);
  }

  function renderLeaderboardTable(attempts, startRank) {
    if (attempts.length === 0) {
      leaderboardList.innerHTML = '<p>No attempts match your filters.</p>';
      return;
    }

    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th data-column="rank">Rank</th>
            <th data-column="userName">User</th>
            <th data-column="testTitle">Test</th>
            <th data-column="accuracy">Accuracy</th>
            <th data-column="wpm">Speed (WPM)</th>
            <th data-column="totalOriginal">Original Words</th>
            <th data-column="totalUser">Typed Words</th>
            <th data-column="timeTaken">Time Taken</th>
            <th data-column="halfMistakes">Half Mistakes</th>
            <th data-column="fullMistakes">Full Mistakes</th>
            <th data-column="date">Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    attempts.forEach((attempt, index) => {
      const date = new Date(attempt.timestamp);
      const accuracyClass = 
        attempt.stats.accuracy >= 90 ? 'accuracy-high' :
        attempt.stats.accuracy >= 70 ? 'accuracy-medium' : 'accuracy-low';
      
      const minutes = Math.floor(attempt.stats.timeTaken / 60);
      const seconds = attempt.stats.timeTaken % 60;
      const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Add badges to top 3
      let badge = '';
      if (startRank + index === 1) {
        badge = '<span class="badge badge-gold">🥇</span>';
      } else if (startRank + index === 2) {
        badge = '<span class="badge badge-silver">🥈</span>';
      } else if (startRank + index === 3) {
        badge = '<span class="badge badge-bronze">🥉</span>';
      }

      tableHTML += `
        <tr data-id="${attempt.id}" class="${selectedLeaderboardRows.includes(attempt.id) ? 'selected-row' : ''}">
          <td>${startRank + index} ${badge}</td>
          <td class="leaderboard-user">
            <img src="${attempt.userPhoto}" alt="${attempt.userName}">
            <span>${attempt.userName}</span>
          </td>
          <td>${attempt.testTitle || 'Custom Test'} ${attempt.category ? `<span class="category-badge category-${attempt.category}">${getCategoryName(attempt.category)}</span>` : ''}</td>
          <td class="accuracy-cell ${accuracyClass}">${attempt.stats.accuracy.toFixed(1)}%</td>
          <td>${attempt.stats.wpm}</td>
          <td>${attempt.stats.totalOriginal}</td>
          <td>${attempt.stats.totalUser}</td>
          <td>${timeFormatted}</td>
          <td>${attempt.stats.halfMistakes}</td>
          <td>${attempt.stats.fullMistakes}</td>
          <td>${date.toLocaleDateString()}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    leaderboardList.innerHTML = tableHTML;
    
    makeTableSortable();
    updateDeleteButtonState();
  }

  function makeTableSortable() {
    const headers = document.querySelectorAll('.leaderboard-list th[data-column]');
    headers.forEach(header => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        const column = header.getAttribute('data-column');
        
        if (currentSortColumn === column) {
          currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          currentSortColumn = column;
          currentSortDirection = 'desc';
        }
        
        sortAttempts(column, currentSortDirection);
        updatePagination();
        
        headers.forEach(h => {
          h.classList.remove('sorted-asc', 'sorted-desc');
          if (h.getAttribute('data-column') === column) {
            h.classList.add(`sorted-${currentSortDirection}`);
          }
        });
      });
      
      if (header.getAttribute('data-column') === currentSortColumn) {
        header.classList.add(`sorted-${currentSortDirection}`);
      }
    });

    // Add row selection
    const rows = document.querySelectorAll('.leaderboard-list tbody tr');
    rows.forEach(row => {
      row.classList.add('leaderboard-row-selectable');
      row.addEventListener('click', (e) => {
        // Don't toggle selection if clicking on a link or button
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          return;
        }

        const attemptId = row.dataset.id;
        if (selectedLeaderboardRows.includes(attemptId)) {
          selectedLeaderboardRows = selectedLeaderboardRows.filter(id => id !== attemptId);
          row.classList.remove('selected-row');
        } else {
          selectedLeaderboardRows.push(attemptId);
          row.classList.add('selected-row');
        }
        updateDeleteButtonState();
      });
    });
  }

  function updateDeleteButtonState() {
    deleteLeaderboardBtn.disabled = selectedLeaderboardRows.length === 0;
  }

  // Auto-delete old data function
  function cleanupOldData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const timestampThreshold = sixMonthsAgo.getTime();

    database.ref('attempts').once('value').then(snapshot => {
      const updates = {};
      snapshot.forEach(child => {
        if (child.val().timestamp < timestampThreshold) {
          updates[child.key] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        database.ref('attempts').update(updates);
      }
    });
  }

  // Run cleanup weekly
  setInterval(cleanupOldData, 7 * 24 * 60 * 60 * 1000);

  // Original text paste handler
  originalTextEl.addEventListener('paste', function() {
    document.querySelectorAll('.test-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    setTimeout(() => {
      if (originalTextEl.value.trim() !== '' && !testActive) {
        originalTextGroup.classList.add('hidden');
        timerOptions.classList.remove('hidden');
        timerButtons.forEach(btn => {
          btn.disabled = false;
          btn.style.opacity = '1';
        });
      }
    }, 0);
  });
  
  // Timer option click handler
  timerButtons.forEach(button => {
    button.addEventListener('click', function() {
      const minutes = parseInt(this.dataset.minutes);
      startTimer(minutes);
      timerOptions.classList.add('hidden');
      timerDisplay.classList.remove('hidden');
      testActive = true;
    });
  });
  
  // Compare button click handler
  compareBtn.addEventListener('click', function() {
    stopTimer();
    compareTexts();
    disableTimerOptions();
  });
  
  // Show full text button click handler
  showFullTextBtn.addEventListener('click', showFullTexts);
  
  // Back to results button click handler
  backToResultsBtn.addEventListener('click', showResults);
  
  // Download PDF button click handler
  downloadPdfBtn.addEventListener('click', downloadAsPdf);
  
  // Close results button click handler
  closeResultsBtn.addEventListener('click', function() {
    const existingVideo = document.getElementById('testVideoPlayer');
    if (existingVideo) existingVideo.remove();
    location.reload();
  });
  
  function startTimer(minutes) {
    endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + minutes);
    
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
      updateTimerDisplay();
      
      const now = new Date();
      if (now >= endTime) {
        stopTimer();
        timerDisplay.classList.add('timer-ended');
        timerDisplay.textContent = "TIME'S UP!";
        compareTexts();
        lockTest();
        disableTimerOptions();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(timerInterval);
    timerDisplay.classList.add('hidden');
  }
  
  function disableTimerOptions() {
    timerButtons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    });
  }
  
  function updateTimerDisplay() {
    const now = new Date();
    const remaining = endTime - now;
    
    if (remaining <= 0) return;
    
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function lockTest() {
    userTextEl.readOnly = true;
    userTextEl.classList.add('locked-textarea');
    compareBtn.disabled = true;
    closeResultsBtn.classList.remove('hidden');
  }
  
  function compareTexts() {
    const originalText = originalTextEl.value;
    const userText = userTextEl.value;
    
    if (!originalText || !userText) {
      alert('Please enter both original text and your transcription.');
      return;
    }
    
    let testTitle = "Custom Test";
    const selectedTestCard = document.querySelector('.test-card.selected');
    if (selectedTestCard) {
        testTitle = selectedTestCard.querySelector('h4').textContent;
    }
    
    const originalWords = processText(originalText);
    const userWords = processText(userText);
    
    const comparison = compareParagraphs(originalWords, userWords);
    
    displayComparison(comparison);
    displayStats(comparison.stats);
    displayFeedback(comparison.stats, originalWords, userWords);
    displayFullTexts(originalText, userText);
    
    const now = new Date();
    resultDateEl.textContent = now.toLocaleString();
    
    showResults();
    
    if (testActive) {
      lockTest();
    }

    const user = auth.currentUser;
    if (user) {
      const attemptData = {
        userName: user.displayName,
        userPhoto: user.photoURL,
        testTitle: testTitle,
        category: selectedTestCard ? selectedTestCard.dataset.category : customCategory.value,
        stats: comparison.stats,
        timestamp: Date.now()
      };

      database.ref('attempts').push(attemptData)
        .then(() => loadLeaderboard())
        .catch(error => console.error('Error saving attempt:', error));
    }
  }
  
  function showFullTexts() {
    resultsSection.classList.add('hidden');
    fullTextSection.classList.remove('hidden');
  }
  
  function showResults() {
    fullTextSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
  }
  
  function downloadAsPdf() {
    const resultsElement = document.getElementById('results');

    html2canvas(resultsElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('transcription-comparison.pdf');
    });
  }
  
  function processText(text) {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .trim()
      .split(/\s+/);
  }
  
  function isSimilar(wordA, wordB) {
    const minLength = Math.min(wordA.length, wordB.length);
    const maxLength = Math.max(wordA.length, wordB.length);
    let similarCount = 0;
    const threshold = 50;
    
    for (let i = 0; i < minLength; i++) {
      if (wordA[i] === wordB[i]) {
        similarCount++;
      }
    }
    
    const similarityPercentage = (similarCount / maxLength) * 100;
    return similarityPercentage >= threshold;
  }
  
  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  
  function compareParagraphs(paragraphA, paragraphB) {
    let comparedText = '';
    let numHalfDiff = 0;
    let numFullDiff = 0;
    let wordAIndex = 0;
    let wordBIndex = 0;

    while (wordAIndex < paragraphA.length || wordBIndex < paragraphB.length) {
      const wordA = paragraphA[wordAIndex] || '';
      const wordB = paragraphB[wordBIndex] || '';
      const cleanWordA = wordA.replace(/[,\?\-\s]/g, '');
      const cleanWordB = wordB.replace(/[,\?\-\s]/g, '');

      if (cleanWordA === cleanWordB) {
        comparedText += `<span class="correct">${wordA}</span> `;
        wordAIndex++;
        wordBIndex++;
      } else if (cleanWordA.toLowerCase() === cleanWordB.toLowerCase()) {
        comparedText += `<span class="capitalization">${wordA}</span> `;
        comparedText += `<span class="capitalization-strike">${wordB}</span> `;
        wordAIndex++;
        wordBIndex++;
        numHalfDiff++;
      } else {
        if (!wordA) {
          comparedText += `<span class="addition">${wordB}</span> `;
          wordBIndex++;
          numFullDiff++;
        } else if (!wordB) {
          comparedText += `<span class="missing">${wordA}</span> `;
          wordAIndex++;
          numFullDiff++;
        } else {
          if (wordA === paragraphB[wordBIndex]) {
            comparedText += `<span class="spelling">${wordA}</span> `;
            wordAIndex++;
            wordBIndex++;
          } else if (wordB === paragraphA[wordAIndex]) {
            comparedText += `<span class="spelling-strike">${wordB}</span> `;
            wordAIndex++;
            wordBIndex++;
          } else if (isSimilar(wordA, wordB)) {
            comparedText += `<span class="spelling">${wordA}</span> `;
            comparedText += `<span class="spelling-strike">${wordB}</span> `;
            wordAIndex++;
            wordBIndex++;
            numHalfDiff++;
          } else {
            const pairA = [wordA];
            const pairB = [wordB];
            
            for (let i = 1; i < 5 && (wordBIndex + i) < paragraphB.length; i++) {
              pairB.push(paragraphB[wordBIndex + i]);
            }
            
            for (let i = 1; i < 5 && (wordAIndex + i) < paragraphA.length; i++) {
              pairA.push(paragraphA[wordAIndex + i]);
            }

            let foundPairInA = false;
            for (let i = 1; i <= 50 && (wordAIndex + i) < paragraphA.length; i++) {
              const subarrayA = paragraphA.slice(wordAIndex + i, wordAIndex + i + pairB.length);
              if (arraysAreEqual(subarrayA, pairB)) {
                for (let j = 0; j < i; j++) {
                  comparedText += `<span class="missing">${paragraphA[wordAIndex + j]}</span> `;
                  numFullDiff++;
                }
                comparedText += `<span class="correct">${pairB.join(' ')}</span> `;
                wordAIndex += i + pairB.length;
                wordBIndex += pairB.length;
                foundPairInA = true;
                break;
              }
            }

            if (!foundPairInA) {
              let foundPairInB = false;
              for (let i = 1; i <= 50 && (wordBIndex + i) < paragraphB.length; i++) {
                const subarrayB = paragraphB.slice(wordBIndex + i, wordBIndex + i + pairA.length);
                if (arraysAreEqual(subarrayB, pairA)) {
                  for (let j = 0; j < i; j++) {
                    comparedText += `<span class="addition">${paragraphB[wordBIndex + j]}</span> `;
                    numFullDiff++;
                  }
                  comparedText += `<span class="correct">${pairA.join(' ')}</span> `;
                  wordAIndex += pairA.length;
                  wordBIndex += i + pairA.length;
                  foundPairInB = true;
                  break;
                }
              }

              if (!foundPairInB) {
                comparedText += `<span class="missing">${wordA}</span> `;
                comparedText += `<span class="addition">${wordB}</span> `;
                wordAIndex++;
                wordBIndex++;
                numFullDiff++;
              }
            }
          }
        }
      }
    }

    const keystrokesCount = userTextEl.value.length;
    const errorPercentage = paragraphA.length > 0 ? 
      Math.min(100, ((numHalfDiff / 2) + numFullDiff) / paragraphA.length * 100) : 0;
    const accuracyPercentage = Math.max(0, 100 - errorPercentage);
    
    const endTime = new Date();
    const timeTakenSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;
    
    const typingTimeMinutes = timeTakenSeconds / 60;
    const wordsTyped = paragraphB.length;
    const wpm = typingTimeMinutes > 0 ? Math.round(wordsTyped / typingTimeMinutes) : 0;

    return {
      html: comparedText,
      stats: {
        totalOriginal: paragraphA.length,
        totalUser: paragraphB.length,
        halfMistakes: numHalfDiff,
        fullMistakes: numFullDiff,
        keystrokes: keystrokesCount,
        wpm: wpm,
        accuracy: accuracyPercentage,
        errorRate: errorPercentage,
        timeTaken: timeTakenSeconds
      }
    };
  }
  
  function displayComparison(comparison) {
    comparisonResultEl.innerHTML = comparison.html;
  }
  
  function displayStats(stats) {
    statsEl.innerHTML = `
      <div class="stat-item">
        <h4>Original Words</h4>
        <p>${stats.totalOriginal}</p>
      </div>
      <div class="stat-item">
        <h4>Your Words</h4>
        <p>${stats.totalUser}</p>
      </div>
      <div class="stat-item">
        <h4>Half Mistakes</h4>
        <p>${stats.halfMistakes}</p>
      </div>
      <div class="stat-item">
        <h4>Full Mistakes</h4>
        <p>${stats.fullMistakes}</p>
      </div>
      <div class="stat-item">
        <h4>Keystrokes</h4>
        <p>${stats.keystrokes}</p>
      </div>
      <div class="stat-item">
        <h4>Typing Speed (WPM)</h4>
        <p>${stats.wpm}</p>
      </div>
      <div class="stat-item">
        <h4>Accuracy</h4>
        <p>${stats.accuracy.toFixed(1)}%</p>
      </div>
      <div class="stat-item">
        <h4>Time Taken</h4>
        <p>${Math.floor(stats.timeTaken / 60)}:${(stats.timeTaken % 60).toString().padStart(2, '0')}</p>
      </div>
    `;
  }
  
  function displayFeedback(stats, originalWords, userWords) {
    const analysis = analyzeMistakes(originalWords, userWords);
    
    let feedback = `
      <h4>Overall Assessment</h4>
      ${getOverallAssessment(stats.accuracy, stats.wpm)}
      
      <h4>Mistake Analysis</h4>
      <ul>
        ${analysis.commonMistakes.map(m => `<li>${m}</li>`).join('')}
      </ul>
      
      <h4>Improvement Suggestions</h4>
      <ul>
        ${getImprovementSuggestions(analysis, stats)}
      </ul>
    `;
    
    feedbackEl.innerHTML = feedback;
  }
  
  function displayFullTexts(original, user) {
    originalDisplayEl.textContent = original;
    userDisplayEl.textContent = user;
  }
  
  function analyzeMistakes(originalText, userText) {
    const analysis = {
      commonMistakes: [],
      omissionRate: 0,
      additionRate: 0,
      spellingErrorRate: 0,
      capitalizationErrorRate: 0,
      mostErrorProneWords: []
    };
    
    const wordPairs = [];
    const minLength = Math.min(originalText.length, userText.length);
    
    for (let i = 0; i < minLength; i++) {
      const origWord = originalText[i].toLowerCase();
      const userWord = userText[i].toLowerCase();
      
      if (origWord !== userWord) {
        wordPairs.push({ original: originalText[i], user: userText[i] });
      }
    }
    
    let omissionCount = 0;
    let additionCount = 0;
    let spellingCount = 0;
    let capitalizationCount = 0;
    const errorWords = [];
    
    wordPairs.forEach(pair => {
      const orig = pair.original.toLowerCase();
      const user = pair.user.toLowerCase();
      
      if (user === '') {
        omissionCount++;
      } else if (orig === '') {
        additionCount++;
      } else if (orig === user) {
        capitalizationCount++;
        errorWords.push(pair.original);
      } else if (isSimilar(orig, user)) {
        spellingCount++;
        errorWords.push(pair.original);
      } else {
        errorWords.push(pair.original);
      }
    });
    
    analysis.omissionRate = omissionCount / originalText.length;
    analysis.additionRate = additionCount / originalText.length;
    analysis.spellingErrorRate = spellingCount / originalText.length;
    analysis.capitalizationErrorRate = capitalizationCount / originalText.length;
    
    const wordFrequency = {};
    errorWords.forEach(word => {
      const lowerWord = word.toLowerCase();
      wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
    });
    
    analysis.mostErrorProneWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
    
    if (capitalizationCount > 0) {
      analysis.commonMistakes.push(`Capitalization errors (${capitalizationCount} instances)`);
    }
    if (spellingCount > 0) {
      analysis.commonMistakes.push(`Spelling mistakes (${spellingCount} instances)`);
    }
    if (omissionCount > 0) {
      analysis.commonMistakes.push(`Omitted words (${omissionCount} instances)`);
    }
    if (additionCount > 0) {
      analysis.commonMistakes.push(`Added extra words (${additionCount} instances)`);
    }
    
    return analysis;
  }
  
  function getOverallAssessment(accuracy, wpm) {
    let assessment = '';
    
    if (accuracy >= 95) {
      assessment += '<p>🌟 <strong>Excellent accuracy!</strong> Your transcription is nearly perfect.</p>';
    } else if (accuracy >= 85) {
      assessment += '<p>👍 <strong>Good accuracy.</strong> With a little more practice, you can reach excellence.</p>';
    } else if (accuracy >= 70) {
      assessment += '<p>📝 <strong>Fair accuracy.</strong> Focus on reducing errors to improve your score.</p>';
    } else {
      assessment += '<p>⚠️ <strong>Needs improvement.</strong> Work on accuracy before increasing speed.</p>';
    }
    
    if (wpm >= 50) {
      assessment += '<p>⚡ <strong>Fast typer!</strong> Your speed is impressive. ';
      if (accuracy < 90) {
        assessment += 'Try slowing down slightly to improve accuracy.</p>';
      } else {
        assessment += 'Maintain this speed while keeping accuracy high.</p>';
      }
    } else if (wpm >= 40) {
      assessment += '<p>🏃 <strong>Moderate speed.</strong> You\'re typing at a good pace. ';
      assessment += 'With practice, you can increase speed without sacrificing accuracy.</p>';
    } else {
      assessment += '<p>🐢 <strong>Slow pace.</strong> Focus on building muscle memory and gradually increasing your speed.</p>';
    }
    
    return assessment;
  }
  
  function getImprovementSuggestions(analysis, stats) {
    let suggestions = [];
    
    if (analysis.omissionRate > 0.2) {
      suggestions.push('You\'re skipping many words. Practice reading ahead to anticipate upcoming words.');
    }
    
    if (analysis.additionRate > 0.15) {
      suggestions.push('You\'re adding extra words. Focus on typing only what you see/hear.');
    }
    
    if (analysis.spellingErrorRate > 0.25) {
      suggestions.push('Spelling mistakes are frequent. Consider practicing difficult words separately.');
    }
    
    if (analysis.capitalizationErrorRate > 0.1) {
      suggestions.push('Watch your capitalization. Remember proper nouns and sentence starts need capitals.');
    }
    
    suggestions.push('Practice difficult sections repeatedly until you master them.');
    suggestions.push('Break long passages into smaller chunks for focused practice.');
    suggestions.push('Focus on accuracy before speed - speed will come naturally with practice.');
    
    return suggestions.map(s => `<li>${s}</li>`).join('');
  }

  function embedVideo(url) {
    const existingVideo = document.getElementById('testVideoPlayer');
    if (existingVideo) {
      existingVideo.remove();
    }
    
    if (!url) return;
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.id = 'testVideoPlayer';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId;
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        videoContainer.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>
        `;
      }
    } else {
      videoContainer.innerHTML = `
        <video controls style="width:100%">
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }
    
    originalTextGroup.insertAdjacentElement('afterend', videoContainer);
  }

  function loadGlobalTests() {
    const category = testCategoryFilter.value;
    
    database.ref('tests').orderByChild('timestamp').once('value')
      .then(snapshot => {
        const carouselTrack = document.querySelector('.carousel-track');
        const dotsContainer = document.querySelector('.carousel-dots');
        carouselTrack.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        const tests = snapshot.val();
        
        if (!tests) {
          carouselTrack.innerHTML = '<p>No community tests yet. Be the first to share one!</p>';
          return;
        }
        
        const testsArray = Object.entries(tests).map(([id, test]) => ({
          id,
          ...test
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        // Filter by category if not "all"
        const filteredTests = category === 'all' 
          ? testsArray 
          : testsArray.filter(test => test.category === category);
        
        if (filteredTests.length === 0) {
          carouselTrack.innerHTML = '<p>No tests match your filter.</p>';
          return;
        }
        
        // Create test cards
        filteredTests.forEach((test, index) => {
          const testCard = document.createElement('div');
          testCard.className = 'test-card';
          testCard.dataset.category = test.category;
          testCard.innerHTML = `
            <h4>${test.title} <span class="category-badge category-${test.category}">${getCategoryName(test.category)}</span></h4>
            <p>${test.text.substring(0, 100)}${test.text.length > 100 ? '...' : ''}</p>
            ${test.videoUrl ? '<div class="video-indicator"><svg viewBox="0 0 24 24"><path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path></svg> Includes Video</div>' : ''}
            <div class="test-author">
              <img src="${test.userPhoto}" alt="${test.userName}">
              <span>Added by ${test.userName}</span>
            </div>
            ${isAdmin ? `<button class="edit-test-btn" data-testid="${test.id}">Edit</button>` : ''}
          `;
          
          // Maintain existing click handler for selecting tests
          testCard.addEventListener('click', (e) => {
            // Don't trigger selection if clicking on edit button
            if (!e.target.classList.contains('edit-test-btn')) {
              document.querySelectorAll('.test-card').forEach(card => {
                card.classList.remove('selected');
              });
              testCard.classList.add('selected');
              
              originalTextEl.value = test.text;
              originalTextGroup.classList.add('hidden');
              timerOptions.classList.remove('hidden');
              timerButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
              });
              
              if (test.videoUrl) {
                embedVideo(test.videoUrl);
              } else {
                const existingVideo = document.getElementById('testVideoPlayer');
                if (existingVideo) existingVideo.remove();
              }
            }
          });
          
          carouselTrack.appendChild(testCard);
        });
        
        // Initialize carousel after cards are created
        initializeCarousel();
      })
      .catch(error => {
        console.error('Error loading tests:', error);
        document.querySelector('.carousel-track').innerHTML = '<p>Error loading community tests. Please try again later.</p>';
      });
  }

  function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = document.querySelectorAll('.test-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 16; // including gap
    let currentIndex = 0;
    
    // Determine how many cards to show based on screen width
    function getVisibleCards() {
      if (window.innerWidth < 480) return 1;
      if (window.innerWidth < 768) return 2;
      return 3;
    }
    
    let visibleCards = getVisibleCards();
    const dotCount = Math.ceil(cards.length / visibleCards);
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
    
    function updateCarousel() {
      const offset = -currentIndex * (visibleCards * cardWidth);
      track.style.transform = `translateX(${offset}px)`;
      
      // Update active dot
      document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      
      // Disable/enable buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= dotCount - 1;
    }
    
    // Navigation handlers
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (currentIndex < dotCount - 1) {
        currentIndex++;
        updateCarousel();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const newVisibleCards = getVisibleCards();
      if (newVisibleCards !== visibleCards) {
        visibleCards = newVisibleCards;
        currentIndex = 0;
        updateCarousel();
      }
    });
    
    // Initialize
    updateCarousel();
  }

  // Edit test functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-test-btn')) {
      const testId = e.target.dataset.testid;
      openEditTestModal(testId);
    }
  });

  function openEditTestModal(testId) {
    database.ref('tests/' + testId).once('value').then(snapshot => {
      const test = snapshot.val();
      if (test) {
        // Store the test ID in the modal for later use
        editTestModal.dataset.testid = testId;
        
        // Populate form fields
        editTestTitle.value = test.title;
        editTestCategory.value = test.category;
        editTestText.value = test.text;
        editTestVideoUrl.value = test.videoUrl || '';
        
        // Show modal
        editTestModal.classList.remove('hidden');
      }
    });
  }

  // Save edited test
  saveEditedTest.addEventListener('click', () => {
    const testId = editTestModal.dataset.testid;
    const updatedTest = {
      title: editTestTitle.value.trim(),
      category: editTestCategory.value,
      text: editTestText.value.trim(),
      videoUrl: editTestVideoUrl.value.trim() || null,
      // Preserve existing metadata
      userName: userName.textContent,
      userPhoto: userPhoto.src,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    if (!updatedTest.title || !updatedTest.text) {
      alert('Please fill in all required fields');
      return;
    }

    database.ref('tests/' + testId).update(updatedTest)
      .then(() => {
        alert('Test updated successfully!');
        editTestModal.classList.add('hidden');
        loadGlobalTests(); // Refresh the list
      })
      .catch(error => {
        console.error('Error updating test:', error);
        alert('Failed to update test. Please try again.');
      });
  });

  // Delete test
  deleteTest.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this test? This cannot be undone.')) {
      const testId = editTestModal.dataset.testid;
      
      database.ref('tests/' + testId).remove()
        .then(() => {
          alert('Test deleted successfully!');
          editTestModal.classList.add('hidden');
          loadGlobalTests(); // Refresh the list
        })
        .catch(error => {
          console.error('Error deleting test:', error);
          alert('Failed to delete test. Please try again.');
        });
    }
  });

  // Cancel edit
  cancelEditTest.addEventListener('click', () => {
    editTestModal.classList.add('hidden');
  });

  function getCategoryName(category) {
    const categories = {
      'general': 'General Matter',
      'kailash': 'Kailash Chandra',
      'progressive': 'Progressive',
      'legal': 'Legal',
      'previous': 'Previous Year',
      'test': 'Test'
    };
    return categories[category] || 'General';
  }

  saveBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to save tests.');
      return;
    }

    const title = customTitle.value.trim();
    const text = customOriginal.value.trim();
    const videoUrl = customVideoUrl.value.trim();
    const category = customCategory.value;
    
    if (!title || !text) {
      alert('Please enter both a title and the original text.');
      return;
    }

    const testData = {
      title,
      text,
      videoUrl: videoUrl || null,
      userName: user.displayName,
      userPhoto: user.photoURL,
      category,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref('tests').push(testData)
      .then(() => {
        alert('Test saved and shared with the community!');
        customTitle.value = '';
        customOriginal.value = '';
        customVideoUrl.value = '';
        loadGlobalTests();
      })
      .catch(error => {
        console.error('Error saving test:', error);
        alert('Failed to save test. Please try again.');
      });
  });

  clearBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) return;

    database.ref('tests').orderByChild('userName').equalTo(user.displayName).once('value')
      .then(snapshot => {
        const userTests = snapshot.val();
        if (!userTests || Object.keys(userTests).length === 0) {
          alert('You have no tests to delete.');
          return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <h3>Select Tests to Delete</h3>
            <div class="test-selection"></div>
            <div class="modal-buttons">
              <button id="cancelDelete" class="secondary-btn">Cancel</button>
              <button id="confirmDelete" class="danger-btn">Delete Selected</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        const testSelection = modal.querySelector('.test-selection');
        const checkboxes = [];
        
        Object.entries(userTests).forEach(([id, test]) => {
          const testItem = document.createElement('div');
          testItem.className = 'test-item';
          const checkboxId = `test-${id}`;
          testItem.innerHTML = `
            <input type="checkbox" id="${checkboxId}" checked>
            <label for="${checkboxId}">${test.title} <span class="category-badge category-${test.category}">${getCategoryName(test.category)}</span></label>
          `;
          testSelection.appendChild(testItem);
          checkboxes.push({id, checkbox: testItem.querySelector('input')});
        });
        
        modal.querySelector('#cancelDelete').addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        modal.querySelector('#confirmDelete').addEventListener('click', () => {
          const selectedTests = checkboxes
            .filter(item => item.checkbox.checked)
            .map(item => item.id);
          
          if (selectedTests.length === 0) {
            alert('Please select at least one test to delete.');
            return;
          }
          
          const updates = {};
          selectedTests.forEach(id => {
            updates[id] = null;
          });
          
          database.ref('tests').update(updates)
            .then(() => {
              alert(`${selectedTests.length} test(s) deleted successfully.`);
              document.body.removeChild(modal);
              loadGlobalTests();
            })
            .catch(error => {
              console.error('Error deleting tests:', error);
              alert('Failed to delete tests. Please try again.');
            });
        });
      })
      .catch(error => {
        console.error('Error fetching user tests:', error);
        alert('Failed to fetch your tests. Please try again.');
      });
  });
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('change', function() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', this.checked);
});

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'true') {
  document.getElementById('darkModeToggle').checked = true;
  document.body.classList.add('dark-mode');
}
