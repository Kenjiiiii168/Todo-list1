# 🔧 แก้ Error: python: command not found (Railway detect ผิด project type)

## ❌ Error ที่เจอ:

```
/bin/bash: line 1: python: command not found
```

**และใน Details tab เห็นว่า:**
- Builder: `Railpack (v0.11.0)` (Node.js builder)
- Executable versions: `node@20.19.5`

**นี่แปลว่า Railway detect เป็น Node.js project ไม่ใช่ Python project!**

## 🔍 สาเหตุ:

Railway detect ผิด project type เพราะ:
1. มี `package.json` อยู่ใน root directory
2. Railway detect `package.json` ก่อน `requirements.txt` หรือ `runtime.txt`
3. ทำให้ใช้ Railpack (Node.js builder) แทน Python builder
4. Node.js builder ไม่มี Python runtime ใน container

## ✅ วิธีแก้:

### วิธีที่ 1: ตั้งค่า Root Directory (แนะนำ - ง่ายที่สุด)

1. ไปที่ **Backend service** → **Settings** tab
2. หา **"Root Directory"** หรือ **"Source"** หรือ **"Working Directory"**
3. ตั้งค่าเป็น: `server`
4. **Save**
5. Deploy ใหม่

**หมายเหตุ:** วิธีนี้จะทำให้ Railway ดูไฟล์ใน `server/` directory แทน root directory

### วิธีที่ 2: ใช้ Nixpacks Config

ไฟล์ `server/nixpacks.toml` ถูกสร้างไว้แล้ว:
```toml
[phases.setup]
nixPkgs = ["python311"]

[phases.install]
cmds = ["pip install --break-system-packages -r requirements.txt"]

[start]
cmd = "cd Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2"
```

1. ตั้งค่า **Root Directory** = `server` (ตามวิธีที่ 1)
2. Railway จะอ่าน `nixpacks.toml` อัตโนมัติ
3. Deploy ใหม่

### วิธีที่ 3: ใช้ Dockerfile (ถ้าวิธีอื่นไม่ได้)

สร้าง `server/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --break-system-packages -r requirements.txt

COPY . .

WORKDIR /app/Login

CMD ["python", "-m", "gunicorn", "wsgi:application", "--bind", "0.0.0.0:$PORT", "--workers", "2"]
```

1. ตั้งค่า **Root Directory** = `server`
2. Railway จะ detect Dockerfile และใช้ Docker builder
3. Deploy ใหม่

### วิธีที่ 4: ลบ Backend Service แล้วสร้างใหม่ (ถ้าวิธีอื่นไม่ได้)

1. ลบ Backend service ปัจจุบัน
2. สร้าง service ใหม่:
   - คลิก **"+ New"** → **"GitHub Repo"**
   - เลือก repository เดิม
   - **ตั้งค่า Root Directory = `server`** ทันทีตอนสร้าง
   - Railway จะ detect Python project อัตโนมัติ

## 📝 Checklist:

- [ ] ตั้งค่า Root Directory = `server` ใน Backend service Settings
- [ ] ตรวจสอบว่า Builder เปลี่ยนเป็น Python (ไม่ใช่ Railpack)
- [ ] ตรวจสอบว่า Executable versions แสดง Python version (ไม่ใช่ Node)
- [ ] Deploy ใหม่
- [ ] ตรวจสอบ Deploy Logs ว่าไม่มี "python: command not found"

## 🆘 ถ้ายังไม่ได้:

1. **ตรวจสอบ Settings:**
   - ไปที่ Backend service → Settings
   - ดูว่า Root Directory = `server`
   - ดูว่า Builder = Python (ไม่ใช่ Railpack)

2. **ตรวจสอบ Build Logs:**
   - ดูว่า Python ถูกติดตั้งหรือไม่
   - ดูว่า pip install ทำงานหรือไม่

3. **ลองใช้ Dockerfile:**
   - ใช้วิธีที่ 3 (สร้าง Dockerfile)

