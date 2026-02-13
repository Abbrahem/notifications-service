# 🔗 أمثلة التكامل مع المشروع الأساسي

## 1️⃣ في api/orders.js

\`\`\`javascript
const NotificationHelper = require('./utils/notificationHelper');

// عند إنشاء طلب جديد
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // إنشاء الطلب
      const order = await createOrder(req.body);
      
      // إرسال إشعار للأدمن (لا ننتظر النتيجة)
      NotificationHelper.notifyNewOrder({
        _id: order._id,
        customerName: order.shippingAddress.name,
        total: order.total,
        items: order.items
      }).catch(err => console.error('Notification failed:', err));
      
      // إرجاع الطلب للعميل
      res.status(201).json({ success: true, order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // تحديث حالة الطلب
  if (req.method === 'PATCH') {
    try {
      const { orderId, status } = req.body;
      const order = await updateOrderStatus(orderId, status);
      
      // إرسال إشعار للعميل
      NotificationHelper.notifyOrderStatus(
        order.userId,
        order._id,
        status,
        order.orderNumber
      ).catch(err => console.error('Notification failed:', err));
      
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
\`\`\`

## 2️⃣ في api/products.js

\`\`\`javascript
const NotificationHelper = require('./utils/notificationHelper');

export default async function handler(req, res) {
  // إضافة منتج جديد
  if (req.method === 'POST') {
    try {
      const product = await createProduct(req.body);
      
      // إرسال إشعار لكل العملاء (في الخلفية)
      NotificationHelper.notifyNewProduct({
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category
      }).catch(err => console.error('Notification failed:', err));
      
      res.status(201).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
\`\`\`

## 3️⃣ في Admin Dashboard

\`\`\`javascript
// src/pages/admin/AdminDashboard.js
import React, { useState } from 'react';

function AdminDashboard() {
  const [notification, setNotification] = useState({ title: '', message: '' });
  
  const sendSpecialOffer = async () => {
    try {
      const response = await fetch('/api/send-special-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notification.title,
          message: notification.message,
          url: '/offers',
          targetAll: true
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('تم إرسال الإشعار بنجاح!');
      }
    } catch (error) {
      alert('فشل إرسال الإشعار');
    }
  };
  
  return (
    <div>
      <h2>إرسال إشعار للعملاء</h2>
      <input 
        placeholder="العنوان"
        value={notification.title}
        onChange={(e) => setNotification({...notification, title: e.target.value})}
      />
      <textarea 
        placeholder="الرسالة"
        value={notification.message}
        onChange={(e) => setNotification({...notification, message: e.target.value})}
      />
      <button onClick={sendSpecialOffer}>إرسال للجميع</button>
    </div>
  );
}
\`\`\`

## 4️⃣ إنشاء API endpoint للأدمن

\`\`\`javascript
// api/send-special-offer.js
const NotificationHelper = require('./utils/notificationHelper');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // تحقق من أن المستخدم أدمن
  const user = await verifyAdmin(req);
  if (!user) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    const { title, message, url, targetAll } = req.body;
    
    const result = await NotificationHelper.notifySpecialOffer(
      title,
      message,
      url,
      targetAll
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
\`\`\`

## 5️⃣ عند تغيير حالة المنتج (Sold Out)

\`\`\`javascript
// api/products/[id]/soldout.js
const NotificationHelper = require('../../utils/notificationHelper');

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { soldOut } = req.body;
      
      const product = await updateProduct(id, { soldOut });
      
      // إذا المنتج رجع متاح، أرسل إشعار
      if (!soldOut) {
        NotificationHelper.notifySpecialOffer(
          '✨ منتج متاح الآن!',
          \`\${product.name} أصبح متاحاً مرة أخرى\`,
          \`/product/\${id}\`,
          true
        ).catch(err => console.error('Notification failed:', err));
      }
      
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
\`\`\`

## 6️⃣ Scheduled Notifications (اختياري)

إذا عايز تبعت إشعارات مجدولة (مثلاً كل يوم الجمعة):

\`\`\`javascript
// scheduled-notifications.js
const cron = require('node-cron');
const NotificationHelper = require('./api/utils/notificationHelper');

// كل يوم جمعة الساعة 10 صباحاً
cron.schedule('0 10 * * 5', async () => {
  console.log('Sending Friday special offer...');
  
  await NotificationHelper.notifySpecialOffer(
    '🎉 عروض الجمعة!',
    'خصومات خاصة على كل المنتجات - لا تفوت الفرصة!',
    '/offers',
    true
  );
});
\`\`\`

## 7️⃣ Webhook من خدمة خارجية

إذا عندك webhook من Stripe أو أي خدمة دفع:

\`\`\`javascript
// api/webhooks/payment.js
const NotificationHelper = require('../utils/notificationHelper');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body;
    
    if (event.type === 'payment_intent.succeeded') {
      const orderId = event.data.object.metadata.orderId;
      const order = await getOrder(orderId);
      
      // إرسال إشعار للأدمن
      await NotificationHelper.notifyNewOrder(order);
      
      // إرسال إشعار للعميل
      await NotificationHelper.notifyOrderStatus(
        order.userId,
        order._id,
        'confirmed',
        order.orderNumber
      );
    }
    
    res.json({ received: true });
  }
}
\`\`\`

## 8️⃣ Error Handling Best Practices

\`\`\`javascript
// دائماً استخدم .catch() عشان الإشعار الفاشل ما يوقف الـ API

// ✅ صح
await createOrder(data);
NotificationHelper.notifyNewOrder(order)
  .catch(err => console.error('Notification failed:', err));
return res.json({ success: true, order });

// ❌ غلط - لو الإشعار فشل، الـ API كله هيفشل
await createOrder(data);
await NotificationHelper.notifyNewOrder(order); // لا تستخدم await
return res.json({ success: true, order });
\`\`\`

## 9️⃣ Retry Logic (اختياري)

إذا عايز retry تلقائي:

\`\`\`javascript
async function sendWithRetry(notificationFn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await notificationFn();
    } catch (error) {
      console.log(\`Retry \${i + 1}/\${maxRetries} failed:\`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// استخدام
sendWithRetry(() => NotificationHelper.notifyNewOrder(order))
  .catch(err => console.error('All retries failed:', err));
\`\`\`

---

## 📝 ملاحظات مهمة

1. **لا تنتظر الإشعارات**: استخدم `.catch()` بدل `await` عشان ما توقف الـ API
2. **Log الأخطاء**: دائماً اعمل log للإشعارات الفاشلة
3. **اختبر محلياً**: جرب الإشعارات على localhost قبل النشر
4. **راقب الـ logs**: تابع Vercel logs عشان تشوف أي مشاكل

---

Made with ❤️ for ZT Addiction
