const templates = {
    welcome: (name) => ({
      subject: 'Welcome to NexaCore!',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>We're thrilled to have you on board at NexaCore.</p>
        <p>You can now explore all our features and get started right away.</p>
        <br/>
        <p>The NexaCore Team</p>
      `,
    }),
  
    paymentSuccess: (amount, currency) => ({
      subject: 'Payment Successful - NexaCore',
      html: `
        <h2>Payment Confirmed!</h2>
        <p>Your payment of <strong>${currency.toUpperCase()} ${amount}</strong> was successful.</p>
        <p>Thank you for your payment. Your account has been updated.</p>
        <br/>
        <p>The NexaCore Team</p>
      `,
    }),
  
    paymentFailed: (amount, currency) => ({
      subject: 'Payment Failed - NexaCore',
      html: `
        <h2>Payment Failed</h2>
        <p>Your payment of <strong>${currency.toUpperCase()} ${amount}</strong> could not be processed.</p>
        <p>Please check your payment details and try again.</p>
        <br/>
        <p>The NexaCore Team</p>
      `,
    }),
  
    invoiceDue: (invoiceNumber, dueDate, amount) => ({
      subject: `Invoice ${invoiceNumber} Due - NexaCore`,
      html: `
        <h2>Invoice Due Reminder</h2>
        <p>Your invoice <strong>${invoiceNumber}</strong> of <strong>${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
        <p>Please make your payment before the due date to avoid any service interruption.</p>
        <br/>
        <p>The NexaCore Team</p>
      `,
    }),
  
    passwordReset: (resetLink) => ({
      subject: 'Password Reset Request - NexaCore',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
        <br/>
        <p>The NexaCore Team</p>
      `,
    }),
  };
  
  module.exports = templates;