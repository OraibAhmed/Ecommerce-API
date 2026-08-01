# Ecommerce API

مشروع **Backend REST API** لمتجر إلكتروني، مبني باستخدام **Node.js + Express**، متصل بقاعدة بيانات **Neon PostgreSQL** حقيقية (سحابية)، ومُختبر بالكامل عبر **Postman** ولوحة اختبار ويب مدمجة (Test Dashboard).

تم تنفيذ هذا المشروع كتدريب عملي (Module 2 - Batman Technology) لبناء واجهة API متكاملة لإدارة المنتجات، الفئات، والمستخدمين، مع توثيق كامل لكل مشكلة تقنية واجهت المشروع وطريقة حلها.

**رابط المستودع:** https://github.com/OraibAhmed/Ecommerce-API

---

## المحتويات

- [نظرة عامة](#نظرة-عامة)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [هيكلية المشروع](#هيكلية-المشروع)
- [بنية قاعدة البيانات](#بنية-قاعدة-البيانات)
- [خطوات التثبيت والتشغيل](#خطوات-التثبيت-والتشغيل)
- [إعداد متغيرات البيئة](#إعداد-متغيرات-البيئة)
- [توثيق الـ Endpoints](#توثيق-الـ-endpoints)
- [صيغة الاستجابة الموحدة](#صيغة-الاستجابة-الموحدة)
- [رموز الحالة](#رموز-الحالة)
- [لوحة اختبار الويب](#لوحة-اختبار-الويب)
- [اختبارات Postman ونتائجها](#اختبارات-postman-ونتائجها)
- [الأمان والتحقق من المدخلات](#الأمان-والتحقق-من-المدخلات)
- [سجل المشاكل والحلول الكامل](#سجل-المشاكل-والحلول-الكامل)
- [checklist التسليم النهائي](#checklist-التسليم-النهائي)

---

## نظرة عامة

يوفر المشروع API كامل لإدارة:
- **المنتجات (Products)** — عرض، إنشاء، تعديل، تعطيل (Soft Delete).
- **الفئات (Categories)** — عرض، إنشاء، تعديل.
- **المستخدمين (Users)** — عرض، إنشاء، تفعيل/تعطيل الحالة.

القاعدة موجودة مسبقًا على **Neon** (PostgreSQL سحابية)، ويتصل بها التطبيق مباشرة عبر مكتبة `pg` باستخدام Connection Pooling، دون استخدام أي بيانات وهمية في النسخة النهائية.

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| Node.js | بيئة تشغيل JavaScript على السيرفر |
| Express.js 5 | بناء السيرفر والـ Routes والـ Middleware |
| pg (node-postgres) | الاتصال بقاعدة PostgreSQL وتنفيذ الاستعلامات |
| Neon PostgreSQL | قاعدة البيانات السحابية |
| dotenv | إدارة متغيرات البيئة |
| cors | السماح بطلبات من نطاقات مختلفة |
| nodemon | إعادة تشغيل السيرفر تلقائيًا أثناء التطوير |
| Postman | اختبار وتوثيق كل الـ endpoints |
| HTML/CSS/JS (Vanilla) | لوحة اختبار ويب مدمجة (Test Dashboard) |

---

## هيكلية المشروع

```
ecommerce-api/
├── src/
│   ├── config/
│   │   └── database.js          # الاتصال بقاعدة Neon عبر pg.Pool
│   ├── controllers/
│   │   ├── productsController.js
│   │   ├── categoriesController.js
│   │   └── usersController.js
│   ├── routes/
│   │   ├── productsRoutes.js
│   │   ├── categoriesRoutes.js
│   │   └── usersRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js      # معالج أخطاء مركزي (يلتقط تكرار القيم UNIQUE)
│   ├── app.js
│   └── server.js
├── public/
│   └── index.html                # لوحة اختبار الويب (Test Dashboard)
├── postman/
│   ├── Ecommerce-API.postman_collection.json
│   ├── Ecommerce-API.postman_environment.json
│   └── postman-test-results.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## بنية قاعدة البيانات

الجداول الأساسية المستخدمة (Neon PostgreSQL، موجودة مسبقًا):

**products**
```
id, category_id, name, description, price, stock_quantity, sku (UNIQUE),
is_active, created_at, updated_at
```

**categories**
```
id, name (UNIQUE), description, is_active, created_at
```

**users**
```
id, full_name, email (UNIQUE), phone, password_hash, role (admin/customer),
is_active, created_at
```

> القيود الفريدة (UNIQUE) على `products.sku`, `categories.name`, `users.email` هي أساس اختبارات الحالة 409 (Conflict) بالمشروع.

---

## خطوات التثبيت والتشغيل

### المتطلبات المسبقة
- Node.js (نسخة 18 أو أحدث)
- حساب Neon مع مشروع قاعدة بيانات جاهز
- Postman (نسخة Desktop، وليس نسخة المتصفح)

### 1. استنساخ المستودع
```bash
git clone https://github.com/OraibAhmed/Ecommerce-API.git
cd Ecommerce-API
```

### 2. تثبيت الحزم
```bash
npm install
```

### 3. إعداد ملف البيئة
انسخ `.env.example` إلى `.env` وأدخل بيانات الاتصال الحقيقية بقاعدة Neon.

### 4. تشغيل المشروع (وضع التطوير)
```bash
npm run dev
```
السيرفر يعمل على: `http://localhost:3000`

---

## إعداد متغيرات البيئة

```env
PORT=3000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

> **تنبيه أمني**: ملف `.env` مستثنى من Git عبر `.gitignore` ولا يُرفع أبدًا. في هذا المشروع تم تسريب كلمة سر مؤقتًا أثناء التشخيص الفني، وتم **إعادة تعيينها فورًا (Reset Password)** من لوحة تحكم Neon كإجراء احترازي قياسي.

---

## توثيق الـ Endpoints

الرابط الأساسي: `http://localhost:3000/api`

### Products

| Method | Endpoint | الوصف |
|---|---|---|
| GET | /api/products | عرض كل المنتجات |
| GET | /api/products/:id | عرض منتج واحد |
| POST | /api/products | إنشاء منتج جديد |
| PUT | /api/products/:id | تعديل منتج بالكامل |
| PATCH | /api/products/:id/deactivate | تعطيل منتج (Soft Delete) |

مثال Body لإنشاء منتج:
```json
{
  "category_id": 1,
  "name": "لابتوب جيمنج برو",
  "description": "لابتوب ألعاب عالي الأداء",
  "price": 1299.99,
  "stock_quantity": 25,
  "sku": "LAP-GAM-001"
}
```

### Categories

| Method | Endpoint | الوصف |
|---|---|---|
| GET | /api/categories | عرض كل الفئات |
| GET | /api/categories/:id | عرض فئة واحدة |
| POST | /api/categories | إنشاء فئة جديدة |
| PUT | /api/categories/:id | تعديل فئة |

مثال Body:
```json
{ "name": "أجهزة إلكترونية", "description": "فئة الأجهزة والإلكترونيات" }
```

### Users

| Method | Endpoint | الوصف |
|---|---|---|
| GET | /api/users | عرض كل المستخدمين |
| GET | /api/users/:id | عرض مستخدم واحد |
| POST | /api/users | إنشاء مستخدم جديد |
| PATCH | /api/users/:id/status | تفعيل/تعطيل مستخدم |

مثال Body:
```json
{
  "full_name": "Test User",
  "email": "testuser@example.com",
  "phone": "0790000000",
  "role": "customer"
}
```

---

## صيغة الاستجابة الموحدة

**نجاح:**
```json
{ "success": true, "message": "وصف العملية", "data": { } }
```

**فشل:**
```json
{ "success": false, "message": "وصف الخطأ", "data": {} }
```

---

## رموز الحالة

| الكود | المعنى | متى يُستخدم |
|---|---|---|
| 200 | OK | نجاح قراءة أو تعديل |
| 201 | Created | نجاح إنشاء سجل جديد |
| 400 | Bad Request | بيانات مفقودة أو غير صالحة |
| 404 | Not Found | السجل أو المسار غير موجود |
| 409 | Conflict | تكرار قيمة فريدة (SKU / name / email) |
| 500 | Internal Server Error | خطأ غير متوقع (تفاصيله لا تُعرض للعميل) |

---

## لوحة اختبار الويب

صفحة تفاعلية على `http://localhost:3000` تتيح إدارة المنتجات/الفئات/المستخدمين مباشرة من المتصفح، وتشغيل الحالات الاختبارية الـ16 بضغطة زر مع عرض النتيجة الفعلية مقابل المتوقعة (✅ / ❌).

---

## اختبارات Postman ونتائجها

Postman Collection كاملة (16 حالة إلزامية) في مجلد `postman/`، مع تحقق تلقائي (`pm.test`) لكل طلب.

| # | الاختبار | Method | المتوقع | الفعلي | النتيجة |
|---|---|---|---|---|---|
| 1 | Get all products | GET | 200 | 200 | ✅ |
| 2 | Get an existing product | GET | 200 | 200 | ✅ |
| 3 | Get a non-existing product | GET | 404 | 404 | ✅ |
| 4 | Create a valid product | POST | 201 | 201 | ✅ |
| 5 | Create a product without a name | POST | 400 | 400 | ✅ |
| 6 | Create a product with a negative price | POST | 400 | 400 | ✅ |
| 7 | Create a product with negative stock | POST | 400 | 400 | ✅ |
| 8 | Create a product with a duplicate SKU | POST | 409 | 409 | ✅ |
| 9 | Update an existing product | PUT | 200 | 200 | ✅ |
| 10 | Update a non-existing product | PUT | 404 | 404 | ✅ |
| 11 | Deactivate a product | PATCH | 200 | 200 | ✅ |
| 12 | Create a valid category | POST | 201 | 201 | ✅ |
| 13 | Create a valid user | POST | 201 | 201 | ✅ |
| 14 | Create a user with a duplicate email | POST | 409 | 409 | ✅ |
| 15 | Send incomplete JSON | POST | 400 | 400 | ✅ |
| 16 | Request an unknown API route | GET | 404 | 404 | ✅ |

**النتيجة الإجمالية: 16 / 16 ناجح (100%)**، عبر Environment `Ecommerce Local` باستخدام **Desktop Agent**، ومتصل بقاعدة Neon حقيقية.

---

## الأمان والتحقق من المدخلات

- استعلامات معلمّة (`$1, $2, ...`) في كل استعلام SQL، لمنع SQL Injection.
- تحقق من الحقول المطلوبة قبل تنفيذ أي استعلام.
- تحقق من كون السعر أكبر من صفر والمخزون غير سالب.
- تحقق من صحة المعرفات كأرقام صحيحة موجبة.
- معالجة مركزية لتكرار القيم الفريدة عبر كود PostgreSQL `23505` في `errorHandler.js`، ترجع 409 موحّدة لكل من المنتجات، الفئات، والمستخدمين دون تكرار الكود بكل controller.
- Soft Delete بدل الحذف الفعلي للمنتجات (`is_active = false`).
- عدم كشف أي تفاصيل تقنية حساسة في استجابات الأخطاء (تُسجَّل داخليًا فقط عبر `console.error`).
- `.env` مستثنى من Git، وتمت إعادة تعيين كلمة سر قاعدة البيانات بعد أي تسريب مؤقت أثناء التشخيص.

---

## سجل المشاكل والحلول الكامل

توثيق تسلسلي لكل مشكلة تقنية واجهت المشروع فعليًا أثناء الإعداد والتشغيل، بالترتيب الزمني.

### 1. ENOENT: Could not read package.json
**السبب:** تشغيل `npm run dev` من مجلد المستخدم الرئيسي بدل مجلد المشروع.
**الحل:** `cd` إلى مجلد المشروع أولًا قبل أي أمر npm.

### 2. nodemon يحاول تشغيل index.js غير موجود
**الرسالة:** `starting node src/server.js index.js` → `Cannot find module index.js`
**السبب:** خطأ زيادة بسكريبت `dev` داخل package.json.
**الحل:** التأكد أن السكريبت هو `"dev": "nodemon src/server.js"` فقط.

### 3. Missing parameter name (path-to-regexp) عند بدء السيرفر
**السبب:** استخدام الصيغة القديمة `app.use('/api/*', ...)` لمعالج 404، وهي غير مدعومة في Express 5.
**الحل:** استبدالها بـ `app.use('/api/*splat', ...)` أو `app.use((req, res) => {...})` بدون مسار.

### 4. ERR_CONNECTION_REFUSED عند فتح localhost بالمتصفح
**التشخيص:** رغم ظهور رسالة "Server is running"، رفض المتصفح و`curl` الاتصال بالكامل.
**السبب:** Windows Firewall يحجب اتصالات Node.js الواردة (Inbound) — نافذة تنبيه ويندوز الأولى لم تُعالَج.
**الحل:** Windows Security → Firewall & network protection → Allow an app through firewall → تفعيل Node.js على Private و Public (أو إضافته يدويًا من `C:\Program Files\nodejs\node.exe`).

### 5. ETIMEDOUT / ENETUNREACH عند الاتصال بقاعدة Neon
**الرسالة:** `AggregateError [ETIMEDOUT] connect ETIMEDOUT <ip>:5432`
**التشخيص:** `Test-NetConnection -Port 5432` رجع `TcpTestSucceeded: True` على نفس الـ IP الذي فشل مع Node.js — ما أثبت أن الشبكة والبورت سليمان، والمشكلة خاصة ببرنامج `node.exe` تحديدًا.
**السبب:** Windows Firewall يحجب الاتصالات الصادرة (Outbound) من `node.exe` على بورت 5432.
**الحل:** إنشاء Outbound Rule صريحة في Windows Defender Firewall with Advanced Security لبرنامج `node.exe`، مفعّلة على كل أنواع الشبكات.
**النتيجة:** نجاح الاتصال فورًا واسترجاع كل المنتجات (22 سجلًا) من قاعدة Neon الحقيقية.

### 6. ملاحظة غير حرجة: ترميز خاطئ لسجل واحد
سجل منتج واحد (id: 21) انحفظ بترميز غلط (`?????`) بسبب مشكلة UTF-8 عند الإدخال الأول؛ السجل التالي (id: 22) بنفس البيانات محفوظ بشكل صحيح. لا يؤثر على وظيفة الـ API.

### 7. اختبارات Categories/Users: أسماء أعمدة مفترضة لم تطابق القاعدة الفعلية
**السبب:** طلبات Postman الأولية استخدمت حقل `password` بينما العمود الفعلي بجدول `users` هو `password_hash`، وافترضت اسم فئة عشوائي متكرر بينما `categories.name` عليه قيد UNIQUE.
**التشخيص:** تمت مراجعة ملف SQL Dump الفعلي لقاعدة البيانات (`full_database_backup.sql`) لاستخراج الأعمدة الحقيقية.
**الحل:** تعديل Postman Collection لاستخدام أسماء الحقول الصحيحة، وتوليد اسم فئة فريد تلقائيًا بكل تشغيل (`{{$timestamp}}`). تأكيد أن `errorHandler.js` يعالج تكرار القيم الفريدة (`23505`) مركزيًا لكل الجداول دون الحاجة لتكرار المنطق بكل controller.

### 8. ECONNREFUSED 127.0.0.1:3000 أثناء الاختبار في Postman
**السبب:** إغلاق نافذة PowerShell التي كان السيرفر يعمل بها.
**الحل:** إعادة تشغيل `npm run dev` والإبقاء على النافذة مفتوحة أثناء الاختبار.

### 9. Postman: "Could not send request" / "No response"
**السبب:** استخدام Cloud Agent بدل Desktop Agent، فلا يستطيع Postman الوصول إلى `localhost` على الجهاز المحلي.
**الحل:** التبديل إلى **Desktop Agent** من أسفل يمين نافذة Postman (يتطلب تثبيت Postman Desktop Agent).

---

## checklist التسليم النهائي

- [x] السيرفر يعمل محليًا بدون أخطاء (`npm run dev`)
- [x] اتصال حقيقي بقاعدة Neon (وليس بيانات وهمية)
- [x] جميع الـ 13 endpoint تعمل بالأكواد الصحيحة
- [x] استعلامات معلمّة في كل مكان يستقبل مدخلات
- [x] 16/16 اختبار Postman ناجح
- [x] لوحة اختبار الويب تعمل
- [x] `.env` غير مرفوع على GitHub (`.gitignore` فعّال)
- [x] `.env.example` نظيف من أي بيانات حقيقية
- [x] كلمة سر Neon أُعيد تعيينها بعد التسريب المؤقت أثناء التشخيص
- [x] المشروع مرفوع على GitHub: https://github.com/OraibAhmed/Ecommerce-API
- [x] Postman Collection + Environment + نتائج التشغيل موجودة في `postman/`
- [x] README شامل يوثق كل شيء (هذا الملف)
