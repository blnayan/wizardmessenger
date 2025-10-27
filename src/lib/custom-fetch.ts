import { JsonObject } from "../../generated/prisma/runtime/library";

type FetchPost = (
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>;

type FetchGet = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>;

type FetchDelete = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>;

type FetchPut = (
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>;

type FetchPatch = (
  input: Parameters<typeof fetch>[0],
  body: JsonObject,
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>;

interface CustomFetch {
  post: FetchPost;
  get: FetchGet;
  delete: FetchDelete;
  put: FetchPut;
  patch: FetchPatch;
}

export const customFetch: CustomFetch = {
  post: (input, body, init) =>
    fetch(input, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  get: (input, init) => fetch(input, { ...init, method: "GET" }),
  delete: (input, init) => fetch(input, { ...init, method: "DELETE" }),
  put: (input, body, init) =>
    fetch(input, {
      ...init,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  patch: (input, body, init) =>
    fetch(input, {
      ...init,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
