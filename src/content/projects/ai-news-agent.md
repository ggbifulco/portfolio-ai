# BGG News-Agent: The Future of Technical Content Production

Questo progetto risolve il problema del sovraccarico di informazioni nel settore AI. Invece di leggere centinaia di feed, utilizzo un'**orchestra di agenti autonomi** per filtrare, analizzare e riassumere le scoperte più rilevanti.

## 🧠 Multi-Agent Architecture
Il sistema utilizza il framework *CrewAI* per definire ruoli e deleghe:

1.  **The Trend Scout (Tavily Search)**: Monitora repository GitHub e paper su ArXiv. Filtra i contenuti in base al "Technical Noise" (esclude il marketing, tiene la sostanza).
2.  **The Deep Analyst (Gemini 1.5 Pro)**: Analizza il codice o il paper recuperato. Estrae algoritmi, benchmark e novità architettoniche.
3.  **The Technical Writer (Markdown Editor)**: Converte l'analisi in un articolo pronto per la newsletter, mantenendo un tono da *Advanced Engineer*.
4.  **The Quality Gate**: Verifica la correttezza del codice Python citato e dei link.

## 🛠️ Tech Stack
*   **Orchestration**: CrewAI (Sequential & Hierarchical processes)
*   **Intelligence**: Google Gemini 1.5 Pro
*   **Search Engine**: Tavily API (Search optimized for LLMs)
*   **Formatting**: Automated Markdown generation

## 🚀 Impact
Questo sistema non è solo un esercizio tecnico, ma uno strumento di produzione reale che riduce il tempo di redazione di un articolo tecnico del **90%**, garantendo al contempo una profondità analitica impossibile per un essere umano in tempi rapidi.
