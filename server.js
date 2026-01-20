require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact form endpoint with email functionality
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ 
            error: 'All fields are required' 
        });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            error: 'Invalid email address' 
        });
    }
    
    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `🌐 New Contact from BDG Websites - ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-bottom: 20px;">New Contact Form Submission</h2>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                    <p style="margin: 5px 0;"><strong style="color: #1f2937;">Name:</strong> ${name}</p>
                    <p style="margin: 5px 0;"><strong style="color: #1f2937;">Email:</strong> ${email}</p>
                </div>
                
                <div style="background: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #1f2937;">Message:</strong></p>
                    <p style="color: #6b7280; line-height: 1.6; margin: 0;">${message}</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    <em>Sent from BDG Websites Contact Form on ${new Date().toLocaleString()}</em>
                </p>
            </div>
        `,
        replyTo: email
    };
    
    try {
        // Send email
        await transporter.sendMail(mailOptions);
        
        console.log('✅ Contact form email sent successfully');
        console.log(`   From: ${name} (${email})`);
        console.log(`   Time: ${new Date().toLocaleString()}`);
        
        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('❌ Email error:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.' 
        });
    }
});

// Placeholder image endpoint
app.get('/api/placeholder/:project', (req, res) => {
    res.redirect(`https://via.placeholder.com/600x400/3b82f6/ffffff?text=${req.params.project}`);
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BDG Websites server running on http://localhost:${PORT}`);
    console.log(`📧 Email configured for: ${process.env.EMAIL_USER || 'NOT SET'}`);
    console.log(`Press Ctrl+C to stop the server`);
});