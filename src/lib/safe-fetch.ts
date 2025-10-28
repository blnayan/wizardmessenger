import { JsonObject } from "../../generated/prisma/runtime/library";

type RequestInitLike = Parameters<typeof fetch>[1];

export type SafeRequestResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface SafeRequestOptions<T> {
  parse?: (response: Response) => Promise<T>;
  fallbackError?: string;
}

type FetchPost = <T = void>(
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: RequestInitLike,
  options?: SafeRequestOptions<T>,
) => Promise<SafeRequestResult<T>>;

type FetchGet = <T = void>(
  input: Parameters<typeof fetch>[0],
  init?: RequestInitLike,
  options?: SafeRequestOptions<T>,
) => Promise<SafeRequestResult<T>>;

type FetchDelete = <T = void>(
  input: Parameters<typeof fetch>[0],
  init?: RequestInitLike,
  options?: SafeRequestOptions<T>,
) => Promise<SafeRequestResult<T>>;

type FetchPut = <T = void>(
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: RequestInitLike,
  options?: SafeRequestOptions<T>,
) => Promise<SafeRequestResult<T>>;

type FetchPatch = <T = void>(
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: RequestInitLike,
  options?: SafeRequestOptions<T>,
) => Promise<SafeRequestResult<T>>;

interface safeFetch {
  post: FetchPost;
  get: FetchGet;
  delete: FetchDelete;
  put: FetchPut;
  patch: FetchPatch;
}

export const safeFetch: safeFetch = {
  post: (input, body, init, options) =>
    safeRequest(
      () =>
        fetch(input, {
          ...init,
          method: "POST",
          headers: withJsonHeaders(init),
          body: JSON.stringify(body),
        }),
      options,
    ),
  get: (input, init, options) =>
    safeRequest(
      () =>
        fetch(input, {
          ...init,
          method: "GET",
        }),
      options,
    ),
  delete: (input, init, options) =>
    safeRequest(
      () =>
        fetch(input, {
          ...init,
          method: "DELETE",
        }),
      options,
    ),
  put: (input, body, init, options) =>
    safeRequest(
      () =>
        fetch(input, {
          ...init,
          method: "PUT",
          headers: withJsonHeaders(init),
          body: JSON.stringify(body),
        }),
      options,
    ),
  patch: (input, body, init, options) =>
    safeRequest(
      () =>
        fetch(input, {
          ...init,
          method: "PATCH",
          headers: withJsonHeaders(init),
          body: JSON.stringify(body),
        }),
      options,
    ),
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

async function safeRequest<T = void>(
  request: () => Promise<Response>,
  options: SafeRequestOptions<T> = {},
): Promise<SafeRequestResult<T>> {
  const {
    parse = (response: Response) => response.json(),
    fallbackError = DEFAULT_ERROR_MESSAGE,
  } = options;

  try {
    const response = await request();

    if (!response.ok) {
      return {
        ok: false,
        error: await extractErrorMessage(response, fallbackError),
      };
    }

    const data = parse ? await parse(response) : (undefined as T);

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
    };
  }
}

async function extractErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const result = await response.clone().json();
    if (result && typeof result.error === "string") {
      return result.error;
    }
  } catch {
    // ignore JSON parse failures and fall back to the default message
  }

  return fallback;
}

function withJsonHeaders(init?: RequestInitLike): Headers {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}
