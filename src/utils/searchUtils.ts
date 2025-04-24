function serializeParams(params: Record<string, any>): string {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
      });
    } else if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return parts.join('&');
}

function prepareParams(params: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = { ...params };

  // Process all array parameters
  Object.entries(result).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 1) {
      result[key] = value[0];
    }
  });

  return result;
}

export {
  serializeParams,
  prepareParams
}
