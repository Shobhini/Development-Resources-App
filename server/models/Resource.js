import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['books', 'tools', 'videos', 'challenges', 'editors', 'websites'],
  },
  tag: {
    type: String,
    required: true,
    enum: ['html', 'css', 'javascript', 'reactjs', 'tailwindcss', 'nextjs'],
  },
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

export default mongoose.model('Resource', resourceSchema)
