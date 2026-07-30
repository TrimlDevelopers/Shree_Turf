import mongoose from 'mongoose'

const pricingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: '/hr',
      trim: true,
      maxlength: 20,
    },
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    icon: {
      type: String,
      enum: ['sun', 'afternoon', 'sunset', 'moon'],
      default: 'sun',
    },
    popular: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

pricingSchema.index({ sortOrder: 1 })

export const Pricing = mongoose.model('Pricing', pricingSchema)
