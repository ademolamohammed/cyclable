import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function CreateObjectFromModel<T, K extends (keyof T)[]>(object: T, items: K): { [key in K[number]]: T[key] } {
  console.log({ object });
  let newObject: { [key in K[number]]: T[key] };
  items.forEach((v) => {
    newObject = { ...newObject, [v]: object[v] ?? object[v] };
    // this[v] = object[v];
  });
  console.log({ newObject });
  return newObject;
}

export const convertArrayOfObjectsToMap = <T extends { [x: string]: any }[], K extends keyof T[number]>(arrayInput: T, key: K) => {
  let objectMap = {} as { [x in T[number][K]]: T[number] };
  arrayInput.forEach((item) => {
    const mapKey = item[key as T[number][K]];
    objectMap[mapKey] = item;
  });
  return objectMap;
};

export const getBeginningOfDay = (date: Date) => new Date(new Date(date).setUTCHours(0, 0, 0, 0));

export const getEndOfDay = (date: Date) => new Date(new Date(date).setUTCHours(23, 59, 59, 0));

