import React from 'react';
import {Form, Input, Checkbox, Button, message} from "antd"
import {UserOutlined, LockOutlined} from '@ant-design/icons'
import { useLocation, useNavigate} from "react-router-dom";
// import Particles from "react-tsparticles"
import ParticlesBg from "particles-bg"
import axios from "axios"
import "./Login.css"

const withRouter = Component => props => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};



function Login(props) {
  const navigate = useNavigate();
  const onFinish = (value) =>{
    axios.get(`http://localhost:3001/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then(
      res=>{
        if(res.data.length == 0){
          message.error("Username or Password is incorrect")
        } else{
          // console.log(res.data[0].username);
          localStorage.setItem("token",JSON.stringify(res.data[0]))
          navigate("/")
        }
      }
    )
  }
  return (
    <div style={{background:"rgb(35,39,65)",height:"100%"}}>
    <ParticlesBg color="white" num={200} type="cobweb" bg={true} />
    <div className='formContainer'>
    <div className='title'>Global Press Public System</div>
    <Form name="basic"
      // labelCol={{ span: 8 }}
      // wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off">
    <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined/>} placeholder="User Name"/>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password prefix={<LockOutlined/>} placeholder="Password"/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" >
          Submit
        </Button>
      </Form.Item>
      </Form>
    </div>  
    </div>
    
  )
};

export default withRouter(Login);
