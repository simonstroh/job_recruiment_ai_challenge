import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { mapStateToProps, mapDispatchToProps } from './mapping'
import { connect } from 'react-redux'
import firebase from './../firebase/app-firebase'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

class Rows extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: []
    }
  }
  componentDidMount() {
    const db = firebase.firestore()
    db.collection('candidates').onSnapshot(snapshot => {
      let candidates = snapshot.docs
      let newState = []
      candidates.forEach(candidate => {
        var newCandidate = candidate.data()
        newCandidate.id = candidate.id
        newState.push(newCandidate)
      })
      this.setState({rows: newState})
    })
  }
  remove(id) {
    firebase.firestore().collection('candidates').doc(id).delete()
  }
  open(filename) {
    var url = `/uploads/${filename}`
    var win = window.open(url)
    win.focus()
  }
  render() {
    return(
      <div className="portal-table">
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate's Name</TableCell>
                <TableCell align="right">Likelihood(%)</TableCell>
                <TableCell align="right">Strength</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row"><div onClick={() => this.open(row.filename)} style={{width: '100%', height: '100%', cursor: 'pointer'}}>{row.name}</div></TableCell>
                    <TableCell align="right"><div onClick={() => this.open(row.filename)} style={{width: '100%', height: '100%', cursor: 'pointer'}}>{row.likelihood}</div></TableCell>
                    <TableCell align="right"><div onClick={() => this.open(row.filename)} style={{width: '100%', height: '100%', cursor: 'pointer'}}>{row.strength}</div></TableCell>
                    <TableCell align="right"><div onClick={() => this.open(row.filename)} style={{width: '100%', height: '100%', cursor: 'pointer'}}>{String(row.date.toDate())}</div></TableCell>
                    <TableCell align="right"><IconButton onClick={() => this.remove(row.id)}><DeleteIcon /></IconButton></TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rows)
