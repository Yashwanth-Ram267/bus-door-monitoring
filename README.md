# 🚌 Bus Luggage Compartment Door Monitoring System
### NIIT University — Synapse Project

A complete IoT monitoring dashboard website for the Bus Luggage Compartment Door Monitoring System.

---

## 📁 Project Structure

```
busmonitor/
├── index.html          ← Main website file (open this in browser)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Navigation, simulation, live dashboard
└── README.md           ← This file
```

---

## 🚀 How to Run

### Option 1 — Direct Open (Simplest)
Just double-click `index.html` to open in your browser. No server needed.

### Option 2 — VS Code Live Server (Recommended)
1. Open the `busmonitor/` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

### Option 3 — Python HTTP Server
```bash
cd busmonitor
python -m http.server 8080
# Open http://localhost:8080
```

---

## 📄 Pages Included

| Page | Description |
|------|-------------|
| **Home** | Project overview, flow diagram, stats |
| **Live Dashboard** | Real-time simulated sensor monitoring |
| **System Architecture** | Hardware stack and data flow diagram |
| **Sensors** | MPU6050, Reed Switch, ESP32-CAM details |
| **Alerts** | Alert levels, output devices, event log |
| **Project Working** | Step-by-step how the system works |
| **Project Cost** | Component pricing and breakdown |
| **Timeline** | Phases and Gantt chart |
| **Team** | All 10 team member cards |
| **Gallery** | Image placeholders (add your own images) |
| **Contact** | Contact form and project details |

---

## 🖼️ Adding Real Images (Gallery)

Replace the placeholder divs in the Gallery section with actual `<img>` tags:

```html
<!-- Replace this: -->
<div class="gallery-placeholder">
  <span>🔄</span>
  <span>SYSTEM FLOWCHART</span>
</div>

<!-- With this: -->
<img src="images/flowchart.png" alt="System Flowchart" style="width:100%; height:200px; object-fit:cover;" />
```

Create an `images/` folder and place your project images there.

---

## 🌐 Deploying to GitHub Pages

1. Create a new GitHub repository
2. Upload all files maintaining folder structure
3. Go to **Settings → Pages**
4. Set source to **main branch / root**
5. Your site will be live at: `https://yourusername.github.io/repo-name/`

---

## 🎨 Customization

Edit `css/style.css` → Change CSS variables at the top:
```css
:root {
  --accent-cyan: #00e5ff;    /* Main accent color */
  --accent-green: #00ff9d;   /* Status color */
  --bg-primary: #050d1a;     /* Background */
}
```

---

## 👥 Team
Parth Verma · Swayam Nayak · Nigidalala Yashwanth Ram · Neel Singh · Harsh Gupta · Khan Mohd Aasif · Yoshiha.K · D. Karthik · Vipul Sardana · Komal Gupta

**NIIT University | Synapse Project | 2024**
