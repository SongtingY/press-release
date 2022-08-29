import React, { useEffect, useState, useRef } from 'react';
import { Button, PageHeader, Steps, message, Form, Input, Select, notification } from 'antd';
import style from './News.module.css';
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router";

const { Step } = Steps;
const { Option } = Select;

const withRouter = Component => props => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};


function NewsUpdate(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  // to do the form validation
  const newsForm = useRef(null);
  // /编辑新闻的状态
  const [newsInfo, setNewsInfo] = useState(null)

  const [formMsg, setFormMsg] = useState({})
  //文本框的数据
  const [content, setContent] = useState("")
  const { region, username, roleId } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res=>{
      let {title, categoryId, content} = res.data
      newsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, []);

  const next = () => {
    if (current  == 0){
      newsForm.current.validateFields().then(res=>{
        setFormMsg(res)
        setCurrent(current + 1);
      }).catch(err =>{
        console.log(err)
      })
    } else{
      if (content == '' || content == '<p></p>\n'){
        message.error("Please input news content")
      } else{
        setCurrent(current + 1);
      }
    }   
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleSave = (auditState) =>{
      axios.patch(`/news/${params.id}`,{
        ...formMsg,
        "content": content,
        "auditState": auditState
      }).then(res=>{
        navigate(auditState==0?"/news-manage/draft":"/audit-manage/list")
        notification.info({
          message: `notification`,
          description:
          `You can go to ${auditState === 0? 'Draft': 'Revie'} to check your news`,
          placement:"bottomRight",
        });
      })
  }

  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setCategoryList(res.data)
    })
  })
  
  
  return (
    <div>
    <PageHeader
    className="site-page-header"
    title="Update News"
    onBack={() => window.history.back()}
  />
  <Steps current={current}>
    <Step title="Basic Information" description="News Headlines, News Categories" />
    <Step title="News Content" description="News ain content" />
    <Step title="News Submission" description="Save a draft or submit for review" />
    </Steps>

    <div style={{marginTop:'50px'}}>
    
    
    <div className={current === 0? "":style.active} >
    <Form {...layout} name="control-hooks" ref={newsForm}>
      <Form.Item name="title" label="News title" rules={[{ required: true, message: 'Please input your user name!' }]}>
          <Input />
      </Form.Item>
      <Form.Item name="categoryId" label="New Category" rules={[{ required: true, message: 'Please select the news category!' }]}>
          <Select>
              {categoryList.map(item =>
                  <Option key={item.id} value={item.id}>{item.title}</Option>
              )}
          </Select>
      </Form.Item>
    </Form>
    </div>
    <div className={current === 1? "":style.active} >
      <NewsEditor getContent={(value)=>{
        setContent(value)
      }} content={content}></NewsEditor>
    </div>
    <div className={current === 2? "":style.active} >
      
    </div>
    </div>
    
      <div className="steps-action">
        {current <= 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === 2 && (
          <span>
          <Button type='primary' onClick={()=> handleSave(0)}>Save Draft</Button>
          <Button type="danger" onClick={() => handleSave(1)}>
            Submit
          </Button>
          </span>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
  
  </div>
  )
}

export default withRouter(NewsUpdate);