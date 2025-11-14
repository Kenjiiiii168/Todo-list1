# 🗄️ สร้าง Tables ใน Database (Run Migration)

## 📋 Tables ที่ต้องสร้าง:

จาก `models.py` มี 2 tables:

1. **`users`** - เก็บข้อมูลผู้ใช้
   - `id` (BigInteger, Primary Key)
   - `username` (String, Unique, Not Null)
   - `password_hash` (String, Not Null)
   - `created_at` (DateTime, Timezone)

2. **`todos`** - เก็บข้อมูล Todo items
   - `id` (BigInteger, Primary Key)
   - `user_id` (BigInteger, Foreign Key → users.id)
   - `title` (String, Not Null)
   - `due_date` (Date, Optional)
   - `is_completed` (Boolean, Default: false)
   - `created_at` (DateTime, Timezone)
   - `updated_at` (DateTime, Timezone)

---

## ✅ วิธีสร้าง Tables (Run Migration):

### วิธีที่ 1: ใช้ Pre-Deploy Command (แนะนำ - อัตโนมัติ)

1. ไปที่ **Backend service** → **Settings** tab
2. **เลื่อนลงไปดูส่วน "Deploy"** (หรือคลิก "Deploy" ในแถบด้านขวา)
3. หา **"Pre-deploy Command"** field
4. ใส่:
   ```
   cd Login && FLASK_APP=app.py python3 -m flask db upgrade
   ```
   **หมายเหตุ:** 
   - ใช้ `cd Login` ไม่ใช่ `cd server/Login` (เพราะ Root Directory = `server` แล้ว)
   - ใช้ `python3` (Nixpacks ใช้ `python3`)
5. **Save**
6. Railway จะ run migration อัตโนมัติทุกครั้งที่ deploy ✅

---

### วิธีที่ 2: Run Manual (ถ้าไม่มี Pre-Deploy Command)

1. **รอให้ deploy เสร็จก่อน** (ดูที่ Deployments tab)
2. เมื่อ deploy เสร็จ → คลิก **"..."** → **"Open Shell"**
3. พิมพ์:
   ```bash
   cd Login
   export FLASK_APP=app.py
   python3 -m flask db upgrade
   ```
4. กด Enter
5. ✅ ควรเห็น "INFO: Alembic upgrade complete"

---

## 🔍 ตรวจสอบว่า Tables ถูกสร้างแล้ว:

### วิธีที่ 1: ใช้ Railway PostgreSQL Shell

1. ไปที่ **PostgreSQL Database service**
2. คลิก **"..."** → **"Open Shell"** หรือ **"Connect"**
3. พิมพ์:
   ```sql
   \dt
   ```
4. ควรเห็น:
   - `alembic_version` (table สำหรับเก็บ migration version)
   - `users` (table สำหรับผู้ใช้)
   - `todos` (table สำหรับ todo items)

### วิธีที่ 2: ใช้ Backend API

1. เปิด Backend URL (เช่น `https://your-backend.railway.app`)
2. ควรเห็น: `{"status": "ok", "service": "todo-api"}`
3. ถ้าเห็น response นี้ แสดงว่า database เชื่อมต่อสำเร็จแล้ว

---

## 📝 Checklist:

- [ ] ตั้งค่า Pre-Deploy Command: `cd Login && FLASK_APP=app.py python3 -m flask db upgrade`
- [ ] Deploy ใหม่
- [ ] ตรวจสอบ Build Logs ว่า migration ทำงานหรือไม่
- [ ] ตรวจสอบว่า tables ถูกสร้างแล้ว (ใช้ PostgreSQL Shell)

---

## 🆘 ถ้ายังไม่ได้:

### ตรวจสอบ Environment Variables:

1. ไปที่ **Backend service** → **Variables** tab
2. ตรวจสอบว่า:
   - `DATABASE_URL` ถูกตั้งค่าแล้ว (Railway จะ auto-generate ถ้าสร้าง PostgreSQL service)
   - `FLASK_APP=app.py` ถูกตั้งค่าแล้ว

### ตรวจสอบ Migration Files:

1. ตรวจสอบว่า `server/Login/migrations/versions/7bb4e2d317d4_init_schema.py` มีอยู่
2. ตรวจสอบว่า migration file ถูก commit และ push ไปที่ GitHub แล้ว

### ลอง Run Migration Manual:

1. ไปที่ Backend service → Deployments → Open Shell
2. รัน:
   ```bash
   cd Login
   export FLASK_APP=app.py
   export DATABASE_URL=<your-database-url>
   python3 -m flask db upgrade
   ```

---

## 💡 สรุป:

**Tables ที่ต้องสร้าง:**
- `users` - เก็บข้อมูลผู้ใช้
- `todos` - เก็บข้อมูล Todo items

**วิธีสร้าง:**
- ใช้ Pre-Deploy Command: `cd Login && FLASK_APP=app.py python3 -m flask db upgrade`
- หรือ Run Manual: ใช้ Railway Shell

ลองทำตามนี้ แล้วบอกผลลัพธ์!

