import axios from 'axios'
import * as store from '../plugins/store'

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

export async function selectVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/select`, {
      key,
      id,
      password: store.password(),
    })
  ).data
}

export async function deleteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/delete`, {
      key,
      id,
      password: store.password(),
    })
  ).data
}

export async function selectVariants(key: string, ids: string[]) {
  return (
    await axios.post(`${base}/localizations/select`, {
      key,
      ids,
      password: store.password(),
    })
  ).data
}

export async function deleteVariants(key: string, ids: string[]) {
  return (
    await axios.post(`${base}/localizations/delete`, {
      key,
      ids,
      password: store.password(),
    })
  ).data
}

export async function editVariant(key: string, id: string, text: string) {
  return (
    await axios.post(`${base}/localizations/edit`, {
      key,
      id,
      text,
      password: store.password(),
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

export async function deleteLocalization(key: string) {
  return (
    await axios.post(`${base}/localizations/localization/delete`, {
      key,
      password: store.password(),
    })
  ).data
}

export async function deleteLocalizationTag(key: string, tag: string) {
  return (
    await axios.post(`${base}/localizations/localization/deleteTag`, {
      key,
      tag,
      password: store.password(),
    })
  ).data
}

export async function addLocalizationTag(key: string, tag: string) {
  return (
    await axios.post(`${base}/localizations/localization/addTag`, {
      key,
      tag,
      password: store.password(),
    })
  ).data
}

export async function leaveCommentToVariant(
  text: string,
  key: string,
  id: string
) {
  return (
    await axios.post(`${base}/localizations/comment`, {
      username: store.username(),
      text,
      key,
      id,
    })
  ).data
}

export async function deleteCommentToVariant(
  key: string,
  id: string,
  commentId: string
) {
  return (
    await axios.post(`${base}/localizations/comment/delete`, {
      key,
      id,
      commentId,
      password: store.password(),
    })
  ).data
}
