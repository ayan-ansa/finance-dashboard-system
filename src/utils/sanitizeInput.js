import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

// For Objects
export const sanitizeObject = (obj) => {
  const cleanInput = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value == "string" ? purify.sanitize(value) : value,
    ])
  );
  return cleanInput;
};

// For single value
export const sanitizeInput = (value) => {
  return purify.sanitize(value);
};