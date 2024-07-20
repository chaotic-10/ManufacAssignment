import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Table from "./Table";
import Table2 from "./Table2"



export default function App() {
  return <MantineProvider theme={theme}>
    <Table />
    <Table2 />
  </MantineProvider>;
}
