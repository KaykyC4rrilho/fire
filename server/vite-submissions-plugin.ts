import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import submissionsApi from '../api/submissions.js'

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined
}

function createWebHeaders(request: IncomingMessage) {
  const headers = new Headers()

  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(name, item))
    } else if (value !== undefined) {
      headers.set(name, value)
    }
  }

  return headers
}

async function toWebRequest(request: IncomingMessage) {
  const method = request.method ?? 'GET'
  const host = request.headers.host ?? 'localhost'
  const url = new URL(request.url ?? '/', `http://${host}`)
  const body = method === 'GET' || method === 'HEAD'
    ? undefined
    : await readRequestBody(request)

  return new Request(url, {
    method,
    headers: createWebHeaders(request),
    body,
  })
}

async function sendWebResponse(response: Response, serverResponse: ServerResponse) {
  serverResponse.statusCode = response.status
  response.headers.forEach((value, name) => {
    serverResponse.setHeader(name, value)
  })

  const body = Buffer.from(await response.arrayBuffer())
  serverResponse.end(body)
}

export function submissionsApiPlugin(): Plugin {
  return {
    name: 'fire-submissions-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(
          request.url ?? '/',
          'http://vite.local',
        ).pathname

        if (pathname !== '/api/submissions') {
          next()
          return
        }

        try {
          const webRequest = await toWebRequest(request)
          const webResponse = await submissionsApi.fetch(webRequest)
          await sendWebResponse(webResponse, response)
        } catch (error) {
          console.error('Local submissions API failed:', error)
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(
            JSON.stringify({
              error: {
                message: 'Não foi possível processar a requisição local.',
                code: 'LOCAL_API_ERROR',
              },
            }),
          )
        }
      })
    },
  }
}
