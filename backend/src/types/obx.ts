export type OBXRecord = {
	name: string;
	value: string;
	unit: string;
};

export type HighRiskRecord = {
	name: string;
	diagnostic: string;
	diagnosticGroup: string;
	value: string;
	unit: string;
	possibleConditions: string[] | undefined;
	standardLower: number;
	standardHigher: number;
};
