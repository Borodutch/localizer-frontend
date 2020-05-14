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
      text: text.replace(/ - /g, ' — ').replace(/  /g, ' '),
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

export async function upvoteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/upvote`, {
      key,
      id,
    })
  ).data
}

export async function downvoteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/downvote`, {
      key,
      id,
    })
  ).data
}

export async function removeUpvoteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/upvote/remove`, {
      key,
      id,
    })
  ).data
}

export async function removeDownvoteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/downvote/remove`, {
      key,
      id,
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
