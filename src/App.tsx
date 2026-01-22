import Layout from "./routes/layout";
import "./app.css";
import "./embla.css";
import { createHashRouter, RouterProvider } from "react-router";
import Images from "./components/images";
import About from "./routes/about";
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Images /> },
      { path: "about", element: <About /> },
      { path: "*", element: <div className="text-red-500 p-4">Not Found</div> },
    ],
  },
];

const router = createHashRouter(routes);
function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
