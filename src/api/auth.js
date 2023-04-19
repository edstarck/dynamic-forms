import {user} from '@/config'

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    console.log(email === user.email && password === user.password)
    setTimeout(() => {
      if (email === user.email && password === user.password) {
        resolve({
          email: user.email,
          name: user.name,
        })
      } else {
        reject('supplied credentials do not match any user')
      }
    }, 1000)
  })
}

const checkIfUserExistsInDB = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === user.email) {
        resolve(true)
      } else {
        reject('user not found')
      }
    }, 1000)
  })
}

const postFormToDB = (form) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(form), 1000)
  })
}

export default {
  login,
  checkIfUserExistsInDB,
  postFormToDB,
}

// TODO:
// разнести это API по разным модулям
