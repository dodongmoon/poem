document.addEventListener('DOMContentLoaded', function() {
    // Updated to include short-right-highlight in the query selector
    const highlights = document.querySelectorAll('.highlight, .repetition, .numbered-highlight, .yellow-highlight, .red-highlight, .yellow-symmetry-highlight, .thin-red-highlight, .short-right-highlight');
    const checkButton = document.getElementById('check-answers');
    const hideButton = document.getElementById('hide-answers');
    const resetButton = document.getElementById('reset');
    const repetitions = document.querySelectorAll('.repetition');
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    // New poem selector elements
    const poemButtons = document.querySelectorAll('.poem-btn');
    const poemContainers = document.querySelectorAll('.poem-container');
    const qaSections = document.querySelectorAll('.qa-section');
    
    // Add event listeners for symmetry question marks
    const symmetryQuestions = document.querySelectorAll('.symmetry-question');
    symmetryQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const originalText = this.getAttribute('data-original');
            if (this.textContent === '?') {
                this.textContent = originalText;
            } else {
                this.textContent = '?';
            }
        });
    });
    
    /**
     * Handles poem selection
     * @param {Event} event - The click event
     */
    function handlePoemSelection(event) {
        // Get the selected poem ID
        const selectedPoemId = event.currentTarget.getAttribute('data-poem');
        
        // Update active state for buttons
        poemButtons.forEach(button => {
            if (button.getAttribute('data-poem') === selectedPoemId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Show the selected poem and hide others
        poemContainers.forEach(container => {
            if (container.id === selectedPoemId) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        });
        
        // Show the associated Q&A and hide others
        qaSections.forEach(section => {
            if (section.id === `${selectedPoemId}-qa`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Show the associated Jammini assistant and hide others
        const jamminiContainers = document.querySelectorAll('.jammini-container');
        jamminiContainers.forEach(container => {
            if (container.id === `${selectedPoemId}-jammini`) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
        
        // Reset UI when switching poems
        resetUI();
    }
    
    /**
     * Handles click events on highlighted elements
     * @param {Event} event - The click event
     */
    function handleHighlightClick(event) {
        const element = event.currentTarget;
        
        // Handle repetition elements
        if (element.classList.contains('repetition')) {
            const meaning = element.getAttribute('data-meaning');
            
            // Toggle active class on all repetitions with the same meaning
            repetitions.forEach(rep => {
                if (rep.getAttribute('data-meaning') === meaning) {
                    rep.classList.toggle('repetition-active');
                }
            });
        }
        
        // Toggle meaning display
        toggleMeaningDisplay(element);
    }
    
    /**
     * Toggles the visibility of meaning elements
     * @param {HTMLElement} element - The highlighted element
     */
    function toggleMeaningDisplay(element) {
        let meaningElement = element.nextElementSibling;
        
        // If meaning element exists and is a meaning div
        if (meaningElement && meaningElement.classList.contains('meaning')) {
            meaningElement.classList.toggle('visible');
        } else {
            // Create new meaning element
            createMeaningElement(element);
        }
    }
    
    /**
     * Creates a new meaning element
     * @param {HTMLElement} element - The element to create meaning for
     */
    function createMeaningElement(element) {
        const newMeaning = document.createElement('div');
        newMeaning.classList.add('meaning');
        newMeaning.textContent = element.getAttribute('data-meaning');
        element.insertAdjacentElement('afterend', newMeaning);
        newMeaning.classList.add('visible');
    }
    
    /**
     * Resets the entire UI to initial state
     */
    function resetUI() {
        // Find active poem container
        const activePoemContainer = document.querySelector('.poem-container.active');
        if (!activePoemContainer) return;
        
        // Remove meaning elements
        const meaningElements = activePoemContainer.querySelectorAll('.meaning');
        meaningElements.forEach(meaning => {
            meaning.remove();
        });
        
        // Reset repetition highlighting
        const activeRepetitions = activePoemContainer.querySelectorAll('.repetition');
        activeRepetitions.forEach(rep => {
            rep.classList.remove('repetition-active');
        });
        
        // Reset symmetry question marks
        const activeSymmetryQuestions = activePoemContainer.querySelectorAll('.symmetry-question');
        activeSymmetryQuestions.forEach(question => {
            question.textContent = '?';
        });
        
        // Reset Q&A answers for active section
        const activeQaSection = document.querySelector('.qa-section.active');
        if (activeQaSection) {
            const answerElements = activeQaSection.querySelectorAll('.answer');
            const answerBtns = activeQaSection.querySelectorAll('.answer-btn');
            
            answerElements.forEach(answer => {
                answer.classList.remove('visible');
            });
            
            answerBtns.forEach(btn => {
                btn.textContent = '정답 확인';
            });
        }
        
        // Reset inline answers
        const inlineAnswers = document.querySelectorAll('.inline-answer');
        const inlineAnswerBtns = document.querySelectorAll('.inline-answer-btn');
        
        inlineAnswers.forEach(answer => {
            answer.classList.remove('visible');
        });
        
        inlineAnswerBtns.forEach(btn => {
            btn.textContent = '?';
        });
    }
    
    /**
     * Shows all answers for the active poem
     */
    function showAllAnswers() {
        // Find active poem container
        const activePoemContainer = document.querySelector('.poem-container.active');
        if (!activePoemContainer) return;
        
        // Get all highlights within active poem
        const activeHighlights = activePoemContainer.querySelectorAll('.highlight, .repetition, .yellow-highlight, .red-highlight');
        
        activeHighlights.forEach(highlight => {
            let meaning = highlight.nextElementSibling;
            if (!meaning || !meaning.classList.contains('meaning')) {
                const newMeaning = document.createElement('div');
                newMeaning.classList.add('meaning');
                newMeaning.textContent = highlight.getAttribute('data-meaning');
                highlight.insertAdjacentElement('afterend', newMeaning);
                meaning = newMeaning;
            }
            meaning.classList.add('visible');
        });
        
        // Show all symmetry answers
        const symmetryQuestions = activePoemContainer.querySelectorAll('.symmetry-question');
        symmetryQuestions.forEach(question => {
            question.textContent = question.getAttribute('data-original');
        });
        
        // Also show Q&A answers for active section
        const activeQaSection = document.querySelector('.qa-section.active');
        if (activeQaSection) {
            const answerElements = activeQaSection.querySelectorAll('.answer');
            const answerBtns = activeQaSection.querySelectorAll('.answer-btn');
            
            answerElements.forEach(answer => {
                answer.classList.add('visible');
            });
            
            answerBtns.forEach(btn => {
                btn.textContent = '정답 숨기기';
            });
        }
        
        // Show inline answers for active poem
        const inlineAnswers = activePoemContainer.querySelectorAll('.inline-answer');
        const inlineAnswerBtns = activePoemContainer.querySelectorAll('.inline-answer-btn');
        
        inlineAnswers.forEach(answer => {
            answer.classList.add('visible');
        });
        
        inlineAnswerBtns.forEach(btn => {
            btn.textContent = 'O';
        });
    }
    
    /**
     * Hides all answers for the active poem
     */
    function hideAllAnswers() {
        // Find active poem container
        const activePoemContainer = document.querySelector('.poem-container.active');
        if (!activePoemContainer) return;
        
        // Hide all meaning elements
        const meaningElements = activePoemContainer.querySelectorAll('.meaning');
        meaningElements.forEach(meaning => {
            meaning.classList.remove('visible');
        });
        
        // Reset repetition highlighting
        const activeRepetitions = activePoemContainer.querySelectorAll('.repetition');
        activeRepetitions.forEach(rep => {
            rep.classList.remove('repetition-active');
        });
        
        // Reset symmetry questions to ?
        const symmetryQuestions = activePoemContainer.querySelectorAll('.symmetry-question');
        symmetryQuestions.forEach(question => {
            question.textContent = '?';
        });
        
        // Also hide Q&A answers for active section
        const activeQaSection = document.querySelector('.qa-section.active');
        if (activeQaSection) {
            const answerElements = activeQaSection.querySelectorAll('.answer');
            const answerBtns = activeQaSection.querySelectorAll('.answer-btn');
            
            answerElements.forEach(answer => {
                answer.classList.remove('visible');
            });
            
            answerBtns.forEach(btn => {
                btn.textContent = '정답 확인';
            });
        }
        
        // Hide inline answers
        const inlineAnswers = document.querySelectorAll('.inline-answer');
        const inlineAnswerBtns = document.querySelectorAll('.inline-answer-btn');
        
        inlineAnswers.forEach(answer => {
            answer.classList.remove('visible');
        });
        
        inlineAnswerBtns.forEach(btn => {
            btn.textContent = '?';
        });
    }
    
    // Add event listeners for poem selection
    poemButtons.forEach(button => {
        button.addEventListener('click', handlePoemSelection);
    });
    
    // Add event listeners for Q&A section
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle the answer visibility
            const answer = this.nextElementSibling;
            answer.classList.toggle('visible');
            
            // Toggle button text
            if (answer.classList.contains('visible')) {
                this.textContent = '정답 숨기기';
            } else {
                this.textContent = '정답 확인';
            }
        });
    });
    
    // Add existing event listeners
    highlights.forEach(highlight => {
        highlight.addEventListener('click', handleHighlightClick);
    });
    
    // Add handler for inline question answer button
    const inlineAnswerBtn = document.querySelector('.inline-answer-btn');
    if (inlineAnswerBtn) {
        inlineAnswerBtn.addEventListener('click', function() {
            const inlineAnswer = this.nextElementSibling;
            inlineAnswer.classList.toggle('visible');
            
            // Toggle button text
            if (inlineAnswer.classList.contains('visible')) {
                this.textContent = 'O';
            } else {
                this.textContent = '?';
            }
        });
    }
    
    checkButton.addEventListener('click', showAllAnswers);
    hideButton.addEventListener('click', hideAllAnswers);
    resetButton.addEventListener('click', resetUI);

    // Set initial display for jammini containers
    const jamminiContainers = document.querySelectorAll('.jammini-container');
    jamminiContainers.forEach(container => {
        if (container.id === 'poor-love-song-jammini') {
            container.style.display = 'none';
        }
        if (container.id === 'winter-sea-jammini') {
            container.style.display = 'none';
        }
        if (container.id === 'dawn-letter-jammini') {
            container.style.display = 'none';
        }
    });

    // Show the active poem's jammini container if any
    const activePoemContainer = document.querySelector('.poem-container.active');
    if (activePoemContainer) {
        const activePoemId = activePoemContainer.id;
        const activeJammini = document.getElementById(`${activePoemId}-jammini`);
        if (activeJammini) {
            activeJammini.style.display = 'block';
        }
    }

    // Ensure consistent message timestamps for all Jammini Assistants
    const allJamminiMessages = document.querySelectorAll('.jammini-message');
    let baseTime = new Date();
    baseTime.setHours(14);
    baseTime.setMinutes(15);

    allJamminiMessages.forEach((message, index) => {
        const timeSpan = message.querySelector('.jammini-time');
        const messageTime = new Date(baseTime.getTime() + (index % 8) * 60000);
        const hours = messageTime.getHours();
        const minutes = messageTime.getMinutes().toString().padStart(2, '0');
        const timeText = `오후 ${hours - 12}:${minutes}`;
        
        timeSpan.textContent = timeText;
        
        // Add small delay to each message appearance for chat-like effect
        message.style.animationDelay = `${(index % 8) * 0.2}s`;
    });
});