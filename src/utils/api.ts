import { Comment } from '@/models/Comment'
import { Variant } from '@/models/Variant'
import { Localization } from '@/models/Localization'
import axios from 'axios'
import store from '@/store'

const base = process.env.VUE_APP_API || '/api/'

function convertCreatedAt(item: any) {
  item.createdAt = new Date(item.createdAt)
  return item
}

export async function getLocalizations() {
  return (await axios.get(`${base}/localizations`)).data
    .map(convertCreatedAt)
    .map((localization: any) => {
      localization.variants.forEach((variant: any) => {
        variant.comments = variant.comments.map(convertCreatedAt)
      })
      return localization
    })
    .map((localization: Localization) => {
      localization.variants = localization.variants.sort((a: any, b: any) => {
        if (a.selected && !b.selected) {
          return -1
        } else if (!a.selected && b.selected) {
          return 1
        } else {
          return 0
        }
      })
      return localization
    }) as Localization[]
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
  ).data as Variant
}

export async function selectVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/select`, {
      key,
      id,
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function deleteVariant(key: string, id: string) {
  return (
    await axios.post(`${base}/localizations/delete`, {
      key,
      id,
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function selectVariants(key: string, ids: string[]) {
  return (
    await axios.post(`${base}/localizations/select`, {
      key,
      ids,
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function deleteVariants(key: string, ids: string[]) {
  return (
    await axios.post(`${base}/localizations/delete`, {
      key,
      ids,
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function editVariant(key: string, id: string, text: string) {
  return (
    await axios.post(`${base}/localizations/edit`, {
      key,
      id,
      text,
      password: (store as any).state.AppStore.password,
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
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function deleteLocalizationTag(key: string, tag: string) {
  return (
    await axios.post(`${base}/localizations/localization/deleteTag`, {
      key,
      tag,
      password: (store as any).state.AppStore.password,
    })
  ).data
}

export async function addLocalizationTag(key: string, tag: string) {
  return (
    await axios.post(`${base}/localizations/localization/addTag`, {
      key,
      tag,
      password: (store as any).state.AppStore.password,
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
      username: (store as any).state.AppStore.username,
      text,
      key,
      id,
    })
  ).data as Comment
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
      password: (store as any).state.AppStore.password,
    })
  ).data
}
