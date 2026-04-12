import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

function Main() {
  return <App />
}

const root = createRoot(document.getElementById("root"))
root.render(<Main />)

export default Main