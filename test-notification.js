// ملف اختبار سريع للإشعارات
require('dotenv').config();

const testNotification = async () => {
  const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001';
  const API_KEY = process.env.API_SECRET_KEY;

  console.log('🧪 Testing Notification Service...\n');
  console.log('Service URL:', NOTIFICATION_SERVICE_URL);
  console.log('API Key:', API_KEY ? '✅ Set' : '❌ Missing');
  console.log('');

  // 1. Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/health`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    const result = await response.json();
    console.log('✅ Health Check:', result);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
  }
  console.log('');

  // 2. Test Send to Token (يحتاج token حقيقي)
  const testToken = process.argv[2]; // يمكن تمرير token من command line
  
  if (testToken) {
    console.log('2️⃣ Testing Send to Token...');
    try {
      const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-to-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          token: testToken,
          title: '🧪 اختبار الإشعارات',
          body: 'هذا إشعار تجريبي من خدمة الإشعارات',
          data: {
            url: '/',
            type: 'test'
          }
        })
      });
      const result = await response.json();
      console.log('✅ Send to Token:', result);
    } catch (error) {
      console.error('❌ Send to Token Failed:', error.message);
    }
  } else {
    console.log('2️⃣ Skipping Send to Token (no token provided)');
    console.log('   Usage: node test-notification.js YOUR_FCM_TOKEN');
  }
  console.log('');

  // 3. Test New Order Notification
  console.log('3️⃣ Testing New Order Notification...');
  try {
    const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/new-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        orderId: 'TEST-' + Date.now(),
        customerName: 'أحمد محمد',
        total: '500',
        items: 3
      })
    });
    const result = await response.json();
    console.log('✅ New Order:', result);
  } catch (error) {
    console.error('❌ New Order Failed:', error.message);
  }
  console.log('');

  console.log('🎉 Testing Complete!');
};

testNotification();
