# ChatBee – Portfolio Chatbot for Haseeba Maqsood

Flask (Python 3.11.9) backend + OpenRouter API + HTML/CSS/JavaScript frontend.

## Run in VS Code

1. Install Python 3.11.9 and open this folder in VS Code (File > Open Folder).
2. Open the terminal (Ctrl + `) and create a virtual environment:
   - Windows:  `py -3.11 -m venv venv`  then  `venv\Scripts\activate`
   - Mac/Linux: `python3.11 -m venv venv`  then  `source venv/bin/activate`
3. Install packages:  `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and paste your OpenRouter API key
   (create one free at https://openrouter.ai/keys).
5. Run:  `python app.py`
6. Open http://127.0.0.1:5000 in your browser.

## Customize

- `profile_data.json` – all of your information (add email, GitHub, LinkedIn, more projects). The chatbot only answers from this file.
- `static/style.css` – colours are in the `:root` block at the top; copy the exact colours from your portfolio.
- `.env` – change `OPENROUTER_MODEL` if a free model is unavailable (see https://openrouter.ai/models).

## Project structure

```
ChatBee/
├── app.py              Flask backend + OpenRouter call
├── profile_data.json   Your portfolio knowledge
├── requirements.txt
├── .env.example
└── static/
    ├── index.html
    ├── style.css
    └── script.js
```

## Troubleshooting

- "missing API key": make sure the file is named `.env` (not `.env.example`) and restart the app.
- "OpenRouter error 404/429": the free model may be busy or retired; change `OPENROUTER_MODEL` in `.env`.
