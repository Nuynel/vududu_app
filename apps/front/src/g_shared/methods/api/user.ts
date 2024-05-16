import {User} from "../../types";
import {URL} from './index';

export async function signIn(data: User) {
  return await fetch(`${URL}/sign-in`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data)
  }).then(r => {
    if (r.status === 400 || r.status === 401) {
      throw new Error('Не авторизовано')
    }
    return r.json()
  })
}

export async function signOut() {
  try {
    return await fetch(`${URL}/sign-out`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  } catch (error) {
    console.error(error)
  }
}

export async function signUp(data: User) {
  return await fetch(`${URL}/sign-up`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  }).then(r => {
    if (r.status === 400 || r.status === 401) {
      throw new Error('Пользователь не добавлен')
    }
    return r.json()
  })
}

export async function getUser() {
  try {
    return await fetch(`${URL}/user`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

