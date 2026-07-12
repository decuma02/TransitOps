export function paramId(params: { id?: string | string[] }): string {
  const id = params.id;
  if (Array.isArray(id)) return id[0];
  return id ?? '';
}
