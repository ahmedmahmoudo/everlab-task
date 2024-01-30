import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import LandingPage from "./pages/landing";

function App() {
	return (
		<MantineProvider>
			<LandingPage />
		</MantineProvider>
	);
}

export default App;
