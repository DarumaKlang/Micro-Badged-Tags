# Micro Badged Tags

เครื่องมือสร้าง badge สำหรับ GitHub, Gitea และโปรเจกต์ React/Next.js เลือกได้ทั้งแบบ Solid และ Split สองสี พร้อมไอคอนหรือข้อความ แล้วดูตัวอย่างและส่งออกเป็น Markdown หรือ JSX

## เริ่มใช้งาน

ต้องใช้ Node.js และ pnpm ตามเวอร์ชันที่ระบุใน `package.json`

```bash
pnpm install
pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อสร้าง badge ในหน้าเว็บ

ตรวจโค้ดและ build ด้วย:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

รันทดสอบการสร้างโค้ดและ Markdown ด้วย:

```bash
pnpm test
```

## รูปแบบที่ส่งออก

- **Markdown** สร้างรูปภาพจาก Shields.io และเลือกใส่ลิงก์ปลายทางแบบ HTTP/HTTPS ได้
- **React JSX** เป็นตัวอย่างการเรียกใช้ `BadgedTag` หรือ `SplitBadgedTag` ไม่ใช่ component package ที่ติดตั้งได้ทันที
- ข้อความถูกส่งออกเป็น JSX string expressions เพื่อรองรับเครื่องหมายคำพูดและบรรทัดใหม่

หากต้องการใช้ JSX ในโปรเจกต์อื่น ต้องนำ source ที่เกี่ยวข้องจาก repository นี้ไปไว้ในโปรเจกต์ปลายทางก่อน:

- Solid badge: [`components/tag/BadgedTag.tsx`](./components/tag/BadgedTag.tsx)
- Split badge: [`components/tag/SplitBadgedTag.tsx`](./components/tag/SplitBadgedTag.tsx), [`components/tag/BrandIcon.tsx`](./components/tag/BrandIcon.tsx), [`lib/brand-icons.ts`](./lib/brand-icons.ts), และชนิดข้อมูลที่อ้างอิงจาก [`lib/shields.ts`](./lib/shields.ts)

ตัวอย่าง JSX ที่ได้เป็นการเรียกใช้ component:

```tsx
import { BadgedTag } from "@/components/tag/BadgedTag";

export function Example() {
  return <BadgedTag text={"Verified"} variant="success" size="md" />;
}
```

สำหรับแบบ Split ให้นำเข้า `SplitBadgedTag` จาก path ที่ตรงกับตำแหน่ง source ในโปรเจกต์ปลายทางเช่นกัน

## เทคโนโลยี

- Next.js App Router
- React และ TypeScript
- Tailwind CSS
- ไอคอนแบรนด์จาก Simple Icons
- รูปภาพ badge สำหรับ Markdown จาก Shields.io
