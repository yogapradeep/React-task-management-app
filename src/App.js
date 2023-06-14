import React, { useEffect, useState, Suspense } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
// 1. Import `createTheme`
import { createTheme, NextUIProvider, Loading } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";
import { Layout } from "./layout";
import { Box } from "./components/Box";
import TodoList from "./components/TodoList";

const Login = React.lazy(() => import("./views/Login")); // Lazy-loaded




const App = () => {
  const [user, setUser] = useState({});
  const token = useLocalStorage("token");
  //console.log(user)


  // 2. Call `createTheme` and pass your custom values
  const lightTheme = createTheme({
    type: "light",
  });

  const darkTheme = createTheme({
    type: "dark",
  });
  // 3. Apply light or dark theme depending on useDarkMode value
  // App.jsx entry point of your app

  // 4. Use `useDarkMode` to change the theme
  const darkMode = useDarkMode(false);

  useEffect(() => {
    setUser(token);
  
  }, []);

  

  
  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <Layout>
          <Box css={{ px: "$24", mt: "$8", "@xsMax": { px: "$10" } }}>
            <TodoList/>
          </Box>
        </Layout>
  
          {/* <Login /> */}
    </NextUIProvider>
  );
};

export default App;
