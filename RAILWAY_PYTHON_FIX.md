# 🔧 แก้ Error: python3: command not found

## ❌ Error ที่เจอ:

```
/bin/bash: line 1: python3: command not found
```

## 🔍 สาเหตุ:

Railway container ใช้ `python` ไม่ใช่ `python3` ใน Start Command และ Pre-Deploy Command

## ✅ วิธีแก้:

### ตั้งค่า Start Command:

1. ไปที่ **Backend service** → **Settings** tab
2. หา **"Start Command"** หรือ **"Run Command"**
3. เปลี่ยนจาก:
   ```
   cd server/Login && python3 -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2
   ```
   เป็น:
   ```
   cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2
   ```
4. **Save**

### ตั้งค่า Pre-Deploy Command:

1. ไปที่ **Backend service** → **Settings** tab
2. หา **"Pre-Deploy Command"** หรือ **"Before Deploy"**
3. เปลี่ยนจาก:
   ```
   cd server/Login && FLASK_APP=app.py python3 -m flask db upgrade
   ```
   เป็น:
   ```
   cd server/Login && FLASK_APP=app.py python -m flask db upgrade
   ```
4. **Save**

## 📝 สรุป:

- **Build Command:** ใช้ `python3` (เพราะติดตั้ง `python3-pip`)
  ```
  apt-get update && apt-get install -y python3-pip && cd server && python3 -m pip install --break-system-packages -r requirements.txt
  ```

- **Start Command:** ใช้ `python` (Railway container ใช้ `python`)
  ```
  cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2
  ```

- **Pre-Deploy Command:** ใช้ `python` (Railway container ใช้ `python`)
  ```
  cd server/Login && FLASK_APP=app.py python -m flask db upgrade
  ```

## 🆘 ถ้ายังไม่ได้:

ลองตรวจสอบว่า Python ถูกติดตั้งแล้วหรือไม่:

1. ไปที่ **Backend service** → **Settings** tab
2. ตรวจสอบว่า **"Python Version"** หรือ **"Runtime Version"** ถูกตั้งค่าเป็น `3.11` หรือ `3.12`
3. หรือลองใช้ full path: `/usr/bin/python3` (แต่ไม่แนะนำ เพราะอาจจะไม่มี)

