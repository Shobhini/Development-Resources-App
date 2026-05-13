import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Resource from '../models/Resource.js'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../../client/src/database')

const CATEGORIES = ['books', 'tools', 'videos', 'challenges', 'editors', 'websites']

const FILE_TAG_MAP = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  reactjs: 'reactjs',
  tailwindcss: 'tailwindcss',
  nextjs: 'nextjs',
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Resource.deleteMany({})
  console.log('Cleared existing resources')

  const docs = []

  for (const category of CATEGORIES) {
    for (const fileTag of Object.keys(FILE_TAG_MAP)) {
      const filePath = join(DB_PATH, category, `${fileTag}.json`)
      try {
        const raw = JSON.parse(readFileSync(filePath, 'utf-8'))
        for (const item of raw) {
          docs.push({
            title: item.title,
            description: item.description,
            link: item.link,
            img: item.img,
            category,
            tag: FILE_TAG_MAP[fileTag],
            status: 'approved',
            submittedBy: null,
          })
        }
      } catch {
        // File may not exist for this category/tag combo — skip silently
      }
    }
  }

  await Resource.insertMany(docs)
  console.log(`Seeded ${docs.length} resources`)
  await mongoose.disconnect()
  console.log('Done')
}

seed().catch((err) => { console.error(err); process.exit(1) })
