# 🔔 ZT Addiction Notifications Service

خدمة الإشعارات المنفصلة لمتجر ZT Addiction

## 🚀 المميزات

- ✅ إرسال إشعارات للطلبات الجديدة للأدمن
- ✅ إرسال إشعارات تغيير حالة الطلب للعميل
- ✅ إرسال إشعارات المنتجات الجديدة لكل العملاء
- ✅ إرسال عروض خاصة
- ✅ نظام Retry تلقائي
- ✅ تنظيف الـ tokens غير الصالحة
- ✅ سجل كامل للإشعارات
- ✅ حماية بـ API Key

## 📦 التثبيت

\`\`\`bash
cd notifications-service
npm install
\`\`\`

## ⚙️ الإعداد

1. انسخ ملف `.env.example` إلى `.env`:
\`\`\`bash
copy .env.example .env
\`\`\`

2. املأ البيانات في `.env`:
\`\`\`env
PORT=3001
MONGODB_URI=mongodb+srv://...
FIREBASE_PROJECT_ID=zt-additction
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@zt-additction.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
API_SECRET_KEY=your-super-secret-key-here
\`\`\`

## 🏃 التشغيل

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm start
\`\`\`

## 🌐 النشر على Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
\`\`\`

## 📡 API Endpoints

جميع الـ endpoints تحتاج header:
\`\`\`
x-api-key: your-secret-key
\`\`\`

### 1. طلب جديد (للأدمن)
\`\`\`bash
POST /api/notifications/new-order
{
  "orderId": "123",
  "customerName": "أحمد محمد",
  "total": "500",
  "items": 3
}
\`\`\`

### 2. تغيير حالة الطلب (للعميل)
\`\`\`bash
POST /api/notifications/order-status
{
  "userId": "user123",
  "orderId": "123",
  "status": "confirmed",
  "orderNumber": "ORD-001"
}
\`\`\`

الحالات المتاحة:
- `pending` - قيد المراجعة
- `confirmed` - تم التأكيد
- `processing` - جاري التجهيز
- `shipped` - في الطريق
- `delivered` - تم التوصيل
- `cancelled` - ملغي

### 3. منتج جديد (لكل العملاء)
\`\`\`bash
POST /api/notifications/new-product
{
  "productName": "عطر فخم",
  "price": "350",
  "category": "perfumes",
  "productId": "prod123"
}
\`\`\`

### 4. عرض خاص
\`\`\`bash
POST /api/notifications/special-offer
{
  "title": "🎁 خصم 50%",
  "message": "خصم على كل المنتجات لمدة 24 ساعة!",
  "url": "/offers",
  "targetAll": true
}
\`\`\`

### 5. إشعار مخصص
\`\`\`bash
POST /api/notifications/custom
{
  "userId": "user123",
  "title": "عنوان الإشعار",
  "body": "محتوى الإشعار",
  "data": {
    "url": "/custom-page"
  }
}
\`\`\`

### 6. إرسال بالـ Token (للتجربة)
\`\`\`bash
POST /api/notifications/send-to-token
{
  "token": "fcm-token-here",
  "title": "تجربة",
  "body": "هذا إشعار تجريبي",
  "data": {
    "url": "/"
  }
}
\`\`\`

## 🔗 الاستخدام من المشروع الأساسي

\`\`\`javascript
// في ملف orders.js مثلاً
const NOTIFICATION_SERVICE = 'https://your-service.vercel.app';
const API_KEY = process.env.NOTIFICATION_API_KEY;

async function sendOrderNotification(orderData) {
  try {
    const response = await fetch(\`\${NOTIFICATION_SERVICE}/api/notifications/new-order\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    console.log('Notification sent:', result);
  } catch (error) {
    console.error('Failed to send notification:', error);
    // الإشعار فشل لكن الـ order نجح - مش مشكلة
  }
}
\`\`\`

## 🛡️ الأمان

- كل الـ requests محمية بـ API Key
- الـ Firebase credentials مشفرة
- CORS محدود للدومينات المسموحة
- Rate limiting (يمكن إضافته)

## 📊 المراقبة

- سجل كامل للإشعارات في MongoDB
- تنظيف تلقائي للـ tokens غير الصالحة
- Logs مفصلة لكل عملية

## 🐛 استكشاف الأخطاء

### الإشعار لم يصل؟
1. تأكد من الـ FCM token صحيح
2. تأكد من المستخدم وافق على الإشعارات
3. تحقق من الـ logs في MongoDB

### خطأ في الاتصال؟
1. تأكد من الـ API Key صحيح
2. تأكد من الـ Firebase credentials صحيحة
3. تأكد من MongoDB URI صحيح

## 📝 ملاحظات

- الخدمة مستقلة تماماً عن المشروع الأساسي
- يمكن إعادة تشغيلها بدون التأثير على الموقع
- الإشعارات الفاشلة لا تؤثر على عمل الموقع
- يدعم إرسال آلاف الإشعارات في وقت واحد

## 🎯 الخطوات التالية

1. نشر الخدمة على Vercel
2. إضافة الـ API Key في المشروع الأساسي
3. ربط الـ endpoints في الـ orders/products APIs
4. اختبار الإشعارات

---

Made with ❤️ for ZT Addiction
