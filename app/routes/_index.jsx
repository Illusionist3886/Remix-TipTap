import TipTap from "../components/TipTap";
import '../components/css/editor.css'
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css'
import { useState } from "react";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const primaryHtmlContent = `
<h1>hi</h1>
<a href="https://google.com">google</a>
`

export default function Index() {
  const [htmlContent, getUpdatedHtmlContent] = useState(primaryHtmlContent)

  console.log(htmlContent)

  return (
    <>
      <AppProvider>
        <TipTap content={htmlContent} getUpdatedHtmlContent={getUpdatedHtmlContent}/>
      </AppProvider>
    </>
  );
}
