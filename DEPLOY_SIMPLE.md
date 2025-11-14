# 🚀 Deploy บน Railway + Vercel (ฟรี!)

## 📋 ขั้นตอนง่ายๆ (ทำตามทีละขั้น)

### 1️⃣ สร้างบัญชี Railway (Backend + Database)

1. ไปที่ https://railway.app
2. คลิก **"Start a New Project"**
3. Sign up ด้วย **GitHub** (คลิกเดียว)
4. ✅ เสร็จ!

---

### 2️⃣ Deploy Backend + สร้าง Database

1. ใน Railway Dashboard → คลิก **"New Project"**
2. เลือก **"Deploy from GitHub repo"**
3. เลือก repository: `Kenjiiiii168/Todo-list1`
4. Railway จะ detect Python project อัตโนมัติ ✅

5. **สร้าง PostgreSQL Database:**
   - คลิก **"+ New"** → **"Database"** → **"PostgreSQL"**
   - Railway จะสร้าง database ให้อัตโนมัติ ✅

6. **ตั้งค่า Environment Variables:**
   - ไปที่ Backend service → คลิก **"Variables"** tab
   - Railway จะ auto-generate `DATABASE_URL` ให้อัตโนมัติ (ไม่ต้องเพิ่มเอง) ✅
   - เพิ่มตัวแปรอื่นๆ (คลิก **"+ New Variable"**):
     ```
     SECRET_KEY = [คลิก Generate หรือใส่ random string]
     SESSION_PERMANENT = true
     SESSION_COOKIE_SAMESITE = None
     SESSION_COOKIE_SECURE = true
     FLASK_APP = app.py
     ```

7. **ตั้งค่า Start Command (แทน Root Directory):**
   - ไปที่ Backend service → คลิก **"Settings"** tab
   - หา **"Start Command"** หรือ **"Deploy Command"**
   - ใส่: `cd server/Login && gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
   - หรือถ้ามี **"Build Command"** → ใส่: `python3 -m ensurepip --upgrade && cd server && python3 -m pip install -r requirements.txt`
   - **หมายเหตุ:** ต้องติดตั้ง pip ก่อนด้วย `python3 -m ensurepip --upgrade`
   - คลิก **"Save"**
   - **หมายเหตุ:** ถ้าไม่มี Root Directory setting → ใช้วิธีนี้แทน ✅

8. **Run Migration (สร้าง tables):**

   **วิธีที่ 1: ใช้ Pre-Deploy Command (แนะนำ - อัตโนมัติ):**
   - ไปที่ Backend service → **Settings** tab
   - หา **"Pre-Deploy Command"** หรือ **"Before Deploy"**
   - ใส่: `cd server/Login && FLASK_APP=app.py python3 -m flask db upgrade`
   - **Save**
   - Railway จะ run migration อัตโนมัติทุกครั้งที่ deploy ✅

   **วิธีที่ 2: Run Manual (ถ้าไม่มี Pre-Deploy Command):**
   - รอให้ deploy เสร็จก่อน (ดูที่ Deployments tab)
   - เมื่อ deploy เสร็จ → คลิก **"..."** → **"Open Shell"**
   - พิมพ์: `cd server/Login && FLASK_APP=app.py python3 -m flask db upgrade`
   - กด Enter
   - ✅ ควรเห็น "INFO: Alembic upgrade complete"

---

### 3️⃣ Deploy Frontend (เลือก 1 วิธี)

**วิธีที่ 1: ใช้ Railway (แนะนำ - ใช้ทั้งหมดที่เดียว!)**

1. ใน Railway project เดียวกัน → คลิก **"+ New"**
2. เลือก **"GitHub Repo"**
3. เลือก repository เดียวกัน: `Kenjiiiii168/Todo-list1`

4. **ตั้งค่า:**
   - Railway จะ detect เป็น Static Site อัตโนมัติ
   - **Root Directory:** `.` (root)
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npx serve -s dist -l $PORT`
   - **Output Directory:** `dist` (ถ้ามี)
   - **หมายเหตุ:** Vite จะ bundle CSS อัตโนมัติ (index.css, App.css) ลงใน dist folder ✅

5. **Environment Variables:**
   - คลิก **"Variables"** tab
   - เพิ่ม:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** URL ของ backend จาก Railway
       - ไปที่ Backend service → คลิก **"Settings"**
       - Copy **"Public Domain"** (เช่น `https://your-backend.railway.app`)
       - วางใน Frontend Environment Variable

