export type User = {
  email: string,
  password: string,
}

// todo убрать any из dogs, список собак тоже сделать ссылкой на list?

export type UserData = {
  email: string, // электронный адрес
  profileIds: string[],
}
