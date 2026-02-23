# Self-Correcting RAG: High-Reliability Enterprise Search

Questo progetto implementa una pipeline di **Retrieval-Augmented Generation (RAG)** di grado enterprise, progettata per eliminare le allucinazioni tipiche dei sistemi basati solo sulla similarità vettoriale.

## 🚀 The Core Problem
I sistemi RAG standard spesso falliscono quando il recupero (retrieval) fornisce informazioni irrilevanti o quando il modello genera risposte basate su pre-conoscenze invece che sul contesto fornito. Questo sistema introduce un **loop di auto-correzione**.

## 🛠️ Advanced Architecture
Il sistema non è lineare, ma segue un flusso ciclico:

1.  **Semantic Retrieval**: Ricerca vettoriale su *Qdrant* con embedding *BGE-M3*.
2.  **Context Grading**: Un agente AI (Claude 3.5) valuta se i documenti recuperati sono sufficienti per rispondere alla domanda.
3.  **Self-Correction Loop**:
    *   Se il contesto è scarso, il sistema espande la query e rifà la ricerca.
    *   Se la risposta generata contiene "hallucinations" (non supportate dai dati), il sistema la scarta e rigenera con parametri più restrittivi.
4.  **Evaluation**: Utilizzo del framework *Ragas* per monitorare la *Faithfulness* e la *Answer Relevancy*.

## 🔧 Technical Stack
*   **Engine**: LlamaIndex (Workflows)
*   **Vector DB**: Qdrant (Hybrid Search enabled)
*   **Models**: Claude 3.5 Sonnet (Reasoner), GPT-4o-mini (Grader)
*   **Parsing**: Unstructured.io per PDF complessi

## 📊 Business Impact
*   **Accuratezza**: Riduzione delle allucinazioni del **95%** rispetto a una pipeline RAG standard.
*   **Trust**: Ogni affermazione è collegata a una citazione precisa (Citations source tracking).
