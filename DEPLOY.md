# วิธี Deploy บน Railway (ฟรี ไม่ต้องใส่บัตร)

## Railway Setup

### 1. สร้างบัญชี Railway
- ไปที่ https://railway.app
- Sign up ด้วย GitHub account

### 2. Deploy Backend + Database

**ตัวเลือก A: ใช้ Database ที่มีอยู่แล้ว (Render, Supabase, Neon, etc.)**

1. คลิก "New Project" → "Deploy from GitHub repo"
2. เลือก repository ของคุณ
3. Railway จะ detect Python project อัตโนมัติ
4. **ข้ามการสร้าง Database ใหม่** - ใช้ database เดิม
5. เชื่อมต่อ Database เดิมกับ Backend:
   - ไปที่ Backend service → "Variables"
   - เพิ่ม `DATABASE_URL` = connection string จาก database เดิม
     - **Render**: ไปที่ PostgreSQL service → Settings → Copy "Internal Database URL"
     - **Supabase**: Project Settings → Database → Connection String
     - **Neon**: Dashboard → Connection String
   - **หมายเหตุ**: ถ้า connection string เป็น `postgres://` จะถูกแปลงเป็น `postgresql+psycopg2://` อัตโนมัติ
   - เพิ่ม environment variables อื่นๆ:
   
**ตัวเลือก B: สร้าง Database ใหม่บน Railway**

1. คลิก "New Project" → "Deploy from GitHub repo"
2. เลือก repository ของคุณ
3. Railway จะ detect Python project อัตโนมัติ
4. เพิ่ม PostgreSQL Database:
   - คลิก "+ New" → "Database" → "PostgreSQL"
5. เชื่อมต่อ Database กับ Backend:
   - ไปที่ Backend service → "Variables"
   - เพิ่ม `DATABASE_URL` จาก PostgreSQL service (Railway จะ auto-generate)
   - เพิ่ม environment variables อื่นๆ:
     ```
     SECRET_KEY=<generate random string>
     SESSION_PERMANENT=true
     SESSION_COOKIE_SAMESITE=None
     SESSION_COOKIE_SECURE=true
     FLASK_APP=app.py
     ```
6. ตั้งค่า Root Directory:
   - ไปที่ Backend service → "Settings"
   - ตั้งค่า "Root Directory" = `server/Login`
7. Run Migration:
   - ไปที่ Backend service → "Deployments" → คลิก "..." → "Open Shell"
   - รัน: `FLASK_APP=app.py flask db upgrade`
   - **หมายเหตุ**: ถ้าใช้ database เดิมที่มีข้อมูลอยู่แล้ว อาจไม่ต้องรัน migration (ถ้า schema ตรงกันแล้ว)

### 3. Deploy Frontend

**วิธีที่ 1: ใช้ Vercel (แนะนำ - ง่ายที่สุด)**
1. ไปที่ https://vercel.com
2. Sign up ด้วย GitHub
3. "Add New Project" → เลือก repository
4. ตั้งค่า:
   - Framework Preset: Vite
   - Root Directory: `.` (root)
   - Build Command: `npm ci && npm run build`
   - Output Directory: `dist`
5. เพิ่ม Environment Variable:
   - `VITE_API_URL` = URL ของ backend (เช่น `https://your-backend.railway.app`)

**วิธีที่ 2: ใช้ Railway Static**
1. ใน Railway project เดียวกัน → "+ New" → "GitHub Repo"
2. เลือก repository เดียวกัน
3. ตั้งค่า:
   - Root Directory: `.`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npx serve -s dist -l 3000`
4. เพิ่ม Environment Variable:
   - `VITE_API_URL` = URL ของ backend

### 4. ตั้งค่า CORS

ใน Backend service → Variables:
- เพิ่ม `ALLOWED_ORIGINS` = URL ของ frontend (เช่น `https://your-frontend.vercel.app`)

---

## ทางเลือกอื่น: Deploy ด้วย Docker

### วิธีที่ 1: Railway (รองรับ Docker)

Railway รองรับ Dockerfile และ Docker Compose:

1. สร้าง `Dockerfile` สำหรับ backend (มีอยู่แล้วใน `server/Login/Dockerfile`)
2. ไปที่ Railway → New Project → Deploy from GitHub
3. Railway จะ detect Dockerfile อัตโนมัติ
4. ตั้งค่า environment variables
5. Deploy!

### วิธีที่ 2: Fly.io (รองรับ Docker)

1. ติดตั้ง Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. สร้าง app: `fly launch` (Fly จะ detect Dockerfile)
4. Deploy: `fly deploy`

### วิธีที่ 3: Render (รองรับ Docker)

1. ไปที่ Render → New Web Service
2. Connect GitHub repository
3. Render จะ detect Dockerfile
4. ตั้งค่า environment variables
5. Deploy!

### วิธีที่ 4: Docker Compose บน VPS

ถ้าคุณมี VPS (DigitalOcean, Linode, etc.):

```bash
# Copy docker-compose.prod.yml
scp docker-compose.prod.yml user@your-vps:/app/

# SSH เข้า VPS
ssh user@your-vps

# Deploy
cd /app
docker-compose -f docker-compose.prod.yml up -d
```

---

## หมายเหตุ

- Railway ให้ $5 ฟรีต่อเดือน (พอใช้สำหรับโปรเจกต์เล็ก)
- Vercel ฟรีสำหรับ static sites (ไม่จำกัด)
- Fly.io ฟรี tier มีจำกัด แต่พอใช้

---

## Export/Import ข้อมูลจาก Local Docker Database

ถ้าคุณมีข้อมูลใน local Docker PostgreSQL และต้องการย้ายไป cloud:

### Export จาก Local Docker:

**Windows (PowerShell):**
```powershell
.\export_database.ps1
```

**Linux/Mac:**
```bash
chmod +x export_database.sh
./export_database.sh
```

### Import ไปยัง Cloud Database:

1. ไปที่ Railway Backend → Open Shell
2. รัน:
   ```bash
   # Import schema
   psql $DATABASE_URL -f schema.sql
   
   # Import data
   psql $DATABASE_URL -f data.sql
   ```

**หรือใช้ pgAdmin/psql:**
- Copy connection string จาก cloud database
- ใช้ pgAdmin หรือ psql เพื่อ import ไฟล์ `.sql`

### หมายเหตุ:
- ต้องมี `pg_dump` และ `psql` ติดตั้งไว้ (หรือใช้ Docker exec เข้าไปใน container)
- ถ้าใช้ Docker exec: `docker exec -i postgres pg_dump -U myuser mydatabase > backup.sql`

