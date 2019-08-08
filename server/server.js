const express = require('express')
var fs = require('fs')
var path = require('path')
const Loki = require('lokijs')
const { loadCollection, cleanFolder } = require('./utils')
const multer = require('multer')
const app = express()
const DB_NAME = 'db.json'
const COLLECTION_NAME = 'resumés'
const UPLOAD_PATH = 'uploads'
const upload = multer({ dest: `${UPLOAD_PATH}/` })
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' })
const brain = require('brainjs')
const parser = require('body-parser')
const cors = require('cors')
const firebase = require('firebase')

var net = new brain.NeuralNetwork()
net.train([
  {
    input: { skills: 0.9, experience: 1, gpa: 0.8 },
    output: { accepted: 1, rejected: 0 }
  },
  {
    input: { skills: 0.9, experience: 0.7, gpa: 0.875 },
    output: { accepted: 1, rejected: 0 }
  },
  {
    input: { skills: 1.0, experience: 0.6, gpa: 0.875 },
    output: { accepted: 1, rejected: 0 }
  },
  {
    input: { skills: 0.9, experience: 1.0, gpa: 0.8 },
    output: { accepted: 1, rejected: 0 }
  },
  {
    input: { skills: 0.2, experience: 0.1, gpa: 0.6 },
    output: { accepted: 0, rejected: 1 }
  },
  {
    input: { skills: 0.5, experience: 0.6, gpa: 0.5 },
    output: { accepted: 0, rejected: 1 }
  },
  {
    input: { skills: 0.1, experience: 0.4, gpa: 0.5 },
    output: { accepted: 0, rejected: 1 }
  },
  {
    input: { skills: 0.2, experience: 0.6, gpa: 0.7 },
    output: { accepted: 0, rejected: 1 }
  },
  {
    input: { skills: 0.3, experience: 0.6, gpa: 0.8 },
    output: { accepted: 0, rejected: 1 }
  }
])

const reqSkills = ['React', 'PostgreSQL', 'Node', 'Docker', 'Git']
const reqExperience = ['Backend', 'Frontend', 'Fullstack']

const config = {
  apiKey: "AIzaSyBRuCdx2_pjrhecn1mYr75IUXV9qb9ZXuI",
  authDomain: "geico-e017e.firebaseapp.com",
  databaseURL: "https://geico-e017e.firebaseio.com",
  projectId: "geico-e017e",
  storageBucket: "geico-e017e.appspot.com",
  messagingSenderId: "1001693216333"
}
const fb = firebase.initializeApp(config)

// cleanFolder(UPLOAD_PATH)
app.use(express.static('./public'))
app.use(cors())
app.use(parser.json())
app.post('/uploads', upload.single('post'), async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db)
    const data = col.insert(req.file)
    db.saveDatabase()
    const { $loki, filename, originalname } = data
    res.send({id: $loki, fileName: filename, originalName: originalname})
  } catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})
app.post('/candidates', (req, res) => {
  var { skills, experiences, gpa, filename, name } = req.body
  var skillsCount = 0
  var expCount = 0
  console.log(req.body)
  skills.forEach(skill => {
    reqSkills.forEach(s => {
      if (skill.toLowerCase().includes(s.toLowerCase())) {
        skillsCount++
      }
    })
  })
  experiences.forEach(experience => {
    reqExperience.forEach(e => {
      if (experience.toLowerCase().includes(e.toLowerCase())) {
        expCount++
      }
    })
  })
  var output = net.run({
    skills: skillsCount / reqSkills.length,
    experience: expCount / reqExperience.length,
    gpa: gpa / 4
  })
  console.log(output)
  var db = fb.firestore().collection('candidates')
  db.add({
    name: name,
    likelihood: (output.accepted * 100).toFixed(1) + '%',
    strength: output.accepted < 0.125 ? 'Very Weak' : output.accepted < 0.25 ? 'Weak' : output.accepted < 0.5 ? 'Somewhat Weak' : output.accepted < 0.75 ? 'Somewhat Strong' : 'Strong',
    filename: filename,
    skills: skills,
    experiences: experiences,
    gpa: gpa,
    date: new Date()
  })
  res.sendStatus(200)
})
app.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'uploads', req.params.filename))
})
app.get('/assets/GeicoLogo.png', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'assets', 'GeicoLogo.png'))
})
app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'portal.html'))
})
app.post('/likelihood', (req, res) => {
  var { skills, experience, gpa } = req.body
  console.log(JSON.stringify(req.body))
  var output = net.run({ skills, experience, gpa })
  res.send(output)
})

const PORT = process.env.PORT || 3031
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
})
