# 🧠 Sentilytics

Sentilytics is a **React-based sentiment analysis application** integrated with **n8n workflows** to detect and respond to user feedback in real time.  
This repository includes both the frontend (React) and exported n8n workflows for easy automation setup.

---

## 🚀 Features

- **Sentiment Detection** – Analyze text input and classify it as **Positive**, **Neutral**, or **Negative** using OpenAI.
- **n8n Integration** – Automates sentiment classification and data handling through visual workflows.
- **Real-Time Alerts** – Email notifications are sent for all sentiment responses (Positive, Neutral, or Negative) via the Gmail API.
- **Data Storage** – Saves feedback to **Supabase** and **Google Sheets** through automated workflows.
- **Responsive UI** – Built using **React** and **Tailwind CSS** for a clean user experience.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Automation:** n8n (Open-source workflow automation)
- **NLP:** OpenAI GPT API (called via HTTP Request node in n8n)
- **Data Storage:** Supabase and Google Sheets
- **Email Integration:** Gmail API (triggered via Node.js function and HTTP request nodes in n8n)
- **Languages:** JavaScript (ES6+)
- **Styling:** Tailwind CSS or Material Tailwind
- **Package Manager:** npm or yarn

---

## 🔄 n8n Workflows

This project includes reusable n8n workflows located in the `/n8n-workflows` folder:

- **Sentiment Classification** – Routes feedback to OpenAI, receives the classification.
- **Data Logging** – Stores the result in Supabase and Google Sheets.
- **Email Notification** – Sends email alerts for each feedback response via the Gmail API.

> You can import the `.json` files directly into your n8n instance to replicate the full automation logic.

---

## 📽️ Demo

Here’s a quick demo of Sentilytics in action:

<p align="center">
  <img src="https://github.com/lewnuyda/sentilytics/blob/main/src/assets/sentilytics.gif" width="600" alt="Sentilytics Demo"/>
</p>

> Watch how user feedback is analyzed, stored, and emailed automatically in real time.

---

## 🧠 How It Works

1. User submits text feedback through the React frontend.
2. The text is sent to an n8n workflow.
3. OpenAI analyzes the text and returns a sentiment classification.
4. The result is saved in both Supabase and Google Sheets.
5. An email is sent via Gmail with the sentiment result and feedback content.

---

## ⚙️ Installation & Setup (React App)

### **1. Clone the repository**

```bash
git clone https://github.com/lewnuyda/sentilytics.git
cd sentilytics
```

### **2. Install dependencies**

```bash
npm install
# or
yarn install
```

### **3. Run the development server**

```bash
npm run dev
# or
yarn dev
```
