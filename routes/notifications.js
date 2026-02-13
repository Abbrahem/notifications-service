const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { authenticateRequest } = require('../middleware/auth');

// كل الـ routes محمية بالـ API key
router.use(authenticateRequest);

// إرسال إشعار order جديد للأدمن
router.post('/new-order', async (req, res) => {
  try {
    const { orderId, customerName, total, items } = req.body;

    const notification = {
      title: '🛍️ طلب جديد!',
      body: `طلب من ${customerName} - ${total} جنيه`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'new_order',
      orderId: orderId.toString(),
      url: `/admin/orders/${orderId}`
    };

    const results = await notificationService.sendToAdmins(notification, data);
    
    res.json({ 
      success: true, 
      message: 'Notification sent to admins',
      results 
    });
  } catch (error) {
    console.error('Error in new-order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إرسال إشعار تغيير حالة الطلب للعميل
router.post('/order-status', async (req, res) => {
  try {
    const { userId, orderId, status, orderNumber } = req.body;

    const statusMessages = {
      'pending': '⏳ طلبك قيد المراجعة',
      'confirmed': '✅ تم تأكيد طلبك',
      'processing': '📦 جاري تجهيز طلبك',
      'shipped': '🚚 طلبك في الطريق إليك',
      'delivered': '🎉 تم توصيل طلبك بنجاح',
      'cancelled': '❌ تم إلغاء طلبك'
    };

    const notification = {
      title: 'تحديث حالة الطلب',
      body: statusMessages[status] || `حالة طلبك: ${status}`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'order_status',
      orderId: orderId.toString(),
      status,
      url: `/orders/${orderId}`
    };

    const result = await notificationService.sendToUser(userId, notification, data);
    
    res.json({ 
      success: true, 
      message: 'Status notification sent',
      result 
    });
  } catch (error) {
    console.error('Error in order-status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إرسال إشعار منتج جديد لكل العملاء
router.post('/new-product', async (req, res) => {
  try {
    const { productName, price, category, productId } = req.body;

    const notification = {
      title: '✨ منتج جديد!',
      body: `${productName} - ${price} جنيه`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'new_product',
      productId: productId.toString(),
      category,
      url: `/product/${productId}`
    };

    const results = await notificationService.sendToAll(notification, data);
    
    res.json({ 
      success: true, 
      message: 'Product notification sent to all users',
      results 
    });
  } catch (error) {
    console.error('Error in new-product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إرسال إشعار عرض خاص
router.post('/special-offer', async (req, res) => {
  try {
    const { title, message, url, targetAll } = req.body;

    const notification = {
      title: title || '🎁 عرض خاص!',
      body: message,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'special_offer',
      url: url || '/'
    };

    let results;
    if (targetAll) {
      results = await notificationService.sendToAll(notification, data);
    } else {
      results = await notificationService.sendToAdmins(notification, data);
    }
    
    res.json({ 
      success: true, 
      message: 'Special offer notification sent',
      results 
    });
  } catch (error) {
    console.error('Error in special-offer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إرسال إشعار مخصص لمستخدم معين
router.post('/custom', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId, title, and body are required' 
      });
    }

    const notification = { title, body, icon: '/icon-192x192.png' };
    const result = await notificationService.sendToUser(userId, notification, data || {});
    
    res.json({ 
      success: true, 
      message: 'Custom notification sent',
      result 
    });
  } catch (error) {
    console.error('Error in custom:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إرسال بالـ token مباشرة (للتجربة)
router.post('/send-to-token', async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'token, title, and body are required' 
      });
    }

    const notification = { title, body, icon: '/icon-192x192.png' };
    const result = await notificationService.sendToToken(token, notification, data || {});
    
    res.json({ 
      success: true, 
      message: 'Notification sent',
      result 
    });
  } catch (error) {
    console.error('Error in send-to-token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Notification service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
