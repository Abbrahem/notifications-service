const { getAdmin } = require('../config/firebase');
const { getDB } = require('../config/mongodb');

class NotificationService {
  
  // إرسال إشعار لمستخدم واحد
  async sendToUser(userId, notification, data = {}) {
    try {
      const db = await getDB();
      const user = await db.collection('users').findOne({ _id: userId });
      
      if (!user || !user.fcmToken) {
        throw new Error('User not found or no FCM token');
      }

      return await this.sendToToken(user.fcmToken, notification, data);
    } catch (error) {
      console.error('Error sending to user:', error);
      throw error;
    }
  }

  // إرسال إشعار بالـ token
  async sendToToken(token, notification, data = {}) {
    try {
      const admin = getAdmin();
      const message = {
        notification: {
          title: notification.title,
          body: notification.body
          // شلنا icon من هنا - Firebase مش بيقبله
        },
        data: {
          ...data,
          click_action: data.url || '/',
          timestamp: Date.now().toString()
        },
        token: token
      };

      const response = await admin.messaging().send(message);
      
      // حفظ سجل الإشعار
      await this.logNotification({
        token,
        notification,
        data,
        status: 'sent',
        messageId: response,
        sentAt: new Date()
      });

      return { success: true, messageId: response };
    } catch (error) {
      // حفظ الفشل
      await this.logNotification({
        token,
        notification,
        data,
        status: 'failed',
        error: error.message,
        sentAt: new Date()
      });
      
      throw error;
    }
  }

  // إرسال لكل المستخدمين
  async sendToAll(notification, data = {}) {
    try {
      const db = await getDB();
      const users = await db.collection('users')
        .find({ fcmToken: { $exists: true, $ne: null } })
        .toArray();

      const results = {
        total: users.length,
        success: 0,
        failed: 0,
        errors: []
      };

      // إرسال بالـ batch (500 في المرة)
      const batchSize = 500;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const tokens = batch.map(u => u.fcmToken);

        try {
          const response = await this.sendMulticast(tokens, notification, data);
          results.success += response.successCount;
          results.failed += response.failureCount;
        } catch (error) {
          results.errors.push(error.message);
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending to all:', error);
      throw error;
    }
  }

  // إرسال multicast
  async sendMulticast(tokens, notification, data = {}) {
    const admin = getAdmin();
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.body
        // شلنا icon من هنا
      },
      data: {
        ...data,
        click_action: data.url || '/',
        timestamp: Date.now().toString()
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    // تنظيف الـ tokens الفاشلة
    if (response.failureCount > 0) {
      await this.cleanupInvalidTokens(tokens, response.responses);
    }

    return response;
  }

  // تنظيف الـ tokens غير الصالحة
  async cleanupInvalidTokens(tokens, responses) {
    const db = await getDB();
    const invalidTokens = [];

    responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;
        if (errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered') {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await db.collection('users').updateMany(
        { fcmToken: { $in: invalidTokens } },
        { $unset: { fcmToken: "" } }
      );
      console.log(`🧹 Cleaned up ${invalidTokens.length} invalid tokens`);
    }
  }

  // حفظ سجل الإشعارات
  async logNotification(log) {
    try {
      const db = await getDB();
      await db.collection('notification_logs').insertOne(log);
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // إرسال للأدمن فقط
  async sendToAdmins(notification, data = {}) {
    try {
      const db = await getDB();
      
      // البحث في fcmTokens collection
      const adminTokens = await db.collection('fcmTokens')
        .find({ 
          userType: 'admin',
          token: { $exists: true, $ne: null }
        })
        .sort({ lastUsed: -1 })
        .toArray();

      console.log(`📤 Found ${adminTokens.length} admin tokens`);

      const results = [];
      for (const tokenDoc of adminTokens) {
        try {
          const result = await this.sendToToken(tokenDoc.token, notification, data);
          results.push({ token: tokenDoc.token.substring(0, 20) + '...', success: true });
        } catch (error) {
          results.push({ token: tokenDoc.token.substring(0, 20) + '...', success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending to admins:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
