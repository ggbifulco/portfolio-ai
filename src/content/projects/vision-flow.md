# VisionFlow: Real-time Multimodal Video Understanding

VisionFlow è una pipeline di intelligenza artificiale avanzata che converte flussi video grezzi in dati strutturati e risposte in linguaggio naturale. Integra il meglio del rilevamento oggetti (*YOLOv11*) con la comprensione semantica delle immagini (*VLM*).

## 🎥 The Multimodal Challenge
Mentre i sistemi CV tradizionali si limitano a contare oggetti, VisionFlow capisce le relazioni tra essi e l'azione in corso. Risponde a domande come: "Qual è il comportamento dell'utente vicino alla zona di pericolo?" o "Il prodotto sulla linea rispetta gli standard qualitativi?".

## 🛠️ Integrated Architecture
1.  **Fast Detection (YOLOv11)**: Rilevamento di oggetti e keypoints a >60 FPS.
2.  **Scene Capture**: Estrazione di frame critici basata su anomalie o eventi specifici.
3.  **VLM Reasoning (Moondream2)**: Un modello Vision-Language ultra-leggero analizza il frame e risponde alla query dell'utente.
4.  **Async API (FastAPI)**: Gestisce lo streaming video e le richieste di analisi in parallelo senza bloccare l'inferenza.

## 🔧 Technical Stack
-   **Model Hub**: Hugging Face Transformers & Ultralytics
-   **Core**: PyTorch & OpenCV
-   **Inference Optimization**: ONNX Runtime / TensorRT
-   **Interface**: FastAPI with WebSockets

## 🚀 Future Scalability
Il sistema è progettato per essere deployato su **Edge Devices** (NVIDIA Jetson) o in Cloud, grazie alla scelta di modelli ad alta efficienza che non richiedono cluster di GPU massicce.
