import TipTap from "../components/TipTap";
import '../components/css/editor.css'
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css'

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <AppProvider>
        <TipTap />
      </AppProvider>
    </>
  );
}
