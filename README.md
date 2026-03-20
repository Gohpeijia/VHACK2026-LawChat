# ⚖️ LawChat — Malaysian Rights Explainer

> **Snap a letter. Ask a law. Know your rights.**
> An AI-powered multilingual civic assistant that helps every Malaysian understand government documents and their legal rights — in multiple languages.

---

## 🏆 V HACK 2026 — Varsity Hackathon

| | |
|---|---|
| **Track** | Natural Language Processing (NLP) |
| **SDG** | SDG 10: Reduced Inequalities (Target 10.2) |
| **Team** | VHACK2026-LawChat |
| **University** | Sunway University|
| **Deadline** | 20 March 2026 |

---

## 🖼️ User Interface Showcase:
### For Web:

<table border="0">

  <tr>
    <td align="center" width="40%">
      <b>🔐 The Login Page</b><br />
      <img src="https://github.com/user-attachments/assets/cae24716-0d95-4252-9325-9d58085e6a45" width="100%" />
    </td>
    <td align="center" width="40%">
      <b> 📝 Document Explainer </b><br />
      <img src="https://github.com/user-attachments/assets/4cab477b-6ecd-48a5-870e-3c9b0cbeaa99" width="100%" />
    </td>
   </tr>
   <tr>
    <td align="center" width="40%">
      <b> ⚖️ Law Chat</b><br />
      <img src="https://github.com/user-attachments/assets/8c2f9975-6b0b-4454-ba3d-35531a137a72" width="100%" />
    </td>
    <td align="center" width="40%">
      <b>⚡ History Page ><br />
      <img src="https://github.com/user-attachments/assets/b667a61b-0cf0-45c5-85fb-d88f6a0feaaa" width=100%" />
    </td>
  </tr>
</table>

### For Mobile:

<table border="0">

  <tr>
    <td align="center" width="40%">
      <b>🔐 The Login Page</b><br />
      <img src="https://github.com/user-attachments/assets/7b44a204-8f16-4378-8fb5-cf342ffea66a" />
    </td>
    <td align="center" width="40%">
      <b> 📝 Document Explainer </b><br />
      <img src="https://github.com/user-attachments/assets/7c7c1b8b-d6f6-4822-a219-e1e2b83f76e1" />
    </td>
    </tr>
    <tr>
    <td align="center" width="40%">
      <b> ⚖️ Law Chat</b><br />
      <img src="https://github.com/user-attachments/assets/c8fb62e8-5d1c-4b1f-85a1-4e9df1919853" />
    </td>
    <td align="center" width="40%">
      <b>⚡ History Page </b><br />
      <img src="https://github.com/user-attachments/assets/9e1c1408-ac46-4d47-85e4-d4009f88744d" />
    </td>
  </tr>
</table>

---
## 🎯 Problem Statement

ASEAN is a mosaic of thousands of languages and dialects. However, digital government portals (e-Gov) often use a single dominant national language and complex official terminology. This creates a barrier for:

- 👴 **Elderly users** who cannot understand formal BM or English
- 👷 **Migrant workers** unfamiliar with local legal language
- 🏘️ **Rural B40 communities** excluded from welfare and legal services
- 📋 **SMEs and freelancers** confused by LHDN and JKM letters

---

## 💡 Solution

**LawChat** is powered by the **Gemini API** that:

1. 📷 **Snaps government document**: Such as LHDN notice, JKM letter, hospital bill, welfare form and more.
2. 🧠 **Gemini AI Powered:** Integrates Google's state-of-the-art Gemini API for accurate, context-aware legal simplifications.
3. ✅ **Givee clear action steps**: The step will labeled at the aend of the chat for user to notice it.
4. ⚖️ **Answers legal questions** about tenancy, employment, consumer, family, road, and welfare rights
5. 🎧 **Reading Mode (Text-to-Speech):** The AI can read its explanations aloud, perfect for users on the go or those with visual impairments.
6. 🎙️ **Voice Input (Speech-to-Text):** Users can simply speak their legal questions, ensuring accessibility for all.
7. 🗄️ **Cloud Database:** Utilizes Firebase for robust, real-time database management and secure data storage.
8. 📱 **Cross-Platform:** Built as a modern web app that compiles natively to Android.

