/**
 * CASE FILES - Dialogue System
 * Handles all text display, typewriter effects, and conversation trees
 */

const DialogueSystem = {
    container: null,
    textElement: null,
    continueIndicator: null,
    choicesContainer: null,
    
    currentText: '',
    displayedText: '',
    charIndex: 0,
    typeSpeed: 30, // ms per character
    isTyping: false,
    isPaused: false,
    onComplete: null,
    
    // Conversation tree state
    currentTree: null,
    currentNodeId: null,
    history: [],
    
    init() {
        // Will be called when DOM is ready
    },
    
    setContainer(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (this.container) {
            this.textElement = this.container.querySelector('.dialogue-text');
            this.continueIndicator = this.container.querySelector('.dialogue-continue');
            this.choicesContainer = this.container.querySelector('.dialogue-choices');
        }
    },
    
    /**
     * Display text with typewriter effect
     */
    async typeText(text, options = {}) {
        const {
            speed = this.typeSpeed,
            onCharacter = null,
            skipable = true,
        } = options;
        
        return new Promise((resolve) => {
            this.currentText = text;
            this.displayedText = '';
            this.charIndex = 0;
            this.isTyping = true;
            this.isPaused = false;
            this.onComplete = resolve;
            
            if (this.textElement) {
                this.textElement.textContent = '';
            }
            
            if (this.continueIndicator) {
                this.continueIndicator.classList.remove('visible');
            }
            
            const type = () => {
                if (this.isPaused) {
                    setTimeout(type, 50);
                    return;
                }
                
                if (this.charIndex < this.currentText.length) {
                    const char = this.currentText[this.charIndex];
                    this.displayedText += char;
                    
                    if (this.textElement) {
                        this.textElement.textContent = this.displayedText;
                    }
                    
                    // Play typewriter sound for visible characters
                    if (char !== ' ' && char !== '\n') {
                        AudioManager.play('typewriter');
                    }
                    
                    if (onCharacter) {
                        onCharacter(char, this.charIndex);
                    }
                    
                    this.charIndex++;
                    
                    // Variable delay for punctuation
                    let delay = speed;
                    if (['.', '!', '?'].includes(char)) {
                        delay = speed * 8;
                    } else if ([',', ';', ':'].includes(char)) {
                        delay = speed * 3;
                    }
                    
                    setTimeout(type, delay);
                } else {
                    this.isTyping = false;
                    if (this.continueIndicator) {
                        this.continueIndicator.classList.add('visible');
                    }
                    resolve();
                }
            };
            
            type();
        });
    },
    
    /**
     * Skip to end of current text
     */
    skipToEnd() {
        if (!this.isTyping) return false;
        
        this.displayedText = this.currentText;
        this.charIndex = this.currentText.length;
        this.isTyping = false;
        
        if (this.textElement) {
            this.textElement.textContent = this.displayedText;
        }
        
        if (this.continueIndicator) {
            this.continueIndicator.classList.add('visible');
        }
        
        if (this.onComplete) {
            this.onComplete();
        }
        
        return true;
    },
    
    /**
     * Clear displayed text
     */
    clear() {
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.isTyping = false;
        
        if (this.textElement) {
            this.textElement.textContent = '';
        }
        
        if (this.continueIndicator) {
            this.continueIndicator.classList.remove('visible');
        }
    },
    
    /**
     * Start a conversation tree
     */
    async startConversation(tree, startNodeId = 'start') {
        this.currentTree = tree;
        this.history = [];
        
        GameState.dialogue.active = true;
        GameState.dialogue.currentNode = startNodeId;
        
        await this.showNode(startNodeId);
    },
    
    /**
     * Show a specific dialogue node
     */
    async showNode(nodeId) {
        const node = this.currentTree[nodeId];
        if (!node) {
            console.error(`Dialogue node not found: ${nodeId}`);
            return;
        }
        
        this.currentNodeId = nodeId;
        this.history.push(nodeId);
        GameState.dialogue.currentNode = nodeId;
        
        // Update speaker if specified
        if (node.speaker) {
            GameState.dialogue.speaker = node.speaker;
            this.updateSpeaker(node.speaker);
        }
        
        // Display the text
        await this.typeText(node.text);
        
        // Handle what comes next
        if (node.choices && node.choices.length > 0) {
            this.showChoices(node.choices);
        } else if (node.next) {
            // Wait for click then continue
            this.waitForContinue(() => {
                this.showNode(node.next);
            });
        } else if (node.action) {
            // Execute action
            this.executeAction(node.action);
        } else {
            // End of conversation
            this.waitForContinue(() => {
                this.endConversation();
            });
        }
    },
    
    /**
     * Show dialogue choices
     */
    showChoices(choices) {
        if (!this.choicesContainer) return;
        
        this.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            // Check if choice should be shown
            if (choice.condition && !this.checkCondition(choice.condition)) {
                return;
            }
            
            const button = document.createElement('button');
            button.className = 'dialogue-choice';
            button.textContent = choice.text;
            button.style.opacity = '0';
            button.style.animation = `fade-in-up 0.3s ease-out ${index * 0.1}s forwards`;
            
            button.addEventListener('click', () => {
                AudioManager.play('click');
                this.selectChoice(choice);
            });
            
            this.choicesContainer.appendChild(button);
        });
    },
    
    /**
     * Handle choice selection
     */
    async selectChoice(choice) {
        // Clear choices
        if (this.choicesContainer) {
            this.choicesContainer.innerHTML = '';
        }
        
        // Set any flags
        if (choice.setFlag) {
            GameState.setFlag(choice.setFlag, true);
        }
        
        // Show player's choice text briefly (optional)
        // Then continue to next node
        if (choice.next) {
            await this.showNode(choice.next);
        } else if (choice.action) {
            this.executeAction(choice.action);
        } else {
            this.endConversation();
        }
    },
    
    /**
     * Wait for click to continue
     */
    waitForContinue(callback) {
        const handler = (e) => {
            // Skip if clicking a choice button
            if (e.target.classList.contains('dialogue-choice')) return;
            
            document.removeEventListener('click', handler);
            AudioManager.play('click');
            callback();
        };
        
        document.addEventListener('click', handler);
    },
    
    /**
     * Check a condition
     */
    checkCondition(condition) {
        if (typeof condition === 'string') {
            return GameState.getFlag(condition);
        }
        if (typeof condition === 'function') {
            return condition(GameState);
        }
        return true;
    },
    
    /**
     * Execute an action
     */
    executeAction(action) {
        if (typeof action === 'string') {
            // Emit event
            document.dispatchEvent(new CustomEvent('dialogue:action', { 
                detail: { action } 
            }));
        } else if (typeof action === 'function') {
            action(GameState);
        }
    },
    
    /**
     * Update speaker display
     */
    updateSpeaker(speakerId) {
        const portrait = document.querySelector('.speaker-portrait');
        const nameElement = document.querySelector('.speaker-name');
        
        // Get speaker data
        const character = CharacterManager.getCharacter(speakerId);
        
        if (character && nameElement) {
            nameElement.textContent = character.name;
        }
        
        if (character && portrait) {
            // Update portrait image
            if (character.portrait) {
                portrait.style.backgroundImage = `url(${character.portrait})`;
            }
        }
    },
    
    /**
     * End conversation
     */
    endConversation() {
        GameState.dialogue.active = false;
        GameState.dialogue.speaker = null;
        GameState.dialogue.currentNode = null;
        
        this.currentTree = null;
        this.currentNodeId = null;
        this.clear();
        
        // Hide dialogue overlay if in investigation
        const overlay = document.querySelector('.dialogue-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        
        document.dispatchEvent(new CustomEvent('dialogue:end'));
    },
    
    /**
     * Pause/resume typing
     */
    pause() {
        this.isPaused = true;
    },
    
    resume() {
        this.isPaused = false;
    },
};

window.DialogueSystem = DialogueSystem;
