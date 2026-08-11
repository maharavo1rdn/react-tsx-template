import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/appRoutes";

function App() {
  return useRoutes(appRoutes);
}

export default App;
