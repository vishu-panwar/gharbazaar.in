# Email Templates - Contact Form

## 📧 Email Templates Created

### 1. **User Acknowledgment Email** 
`contact-form-user.html`

**Purpose:** Sent to user who submits the contact form

**Placeholders:**
- `${userName}` - User's name
- `${userEmail}` - User's email
- `${phone}` - User's phone number
- `${subject}` - Message subject
- `${referenceId}` - Unique reference ID
- `${submittedAt}` - Submission timestamp
- `${currentYear}` - Current year

**Features:**
- ✅ Professional acknowledgment
- ✅ What happens next info
- ✅ Contact information (contact@gharbazaar.in, support@gharbazaar.in)
- ✅ Reference ID for tracking
- ✅ CTA button to visit website

---

### 2. **Admin Notification Email**
`contact-form-admin.html`

**Purpose:** Sent to admin when someone submits contact form

**Placeholders:**
- `${userName}` - Submitter's name
- `${userEmail}` - Submitter's email
- `${userPhone}` - Submitter's phone
- `${subject}` - Message subject
- `${message}` - Message content
- `${priority}` - Priority level (High/Normal)
- `${referenceId}` - Unique reference ID
- `${submittedAt}` - Submission timestamp
- `${ipAddress}` - User's IP address
- `${userAgent}` - Browser/device info
- `${sourcePage}` - Source page URL
- `${todayCount}` - Today's submission count
- `${weekCount}` - This week's count
- `${pendingCount}` - Pending responses count
- `${currentYear}` - Current year

**Features:**
- ✅ Urgent notification badge
- ✅ Complete contact details
- ✅ Message content display
- ✅ Quick action buttons (Reply, View Dashboard)
- ✅ Submission statistics
- ✅ Metadata tracking

---

## 🔧 How to Use

### Backend Integration Example (Node.js):

```javascript
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load templates
const userTemplate = fs.readFileSync(
    path.join(__dirname, 'templates/emails/contact-form-user.html'), 
    'utf8'
);
const adminTemplate = fs.readFileSync(
    path.join(__dirname, 'templates/emails/contact-form-admin.html'), 
    'utf8'
);

// Function to replace placeholders
function replacePlaceholders(template, data) {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
        const placeholder = `\${${key}}`;
        result = result.replaceAll(placeholder, value);
    }
    return result;
}

// Send emails
async function sendContactFormEmails(formData) {
    const referenceId = `CF-${Date.now()}`;
    const submittedAt = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Data for user email
    const userData = {
        userName: formData.name,
        userEmail: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        referenceId: referenceId,
        submittedAt: submittedAt,
        currentYear: new Date().getFullYear()
    };

    // Data for admin email
    const adminData = {
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority || 'Normal',
        referenceId: referenceId,
        submittedAt: submittedAt,
        ipAddress: formData.ip || 'N/A',
        userAgent: formData.userAgent || 'N/A',
        sourcePage: formData.source || 'Contact Form',
        todayCount: '5', // Get from database
        weekCount: '23', // Get from database
        pendingCount: '8', // Get from database
        currentYear: new Date().getFullYear()
    };

    // Replace placeholders
    const userEmailHtml = replacePlaceholders(userTemplate, userData);
    const adminEmailHtml = replacePlaceholders(adminTemplate, adminData);

    // Send user email
    await transporter.sendMail({
        from: 'GharBazaar <noreply@gharbazaar.in>',
        to: formData.email,
        subject: 'Thank you for contacting GharBazaar',
        html: userEmailHtml
    });

    // Send admin email
    await transporter.sendMail({
        from: 'GharBazaar Contact Form <noreply@gharbazaar.in>',
        to: 'admin@gharbazaar.in',
        subject: `New Contact Form: ${formData.subject}`,
        html: adminEmailHtml
    });
}
```

---

## 📝 Support Emails Mentioned

- **General Inquiries:** contact@gharbazaar.in
- **Technical Support:** support@gharbazaar.in

---

## ✅ Templates Ready!

Both templates are professional, responsive, and ready to use. Just replace the placeholders with actual data from your backend! 🚀
