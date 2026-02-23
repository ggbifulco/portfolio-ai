# DocuMind: Enterprise RAG Architecture

DocuMind è un sistema avanzato di **Retrieval-Augmented Generation** progettato per gestire migliaia di documenti tecnici garantendo risposte precise e verificabili.

## Sfide Tecniche
1.  **Parsing di tabelle complesse**: Utilizzo di *Unstructured.io* per convertire PDF complessi in dati puliti.
2.  **Latenza**: Ottimizzazione dei tempi di risposta tramite *Milvus* e ricerca ibrida.
3.  **Hallucinations**: Implementazione di un sistema di *Self-Correction* basato su Agenti AI.

## Pipeline di Elaborazione
Il sistema segue un flusso lineare ma potente:
*   **Ingestion**: Caricamento e chunking intelligente.
*   **Embedding**: Trasformazione vettoriale con *BGE-M3*.
*   **Retrieval**: Recupero ibrido (Keyword + Semantico).
*   **Generation**: Risposta finale tramite *Claude 3.5 Sonnet*.

### Risultati Ottenuti
Il sistema ha ridotto il tempo di ricerca interna del **70%** per il team di ingegneria, fornendo citazioni dirette alle fonti originali per ogni risposta generata.
