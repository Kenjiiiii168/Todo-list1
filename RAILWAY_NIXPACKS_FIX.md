# 🔧 แก้ Error: pip: command not found ใน Nixpacks Build

## ❌ Error ที่เจอ:

```
/bin/bash: line 1: pip: command not found
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c pip install --break-system-packages -r requirements.t... did not complete successfully: exit code: 127
```

**และใน Build Logs เห็นว่า:**
- Railway ใช้ Nixpacks builder (เห็นจาก `nix-env`, `nix-collect-garbage`)
- แต่ `pip` ไม่พบ แสดงว่า Python environment ไม่ถูกติดตั้ง

## 🔍 สาเหตุ:

1. **Root Directory ยังไม่ได้ตั้งค่า** - ทำให้ Railway ไม่ได้อ่าน `server/nixpacks.toml`
2. **Nixpacks config ไม่ถูกต้อง** - ใช้ `pip` แทน `python3 -m pip`
3. **Python package ไม่ได้ถูกติดตั้ง** - ต้องเพิ่ม `pip` ใน `nixPkgs`

## ✅ วิธีแก้:

### วิธีที่ 1: ตั้งค่า Root Directory + แก้ Nixpacks Config (แนะนำ)

1. **ตั้งค่า Root Directory:**
   - ไปที่ Backend service → Settings → Source section
   - คลิก "Add Root Directory"
   - ใส่: `server`
   - Save

2. **แก้ Nixpacks Config:**
   - ไฟล์ `server/nixpacks.toml` ถูกแก้ไขแล้ว:
   ```toml
   [phases.setup]
   nixPkgs = ["python311"]
   
   [phases.install]
   cmds = ["python3 -m pip install --break-system-packages -r requirements.txt"]
   
   [start]
   cmd = "cd Login && python3 -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2"
   ```
   - **หมายเหตุ:** `python311` มี pip มาด้วยอยู่แล้ว ไม่ต้องเพิ่ม `pip` ใน `nixPkgs`
   - ใช้ `python3 -m pip` แทน `pip` เพื่อให้แน่ใจว่าใช้ Python ที่ถูกต้อง
   - ใช้ `python3` ใน start command (Nixpacks ใช้ `python3`)

3. **Deploy ใหม่**

---

### วิธีที่ 2: ใช้ Build Command ใน Railway Settings (ถ้าวิธีที่ 1 ไม่ได้)

1. **ตั้งค่า Root Directory = `server`** (เหมือนวิธีที่ 1)

2. **ตั้งค่า Build Command:**
   - ไปที่ Backend service → Settings → Build section
   - หา "Custom Build Command"
   - ใส่: `python3 -m pip install --break-system-packages -r requirements.txt`
   - Save

3. **ตั้งค่า Start Command:**
   - ไปที่ Backend service → Settings → Deploy section
   - หา "Custom Start Command"
   - ใส่: `cd Login && python3 -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
   - Save

4. **Deploy ใหม่**

---

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

1. ตั้งค่า Root Directory = `server`
2. Railway จะ detect Dockerfile และใช้ Docker builder
3. Deploy ใหม่

---

## 📝 Checklist:

- [ ] ตั้งค่า Root Directory = `server` ใน Source section
- [ ] ตรวจสอบว่า `server/nixpacks.toml` ใช้ `python3 -m pip` แทน `pip`
- [ ] ตรวจสอบว่า Builder เปลี่ยนเป็น Python/Nixpacks (ไม่ใช่ Railpack Default)
- [ ] Deploy ใหม่
- [ ] ตรวจสอบ Build Logs ว่าไม่มี "pip: command not found"

---

## 🆘 ถ้ายังไม่ได้:

1. **ตรวจสอบ Root Directory:**
   - ไปที่ Settings → Source section
   - ดูว่า Root Directory = `server` หรือไม่
   - ถ้าไม่ → ตั้งค่าใหม่

2. **ตรวจสอบ Builder:**
   - ไปที่ Settings → Build section
   - ดูว่า Builder = Python/Nixpacks หรือไม่
   - ถ้ายังเป็น Railpack Default → ตั้ง Root Directory ใหม่

3. **ลองใช้ Build Command แทน Nixpacks:**
   - ใช้วิธีที่ 2 (ตั้งค่า Build Command ใน Railway Settings)

---

## 💡 สรุป:

**ปัญหาหลัก:** Root Directory ยังไม่ได้ตั้งค่า → ทำให้ Railway ไม่ได้อ่าน `server/nixpacks.toml`

**วิธีแก้:**
1. ตั้ง Root Directory = `server` ✅
2. แก้ `nixpacks.toml` ให้ใช้ `python3 -m pip` แทน `pip` ✅
3. Deploy ใหม่ ✅

ลองทำตามนี้ แล้วบอกผลลัพธ์!

