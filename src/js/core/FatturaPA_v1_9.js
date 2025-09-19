import { create } from 'xmlbuilder2';

/**
 * Classe per generare l'XML della Fattura Elettronica v1.9.
 */
export class FatturaPA_v1_9 {
    constructor(cedente, invoice) {
        this.cedente = cedente;
        this.invoice = invoice;
        this.cessionario = invoice.client;
    }

    /**
     * Costruisce e restituisce la stringa XML completa.
     * @returns {string} L'XML della fattura, formattato.
     */
    buildXML() {
        const progressivoInvio = this.invoice.number.replace(/\W/g, '');

        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('p:FatturaElettronica', {
                'versione': 'FPR12',
                'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                'xmlns:p': 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            });

        // === HEADER ===
        const header = root.ele('FatturaElettronica_Header');
        
        // Dati Trasmissione
        header.ele('DatiTrasmissione')
            .ele('IdTrasmittente')
                .ele('IdPaese').txt(this.cedente.sede.nazione).up()
                .ele('IdCodice').txt(this.cedente.codiceFiscale).up()
            .up()
            .ele('ProgressivoInvio').txt(progressivoInvio).up()
            .ele('FormatoTrasmissione').txt('FPR12').up()
            .ele('CodiceDestinatario').txt(this.cessionario.sdi_code || '0000000').up();
            // Aggiungere PecDestinatario se sdi_code è '0000000'

        // Cedente Prestatore (la tua azienda)
        const cedenteNode = header.ele('CedentePrestatore').ele('DatiAnagrafici');
        cedenteNode.ele('IdFiscaleIVA')
            .ele('IdPaese').txt(this.cedente.sede.nazione).up()
            .ele('IdCodice').txt(this.cedente.partitaIva).up()
        .up();
        cedenteNode.ele('CodiceFiscale').txt(this.cedente.codiceFiscale).up();
        cedenteNode.ele('Anagrafica').ele('Denominazione').txt(this.cedente.denominazione).up().up();
        cedenteNode.ele('RegimeFiscale').txt(this.cedente.regimeFiscale).up();

        // Cessionario Committente (il cliente)
        const cessionarioNode = header.ele('CessionarioCommittente').ele('DatiAnagrafici');
        if (this.cessionario.tax_code) {
             cessionarioNode.ele('CodiceFiscale').txt(this.cessionario.tax_code).up();
        }
        cessionarioNode.ele('IdFiscaleIVA')
            .ele('IdPaese').txt(this.cessionario.address.country).up()
            .ele('IdCodice').txt(this.cessionario.vat_number).up()
        .up();
        cessionarioNode.ele('Anagrafica').ele('Denominazione').txt(this.cessionario.name).up().up();

        // === BODY ===
        const body = root.ele('FatturaElettronica_Body');
        
        // Dati Generali
        body.ele('DatiGenerali')
            .ele('DatiGeneraliDocumento')
                .ele('TipoDocumento').txt('TD01').up() // Da rendere dinamico
                .ele('Divisa').txt(this.invoice.currency).up()
                .ele('Data').txt(this.invoice.date).up()
                .ele('Numero').txt(this.invoice.number).up()
            .up()
        .up();
        
        // Dati Beni e Servizi
        const datiBeniServizi = body.ele('DatiBeniServizi');
        this.invoice.items.forEach((item, index) => {
            datiBeniServizi.ele('DettaglioLinee')
                .ele('NumeroLinea').txt(index + 1).up()
                .ele('Descrizione').txt(item.description).up()
                .ele('Quantita').txt(item.quantity.toFixed(2)).up()
                .ele('PrezzoUnitario').txt(item.unit_price.toFixed(2)).up()
                .ele('PrezzoTotale').txt((item.quantity * item.unit_price).toFixed(2)).up()
                .ele('AliquotaIVA').txt('22.00').up() // Da rendere dinamico
            .up();
        });

        // Dati di Riepilogo IVA
        datiBeniServizi.ele('DatiRiepilogo')
            .ele('AliquotaIVA').txt('22.00').up()
            .ele('ImponibileImporto').txt(this.invoice.subtotal.toFixed(2)).up()
            .ele('Imposta').txt(this.invoice.tax_total.toFixed(2)).up()
            .ele('EsigibilitaIVA').txt('I').up();

        return root.end({ prettyPrint: true });
    }
}