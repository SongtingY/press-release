import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Table, Tag, Modal, Popover, Switch} from 'antd'
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(()=>{
    axios.get("http://localhost:3001/rights?_embed=children").then(res =>{
      const list = res.data;
      //  aviod the fold icon
        list.forEach(element => {
            if (element.children.length === 0)
                element.children = ""
        });
      setDataSource(list)})
  },[]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: 'Permission',
      dataIndex: 'title',
    },
    {
      title: 'Permission Path',
      dataIndex: 'key',
      // render will get the index one
      render: (key) =>{
        return <Tag color="orange">{key}</Tag>
    }},

      {
        title: "Operation",
        render:(item)=>{
          return <div>
          {/* delete */}
          <Button danger shape="circle" icon={<DeleteOutlined onClick={() => confirmMethod(item)}/>}></Button> 
          {/* edit the right management */}
          <Popover content={
            <div style={{ textAlign: "center" }}>
                <Switch checked={item.pagepermisson === 1 }  onChange={() => changeSwitchCheck(item)}/>
            </div>
            
        }
            title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"}>
            {/* trigger here is to disable the popover if it is not allowed */}
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>        
        </div>
        }
      }
  ];

  const changeSwitchCheck = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    if (item.grade === 1) {
      axios.patch(`http://localhost:3001/rights/${item.id}`, {
          pagepermisson: item.pagepermisson
      }).then(() => {
          setDataSource([...dataSource])
      })
  } else {
      axios.patch(`http://localhost:3001/children/${item.id}`, {
          pagepermisson: item.pagepermisson
      }).then(() => {
          setDataSource([...dataSource])
      })
  }
  };


  const confirmMethod = (item) => {
    confirm({
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Bla bla ...',
      okText: "Delete",
      // cancelText: 'Cancel',
      onOk() {
        deleteRightList(item)
    }
    });
  };

  const deleteRightList = (item) => {
    if (item.grade === 1) {
      // delete the parent one
      axios.delete(`http://localhost:3001/rights/${item.id}`).then(() => {
          setDataSource(dataSource.filter(data => data.id !== item.id))
      })
  } else {
      // delete the children one
      let list = dataSource.filter(data => data.id === item.rightId)
      //filter
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      axios.delete(`http://localhost:3001/children/${item.id}`).then(() => {
          setDataSource([...dataSource])
      })

  }
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>;
    </div>
  )
}
