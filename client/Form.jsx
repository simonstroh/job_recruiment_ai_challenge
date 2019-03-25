import React from 'react'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import firebase from './../firebase/app-firebase'
import skills from './skills'
import experiences from './experiences'


export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      skills: [],
      experiences: [],
      gpa: '',
      filename: '',
      skill: '',
      experience: '',
      filename: '',
      name: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.delete = this.delete.bind(this)
    this.fileInput = React.createRef()
  }
  delete(index, type) {
    var arr = this.state[type]
    arr.splice(index, 1)
    this.setState({[type]: arr})
  }
  handleKeyPress(e, type) {
    if (e.key === 'Enter') {
      this.setState({[type]: [...this.state[type], this.state[type.slice(0, type.length - 1)]], [type.slice(0, type.length - 1)]: ''})
    }
  }
  checkSkills(text) {
    for (let i = 0; i < skills.length; i++) {
      if (text.toLowerCase().includes(skills[i].toLowerCase())) {
        var filtered = this.state.skills.filter(skill => skill !== skills[i])
        filtered.push(skills[i])
        this.setState({skills: filtered})
      }
    }
  }
  checkExperiences(text) {
    for (let i = 0; i < experiences.length; i++) {
      if (text.toLowerCase().includes(experiences[i].toLowerCase())) {
        var filtered = this.state.experiences.filter(experience => experience !== experiences[i])
        filtered.push(experiences[i])
        this.setState({experiences: filtered})
      }
    }
  }
  handleChange(e, type) {
    this.setState({[type]: e.target.value})
    if (type === 'filename') {
      var pdfjsLib = window['pdfjs-dist/build/pdf']
      var file = this.fileInput.current.files[0]
      var text = []
      var fileReader = new FileReader()
      fileReader.onload = function() {
        var typedArray = new Uint8Array(this.result)
        var loadingTask = pdfjsLib.getDocument(typedArray)
        loadingTask.promise.then(function(pdf) {
          console.log('PDF loaded.')
          var numPages = pdf.numPages
          var lastPromise; // will be used to chain promises
          lastPromise = pdf.getMetadata().then(function(data) {
            console.log('# Metadata Is Loaded');
            console.log('## Info');
            console.log(JSON.stringify(data.info, null, 2));
            console.log();
            if (data.metadata) {
              console.log('## Metadata');
              console.log(JSON.stringify(data.metadata.getAll(), null, 2));
              console.log();
            }
          });
          var loadPage = function(pageNum) {
            return pdf.getPage(pageNum).then(function(page) {
              return page.getTextContent().then(function(content) {
                var strings = content.items.map(function(item) {
                  return item.str;
                });
                text.push(...strings)
              })
            });
          }
          for (let i = 1; i <= numPages; i++) {
            lastPromise = lastPromise.then(loadPage.bind(null, i))
          }
          return lastPromise
        })
        .then(function() {
          parseTerms(text)
        }, function(reason) {
          console.error(reason)
        })
      }
      fileReader.readAsArrayBuffer(file)
      const parseTerms = (text) => {
        text.forEach(line => {
          this.checkSkills(line)
          this.checkExperiences(line)
        })
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    const data = new FormData()
    data.append('post', this.fileInput.current.files[0])
    var json = {
      name: this.state.name,
      skills: this.state.skills,
      experiences: this.state.experiences,
    }
    fetch('http://localhost:3031/uploads', {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(body => {
      var filename = body.fileName
      var json = {
        name: this.state.name,
        skills: this.state.skills,
        experiences: this.state.experiences,
        filename: filename,
        gpa: this.state.gpa
      }
      console.log(json)
      fetch('http://localhost:3031/candidates', {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })
  }
  render() {
    return(
      <form onSubmit={this.handleSubmit} className="info-form" autoComplete="off">
      <div style={{height: 20}}></div>
      <TextField id="name" variant="outlined" className="text-field" style={{width: '100%'}} label="Full name" onChange={(e) => this.setState({name: e.target.value})}/>
      <div style={{height: 20}}></div>
      <div style={{height: 20}}></div>
      <div className="upload-resume">
      <input
      accept="application/pdf"
      id="contained-button-file"
      type="file"
      name="post"
      ref={this.fileInput}
      onChange={(e) => this.handleChange(e, 'filename')}
      />
      <label htmlFor="contained-button-file">
      <Button variant="contained" component="span">
      Upload Resumé
      </Button>
      </label>
      <p style={{fontFamily: 'Roboto', fontSize: 10, textAlign: 'center', margin: 10}}>{this.state.filename}</p>
      </div>
      <div style={{height: 20}}></div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {
        this.state.skills.map((skill, index) => (
          <Chip
          key={skill + index}
          style={{margin: 4}}
          onDelete={() => this.delete(index, 'skills')}
          label={skill}
          />
        ))
      }
      </div>
      <div style={{height: 20}}></div>
      <TextField id="skill" variant="outlined" className="text-field" style={{width: '100%'}} label="Add new skill" type="text" value={this.state.skill} onChange={(e) => this.handleChange(e, 'skill')} onKeyPress={(e) => this.handleKeyPress(e, 'skills')} />
      <div style={{height: 20}}></div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {
        this.state.experiences.map((experience, index) => (
          <Chip
          key={experience + index}
          style={{margin: 4}}
          onDelete={() => this.delete(index, 'experiences')}
          label={experience}
          />
        ))
      }
      </div>
      <div style={{height: 20}}></div>
      <TextField id="experience" variant="outlined" className="text-field" style={{width: '100%'}} label="Add new experience" value={this.state.experience} onChange={(e) => this.handleChange(e, 'experience')} onKeyPress={(e) => this.handleKeyPress(e, 'experiences')} />
      <div style={{height: 20}}></div>
      <div style={{height: 20}}></div>
      <TextField id="gpa" variant="outlined" className="text-field" style={{width: '100%'}} label="GPA" onChange={(e) => this.setState({gpa: e.target.value})}/>
      <div style={{height: 20}}></div>
      <div style={{height: 20}}></div>
      <Button
      style={{alignSelf: 'flex-end', backgroundColor: '#1a237e', color: 'white'}}
      variant="contained"
      onClick={this.handleSubmit}
      >
      Submit
      </Button>
      </form>
    )
  }
}
