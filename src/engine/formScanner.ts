export type FormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export function scanFormElements(): FormElement[] {
  const elements: FormElement[] = [];

  const inputs = document.querySelectorAll("input");
  const textareas = document.querySelectorAll("textarea");
  const selects = document.querySelectorAll("select");

  inputs.forEach((el) => elements.push(el as HTMLInputElement));
  textareas.forEach((el) => elements.push(el as HTMLTextAreaElement));
  selects.forEach((el) => elements.push(el as HTMLSelectElement));

  return elements;
}
