import {
  buildGoogleFormBody,
  GOOGLE_FORM_ACTION,
  type AccumulatedResponses,
  type FormTokens,
} from './googleForm'

async function fetchFormTokens(): Promise<FormTokens> {
  // Server endpoint avoids browser CORS when reading Google HTML
  const res = await fetch('/api/form-tokens')
  if (!res.ok) throw new Error('Impossibile leggere i token del Google Form')
  return (await res.json()) as FormTokens
}

/**
 * Submit via hidden iframe + form, including Google hidden tokens.
 */
export async function submitGoogleFormViaIframe(data: AccumulatedResponses): Promise<void> {
  const tokens = await fetchFormTokens()
  if (!tokens.fbzx) {
    throw new Error('Token Google Form mancante (fbzx). Riprova.')
  }

  const params = buildGoogleFormBody(data, tokens)
  const entryCount = [...params.keys()].filter((k) => k.startsWith('entry.')).length
  if (entryCount < 5) {
    throw new Error('Dati incompleti: impossibile inviare a Google Form.')
  }

  return new Promise((resolve, reject) => {
    const id = `gform_${Date.now()}`
    const iframe = document.createElement('iframe')
    iframe.name = id
    iframe.title = 'google-form-submit'
    iframe.style.display = 'none'

    const form = document.createElement('form')
    form.action = GOOGLE_FORM_ACTION
    form.method = 'POST'
    form.target = id
    form.acceptCharset = 'UTF-8'
    form.style.display = 'none'

    for (const [name, value] of params.entries()) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    const cleanup = () => {
      form.remove()
      iframe.remove()
    }

    iframe.addEventListener('load', () => {
      cleanup()
      resolve()
    })

    document.body.appendChild(iframe)
    document.body.appendChild(form)

    try {
      form.submit()
    } catch (err) {
      cleanup()
      reject(err)
      return
    }

    window.setTimeout(() => {
      cleanup()
      resolve()
    }, 3000)
  })
}
