import { injectExportButton } from './ui/invoice-button';
import { initializeSettingsPage } from './ui/settings-page';
import '../assets/styles/plugin.css';

/**
 * Punto di ingresso principale del plugin.
 * Controlla in quale pagina ci si trova e avvia la logica corretta.
 */
function initializePlugin() {
    console.log('Plugin Fattura Elettronica IT Caricato.');
    
    // Se siamo nella pagina delle impostazioni (identificata dal form)
    if (document.getElementById('settings-form')) {
        initializeSettingsPage();
    } else {
        // Altrimenti, assumiamo di essere in Invoicerr e attendiamo l'evento per la fattura
        document.addEventListener('invoicerr:view:invoice', (event) => {
            if (event.detail && event.detail.invoice) {
                const invoiceData = event.detail.invoice;
                const targetElementSelector = '.invoice-actions'; // Selettore di esempio
                injectExportButton(targetElementSelector, invoiceData);
            }
        });
    }
}

// Avvia il plugin quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initializePlugin);

// --- BLOCCO DI TEST (solo per provare il pulsante senza Invoicerr) ---
if (!window.location.pathname.includes('settings.html')) {
    setTimeout(() => {
        const fakeInvoiceData = {
            number: 'F2025-008', date: '2025-09-19', currency: 'EUR', subtotal: 2000.00, tax_total: 440.00, total: 2440.00,
            items: [{ description: 'Consulenza Strategica', quantity: 20, unit_price: 100.00, tax_rate: 22.00 }],
            client: { name: 'Cliente Finale S.p.A.', vat_number: '01122334455', tax_code: '01122334455', address: { country: 'IT' }, sdi_code: 'SUBM70N' }
        };
        document.dispatchEvent(new CustomEvent('invoicerr:view:invoice', { detail: { invoice: fakeInvoiceData } }));
    }, 1000);
}