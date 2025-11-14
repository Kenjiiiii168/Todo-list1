# 🔧 แก้ Backend Service: pip not found

## ❌ Error ที่เจอ:

```
sh: 1: pip: not found
ERROR: failed to build: failed to solve: process "sh -c cd server && pip install -r requirements.txt" did not complete successfully: exit code: 127
```

## 🔍 สาเหตุ:

1. **Railway ไม่ได้ detect Python project** - อาจต้องตั้งค่า Python version
2. **pip ไม่ได้ติดตั้ง** - ต้องใช้ `python -m pip` แทน `pip`
3. **Python path ไม่ถูกต้อง** - ต้องใช้ `python3` หรือ `python`

## ✅ วิธีแก้:

### วิธีที่ 1: ใช้ python -m pip (แนะนำ)

1. ไปที่ **Backend service** → **Settings** tab

2. **ตั้งค่า Build Command:**
   - หา **"Build Command"** หรือ **"Install Command"**
   - ใส่: `apt-get update && apt-get install -y python3-pip python3-venv && cd server && python3 -m pip install --break-system-packages -r requirements.txt`
   - หรือ: `apt-get update && apt-get install -y python3-pip python3-venv && cd server && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
   - **หมายเหตุ:** ใช้ `--break-system-packages` flag เพื่อ override externally-managed-environment หรือใช้ virtual environment

3. **ตั้งค่า Python Version (ถ้ามี):**
   - หา **"Python Version"** หรือ **"Runtime Version"**
   - ตั้งค่าเป็น: `3.11` หรือ `3.12`

4. **Save**

### วิธีที่ 2: ใช้ Environment Variable

1. ไปที่ **Backend service** → **Variables** tab
2. เพิ่ม:
   - **Key:** `PYTHON_VERSION`
   - **Value:** `3.11`
3. **Save**

### วิธีที่ 3: ตรวจสอบว่า Railway Detect Python

1. ไปที่ **Backend service** → **Settings** tab
2. ดูว่า Railway detect เป็น Python project หรือไม่
3. ถ้าไม่ → ลบ service แล้วสร้างใหม่
4. หรือตั้งค่า **"Language"** หรือ **"Runtime"** = `Python`

4. **ตั้งค่า Pre-Deploy Command (Run Migration):**
   - หา **"Pre-Deploy Command"** หรือ **"Before Deploy"**
   - ใส่: `cd server/Login && FLASK_APP=app.py python -m flask db upgrade`
   - หรือ: `cd server/Login && export FLASK_APP=app.py && python -m flask db upgrade`
   - **หมายเหตุ:** ใช้ `python` ใน Start Command และ Pre-Deploy Command (Railway container ใช้ `python` ไม่ใช่ `python3`)

5. **Save**

## 📝 Checklist:

- [ ] ตั้งค่า Build Command = `cd server && python3 -m pip install -r requirements.txt`
- [ ] ตั้งค่า Python Version = 3.11 (ถ้ามี)
- [ ] ตั้งค่า Start Command = `cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- [ ] ตั้งค่า Pre-Deploy Command = `cd server/Login && FLASK_APP=app.py python -m flask db upgrade`
- [ ] ตรวจสอบว่า DATABASE_URL ถูกตั้งค่าแล้ว
- [ ] Deploy ใหม่

## 🆘 ถ้ายังไม่ได้:

ลองใช้ Build Command แบบนี้ (ติดตั้ง pip ก่อน):

**วิธีที่ 1: ใช้ --break-system-packages (แนะนำ - ง่ายที่สุด):**
```
apt-get update && apt-get install -y python3-pip && cd server && python3 -m pip install --break-system-packages -r requirements.txt
```

**วิธีที่ 2: ใช้ Virtual Environment:**
```
apt-get update && apt-get install -y python3-pip python3-venv && cd server && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

**วิธีที่ 3: ใช้ --user flag:**
```
apt-get update && apt-get install -y python3-pip && cd server && python3 -m pip install --user -r requirements.txt
```

