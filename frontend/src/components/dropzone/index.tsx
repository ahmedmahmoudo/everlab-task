import { useDropzone } from "react-dropzone";
import classes from "./index.module.css";
import { File } from "lucide-react";

type Props = {
	onFileUpload: (file: File) => void;
};

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {
	const onDrop = (acceptedFiles: File[]) => {
		console.log(acceptedFiles);
		const file = acceptedFiles[0];
		onFileUpload(file);
	};

	const { getInputProps, getRootProps } = useDropzone({
		accept: {
			"text/txt": [".txt"],
		},
		onDrop,
	});

	return (
		<div {...getRootProps()} className={classes.dropzone}>
			<input {...getInputProps()} />
			<File size={64} />
			<p>
				Drag and drop the report file or <span>click</span> here
			</p>
		</div>
	);
};

export default Dropzone;
