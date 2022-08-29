import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {Table, Button, Modal, notification} from 'antd'
import axios from 'axios';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, CloudUploadOutlined} from "@ant-design/icons";

const {confirm} = Modal;

const withRouter = Component => props => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};


function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);
  const {username} = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    });
  },[username]);


  const confirmMethod = (item) => {
    confirm({
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Bla bla ...',
      okText: "Delete",
      // cancelText: 'Cancel',
      onOk() {
        deleteRightsList(item)
    }
    });
  };

  const deleteRightsList = (item) => {
    axios.delete(`/news/${item.id}`).then(()=>{
      setDataSource(dataSource.filter(data => data.id != item.id))
    })
  };

  const handleCheck = (id) =>{
    axios.patch(`/news/${id}`,{
      "auditState": 1
    }).then(res=>{
      navigate("/audit-manage/list")
      notification.info({
        message: `notification`,
        description:
          `You can go to review to check your news`,
        placement:"bottomRight"
      });
    })
  }


  const columns=[{
    title: 'ID',
    dataIndex: 'id',
    render: (id) => {
      return <b>{id}</b>
    }},
    {
      title: 'News Title',
      dataIndex: 'title',
      render:(title, item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render:(catrgory)=>{
        return catrgory.title
      }
    },
    
    {
      title: "Operation",
      render:(item)=>{
        return <div>
        {/* delete */}
        <Button danger shape="circle" icon={<DeleteOutlined onClick={() => confirmMethod(item)} />}></Button> 
        {/* edit the right management */}
          <Button shape="circle" icon={<EditOutlined/>} onClick={()=>{
            navigate(`/news-manage/update/${item.id}`)
          }}/>      
          <Button type="primary" shape="circle" icon={<CloudUploadOutlined/>} onClick={()=>handleCheck(item.id)}/>  
      </div>
      }
    }
  ];


  
  return (
    <div>
      <Table dataSource={dataSource} columns ={columns} rowKey={(item)=>item.id}></Table>
    </div>
  )
};

export default withRouter(NewsDraft);