const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  paymentId: { type: String }, // Paymob transaction id
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
