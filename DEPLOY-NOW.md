# 🚀 ارفع الخدمة دلوقتي!

## الخطوات:

### 1. افتح Terminal في مجلد notifications-service:
\`\`\`bash
cd notifications-service
\`\`\`

### 2. ثبت Vercel CLI (لو مش مثبت):
\`\`\`bash
npm i -g vercel
\`\`\`

### 3. سجل دخول:
\`\`\`bash
vercel login
\`\`\`

### 4. ارفع المشروع:
\`\`\`bash
vercel
\`\`\`

اختر:
- Set up and deploy? **Yes**
- Which scope? اختر حسابك
- Link to existing project? **No**
- Project name? **zt-notifications**
- Directory? اضغط Enter (.)
- Override settings? **No**

### 5. بعد الرفع، هيديك رابط زي:
\`\`\`
https://zt-notifications.vercel.app
\`\`\`

### 6. روح Vercel Dashboard:
https://vercel.com/dashboard

### 7. اختار المشروع → Settings → Environment Variables

### 8. أضف المتغيرات دي:

\`\`\`
MONGODB_URI = mongodb+srv://danger_admin:danger123@cluster0.nn5tzmd.mongodb.net/danger-sneakers?retryWrites=true&w=majority

FIREBASE_PROJECT_ID = zt-additction

FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@zt-additction.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4sMbPB1zSJRKW
qDQEIAr45uMDsQOafV1BhtdqUZA1fAH5rnUKBBqwqvpnVswe0wrkdPgiEgFUIb67
NKevQLJo4Ee0ChDPfNQV2ptRqDP7GsJ9eIGj7Pdy6dKQJRyD5xr9zmkPxkhIi8dg
PV0XkQi8Simjc3yUwcwm+fqjnqKTLbjR13fkktFm3K5vCNao/70XhkLuwbkE4Lau
FgBExmxBlrGcAv5wD8q6HWvIGAXZmIBBAJpy/StwjFr9ehVmyLsQ1xpuIJGV5eQM
fvtvk12NoRi