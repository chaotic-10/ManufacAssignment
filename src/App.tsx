import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Table from "./Table";


export default function App() {
  return <MantineProvider theme={theme}>
    <Table />
  </MantineProvider>;
}
