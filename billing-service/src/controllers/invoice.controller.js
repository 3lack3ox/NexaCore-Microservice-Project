const Invoice = require('../models/invoice.model');
const { v4: uuidv4 } = require('uuid');

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  return `INV-${timestamp}`;
};

// Create invoice
const createInvoice = async (req, res) => {
  try {
    const { amount, currency, dueDate, description } = req.body;
    const userId = req.user.id;

    const invoice = await Invoice.create({
      userId,
      invoiceNumber: generateInvoiceNumber(),
      amount,
      currency: currency || 'USD',
      dueDate,
      description,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create invoice', error: err.message });
  }
};

// Get all invoices for current user
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

// Get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.status(200).json(invoice);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch invoice', error: err.message });
  }
};

// Mark invoice as paid
const markInvoicePaid = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({ status: 'paid', paidAt: new Date() });
    return res.status(200).json({ message: 'Invoice marked as paid', invoice });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update invoice', error: err.message });
  }
};

// Admin: Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

// Admin: Cancel invoice
const cancelInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({ status: 'cancelled' });
    return res.status(200).json({ message: 'Invoice cancelled successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to cancel invoice', error: err.message });
  }
};

module.exports = {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  markInvoicePaid,
  getAllInvoices,
  cancelInvoice,
};