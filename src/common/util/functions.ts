// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
export function isObjectEmpty(obj: { [k: string]: any }): boolean {
  return Object.keys(obj).length === 0;
}

export const isTestEnvironment = process.env.NODE_ENV === "test";

export const isDevEnvironment = process.env.NODE_ENV === "dev";

export const isProdEnvironment = process.env.NODE_ENV === "prod";
