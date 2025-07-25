import { useContext } from "react";
import { ShowContext } from "../components/context-provider"; // Adjust path

export default function useShowContext() {
  const context = useContext(ShowContext);
  if (!context) {
    throw new Error("useShowContext must be used within a ContextProvider");
  }
  return context;
}
