# 01.mern-chat-app
Full-stack real-time chat application built with MERN stack and Socket.io

```
01-chat-app
├─ backend
│  ├─ config
│  │  ├─ cloudinary.js
│  │  ├─ db.js
│  │  └─ token.js
│  ├─ controllers
│  │  ├─ authController.js
│  │  ├─ messageController.js
│  │  └─ userController.js
│  ├─ index.js
│  ├─ middlewares
│  │  ├─ isAuth.js
│  │  └─ multer.js
│  ├─ models
│  │  ├─ conversationModel.js
│  │  ├─ messageModel.js
│  │  └─ userModel.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ Screenshot 2026-01-20 200002.png
│  └─ socket
│     └─ socket.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ dp.png
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ MessageArea.jsx
│  │  │  ├─ RecieverMessage.jsx
│  │  │  ├─ SenderMessage.jsx
│  │  │  └─ Sidebar.jsx
│  │  ├─ config.js
│  │  ├─ customHooks
│  │  │  ├─ getCurrentUser.jsx
│  │  │  ├─ getMessages.jsx
│  │  │  └─ getOtherUser.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Home.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Profile.jsx
│  │  │  └─ Signup.jsx
│  │  └─ redux
│  │     ├─ messageSlice.js
│  │     ├─ store.js
│  │     └─ userSlice.js
│  └─ vite.config.js
└─ README.md

```