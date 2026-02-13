// Helper functions لتسهيل إرسال الإشعارات

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001';
const API_KEY = process.env.NOTIFICATION_API_KEY;

class NotificationHelper {
  
  // إرسال إشعار طلب جديد للأدمن
  static async notifyNewOrder(orderData) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/new-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          orderId: orderData._id || orderData.id,
          customerName: orderData.customerName || orderData.name,
          total: orderData.total,
          items: orderData.items?.length || 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ New order notification sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send new order notification:', error.message);
      // لا نرمي الخطأ - الإشعار فشل لكن الطلب نجح
      return { success: false, error: error.message };
    }
  }

  // إرسال إشعار تغيير حالة الطلب
  static async notifyOrderStatus(userId, orderId, status, orderNumber) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          userId,
          orderId,
          status,
          orderNumber
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Order status notification sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send order status notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  // إرسال إشعار منتج جديد
  static async notifyNewProduct(productData) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/new-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          productName: productData.name,
          price: productData.price,
          category: productData.category,
          productId: productData._id || productData.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ New product notification sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send new product notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  // إرسال عرض خاص
  static async notifySpecialOffer(title, message, url = '/', targetAll = true) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/special-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          title,
          message,
          url,
          targetAll
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Special offer notification sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send special offer notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  // إرسال إشعار مخصص
  static async notifyCustom(userId, title, body, data = {}) {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          userId,
          title,
          body,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Custom notification sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send custom notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  // فحص صحة الخدمة
  static async checkHealth() {
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/health`, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Notification service health check failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = NotificationHelper;
