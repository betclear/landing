import { en } from "./en";

/**
 * Deeply mutable dictionary shape with string literals widened to `string`
 * so locale files can diverge while keeping the same key structure.
 */
type WidenDictionary<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? Array<WidenDictionary<U>>
        : T extends object
          ? { -readonly [K in keyof T]: WidenDictionary<T[K]> }
          : T;

export type Dictionary = WidenDictionary<typeof en>;
