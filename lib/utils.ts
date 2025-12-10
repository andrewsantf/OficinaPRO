import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDocument(value: string) {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}

export function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length > 11) {
    return numbers.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else if (numbers.length > 10) {
    return numbers.replace(/^(\d\d)(\d{5})(\d{4})/, '($1) $2-$3')
  } else {
    return numbers.replace(/^(\d\d)(\d{4})(\d{0,4})/, '($1) $2-$3')
  }
}
