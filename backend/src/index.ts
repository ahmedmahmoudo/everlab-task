import express from "express";
import fs from "fs";
import { getOBXData } from "./utils/hl7-parser";
import { getHighestRisk } from "./services/diagnostic";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.post("/highest-risk", upload.single("report"), async (req, res) => {
	const file = fs.readFileSync(path.join(__dirname, "../", req.file?.path!));
	if (!file) {
		return res.status(400).json({
			error: "Invalid file",
		});
	}

	const obxData = getOBXData(file.toString());
	const highestRisk = await getHighestRisk(obxData);

	return res.json({
		data: highestRisk,
	});
});

app.get("/", async (req, res) => {
	res.send("Highest Risk API");
});

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
