/**
 * CASE FILES - Character Management
 */

const CharacterManager = {
    characters: {},
    
    init() {
        // Register core characters
        this.registerCharacter({
            id: 'chief',
            name: 'The Chief',
            role: 'Agency Director',
            portrait: null, // Silhouette only
            description: 'Your mysterious superior. Always speaks through a CRT screen.',
        });
        
        this.registerCharacter({
            id: 'courier',
            name: 'The Courier',
            role: 'Package Delivery',
            portrait: null, // Will be replaced with art
            description: 'Looks permanently exhausted. Always delivering.',
            regionalVariants: {
                france: { accessory: 'scarf' },
                japan: { accessory: 'umbrella' },
                indonesia: { accessory: 'sweating' },
                egypt: { accessory: 'sunglasses' },
            },
        });
    },
    
    registerCharacter(character) {
        this.characters[character.id] = character;
    },
    
    getCharacter(id) {
        return this.characters[id];
    },
    
    /**
     * Register case-specific characters
     */
    loadCaseCharacters(characters) {
        characters.forEach(char => {
            this.registerCharacter(char);
        });
    },
    
    /**
     * Get courier variant for current country
     */
    getCourierVariant(country) {
        const courier = this.characters.courier;
        if (!courier) return null;
        
        const variant = courier.regionalVariants?.[country.toLowerCase()];
        return {
            ...courier,
            ...variant,
        };
    },
    
    /**
     * Add character to met list
     */
    meetCharacter(characterId) {
        const character = this.getCharacter(characterId);
        if (!character) return false;
        
        return GameState.addPerson({
            id: characterId,
            name: character.name,
            role: character.role,
            portrait: character.portrait,
            suspect: character.suspect || false,
        });
    },
};

window.CharacterManager = CharacterManager;
