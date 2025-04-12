ThriveAI-AMI UI

A multi-modal AI interaction and management application.

📚 Table of Contents

System Requirements

Installation

Configuration

Usage

Key Features

Project Structure

API Endpoints

Development Setup

Troubleshooting

Contact

🧰 System Requirements

Node.js v16+

npm v8+

Python 3.8+

Windows 10+ / macOS Monterey+ / Ubuntu 20.04+

RAM: Minimum 4GB

Disk Space: 2GB

⚙️ Installation

git clone https://github.com/[username]/thriveai-ami-ui.git
cd thriveai-ami-ui
npm install

🔧 Configuration

Create a .env file in the root directory with the following:

VITE_GEMINI_API_KEY=your_gemini_api_key
API_BASE_URL=http://localhost:5000

🚀 Usage

Start Frontend

npm run dev

Start Backend Server

cd backend
python main.py

Start AI Services

cd AI2/AI2
python app_version_3.py

Open in browser: http://localhost:5173

✨ Key Features

🎯 Multi-modal AI interaction (text, voice, visual)

🧠 Therapeutic conversation with emotional intelligence

🔒 Secure user authentication

📊 Real-time sentiment analysis

🎭 Expressive avatar with emotional responses

🗣️ Text-to-speech and speech-to-text

📁 Project Structure

thriveai-ami-ui/
├── src/                     # Frontend source code
│   ├── components/          # UI components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│
├── backend/                 # FastAPI backend server
│   ├── main.py              # Main server file
│   └── users.json           # User database
│
├── AI2/                     # AI services
│   └── AI2/                 # AI implementation
│       ├── app_version_3.py # Main AI service
│       ├── test3.py         # Testing module
│       └── static/          # Static assets for AI
│
├── public/                  # Public assets
└── README.md

🔌 API Endpoints

Authentication

POST /register - Register a new user

POST /token - Login and get access token

GET /users/me - Get current user details

AI Interaction

POST /process_audio - Process audio input and get AI response

POST /process_text - Process text input and get AI response

🛠 Development Setup

Clone the repository

Install frontend dependencies: npm install

Install backend dependencies: pip install -r AI2/AI2/requirements.txt

Add required environment variables to .env

Start frontend and backend servers as outlined in Usage

❗ Troubleshooting

Ensure ports 5000 (backend) and 5173 (frontend) are not blocked.

Confirm Python 3.8+ and Node.js 16+ are correctly installed.

Use npm audit fix if you face dependency issues.

📬 Contact
For any questions or support, please contact:
