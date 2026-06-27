/**
 * CASE FILES - Scene Manager
 * Handles screen transitions and scene loading
 */

const SceneManager = {
    scenes: {},
    currentSceneData: null,
    
    init() {
        // Register screen handlers
        this.setupScreenHandlers();
    },
    
    setupScreenHandlers() {
        // Evidence close button
        document.querySelector('.evidence-close')?.addEventListener('click', () => {
            InventorySystem.hideEvidencePopup();
        });
        
        // Board close button
        document.querySelector('.board-close')?.addEventListener('click', () => {
            this.transitionTo('investigation');
        });
    },
    
    /**
     * Register scene data
     */
    registerScene(sceneData) {
        this.scenes[sceneData.id] = sceneData;
    },
    
    /**
     * Load case scenes
     */
    loadCaseScenes(scenes) {
        scenes.forEach(scene => {
            this.registerScene(scene);
        });
    },
    
    /**
     * Transition between screens
     */
    async transitionTo(screenId, data = {}) {
        const currentScreen = document.querySelector('.screen.active');
        const newScreen = document.getElementById(`${screenId}-screen`);
        
        if (!newScreen) {
            console.error(`Screen not found: ${screenId}`);
            return;
        }
        
        GameState.previousScreen = GameState.currentScreen;
        GameState.currentScreen = screenId;
        
        // Fade out current
        if (currentScreen) {
            currentScreen.classList.add('fading-out');
            await this.wait(300);
            currentScreen.classList.remove('active', 'fading-out');
        }
        
        // Fade in new
        newScreen.classList.add('fading-in');
        await this.wait(50);
        newScreen.classList.add('active');
        newScreen.classList.remove('fading-in');
        
        // Handle screen-specific setup
        this.onScreenEnter(screenId, data);
        
        return true;
    },
    
    /**
     * Handle screen entry
     */
    onScreenEnter(screenId, data) {
        switch (screenId) {
            case 'investigation':
                UIManager.showHUD();
                break;
            case 'chief':
            case 'boot':
            case 'door':
            case 'package':
            case 'mission':
            case 'travel':
            case 'board':
                UIManager.hideHUD();
                break;
        }
    },
    
    /**
     * Load an investigation scene
     */
    async loadScene(sceneId) {
        const sceneData = this.scenes[sceneId];
        if (!sceneData) {
            console.error(`Scene not found: ${sceneId}`);
            return;
        }
        
        this.currentSceneData = sceneData;
        GameState.scene.id = sceneId;
        GameState.scene.location = sceneData.name;
        GameState.visitLocation(sceneId);
        
        // Update backdrop
        const backdrop = document.querySelector('.location-backdrop');
        if (backdrop && sceneData.backdrop) {
            backdrop.style.backgroundImage = `url(${sceneData.backdrop})`;
        } else if (backdrop) {
            // Placeholder gradient
            backdrop.style.background = sceneData.backgroundColor || 
                'linear-gradient(180deg, #1a1815 0%, #0d0c0a 100%)';
        }
        
        // Update location indicator
        UIManager.updateLocationIndicator(sceneData.name);
        
        // Setup hotspots
        this.setupHotspots(sceneData.hotspots || []);
        
        // Setup characters
        this.setupCharacters(sceneData.characters || []);
        
        // Transition to investigation screen
        await this.transitionTo('investigation');
        
        // Run entry dialogue/event if specified
        if (sceneData.onEnter) {
            if (typeof sceneData.onEnter === 'function') {
                sceneData.onEnter();
            } else if (sceneData.onEnter.dialogue) {
                // Start dialogue
                const overlay = document.querySelector('.dialogue-overlay');
                overlay?.classList.remove('hidden');
                DialogueSystem.setContainer('.dialogue-overlay');
                await DialogueSystem.startConversation(sceneData.onEnter.dialogue);
            }
        }
    },
    
    /**
     * Setup interactive hotspots
     */
    setupHotspots(hotspots) {
        const layer = document.querySelector('.interactive-layer');
        if (!layer) return;
        
        layer.innerHTML = '';
        
        hotspots.forEach(hotspot => {
            const el = document.createElement('div');
            el.className = 'interactive-hotspot';
            el.style.left = `${hotspot.x}%`;
            el.style.top = `${hotspot.y}%`;
            el.style.width = `${hotspot.width || 50}px`;
            el.style.height = `${hotspot.height || 50}px`;
            
            el.addEventListener('mouseenter', () => {
                UIManager.setCursor(hotspot.cursorType || 'magnify');
            });
            
            el.addEventListener('mouseleave', () => {
                UIManager.setCursor('default');
            });
            
            el.addEventListener('click', () => {
                this.handleHotspotClick(hotspot);
            });
            
            layer.appendChild(el);
        });
    },
    
    /**
     * Setup characters in scene
     */
    setupCharacters(characters) {
        const layer = document.querySelector('.characters-layer');
        if (!layer) return;
        
        layer.innerHTML = '';
        
        characters.forEach(char => {
            const el = document.createElement('div');
            el.className = 'character-sprite';
            el.style.left = `${char.x}%`;
            el.style.bottom = `${char.y || 0}%`;
            el.style.width = `${char.width || 150}px`;
            el.style.height = `${char.height || 300}px`;
            
            if (char.image) {
                el.style.backgroundImage = `url(${char.image})`;
                el.style.backgroundSize = 'contain';
                el.style.backgroundPosition = 'bottom center';
                el.style.backgroundRepeat = 'no-repeat';
            } else {
                // Placeholder
                el.style.background = 'rgba(100, 100, 100, 0.3)';
            }
            
            el.addEventListener('mouseenter', () => {
                UIManager.setCursor('talk');
            });
            
            el.addEventListener('mouseleave', () => {
                UIManager.setCursor('default');
            });
            
            el.addEventListener('click', () => {
                this.handleCharacterClick(char);
            });
            
            layer.appendChild(el);
        });
    },
    
    /**
     * Handle hotspot interaction
     */
    handleHotspotClick(hotspot) {
        AudioManager.play('click');
        
        switch (hotspot.type) {
            case 'evidence':
                InventorySystem.showEvidencePopup({
                    id: hotspot.id,
                    name: hotspot.name,
                    type: hotspot.evidenceType || 'document',
                    description: hotspot.description,
                    image: hotspot.image,
                });
                break;
                
            case 'examine':
                // Show examination text
                const overlay = document.querySelector('.dialogue-overlay');
                overlay?.classList.remove('hidden');
                DialogueSystem.setContainer('.dialogue-overlay');
                DialogueSystem.typeText(hotspot.description).then(() => {
                    DialogueSystem.waitForContinue(() => {
                        overlay?.classList.add('hidden');
                        DialogueSystem.clear();
                    });
                });
                break;
                
            case 'travel':
                if (hotspot.destination) {
                    TravelSystem.travelTo(hotspot.destination);
                }
                break;
                
            case 'action':
                if (hotspot.action) {
                    document.dispatchEvent(new CustomEvent('scene:action', {
                        detail: { action: hotspot.action, hotspot }
                    }));
                }
                break;
        }
    },
    
    /**
     * Handle character interaction
     */
    handleCharacterClick(character) {
        AudioManager.play('click');
        
        // Meet character if not already met
        CharacterManager.meetCharacter(character.id);
        
        // Start dialogue if available
        if (character.dialogue) {
            const overlay = document.querySelector('.dialogue-overlay');
            overlay?.classList.remove('hidden');
            DialogueSystem.setContainer('.dialogue-overlay');
            DialogueSystem.startConversation(character.dialogue);
        }
    },
    
    /**
     * Utility wait function
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};

window.SceneManager = SceneManager;
