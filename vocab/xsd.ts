/** 
 * @file xsd vocabulary
 */

import { NamedNode } from "../types.ts";

export default function xsd(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/2001/XMLSchema#" + name,
  };
}

export const anyURI = xsd("anyURI")
export const base64Binary = xsd("base64Binary")
export const boolean = xsd("boolean")
export const byte = xsd("byte")
export const date = xsd("date")
export const dayTimeDuration = xsd("dayTimeDuration")
export const dateTime = xsd("dateTime")
export const dateTimeStamp = xsd("dateTimeStamp")
export const decimal = xsd("decimal")
export const double = xsd("double")
export const duration = xsd("duration")
export const float = xsd("float")
export const gDay = xsd("gDay")
export const gMonth = xsd("gMonth")
export const gMonthDay = xsd("gMonthDay")
export const gYear = xsd("gYear")
export const gYearMonth = xsd("gYearMonth")
export const hexBinary = xsd("hexBinary")
export const int = xsd("int")
export const integer = xsd("integer")
export const language = xsd("language")
export const long = xsd("long")
export const Name = xsd("Name")
export const NCName = xsd("NCName")
export const negativeInteger = xsd("negativeInteger")
export const NMToken = xsd("NMToken")
export const nonNegativeInteger = xsd("nonNegativeInteger")
export const nonPositiveInteger = xsd("nonPositiveInteger")
export const normalizedString = xsd("normalizedString")
export const positiveInteger = xsd("positiveInteger")
export const time = xsd("time")
export const short = xsd("short")
export const string = xsd("string")
export const token = xsd("token")
export const unsignedByte = xsd("unsignedByte")
export const unsignedInt = xsd("unsignedInt")
export const unsignedLong = xsd("unsignedLong")
export const unsignedShort = xsd("unsignedShort")
export const yearMonthDuration = xsd("yearMonthDuration")
