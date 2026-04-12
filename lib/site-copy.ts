type TemplateValue = string | number | null | undefined;

export function renderTemplate(template: string, values: Record<string, TemplateValue>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value === null || value === undefined ? "" : String(value);
  });
}

export function renderFaqTemplate(
  items: Array<{ question: string; answer: string }>,
  values: Record<string, TemplateValue>
) {
  return items.map((item) => ({
    question: renderTemplate(item.question, values),
    answer: renderTemplate(item.answer, values)
  }));
}
