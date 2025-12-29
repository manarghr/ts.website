## TrainSight AI (Python model from `AI/MediaPipe`) – Run locally

This project now supports using **your Python MediaPipe model** (the code inside `AI/MediaPipe/`) for the website camera page.

### 1) Create venv + install deps

From the project root:

```powershell
python -m venv .venv
.venv\Scripts\pip install -r AI\requirements.txt
```

### 2) Start the AI API server

```powershell
.venv\Scripts\python AI\mediapipe_api.py
```

It will run on:
- `http://127.0.0.1:8001`

### 3) Use it from the website

Open:
- `/services/ai-sports`

Click:
- **Enable Camera**
- **Start Workout**

The page will send frames to the Python server every ~200ms and display:
- feedback
- form score
- reps
- skeleton overlay


