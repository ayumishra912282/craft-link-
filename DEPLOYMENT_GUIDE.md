# 🚀 CraftLink Deployment Guide
### (Hinglish mein — Beginners ke liye)

---

> **Yeh guide tumhe step-by-step batayega ki CraftLink ko internet par kaise deploy karo.**
> Backend → **Render.com** par aur Frontend → **Vercel** par.

---

## ✅ Pehle Yeh Check Karo (Prerequisites)

Inhe pehle install/setup karo:

- [x] **Git** installed hona chahiye → [git-scm.com](https://git-scm.com)
- [x] **GitHub account** banana chahiye → [github.com](https://github.com)
- [x] **Render.com account** banana chahiye → [render.com](https://render.com) *(GitHub se login karo)*
- [x] **Vercel account** banana chahiye → [vercel.com](https://vercel.com) *(GitHub se login karo)*
- [x] **Gemini API Key** leni chahiye → [aistudio.google.com](https://aistudio.google.com)

---

## 📁 Project Structure (Samajh lo pehle)

```
Craft-Link-main/
├── backend/          ← FastAPI backend (Render par jayega)
│   ├── app/
│   ├── requirements.txt
│   └── .env
├── frontend/         ← React/Vite frontend (Vercel par jayega)
│   ├── src/
│   └── vercel.json
├── render.yaml       ← Render config (already bana diya)
└── DEPLOYMENT_GUIDE.md
```

---

## 🔵 STEP 1: GitHub Par Push Karo

### 1.1 — GitHub par naya repository banao

1. [github.com](https://github.com) kholo
2. Top-right corner mein **"+"** click karo → **"New repository"**
3. Repository name likho: `craftlink`
4. **Public** select karo
5. **"Create repository"** click karo

### 1.2 — Project folder mein terminal kholo

Project folder ka path hai:
```
c:\Users\hp\Downloads\Craft-Link-main (2)\Craft-Link-main\Craft-Link-main
```

**Windows mein:** Explorer mein folder kholo → Address bar mein `cmd` likho → Enter dabaao

### 1.3 — Git commands chalao (ek ek karke)

```bash
# Step 1: Git initialize karo (agar pehle nahi kiya)
git init

# Step 2: Apna GitHub username set karo (ek baar karna hai)
git config --global user.email "tumhara@email.com"
git config --global user.name "Tumhara Naam"

# Step 3: Saari files add karo
git add .

# Step 4: Commit karo
git commit -m "Initial commit - CraftLink deployment ready"

# Step 5: Main branch set karo
git branch -M main

# Step 6: GitHub se connect karo (apna URL yahan daalo)
git remote add origin https://github.com/TUMHARA-USERNAME/craftlink.git

# Step 7: Push karo!
git push -u origin main
```

> ⚠️ **Note:** `TUMHARA-USERNAME` ki jagah apna actual GitHub username daalo.

### 1.4 — GitHub par check karo

GitHub par jao aur dekho ki tumhara code upload hua ya nahi. Agar files dikh rahi hain → ✅ Success!

---

## 🟠 STEP 2: Render.com Par Backend Deploy Karo

### 2.1 — Render.com par login karo

1. [render.com](https://render.com) kholo
2. **"Get Started for Free"** click karo
3. **"Continue with GitHub"** se login karo

### 2.2 — Naya Web Service banao

1. Dashboard mein **"New +"** button click karo
2. **"Web Service"** select karo
3. **"Connect a repository"** section mein tumhara `craftlink` repo dikhega → **"Connect"** click karo

### 2.3 — Service settings fill karo

Render tumse kuch settings poochega:

| Field | Value |
|-------|-------|
| **Name** | `craftlink-api` |
| **Region** | `Singapore` (India ke paas hai) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### 2.4 — Environment Variables set karo

Neeche scroll karo **"Environment Variables"** section mein aur yeh add karo:

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `ENVIRONMENT` | `production` |
| `CORS_ORIGINS` | `*` |
| `JWT_SECRET` | `craftlink-sih2026-super-secret-key-heritage-crafts` |
| `GEMINI_API_KEY` | `tumhari-actual-gemini-api-key-yahan-daalo` |
| `AI_ENGINE_URL` | `http://127.0.0.1:1800` |

> ⚠️ **IMPORTANT:** `GEMINI_API_KEY` ki value zaroor daalo, warna AI features kaam nahi karenge!

### 2.5 — Deploy karo!

**"Create Web Service"** button click karo.

Render ab tumhara code download karega aur deploy karega. **Isme 3-5 minutes lag sakte hain.** ☕

**Deploy hone ke baad:** Render ek URL dega, kuch aisa dikhega:
```
https://craftlink-api.onrender.com
```

---

## 🟡 STEP 3: Render Se URL Copy Karo

1. Render dashboard mein tumhara `craftlink-api` service kholo
2. Top par **URL** dikhega (green dot ke saath agar live hai)
3. Yeh URL copy karo — kuch aisa hoga:
   ```
   https://craftlink-api.onrender.com
   ```

> 💡 **Tip:** URL pe click karke test karo. Browser mein kuch JSON response aana chahiye.

---

## 🟢 STEP 4: Frontend Mein Render URL Update Karo

Yeh file kholo:
```
frontend/vercel.json
```

**Current content** (jo abhi hai):
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-RENDER-URL.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**`YOUR-RENDER-URL`** ki jagah apna actual Render URL daalo:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://craftlink-api.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

File save karo. Phir dobara GitHub par push karo:

```bash
git add frontend/vercel.json
git commit -m "Update Render backend URL in vercel.json"
git push origin main
```

---

## 🔵 STEP 5: Vercel Par Frontend Deploy Karo

### 5.1 — Vercel par login karo

1. [vercel.com](https://vercel.com) kholo
2. **"Continue with GitHub"** se login karo

### 5.2 — Naya project banao

1. Dashboard mein **"Add New..."** → **"Project"** click karo
2. Tumhara `craftlink` GitHub repo dikhega → **"Import"** click karo

### 5.3 — Project settings configure karo

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 5.4 — Environment Variables (Optional)

Agar frontend mein koi API keys hain to yahan add karo. Warna skip karo.

### 5.5 — Deploy karo!

**"Deploy"** button click karo.

Vercel tumhare frontend ko build karega. **1-2 minutes lagte hain.**

Deploy hone ke baad URL milega, kuch aisa:
```
https://craftlink.vercel.app
```

---

## 🧪 STEP 6: Test Karo

### 6.1 — Backend test karo

Browser mein yeh URL kholo (apna actual Render URL daalo):
```
https://craftlink-api.onrender.com/docs
```

Agar **FastAPI Swagger UI** dikhe → ✅ Backend working!

### 6.2 — Frontend test karo

Browser mein Vercel URL kholo:
```
https://craftlink.vercel.app
```

Agar website dike → ✅ Frontend working!

### 6.3 — Full app test karo

1. Website kholo
2. Register/Login karo
3. Kuch features use karo (craft search, AI recommendations, etc.)
4. Agar sab kaam kare → ✅ **DEPLOYMENT SUCCESSFUL! 🎉**

---

## ❌ Common Problems & Solutions

### Problem 1: Backend deploy nahi ho raha
```
Build failed: No module named 'xyz'
```
**Solution:** `backend/requirements.txt` mein missing package add karo, phir push karo.

---

### Problem 2: Frontend API calls fail ho rahi hain
```
CORS error / Network Error
```
**Solution:**
- `frontend/vercel.json` mein Render URL sahi hai ya nahi check karo
- Render dashboard mein `CORS_ORIGINS=*` set hai ya nahi check karo

---

### Problem 3: Render service "sleeping" hai (Free tier)
```
Website bahut slow load ho rahi hai pehli baar
```
**Solution:** Yeh normal hai! Free tier mein Render 15 minutes baad "sleep" ho jaata hai. Pehli request 30-60 seconds le sakti hai. Paid plan mein yeh nahi hota.

---

### Problem 4: Gemini AI kaam nahi kar raha
```
AI features not working
```
**Solution:** Render dashboard → Environment Variables mein `GEMINI_API_KEY` add karo aur service restart karo.

---

### Problem 5: Git push mein error
```
error: failed to push some refs
```
**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

---

## 🔄 Future Updates Kaise Karo?

Jab bhi code mein changes karo:

```bash
git add .
git commit -m "kya change kiya yahan likho"
git push origin main
```

**Render aur Vercel automatically redeploy ho jayenge!** 🚀

---

## 📞 Help Chahiye?

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **FastAPI Docs:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com)

---

> 🏆 **Badhai ho! Tumne CraftLink ko successfully deploy kar liya!**
> *Heritage crafts ko digital duniya mein laane ka yeh ek important step hai.* 🎨
