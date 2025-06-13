export function convertRequestParams(
  params: Record<string, string | Array<string>>,
) {
  if (!params) return ''
  let url = '?'
  for (const key of Object.keys(params)) {
    if (Array.isArray(params[key])) {
      for (const value of params[key]) {
        url += `${url.length === 1 ? '' : '&'}${key}=${value.replaceAll(' ', '%20')}`
      }
    } else {
      url += `${url.length === 1 ? '' : '&'}${key}=${params[key].replaceAll(' ', '%20')}`
    }
  }
  return url
}
