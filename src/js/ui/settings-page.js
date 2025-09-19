const STORAGE_KEY = 'fatturapa_plugin_settings';

/**
 * Inizializza la logica per la pagina delle impostazioni.
 */
export function initializeSettingsPage() {
    const form = document.getElementById('settings-form');
    if (!form) return;

    loadSettings();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
    });
}

/**
 * Salva i dati dal form nel localStorage del browser.
 */
function saveSettings() {
    const settings = {
        denominazione: document.getElementById('denominazione').value,
        partitaIva: document.getElementById('partitaIva').value,
        codiceFiscale: document.getElementById('codiceFiscale').value,
        regimeFiscale: document.getElementById('regimeFiscale').value,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    const feedback = document.getElementById('feedback');
    feedback.textContent = 'Impostazioni salvate con successo!';
    feedback.style.display = 'block';
    setTimeout(() => { feedback.style.display = 'none'; }, 3000);
}

/**
 * Carica i dati dal localStorage e popola il form.
 */
function loadSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('denominazione').value = settings.denominazione || '';
        document.getElementById('partitaIva').value = settings.partitaIva || '';
        document.getElementById('codiceFiscale').value = settings.codiceFiscale || '';
        document.getElementById('regimeFiscale').value = settings.regimeFiscale || 'RF01';
    }
}