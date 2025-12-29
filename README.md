# 🛡️ SafeTap
SafeTap is a tool that reads those long, boring privacy policies so you don’t have to. It uses AI to find the "red flags" in the fine print and gives the website a safety score.

# What it actually does:
Scans as you browse: The Chrome extension detects when you're looking at a privacy policy and asks if you want to analyze it.
Gives a Safety Score: It looks for things like "selling your data" or "tracking your location" and gives the site a score out of 100.
Highlights the bad stuff: It pulls out the specific sentences that are risky (High, Medium, or Low risk) so you can see why the score is low.
Privacy Dashboard: A clean dashboard (made with React) where you can see all the sites you've scanned and a chart showing which ones are the most dangerous.

# How it’s built:
The Brain: Python & AI (DistilBERT) to understand the legal text.
The Looks: React & Material UI for the dashboard and charts.
The Bridge: A Chrome Extension that connects your browser to the AI.
The Memory: A database that saves your history so you can check it later.

# Quick Start (How to run it):
Start the AI: Go to /nlp-service and run uvicorn main:app.
Start the Backend: Go to /backend and run python main.py.
Start the Dashboard: Go to /frontend and run npm run dev.
Add the Extension: Load the /extension folder into Chrome (Developer Mode).
