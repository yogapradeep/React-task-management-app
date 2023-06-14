import React, { useState } from "react";
import { Grid, Card, Text, useTheme, Input, Button } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import {Authentication } from "../api/http/todosRequest";

const Login = () => {
  const { type, theme } = useTheme();

  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const notify = (proccess) => toast(proccess);



  const handleLogin = () => {
    const user = {
        userName,
        password,
      };
      if(user.userName.trim().length >2 && user.password.trim().length > 2) {
         Authentication(user.userName,user.password)
         .then(response => {
          console.log(response.data);

          if(response.data.code==400){
            console.log("Authentication Unsuccessfull");
            notify("Username/Password doesn't correct")
          }
          if(response.data.code ==200 && response.data.status=="success"){
           
            const accessToken = response.data.results.token;
            const companyId = response.data.results.company_id;
            const userId = response.data.results.user_id;
              // Use the obtained accessToken, companyId, and userId as needed
              console.log('Access Token:', accessToken);
              console.log('Company ID:', companyId);
              console.log('User ID:', userId);
            
            console.log("Authentication sucessfull")
            localStorage.setItem("token",JSON.stringify(user))
            localStorage.setItem("accessToken",accessToken)
            localStorage.setItem("companyId",companyId)
            localStorage.setItem("userId",userId)
               window.location.reload()
           }
        })
        .catch(error => {
          console.error(error);
        });
 
      }else {
        notify("Username/Password doesn't correct")
      } 
  };

  return (
    <Grid.Container
      css={{
        height: "100vh",
      }}
      gap={2}
      justify="center"
      alignItems="center"
    >
      <Grid xs={10} sm={6} md={3} lg={3}>
        <Card css={{ h: "400px" }}>
          <Card.Body>
            <Text h1 size={15} css={{ mt: 0, textAlign: "center" }}>
              LOGIN
            </Text>
            <Input
              css={{
                mt: "$15",
                mr: "$10",
                ml: "$10",
              }}
              clearable
              bordered
              shadow={true}
              type="text"
              label="Username"
              placeholder="Enter your Username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
            />
            <Input.Password
              css={{
                mt: "$12",
                mr: "$10",
                ml: "$10",
              }}
              clearable
              bordered
              type="password"
              label="Password"
              placeholder="Enter your password with eye"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Card.Body>
          <Card.Footer
            isBlurred
            css={{
              display: "flex",
              bgBlur: "#9BA1A6",
              borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
              bottom: 0,
              zIndex: 1,
              justifyContent: "center",
            }}
          >
            <Button  
            auto rounded  shadow color="default" onClick={handleLogin} 
            >
              <Text
                color="white"
                weight="bold"
                transform="uppercase"
                
              >
                Login
              </Text>
            </Button>
          </Card.Footer>
        </Card>
      </Grid>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={type === "dark" ? "dark" : "light"}
      />
    </Grid.Container>
  );
};

export default Login;
