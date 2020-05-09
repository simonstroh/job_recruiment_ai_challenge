import { setRows } from './../redux'

const mapStateToProps = (state) => {
  return {
    rows: state.rows
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRows: (type) => dispatch(setRows(type))
  }
}

export {
  mapStateToProps,
  mapDispatchToProps
}
