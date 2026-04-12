function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMergeDefaults<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(value) ? value : defaults) as T;
  }

  if (isPlainObject(defaults)) {
    const incoming = isPlainObject(value) ? value : {};
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(defaults)) {
      result[key] = deepMergeDefaults(
        (defaults as Record<string, unknown>)[key],
        incoming[key]
      );
    }

    for (const key of Object.keys(incoming)) {
      if (!(key in result)) {
        result[key] = incoming[key];
      }
    }

    return result as T;
  }

  return (value === undefined || value === null ? defaults : value) as T;
}