---

## 🏗️ Architecture
```
┌────────────────────────────────────────────────────────────┐
│                 Cross-Platform Deployment                  │
│                                                            │
│  ┌──────────────────────┐        ┌──────────────────────┐  │
│  │   Web Browser (PC)   │        │ Native App (Android) │  │
│  │    (npm run dev)     │        │   (via Capacitor)    │  │
│  └──────────┬───────────┘        └──────────┬───────────┘  │
│             │                               │              │
│  ┌──────────▼───────────────────────────────▼───────────┐  │
│  │             React 18 + TypeScript (SPA)              │  │
│  │                    Tailwind CSS                      │  │
│  │                                                      │  │
│  │  ┌──────────────┐         ┌───────────────────────┐  │  │
│  │  │ LawChat Tab  │         │ Document Explainer    │  │  │
│  │  │ (Voice API)  │         │ (Camera/PDF Plugin)   │  │  │
│  │  └──────┬───────┘         └───────────┬───────────┘  │  │
│  │         │                             │              │  │
│  │         └──────────────┬──────────────┘              │  │
│  │                        │                             │  │
│  │            ┌───────────▼───────────┐                 │  │
│  │            │     Firebase Auth     │                 │  │
│  │            │    (User Identity)    │                 │  │
│  |            └───────────┬───────────┘                 |  |
|  └────────────────────────|─────────────────────────────┘  │
└───────────────────────────│────────────────────────────────┘
                            │ HTTPS / Secure API Calls
             ┌──────────────┴───────────────┐
             │                              │
             ▼                              ▼
    ┌──────────────────┐           ┌─────────────────────┐
    │ Google Gemini API│           │ Firebase Firestore  │
    │  (Flash Model)   │           │   (Cloud Database)  │
    │                  │           │                     │
    │ • Legal reasoning│           │ • Chat history      │
    │ • Doc parsing    │           │ • Analysed docs     │
    │ • NLP & dialect  │           │ • User preferences  │
    │ • RAG grounding  │           └─────────────────────┘
    └──────────────────┘

```
 
---
 
## 🛠️ Tech Stack
 
| Component | Technology | Role |
|---|---|---|
| **Frontend** | React 18 + TypeScript | Responsive Single Page Application (SPA) styled with Tailwind CSS |
| **Backend** | Google Firebase (Serverless) | Firebase Auth for user identity and Cloud Firestore for real-time data storage |
| **AI Engine** | Gemini 2.5 Flash | Core "brain" for legal reasoning, document parsing, and multi-dialect translation |
| **NLP** | Natural Language Processing | Gemini handles semantic analysis to turn complex legal jargon into plain language |
| **RAG** | Grounded Context | Uses System Instructions to ground the AI in national statutes and legal frameworks |
| **Storage** | Firestore | Stores chat history, analysed documents, and user preferences |
| **Sharing** | HTTPS Preview | Shared via a secure URL that allows others to interact with your specific build |
| **Voice** | Web Speech API | Text-to-speech accessibility for elderly and low-literacy users |

### Environment

| Environment | What it is | Role |
| :--- | :--- | :--- |
| **Mobile Environment** | Android OS | Runs the app natively via Capacitor, granting hardware access (e.g., microphone) for voice input. |
| **Web Environment** | Client Browser | Provides the frontend interface for web users and local development (`npm run dev`). |
| **Cloud Backend** | Google Firebase (Firestore & Auth) | Manages user authentication and securely stores real-time app data like chat histories. |
| **AI Cognitive** | Google Gemini API | Acts as the AI brain to process complex legal queries and generate simplified explanations. |

---
 
## 📋 CS4 Technical Requirements — Coverage
 
