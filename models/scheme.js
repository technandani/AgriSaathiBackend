const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  scheme_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(), 
  },
  scheme_name: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    default: null,
  },
  long_description: {
    type: String,
    default: null,
  },
  scheme_type: {
    type: String,
    enum: ['Subsidy', 'Loan', 'Training', 'Insurance'],
    required: true,
  },
  eligibility_criteria: {
    type: String,
    default: null,
  },
  necessary_documents: {
    type: [String],
    default: [],
  },
  benefits_of_scheme: {
    type: String,
    default: null,
  },
  application_process: {
    type: String,
    default: null,
  },
  apply_button_url: {
    type: String,
    default: null,
  },
  documentation_url: {
    type: String,
    default: null,
  },
  start_date: {
    type: Date,
    default: null,
  },
  end_date: {
    type: Date,
    default: null,
  },
  logo: {
    url: { type: String },
    public_id: { type: String }, 
  },
  images: [
    {
      url: { type: String },
      public_id: { type: String }, 
    },
  ],
  state_specific: {
    type: Boolean,
    default: false,
  },
  applicable_states: {
    type: [String], 
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

SchemeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Scheme = mongoose.model('Scheme', SchemeSchema);

module.exports = Scheme;