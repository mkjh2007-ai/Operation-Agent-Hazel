/**
 * CASE FILES - State Management
 * Central state store for the entire game
 */

const GameState = {
    // Core game state
    initialized: false,
    currentScreen: 'boot',
    previousScreen: null,
    
    // Player identity
    player: {
        agentCode: 'H', // or 'M' for multiplayer
        notebookContent: '',
    },
    
    // Current case data
    currentCase: {
        id: null,
        title: '',
        location: '',
        country: '',
        started: false,
        completed: false,
        startTime: null,
    },
    
    // Scene management
    scene: {
        id: null,
        location: '',
        backdrop: null,
        characters: [],
        hotspots: [],
        visited: [],
    },
    
    // Collections
    evidence: [],
    people: [],
    locations: [],
    
    // Dialogue state
    dialogue: {
        active: false,
        speaker: null,
        currentNode: null,
        history: [],
    },
    
    // UI state
    ui: {
        activePanel: null,
        hudVisible: false,
        cursorType: 'default',
    },
    
    // Phone
    phone: {
        notifications: [],
        incomingCall: null,
        missedCalls: [],
    },
    
    // Flags (story progression)
    flags: {},
    
    // Methods
    setFlag(key, value) {
        this.flags[key] = value;
        this.save();
    },
    
    getFlag(key, defaultValue = false) {
        return this.flags[key] ?? defaultValue;
    },
    
    addEvidence(evidenceItem) {
        if (!this.evidence.find(e => e.id === evidenceItem.id)) {
            this.evidence.push({
                ...evidenceItem,
                collectedAt: Date.now(),
            });
            this.save();
            return true;
        }
        return false;
    },
    
    addPerson(person) {
        if (!this.people.find(p => p.id === person.id)) {
            this.people.push({
                ...person,
                metAt: Date.now(),
                suspicion: 0,
            });
            this.save();
            return true;
        }
        return false;
    },
    
    unlockLocation(locationId) {
        const location = this.locations.find(l => l.id === locationId);
        if (location && !location.unlocked) {
            location.unlocked = true;
            this.save();
            return true;
        }
        return false;
    },
    
    visitLocation(locationId) {
        if (!this.scene.visited.includes(locationId)) {
            this.scene.visited.push(locationId);
        }
    },
    
    save() {
        const saveData = {
            player: this.player,
            currentCase: this.currentCase,
            evidence: this.evidence,
            people: this.people,
            locations: this.locations,
            flags: this.flags,
            phone: this.phone,
            scene: {
                visited: this.scene.visited,
            },
            savedAt: Date.now(),
        };
        localStorage.setItem('casefiles_save', JSON.stringify(saveData));
    },
    
    load() {
        const saveData = localStorage.getItem('casefiles_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            Object.assign(this.player, data.player);
            Object.assign(this.currentCase, data.currentCase);
            this.evidence = data.evidence || [];
            this.people = data.people || [];
            this.locations = data.locations || [];
            this.flags = data.flags || {};
            Object.assign(this.phone, data.phone);
            this.scene.visited = data.scene?.visited || [];
            return true;
        }
        return false;
    },
    
    reset() {
        this.currentCase = {
            id: null,
            title: '',
            location: '',
            country: '',
            started: false,
            completed: false,
            startTime: null,
        };
        this.evidence = [];
        this.people = [];
        this.flags = {};
        this.scene.visited = [];
        this.phone.notifications = [];
        this.phone.incomingCall = null;
        this.phone.missedCalls = [];
        localStorage.removeItem('casefiles_save');
    },
};

// Make it globally accessible
window.GameState = GameState;
