import React, { PureComponent } from 'react'
import Header from './Header.jsx'
import Form from './Form.jsx'
import Footer from './Footer.jsx'
import Paper from '@material-ui/core/Paper'

export default class Main extends PureComponent {
  render() {
    return (
      <Paper style={{padding: 20}}>
      <Header />
      <Form />
      <Footer />
      </Paper>
    )
  }
}