6. ✅ Railway จะ deploy อัตโนมัติ!

---

**วิธีที่ 2: ใช้ Vercel (ถ้าต้องการแยก)**

1. ไปที่ https://vercel.com
2. Sign up ด้วย **GitHub** (คลิกเดียว)
3. คลิก **"Add New Project"**
4. เลือก repository: `Kenjiiiii168/Todo-list1`

5. **ตั้งค่า:**
   - **Framework Preset:** Vite (Vercel จะ detect อัตโนมัติ)
   - **Root Directory:** `.` (root - มีอยู่แล้ว)
   - **Build Command:** `npm ci && npm run build` (มีอยู่แล้ว)
   - **Output Directory:** `dist` (มีอยู่แล้ว)
   - **หมายเหตุ:** Vite จะ bundle CSS อัตโนมัติ (index.css, App.css) ลงใน dist folder ✅

6. **Environment Variables:**
   - คลิก **"Environment Variables"**
   - เพิ่ม:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** URL ของ backend จาก Railway
       - ไปที่ Railway → Backend service → คลิก **"Settings"**
       - Copy **"Public Domain"** (เช่น `https://your-backend.railway.app`)
       - วางใน Vercel Environment Variable

7. คลิก **"Deploy"**
   - ✅ รอสักครู่ → Frontend deploy เสร็จ!

---

### 4️⃣ ตั้งค่า CORS (เชื่อม Frontend กับ Backend)

1. ไปที่ Railway → Backend service → **"Variables"** tab
2. คลิก **"+ New Variable"**
3. เพิ่ม:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** URL ของ frontend
     - **ถ้าใช้ Railway:** ไปที่ Frontend service → **"Settings"** → Copy **"Public Domain"**
     - **ถ้าใช้ Vercel:** ไปที่ Vercel → Project → **"Settings"** → **"Domains"** → Copy URL
     - ตัวอย่าง: `https://your-frontend.railway.app` หรือ `https://your-frontend.vercel.app`
     - วางใน Railway Variable

4. ✅ Backend จะ restart อัตโนมัติ

---

### 5️⃣ ทดสอบ

1. เปิด Frontend URL จาก Vercel
2. ทดสอบ:
   - ✅ Register (สมัครสมาชิก)
   - ✅ Login (เข้าสู่ระบบ)
   - ✅ สร้าง Todo
   - ✅ แก้ไข Todo
   - ✅ ลบ Todo

---

## ✅ Checklist

- [ ] สร้างบัญชี Railway
- [ ] Deploy Backend บน Railway
- [ ] สร้าง PostgreSQL Database
- [ ] ตั้งค่า Environment Variables
- [ ] ตั้งค่า Root Directory = `server/Login`
- [ ] Run Migration (`flask db upgrade`)
- [ ] Deploy Frontend บน Railway (หรือ Vercel)
- [ ] ตั้งค่า `VITE_API_BASE_URL`
- [ ] ตั้งค่า `ALLOWED_ORIGINS` ใน Railway
- [ ] ทดสอบใช้งาน

---

## 💰 ราคา

**ถ้าใช้ Railway ทั้งหมด:**
- **Railway:** ฟรี $5/เดือน (พอใช้สำหรับ Backend + Database + Frontend)
- **รวม:** **ฟรี 100%!** 🎉

**ถ้าใช้ Railway + Vercel:**
- **Railway:** ฟรี $5/เดือน (Backend + Database)
- **Vercel:** ฟรีไม่จำกัด (Frontend)
- **รวม:** **ฟรี 100%!** 🎉

---

## 🆘 ถ้ามีปัญหา

### Backend ไม่เชื่อมต่อ Database:
- ตรวจสอบ `DATABASE_URL` ใน Railway Variables (ควรมีอยู่แล้ว)
- ตรวจสอบว่า run migration แล้ว (`flask db upgrade`)

### Frontend ไม่เชื่อมต่อ Backend:
- ตรวจสอบ `VITE_API_BASE_URL` ใน Vercel
- ตรวจสอบ `ALLOWED_ORIGINS` ใน Railway

### CORS Error:
- ตรวจสอบ `ALLOWED_ORIGINS` ใน Railway Backend Variables
- ต้องเป็น URL เต็ม (เช่น `https://your-frontend.vercel.app`)

---

**พร้อมแล้ว! เริ่ม deploy ได้เลย! 🚀**

