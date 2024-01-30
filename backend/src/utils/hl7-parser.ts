import { Hl7Parser } from "@manhydra/hl7-parser";
var hl7Parser = new Hl7Parser();

export const getOBXData = (hl7Message: string) => {
	return hl7Parser
		.getHl7Model(hl7Message)
		.children.filter(Boolean)
		.filter((x) => x.name === "OBX")
		.map((x) => ({
			name: x.children[3]?.children?.[1].value,
			value: x.children[5]?.value,
			unit: x.children[6]?.value.split("^")?.[0],
		}));
};
