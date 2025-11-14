# 🔧 แก้ Root Directory: ใช้ `server` ไม่ใช่ `/server`

## ❌ ปัญหาที่เจอ:

Root Directory ถูกตั้งค่าเป็น `/server` (มี slash นำหน้า) ซึ่งอาจทำให้เกิดปัญหา

## ✅ วิธีแก้:

### ตั้งค่า Root Directory ให้ถูกต้อง:

1. ไปที่ **Backend service** → **Settings** tab
2. **เลื่อนขึ้นไปดูส่วน "Source"** (หรือคลิก "Source" ในแถบด้านขวา)
3. หา **"Root Directory"** field
4. **แก้ไข:**
   - ถ้าเห็น `/server` → เปลี่ยนเป็น `server` (ลบ slash นำหน้า)
   - หรือลบทั้งหมดแล้วใส่ใหม่: `server`
5. **Save** หรือกด Enter

---

## 📝 สรุป:

- **ผิด:** `/server` (มี slash นำหน้า)
- **ถูก:** `server` (ไม่มี slash นำหน้า)

---

## 🔍 ตรวจสอบ:

หลังแก้ไขแล้ว:
1. ตรวจสอบว่า Root Directory = `server` (ไม่มี slash)
2. ตรวจสอบว่า Builder เปลี่ยนเป็น Python/Nixpacks (ไม่ใช่ Railpack Default)
3. Deploy ใหม่
4. ตรวจสอบ Build Logs ว่าไม่มี error

ลองแก้ไขตามนี้ แล้วบอกผลลัพธ์!

