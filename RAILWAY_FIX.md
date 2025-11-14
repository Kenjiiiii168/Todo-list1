# 🔧 แก้ Error: failed to exec pid1

## ❌ Error ที่เจอ:
```
ERROR (catatonit:2): failed to exec pid1: No such file or directory
```

## 🔍 สาเหตุ:
1. **Start Command ไม่ถูกต้อง** - gunicorn ไม่ได้ติดตั้งหรือ path ไม่ถูก
2. **Build Command ไม่สำเร็จ** - requirements.txt ไม่ได้ถูก install
3. **Working directory ไม่ถูกต้อง**

## ✅ วิธีแก้:

### วิธีที่ 1: ตั้งค่าใน Railway Settings (แนะนำ)

1. ไปที่ **Backend service** → **Settings** tab

2. **ตั้งค่า Build Command:**
   - หา **"Build Command"** หรือ **"Install Command"**
   - ใส่: `apt-get update && apt-get install -y python3-pip && cd server && python3 -m pip install --break-system-packages -r requirements.txt`
   - **หมายเหตุ:** ใช้ `--break-system-packages` flag เพื่อ override externally-managed-environment (PEP 668)

3. **ตั้งค่า Start Command:**
   - หา **"Start Command"** หรือ **"Run Command"**
   - ใส่: `cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
   - หรือ: `python -m gunicorn server.Login.wsgi:application --bind 0.0.0.0:$PORT --workers 2`

4. **Save**

### วิธีที่ 2: ใช้ Procfile (อัตโนมัติ)

ไฟล์ `Procfile` ถูกสร้างไว้แล้ว:
```
web: cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2
```

Railway จะอ่านไฟล์นี้อัตโนมัติ

### วิธีที่ 3: ใช้ railway.json (อัตโนมัติ)

ไฟล์ `railway.json` ถูกแก้ไขแล้ว:
```json
{
  "deploy": {
    "startCommand": "cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2"
  }
}
```

## 📝 Checklist:

- [ ] ตั้งค่า Build Command: `cd server && pip install -r requirements.txt`
- [ ] ตั้งค่า Start Command: `cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- [ ] ตรวจสอบว่า requirements.txt มี gunicorn
- [ ] ตรวจสอบว่า DATABASE_URL ถูกตั้งค่าแล้ว
- [ ] Deploy ใหม่

## 🆘 ถ้ายังไม่ได้:

1. **ตรวจสอบ Logs:**
   - ไปที่ **Logs** tab
   - ดู error message ที่ชัดเจนกว่า

2. **ตรวจสอบ Build:**
   - ดูว่า build สำเร็จหรือไม่
   - ดูว่า pip install ทำงานหรือไม่

3. **ลองใช้ Python แทน:**
   - Start Command: `cd server/Login && python -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`

