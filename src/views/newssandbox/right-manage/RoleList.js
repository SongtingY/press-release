import React, { useEffect, useState } from 'react'
import {Table, Button, Modal, Tree} from 'antd'
import axios from 'axios';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [rightsList, setRightsList] = useState([]);
  const [rightsId, setRightsId] = useState(0);

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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:3001/roles/${item.id}`)
  };

  const columns=[{
    title: 'ID',
    dataIndex: 'id',
    render: (id) => {
      return <b>{id}</b>
    }},
    {
      title: 'Role Name',
      dataIndex: 'roleName'
    },
    {
      title: "Operation",
      render:(item)=>{
        return <div>
        {/* delete */}
        <Button danger shape="circle" icon={<DeleteOutlined onClick={() => confirmMethod(item)} />}></Button> 
        {/* edit the right management */}
          <Button type="primary" shape="circle" icon=
          {<EditOutlined onClick={()=> {
            setIsModalVisible(true); 
            setRightsList(item.rights);
            setRightsId(item.id)}}/>} />      
      </div>
      }
    }
  ];
  
  const handleOk = () => {
    axios
      .patch(`http://localhost:3001/roles/${rightsId}`, {
        rights: rightsList,
      })
      .then(() => {
        dataSource.map(item => {
          if (item.id === rightsId) item.rights = rightsList;
          return item;
        });
      });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCheck = data => {
    setRightsList(data.checked);
    // console.log(data.checked)
  };


  useEffect(() => {
    axios.get("http://localhost:3001/roles").then(res => {
      setDataSource(res.data)
    });
    axios.get("http://localhost:3001/rights?_embed=children").then(res => {
      setTreeData(res.data)
    })
  });

  return (
    <div>
      <Table dataSource={dataSource} columns ={columns} rowKey={(item)=>item.id}></Table>
      <Modal title="Permission Assignment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree checkStrictly checkable treeData={treeData} checkedKeys={rightsList} onCheck={onCheck}/>
      </Modal>
    </div>
  )
};
