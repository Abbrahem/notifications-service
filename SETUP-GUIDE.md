# 🚀 دليل الإعداد السريع - خدمة الإشعارات

## الخطوة 1️⃣: تثبيت المكتبات

\`\`\`bash
cd notifications-service
npm install
\`\`\`

## الخطوة 2️⃣: إعداد ملف .env

افتح ملف `.env` واملأ البيانات:

\`\`\`env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zt-addiction
FIREBASE_PROJECT_ID=zt-additction
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@zt-additction.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
API_SECRET_KEY=generate-a-strong-random-key-here
\`\`\`

### كيف تحصل على البيانات؟

**MongoDB URI:**
- من ملف `.env` الأساسي في المشروع الرئيسي
- أو من MongoDB Atlas Dashboard

**Firebase Credentials:**
- من الملف: `zt-additction-firebase-adminsdk-fbsvc-1637c28d8c.json`
- أو من Firebase Console → Project Settings → Service Accounts

**API Secret Key:**
- اختر أي كلمة سر قوية (مثل: `zt-notif-2024-super-secret-key`)

## الخطوة 3️⃣: تجربة محلية

\`\`\`bash
npm run dev
\`\`\`

يجب أن ترى:
\`\`\`
🚀 ========================================
🔔 Notification Service Started
📡 Port: 3001
🌍 Environment: development
🚀 ========================================
\`\`\`

## الخطوة 4️⃣: اختبار الخدمة

### اختبار Health Check:
\`\`\`bash
curl http://localhost:3001/api/notifications/health ^
  -H "x-api-key: your-secret-key"
\`\`\`

### اختبار إرسال إشعار:
\`\`\`bash
curl -X POST http://localhost:3001/api/notifications/send-to-token ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: your-secret-key" ^
  -d "{\"token\":\"YOUR_FCM_TOKEN\",\"title\":\"تجربة\",\"body\":\"هذا إشعار تجريبي\"}"
\`\`\`

## الخطوة 5️⃣: النشر على Vercel

### أ) تثبيت Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

### ب) تسجيل الدخول:
\`\`\`bash
vercel login
\`\`\`

### ج) النشر:
\`\`\`bash
cd notifications-service
vercel
\`\`\`

اتبع التعليمات:
- Set up and deploy? **Yes**
- Which scope? اختر حسابك
- Link to existing project? **No**
- Project name? **zt-notifications** (أو أي اسم)
- Directory? **./notifications-service**
- Override settings? **No**

### د) إضافة Environment Variables:

بعد النشر، اذهب إلى:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. أضف كل المتغيرات من ملف `.env`:
   - `MONGODB_URI`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `API_SECRET_KEY`

### هـ) إعادة النشر:
\`\`\`bash
vercel --prod
\`\`\`

سيعطيك رابط مثل: `https://zt-notifications.vercel.app`

## الخطوة 6️⃣: ربط الخدمة بالمشروع الأساسي

### أ) أضف في `.env` الأساسي:
\`\`\`env
NOTIFICATION_SERVICE_URL=https://zt-notifications.vercel.app
NOTIFICATION_API_KEY=your-secret-key
\`\`\`

### ب) انسخ ملف Helper:
\`\`\`bash
copy notifications-service\\utils\\notificationHelper.js api\\utils\\notificationHelper.js
\`\`\`

### ج) استخدم في API الخاص بك:

**في api/orders.js:**
\`\`\`javascript
const NotificationHelper = require('./utils/notificationHelper');

// عند إنشاء طلب جديد
await NotificationHelper.notifyNewOrder(order);

// عند تغيير حالة الطلب
await NotificationHelper.notifyOrderStatus(
  order.userId,
  order._id,
  'confirmed',
  order.orderNumber
);
\`\`\`

**في api/products.js:**
\`\`\`javascript
const NotificationHelper = require('./utils/notificationHelper');

// عند إضافة منتج جديد
await NotificationHelper.notifyNewProduct(product);
\`\`\`

## الخطوة 7️⃣: اختبار شامل

### 1. اختبر طلب جديد:
- اعمل order من الموقع
- يجب أن يصل إشعار للأدمن

### 2. اختبر تغيير الحالة:
- غير حالة order من Admin Dashboard
- يجب أن يصل إشعار للعميل

### 3. اختبر منتج جديد:
- أضف منتج جديد
- يجب أن يصل إشعار لكل العملاء

## 🐛 حل المشاكل

### الإشعار لم يصل؟
1. تأكد من الـ FCM token موجود في قاعدة البيانات
2. تأكد من المستخدم وافق على الإشعارات
3. افحص الـ logs في Vercel Dashboard

### خطأ 401 Unauthorized؟
- تأكد من الـ API Key صحيح في الـ header

### خطأ في Firebase؟
- تأكد من الـ FIREBASE_PRIVATE_KEY فيه `\n` بدل السطور الجديدة
- تأكد من الـ credentials صحيحة

### الخدمة لا تعمل؟
\`\`\`bash
# افحص الـ health
curl https://your-service.vercel.app/api/notifications/health ^
  -H "x-api-key: your-key"
\`\`\`

## 📊 مراقبة الخدمة

### Vercel Dashboard:
- Deployments → اختر آخر deployment → Logs
- شوف الـ real-time logs

### MongoDB:
- افحص collection `notification_logs`
- شوف الإشعارات المرسلة والفاشلة

## ✅ Checklist

- [ ] تثبيت المكتبات
- [ ] إعداد ملف .env
- [ ] تجربة محلية
- [ ] النشر على Vercel
- [ ] إضافة Environment Variables
- [ ] ربط بالمشروع الأساسي
- [ ] اختبار طلب جديد
- [ ] اختبار تغيير الحالة
- [ ] اختبار منتج جديد

## 🎉 تم!

الآن عندك خدمة إشعارات احترافية منفصلة تماماً!

---

محتاج مساعدة؟ شوف ملف `README.md` للتفاصيل الكاملة.
