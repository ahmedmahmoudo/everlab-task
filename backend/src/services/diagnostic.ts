import { HighRiskRecord, OBXRecord } from "../types/obx";
import dbClient from "../utils/db";

export const getHighestRisk = async (records: OBXRecord[]) => {
	// We first need to get the metrics we have
	const metrics = await dbClient.diganosticMetric.findMany({
		where: {
			gender: "Any",
		},
		include: {
			condition: true,
		},
	});

	// We then need to find the highest and lowest values for each metric
	const highestRiskDiagnostics: HighRiskRecord[] = [];

	for (const record of records) {
		const metric = metrics.find(
			(metr) =>
				metr.oru_sonic_codes?.split(";").includes(record.name) &&
				metr.oru_sonic_units === record.unit
		);
		if (!metric) {
			continue;
		}

		const standardLower = Number(metric.standard_lower);
		const standardHigher = Number(metric.standard_higher);
		const value = Number(record.value);

		if (value < standardLower || value > standardHigher) {
			// Let's get the diagnostic for this metric
			const diagnostic = await dbClient.diagnostic.findFirst({
				where: {
					id: metric.diagnosticId!,
				},
				include: {
					diagnosticGroup: true,
				},
			});

			highestRiskDiagnostics.push({
				name: record.name,
				diagnostic: diagnostic?.name!,
				diagnosticGroup: diagnostic?.diagnosticGroup?.name!,
				value: record.value,
				unit: record.unit,
				possibleConditions: metric.condition?.map(
					(condition) => condition.name
				),
				standardLower,
				standardHigher,
			});
		}
	}

	return highestRiskDiagnostics;
};
