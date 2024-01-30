import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../config";
import { HighRiskRecord } from "../../types/obx";
import { Card, Container, Grid, Group, Table } from "@mantine/core";
import Dropzone from "../../components/dropzone";
import { ThreeDots } from "react-loader-spinner";
import classes from "./index.module.css";

const LandingPage = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [riskData, setRiskData] = useState<HighRiskRecord[]>([]);

	const onFileUpload = (file: File) => {
		setRiskData([]);
		uploadFile(file);
	};

	const uploadFile = async (file: File) => {
		if (!file) return;

		const formData = new FormData();
		formData.append("report", file);

		setIsUploading(true);
		try {
			const response = await axios.post(`${API_URL}/highest-risk`, formData);
			setRiskData(response.data.data);
		} catch (e) {
			console.log("Error uploading file", e);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Container my="md">
			<Grid>
				<Grid.Col span={12}>
					<h1>Highest Risk Calculator</h1>
				</Grid.Col>
				<Grid.Col span={12}>
					<Card withBorder radius="md">
						{!isUploading && <Dropzone onFileUpload={onFileUpload} />}

						{isUploading && (
							<Group align="center" justify="center">
								<ThreeDots
									visible={true}
									height="80"
									width="80"
									color="#4fa94d"
									radius="9"
									ariaLabel="three-dots-loading"
									wrapperStyle={{}}
									wrapperClass=""
								/>
							</Group>
						)}
					</Card>
				</Grid.Col>
				{riskData.length > 0 && (
					<Grid.Col span={12}>
						<Card withBorder radius="md">
							<h2>High Risk Records</h2>
							<Table.ScrollContainer minWidth={800}>
								<Table verticalSpacing="md">
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Diagnostic</Table.Th>
											<Table.Th>Diagnostic Group</Table.Th>
											<Table.Th>Value</Table.Th>
											<Table.Th>Standard Lower</Table.Th>
											<Table.Th>Standard Higher</Table.Th>
											<Table.Th>Possible Conditions</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{riskData.map((record, index) => (
											<Table.Tr key={index}>
												<Table.Td>{record.diagnostic}</Table.Td>
												<Table.Td>{record.diagnosticGroup}</Table.Td>
												<Table.Td className={classes.value}>
													{record.value}
												</Table.Td>
												<Table.Td className={classes.minValue}>
													{record.standardLower}
												</Table.Td>
												<Table.Td className={classes.maxValue}>
													{record.standardHigher}
												</Table.Td>
												<Table.Td>
													{record.possibleConditions?.length > 0
														? record.possibleConditions?.join(",")
														: "-"}
												</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								</Table>
							</Table.ScrollContainer>
						</Card>
					</Grid.Col>
				)}
			</Grid>
		</Container>
	);
};

export default LandingPage;
