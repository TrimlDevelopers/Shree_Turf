import mongoose from 'mongoose'
import { GAMES, TIME_SLOTS, BOOKING_STATUSES } from '../config/slots.js'

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    slots: {
      type: [String],
      required: true,
      validate: {
        validator(value) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((slot) => TIME_SLOTS.includes(slot))
          )
        },
        message: 'One or more time slots are invalid',
      },
    },
    game: {
      type: String,
      required: true,
      enum: GAMES,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9+\-\s]{8,15}$/,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
      default: '',
      validate: {
        validator(value) {
          if (!value) return true
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        },
        message: 'Invalid email address',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true },
)

bookingSchema.index({ date: 1, status: 1 })

export const Booking = mongoose.model('Booking', bookingSchema)
