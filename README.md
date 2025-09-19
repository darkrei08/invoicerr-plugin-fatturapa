# invoicerr-plugin-fatturapa
=======
# Plugin Fattura Elettronica per Invoicerr

Questo è un plugin per il software [Invoicerr](https'://github.com/Impre-visible/invoicerr') che aggiunge la funzionalità di base per generare il file XML per la Fattura Elettronica Italiana, secondo le specifiche dell'Agenzia delle Entrate.

## Funzionalità
- Generazione di file XML in formato FatturaPA.
- Aggiunta di un pulsante "Esporta XML" nella vista della fattura.
- Pannello di impostazioni per configurare i dati della propria azienda (Cedente/Prestatore).

## Installazione
1.  Compilare il progetto eseguendo `npm run build`.
2.  Copiare la cartella `dist/` e il file `manifest.json` nella directory dei plugin di Invoicerr.

## Sviluppo
Per modificare il codice sorgente:
1.  Clonare questo repository.
2.  Eseguire `npm install` per installare le dipendenze.
3.  Eseguire `npm run dev` per avviare la compilazione automatica durante le modifiche.

