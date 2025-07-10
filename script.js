class SCATimer {
    constructor() {
        this.totalTime = 12 * 60; // 12 minutes in seconds
        this.remainingTime = this.totalTime;
        this.isRunning = false;
        this.interval = null;
        this.currentMode = 'standard';
        this.soundEnabled = true;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.phaseTextElement = document.getElementById('phase-text');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.feedbackSection = document.getElementById('feedback-section');
        this.feedbackButtons = document.querySelectorAll('.feedback-btn');
        
        // Initialize Web Audio API for sound
        this.initializeAudio();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });
        
        this.feedbackButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFeedback(e.target.closest('.feedback-btn').dataset.rating);
            });
        });
        
        // Test sound button
        const testSoundBtn = document.getElementById('test-sound-btn');
        if (testSoundBtn) {
            testSoundBtn.addEventListener('click', () => {
                this.playCompletionSound();
            });
        }
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Reset timer and clear any guided mode styling
        this.reset();
        this.clearGuidedModeStyling();
    }
    
    clearGuidedModeStyling() {
        document.body.classList.remove('guided-green', 'guided-amber', 'guided-red');
        this.timerElement.classList.remove('warning');
        this.phaseTextElement.textContent = '';
    }
    
    start() {
        if (this.isRunning) return;
        
        // Initialize audio context on first user interaction
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // Apply guided mode styling if needed
        if (this.currentMode === 'guided') {
            this.applyGuidedModeStyling();
        }
        
        this.interval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            // Check for guided mode phase changes
            if (this.currentMode === 'guided') {
                this.checkGuidedModePhases();
            }
            
            // Check for standard mode warning
            if (this.currentMode === 'standard' && this.remainingTime <= 60) {
                this.timerElement.classList.add('warning');
            }
            
            if (this.remainingTime <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        clearInterval(this.interval);
    }
    
    reset() {
        this.pause();
        this.remainingTime = this.totalTime;
        this.clearGuidedModeStyling();
        this.updateDisplay();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    complete() {
        this.pause();
        this.remainingTime = 0;
        this.updateDisplay();
        
        if (this.soundEnabled) {
            this.playCompletionSound();
        }
        
        // Show completion message
        this.phaseTextElement.textContent = 'Timer Complete!';
        
        // Clear guided mode styling after completion
        setTimeout(() => {
            this.clearGuidedModeStyling();
        }, 2000);
    }
    
    applyGuidedModeStyling() {
        if (this.remainingTime > 360) { // > 6 minutes
            document.body.classList.add('guided-green');
            this.phaseTextElement.textContent = 'Data Gathering';
        } else if (this.remainingTime > 60) { // 6 minutes to 1 minute
            document.body.classList.remove('guided-green');
            document.body.classList.add('guided-amber');
            this.phaseTextElement.textContent = 'Clinical Management';
        } else { // ≤ 1 minute
            document.body.classList.remove('guided-amber');
            document.body.classList.add('guided-red');
            this.phaseTextElement.textContent = 'Clinical Management';
        }
    }
    
    checkGuidedModePhases() {
        if (this.remainingTime === 360) { // 6 minutes
            document.body.classList.remove('guided-green');
            document.body.classList.add('guided-amber');
            this.phaseTextElement.textContent = 'Clinical Management';
        } else if (this.remainingTime === 60) { // 1 minute
            document.body.classList.remove('guided-amber');
            document.body.classList.add('guided-red');
            this.phaseTextElement.textContent = 'Clinical Management';
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported:', error);
        }
    }
    
    playCompletionSound() {
        if (!this.audioContext || !this.soundEnabled) return;
        
        try {
            // Create oscillator for beep sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Configure sound
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800Hz beep
            oscillator.type = 'sine';
            
            // Configure volume envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            // Play the sound
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
            
            // Resume audio context if suspended (required for some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (error) {
            console.log('Sound playback failed:', error);
        }
    }
    
    resetFeedbackButtons() {
        // Reset feedback button states
        this.feedbackButtons.forEach(btn => {
            btn.classList.remove('clicked');
        });
    }
    
    async handleFeedback(rating) {
        // Visual feedback
        this.feedbackButtons.forEach(btn => {
            btn.classList.remove('clicked');
        });
        event.target.closest('.feedback-btn').classList.add('clicked');
        
        // Disable feedback buttons to prevent double submission
        this.feedbackButtons.forEach(btn => {
            btn.disabled = true;
        });
        
        try {
            // Send feedback to server
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: rating,
                    mode: this.currentMode
                })
            });
            
            if (response.ok) {
                console.log('Feedback sent successfully');
                this.phaseTextElement.textContent = 'Thank you for your feedback!';
            } else {
                console.error('Failed to send feedback');
                // Don't show any message if server fails
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            // Don't show any message if there's an error
        }
        
        // Reset feedback buttons and clear message after a short delay
        setTimeout(() => {
            this.resetFeedbackButtons();
            this.phaseTextElement.textContent = '';
        }, 2000);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SCATimer();
}); 