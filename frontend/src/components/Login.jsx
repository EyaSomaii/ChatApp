// src/components/Login.js
import React, { useState } from "react";
import { Box, Button, Input, VStack, Center } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, password };
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/ChatRoom"); // Changed from 'history.push' to 'navigate'
    } catch (error) {
      console.log("erreur");
    }
  };

  return (
    <Center>
      <Box p={4} borderWidth="1px" borderRadius="md" width="300px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" colorScheme="blue">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default Login;
