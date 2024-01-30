import path from "path";
import dbClient from "./db";
import csv from "csvtojson";
import { Diagnostic } from "@prisma/client";

const DIAGNOSTIC_CSV_PATH = path.join(__dirname, "../../files/diagnostics.csv");
const DIAGNOSTIC_GROUPS_CSV_PATH = path.join(
	__dirname,
	"../../files/diagnostic_groups.csv"
);
const DIAGNOSTIC_METRICS_CSV_PATH = path.join(
	__dirname,
	"../../files/diagnostic_metrics.csv"
);
const CONDITIONS_CSV_PATH = path.join(__dirname, "../../files/conditions.csv");

const seed = async () => {
	// Let's start by importing DIAGNOSTIC GROUPS
	console.log("Reading diagnostic groups...");
	const diagnosticGroupsJSON: { name: string }[] = await csv().fromFile(
		DIAGNOSTIC_GROUPS_CSV_PATH
	);

	console.log("Importing diagnostic groups...");
	const diagnosticGroups = await Promise.all(
		diagnosticGroupsJSON.map(async (group) => {
			return await dbClient.diagnosticGroup.create({
				data: {
					name: group.name,
				},
			});
		})
	);

	// Now let's import DIAGNOSTICS
	console.log("Reading diagnostics...");
	const diagnosticsJSON: { name: string; diagnostic_groups: string }[] =
		await csv().fromFile(DIAGNOSTIC_CSV_PATH);

	console.log("Importing diagnostics...");
	const diagnostics = (
		await Promise.all(
			diagnosticsJSON.map(async (diagnostic) => {
				const diagnosticGroup = diagnosticGroups.find(
					(group) => group.name === diagnostic.diagnostic_groups
				);
				if (!diagnosticGroup) {
					return;
				}

				return await dbClient.diagnostic.create({
					data: {
						name: diagnostic.name,
						diagnosticGroupId: diagnosticGroup?.id,
					},
				});
			})
		)
	).filter(Boolean) as Diagnostic[];

	// Now let's import DIAGNOSTIC METRICS
	console.log("Reading diagnostic metrics...");
	const diagnosticMetricsJSON: {
		name: string;
		diagnostic: string;
		oru_sonic_codes: string;
		oru_sonic_units: string;
		min_age: string;
		max_age: string;
		gender: string;
		standard_lower: string;
		standard_higher: string;
		everlab_lower: string;
		everlab_higher: string;
	}[] = await csv().fromFile(DIAGNOSTIC_METRICS_CSV_PATH);

	console.log("Importing diagnostic metrics...");
	const diagnosticMetrics = await Promise.all(
		diagnosticMetricsJSON.map(async (metric) => {
			const diagnostic = diagnostics.find(
				(diagnostic) => diagnostic.name === metric.diagnostic
			);

			return await dbClient.diganosticMetric.create({
				data: {
					name: metric.name,
					diagnosticId: diagnostic?.id,
					oru_sonic_codes: metric.oru_sonic_codes,
					oru_sonic_units: metric.oru_sonic_units,
					min_age: parseInt(metric.min_age, 10),
					max_age: parseInt(metric.max_age, 10),
					gender: metric.gender,
					standard_lower: parseFloat(metric.standard_lower),
					standard_higher: parseFloat(metric.standard_higher),
					everlab_lower: parseFloat(metric.everlab_lower),
					everlab_higher: parseFloat(metric.everlab_higher),
				},
			});
		})
	);

	// Now let's import CONDITIONS
	console.log("Reading conditions...");
	const conditionsJSON: {
		name: string;
		diagnostic_metrics: string;
	}[] = await csv().fromFile(CONDITIONS_CSV_PATH);

	console.log("Importing conditions...");
	await Promise.all(
		conditionsJSON.map(async (condition) => {
			const diagnosticMetric = diagnosticMetrics.find(
				(metric) => metric.name === condition.diagnostic_metrics
			);
			if (!diagnosticMetric) {
				return;
			}

			return await dbClient.condition.create({
				data: {
					name: condition.name,
					diagnosticMetrics: {
						connect: {
							id: diagnosticMetric.id,
						},
					},
				},
			});
		})
	);

	console.log("Done!");
};

seed();
