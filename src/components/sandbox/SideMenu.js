import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css"
import axios from 'axios';

// antd
import {Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  ControlOutlined,
  SoundOutlined,
  AuditOutlined,
  SmileOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/right-manage": <ControlOutlined />,
  "/news-manage":<SoundOutlined />,
  "/audit-manage":<AuditOutlined />,
  "/publish-manage":<SmileOutlined />

}

// history route
const withRouter = Component => props => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};


function SideMenu(props) {
  // access the json server
  const [items, setItems] = useState([]);
    useEffect(()=>{
      axios.get("http://localhost:3001/rights?_embed=children").then(res =>{
        setItems(res.data)})
    },[]);
    
    // click 
    const navigate = useNavigate();
    const onClick = (props) => {
      navigate(props.key)
    };  

    // get the permission from the admin
    const {role:{rights}}  = JSON.parse(localStorage.getItem("token"));
    
    // subMenu and menu
    const checkPermission = (item)=>{
      return item.pagepermisson == 1 &&  rights.includes(item.key);
    } 
    const renderMenu = (menuList) =>{
      return menuList.map(items =>{
        // add ccheckPermission() to determine whethere the user has the ability to access
        //  add length check to aviod the fold
        if (items.children?.length>0 && checkPermission(items)){
          return (<SubMenu key = {items.key}  icon={iconList[items.key]} title = {items.title}>
          {/* if it has the children, do recursion */}
            {renderMenu(items.children)}
          </SubMenu>)
        }
        return checkPermission(items) && <Menu.Item key={items.key} icon={items.icon} onClick={onClick} >{items.title}</Menu.Item>
      })
    }

    // side collapsed
    const [collapsed, setCollapsed] = useState(false);
    
    // when refresh the page, it wont go back to the home page while remaining the same page
    const selectKeys = [props.location.pathname]
    const openKeys = ["/" + props.location.pathname.split("/")[1]]

    console.log(props);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
    <div style={{ display: 'flex', height: "100%", flexDirection: "column" }} >
      <div className="logo">Press Release System</div>
      {/* aviod the whole page scrolls when the side bar scrolls */}
        <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
      onClick={onClick}
      defaultSelectedKeys={["/home"]}
      theme="dark"
      mode="inline"
      selectedKeys={selectKeys} 
      defaultOpenKeys={openKeys}
    >
    {renderMenu(items)}
    </Menu>
    </div>
    </div>
      </Sider>
  )
};

export default withRouter(SideMenu);