# 🔧 แก้ Frontend Service รัน pip install (ผิด!)

## ❌ Error ที่เจอ:

Frontend service กำลังพยายามรัน:
```
cd server && pip install -r requirements.txt
```

**นี่ผิด!** Frontend ไม่ต้องใช้ pip

## 🔍 สาเหตุ:

`railway.json` ถูกใช้กับ Frontend service ซึ่งทำให้สับสน

## ✅ วิธีแก้:

### วิธีที่ 1: ลบ railway.json (แนะนำ)

1. ลบไฟล์ `railway.json` ออก
2. ตั้งค่าแต่ละ service แยกกันใน Railway UI

### วิธีที่ 2: ตั้งค่า Frontend Service ให้ถูกต้อง

1. ไปที่ **Frontend service** → **Settings** tab

2. **ตั้งค่า Build Command:**
   - หา **"Build Command"**
   - ใส่: `npm install && npm run build`
   - หรือ: `npm ci --cache /tmp/.npm && npm run build`
   - **หมายเหตุ:** ใช้ `npm install` แทน `npm ci` เพื่อหลีกเลี่ยง EBUSY error
   - **อย่าใส่ pip install!**

3. **ตั้งค่า Start Command:**
   - หา **"Start Command"**
   - ใส่: `npx serve -s dist -l $PORT`
   - หรือ: `npx serve dist -p $PORT`

4. **ตั้งค่า Node Version:**
   - หา **"Node Version"** หรือ **"Runtime Version"**
   - ตั้งค่าเป็น: `20`

5. **Save**

### วิธีที่ 3: ตรวจสอบว่าแยก Services ถูกต้อง

**Frontend Service:**
- Build Command: `npm install && npm run build` (หรือ `npm ci --cache /tmp/.npm && npm run build`)
- Start Command: `npx serve -s dist -l $PORT`
- Node Version: `20`

**Backend Service:**
- Build Command: `apt-get update && apt-get install -y python3-pip && cd server && python3 -m pip install -r requirements.txt`
- Start Command: `cd server/Login && python3 -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- Python Version: `3.11`
- **หมายเหตุ:** ใช้ `apt-get install python3-pip` แทน `ensurepip` (Railway Python image ไม่มี ensurepip)

## 📝 Checklist:

- [ ] ตรวจสอบว่า Frontend service ไม่มี pip install
- [ ] ตั้งค่า Frontend Build Command = `npm ci && npm run build`
- [ ] ตั้งค่า Frontend Start Command = `npx serve -s dist -l $PORT`
- [ ] ตั้งค่า Node Version = 20
- [ ] ตรวจสอบว่า Backend service มี pip install
- [ ] Deploy ใหม่

