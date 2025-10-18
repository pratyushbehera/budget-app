import { AppProvider as StoreProvider } from "../../store/index.jsx";
import { App } from "../../App";

export function AppProvider() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
