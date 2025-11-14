# 🔧 แก้ Node Version และ npm Cache Error

## ❌ Error ที่เจอ:

1. **Node version ไม่ตรง:**
   - ต้องการ: Node 20.19.0 หรือ >=22.12.0
   - Railway ใช้: Node 18.20.5

2. **npm cache error:**
   - `EBUSY: resource busy or locked`

## ✅ วิธีแก้:

### 1. ตั้งค่า Node Version ใน Railway:

1. ไปที่ **Frontend service** → **Settings** tab
2. หา **"Node Version"** หรือ **"Runtime Version"**
3. ตั้งค่าเป็น: `20` หรือ `20.19.0`
4. **Save**

### 2. หรือใช้ Environment Variable:

1. ไปที่ **Frontend service** → **Variables** tab
2. เพิ่ม:
   - **Key:** `NODE_VERSION`
   - **Value:** `20`
3. **Save**

### 3. แก้ Build Command:

1. ไปที่ **Frontend service** → **Settings** tab
2. หา **"Build Command"**
3. ใส่ (เลือก 1 วิธี):
   
   **วิธีที่ 1: ใช้ npm install (แนะนำ):**
   ```
   npm install && npm run build
   ```
   
   **วิธีที่ 2: ใช้ npm ci กับ cache ต่างที่:**
   ```
   npm ci --cache /tmp/.npm && npm run build
   ```
   
   **วิธีที่ 3: ใช้ npm ci แต่ไม่ลบ cache:**
   ```
   npm ci --prefer-offline --no-audit && npm run build
   ```
   
   **หมายเหตุ:** `npm ci` จะพยายามลบ cache ซึ่งทำให้เกิด EBUSY error กับ Docker cache mount

### 4. ไฟล์ที่สร้างไว้แล้ว:

- `.nvmrc` - ระบุ Node version 20
- `.node-version` - ระบุ Node version 20
- `package.json` - เพิ่ม `engines` field

Railway จะอ่านไฟล์เหล่านี้อัตโนมัติ

## 📝 Checklist:

- [ ] ตั้งค่า Node Version = 20 ใน Railway Settings
- [ ] แก้ Build Command ให้ clear cache
- [ ] Deploy ใหม่

## 🆘 ถ้ายังไม่ได้:

ลองใช้ Build Command แบบนี้:
```
rm -rf node_modules node_modules/.cache && npm install && npm run build
```

