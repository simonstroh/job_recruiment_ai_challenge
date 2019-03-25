import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBRuCdx2_pjrhecn1mYr75IUXV9qb9ZXuI",
  authDomain: "geico-e017e.firebaseapp.com",
  databaseURL: "https://geico-e017e.firebaseio.com",
  projectId: "geico-e017e",
  storageBucket: "geico-e017e.appspot.com",
  messagingSenderId: "1001693216333"
}

firebase.initializeApp(config)

export default firebase