| Requirement | Implementation |
|---|---|
| ✅ Cross-Platform Deployment | Demonstrated the ability to deploy a single codebase to both Web and Mobile (Android) environments |
| ✅ Text Simplification | Gemini converts legal jargon to plain everyday language (5th-grade level) |
| ✅ Recursive Summarisation | Long policy documents condensed into 3–5 actionable bullet points |
| ✅ Cross-Lingual Retrieval | Ask in any dialect → Gemini retrieves from national-language statute |
| ✅ Hallucination Control | RAG via System Instructions grounds all answers |
| ✅ Hardware Interaction | Implemented hardware-level feature access (Microphone) with proper Android permission handling (RECORD_AUDIO) |
| ✅ Low-Resource Languages | Covers local dialects not supported by standard translation tools |
| ✅ Inclusivity UI | Guest mode, voice input, simple layout designed for low digital literacy |
 
---

 ## 🚀 Quick Start (For Android Users)

If you are an Android user and just want to try the app immediately without any setup, you can install the compiled APK directly!

1. Download the `app-release.apk` file from the repository.
2. Transfer the file to your Android phone.
3. Tap the file to install it. 
   > **Note:** Since this app is not on the Google Play Store, your phone may prompt a security warning. Go to **Settings > Security**, and enable **"Allow installation from unknown sources"** for your file manager or browser.
4. Open LawChat and start exploring!
   
---

## 💻 How to Run (For Developers)

If you want to view the code, modify the app, or run it in a development environment, follow the steps below.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [Android Studio](https://developer.android.com/studio) (Only if you want to build/run the Android version via emulator).
  
  1. Clone the repository:
   ```Bash
   git clone https://github.com/Gohpeijia/VHACK2026-LawChat.git
   cd VHACK2026-LawChat
   ```
   
  2. API Key Setup:
    ```Installation
    # 1. Set up environment variables
    create filename .env
    # Add your keys to .env:
    # GEMINI_API_KEY=your_gemini_key
    ```

  3. Firebase Setup
    ```bash
    # Install Firebase CLI
    npm install -g firebase-tools
     
    # Login and initialise
    firebase login
    firebase init
     
    # Deploy
    firebase deploy
    ```
   
 ### Option 🅰️: Run on Web (Localhost)
The fastest way to test the UI and logic in your browser.

1. Install dependencies:
  ```Bash
  npm install
  ```

2. Start the development server:
  ```Bash
  npm run dev
  ```

3. Open your browser and navigate to the provided `localhost` URL.

### Option 🅱️: Run via Android Studio (Capacitor)
To test native device features (like the Microphone) on an Android emulator or a physical device plugged into your computer.

1. Ensure dependencies are installed and build the web project:
 ```Bash
  npm install
  npm run build
  ```

2.Sync the web assets to the native Android project:
  ```Bash
  npx cap sync
  ```

3.  Sync the web assets to the native Android project:
  ```Bash
  npx cap sync
  ```

4. Wait for the `Gradle Sync` to finish (watch the progress bar at the bottom).

5. Once the "**Play**" button turns green, select your emulator or connected device and click **Run**.

---
 
## 📁 Project Structure
 
```
LawChat/
├── android/               # Native Android project files (generated by Capacitor)
├── dist/                  # Compiled production web assets (after npm run build)
├── src/                   # Main source code (TypeScript, UI components, Logic)
├── capacitor.config.ts    # Capacitor bridge configuration
├── package.json           # Node.js dependencies and scripts
├── .env                   # Environment variables (Gemini API Key, Firebase config)
└── README.md              # Project documentation
```
 
---
 
## 📚 Malaysian Laws Referenced

| Category | Acts |
|---|---|
| Tenancy | Specific Relief Act 1950, Distress Act 1951, National Land Code 1965 |
| Employment | Employment Act 1955, Industrial Relations Act 1967, Minimum Wages Order 2022 |
| Consumer | Consumer Protection Act 1999, Sale of Goods Act 1957 |
| Family | Law Reform (Marriage and Divorce) Act 1976, Guardianship of Infants Act 1961 |
| Road | Road Transport Act 1987, Motor Vehicles (Third Party Risks) Act 1960 |
| Welfare | SOCSO Act 1969, EPF Act 1991, JKM Assistance Guidelines |

---

## 📄 License

This project was built for **V HACK 2026**.

---

<div align="center">

**LawChat** — *Snap a letter. Ask a law. Know your rights.*

Built with ❤️ for every Malaysian who deserves to understand their rights.

</div>
