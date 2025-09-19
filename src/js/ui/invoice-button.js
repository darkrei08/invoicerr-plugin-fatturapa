import { FatturaPA_v1_9 } from '../core/FatturaPA_v1_9';

const STORAGE_KEY = 'fatturapa_plugin_settings';

function getProviderData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
        alert("Errore: Dati azienda non trovati. Configura il plugin nel suo pannello di impostazioni.");
        return null;
    }
    const settings = JSON.parse(savedData);
    // Aggiungiamo i dati fissi che non sono nel form
    settings.sede = { nazione: 'IT' };
    return settings;
}

export function injectExportButton(targetSelector, invoiceData) {
    const container = document.querySelector(targetSelector);
    if (!container) return;

    // Evita di aggiungere il pulsante più volte
    if (container.querySelector('.btn-fattura-elettronica')) return;

    const button = document.createElement('button');
    button.innerText = 'Esporta XML FatturaPA';
    button.className = 'btn-fattura-elettronica';
    button.addEventListener('click', () => handleExport(button, invoiceData));
    container.appendChild(button);
}

function handleExport(button, invoiceData) {
    const cedenteData = getProviderData();
    if (!cedenteData) return;

    button.disabled = true;
    button.innerText = 'Genero...';

    try {
        const generator = new FatturaPA_v1_9(cedenteData, invoiceData);
        const xmlString = generator.buildXML();
        const filename = `IT${cedenteData.partitaIva}_${invoiceData.number.replace(/\W/g, '')}.xml`;
        downloadFile(xmlString, filename);
    } catch (error) {
        console.error("Errore generazione XML:", error);
        alert("Errore durante la generazione dell'XML.");
    } finally {
        button.disabled = false;
        button.innerText = 'Esporta XML FatturaPA';
    }
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}