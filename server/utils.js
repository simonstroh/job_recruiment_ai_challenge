const del = require('del')
const Loki = require('lokijs')

const loadCollection = (colName, db) => {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const _collection = db.getCollection(colName) || db.addCollection(colName)
      resolve(_collection)
    })
  })
}

const cleanFolder = (folderPath) => {
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
}

module.exports = {
  loadCollection,
  cleanFolder
}
