# 🔧 แก้ Error: No module named pip

## ❌ Error ที่เจอ:

```
/root/.nix-profile/bin/python3: No module named pip
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c python3 -m pip install --break-system-packages -r requirements.txt" did not complete successfully: exit code: 1
```

## 🔍 สาเหตุ:

Nixpacks ติดตั้ง `python311` แต่ไม่ได้ติดตั้ง `pip` มาด้วย หรือ `pip` ไม่ได้ถูก link กับ `python3` ที่ถูกต้อง

## ✅ วิธีแก้:

### แก้ Nixpacks Config:

ไฟล์ `server/nixpacks.toml` ถูกแก้ไขแล้ว:
```toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip"]

[phases.install]
cmds = ["python3 -m pip install --break-system-packages -r requirements.txt"]

[start]
cmd = "cd Login && python3 -m gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 2"
```

**หมายเหตุ:** เพิ่ม `python311Packages.pip` ใน `nixPkgs` เพื่อติดตั้ง pip สำหรับ Python 3.11

---

## 📝 Checklist:

- [ ] ตรวจสอบว่า `server/nixpacks.toml` มี `python311Packages.pip` ใน `nixPkgs`
- [ ] Deploy ใหม่
- [ ] ตรวจสอบ Build Logs ว่าไม่มี "No module named pip"

---

## 🆘 ถ้ายังไม่ได้:

ลองใช้วิธีอื่น:

### วิธีที่ 1: ใช้ Build Command ใน Railway Settings

1. ไปที่ **Backend service** → **Settings** tab
2. **เลื่อนลงไปดูส่วน "Build"**
3. หา **"Custom Build Command"** field
4. ใส่: `python3 -m ensurepip --upgrade && python3 -m pip install --break-system-packages -r requirements.txt`
5. **Save**

### วิธีที่ 2: ใช้ Dockerfile

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

## 💡 สรุป:

**ปัญหา:** Nixpacks ติดตั้ง `python311` แต่ไม่ได้ติดตั้ง `pip` มาด้วย

**วิธีแก้:** เพิ่ม `python311Packages.pip` ใน `nixPkgs` เพื่อติดตั้ง pip สำหรับ Python 3.11

ลอง deploy ใหม่ แล้วบอกผลลัพธ์!

