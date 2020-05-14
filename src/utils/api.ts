import axios from 'axios'

const base = process.env.VUE_APP_API

export async function getLocalizations() {
  return (await axios.get(`${base}/localizations`)).data
}

export async function postVariant(
  key: string,
  text: string,
  language: string,
  username?: string
) {
  return (
    await axios.post(`${base}/localizations/localization`, {
      key,
      text,
      language,
      username,
    })
  ).data
}

export async function selectVariant(
  key: string,
  id: string,
  password?: string
) {
  return (
    await axios.post(`${base}/localizations/select`, {
      key,
      id,
      password,
    })
  ).data
}

export async function deleteVariant(
  key: string,
  id: string,
  password?: string
) {
  return (
    await axios.post(`${base}/localizations/delete`, {
      key,
      id,
      password,
    })
  ).data
}

export async function deleteLocalization(key: string, password?: string) {
  return (
    await axios.post(`${base}/localizations/localization/delete`, {
      key,
      password,
    })
  ).data
}
