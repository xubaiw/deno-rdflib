/**
 * @file xsd vocabulary
 */

import { NamedNode } from "../model.ts";

function xsd(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/2001/XMLSchema#" + name,
  };
}

export default {
  "anyURI": xsd("anyURI"),
  "base64Binary": xsd("base64Binary"),
  "boolean": xsd("boolean"),
  "byte": xsd("byte"),
  "date": xsd("date"),
  "dayTimeDuration": xsd("dayTimeDuration"),
  "dateTime": xsd("dateTime"),
  "dateTimeStamp": xsd("dateTimeStamp"),
  "decimal": xsd("decimal"),
  "double": xsd("double"),
  "duration": xsd("duration"),
  "float": xsd("float"),
  "gDay": xsd("gDay"),
  "gMonth": xsd("gMonth"),
  "gMonthDay": xsd("gMonthDay"),
  "gYear": xsd("gYear"),
  "gYearMonth": xsd("gYearMonth"),
  "hexBinary": xsd("hexBinary"),
  "int": xsd("int"),
  "integer": xsd("integer"),
  "language": xsd("language"),
  "long": xsd("long"),
  "Name": xsd("Name"),
  "NCName": xsd("NCName"),
  "negativeInteger": xsd("negativeInteger"),
  "NMToken": xsd("NMToken"),
  "nonNegativeInteger": xsd("nonNegativeInteger"),
  "nonPositiveInteger": xsd("nonPositiveInteger"),
  "normalizedString": xsd("normalizedString"),
  "positiveInteger": xsd("positiveInteger"),
  "time": xsd("time"),
  "short": xsd("short"),
  "string": xsd("string"),
  "token": xsd("token"),
  "unsignedByte": xsd("unsignedByte"),
  "unsignedInt": xsd("unsignedInt"),
  "unsignedLong": xsd("unsignedLong"),
  "unsignedShort": xsd("unsignedShort"),
  "yearMonthDuration": xsd("yearMonthDuration"),
};
