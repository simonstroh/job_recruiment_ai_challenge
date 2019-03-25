import React from 'react'
import Header from './Header.jsx'
import Form from './Form.jsx'
import Footer from './Footer.jsx'
import Paper from '@material-ui/core/Paper'

const App = (props) => (
  <div>
    <Paper style={{padding: 20}}>
    <Header />
    <Form />
    <Footer />
    </Paper>
  </div>
)

export default App
