import React, {useEffect, useState} from 'react'
import { PageHeader, Descriptions } from 'antd'
import { useParams } from "react-router";
import axios from 'axios';
import moment from 'moment'

export default function NewsPreview(props) {
  const params = useParams();
  const [newsInfo, setNewsInfo] = useState(null);
  const auditList = ["Unreviewed","Reviewing", "Approved","Fail"]
  const publishList = ["Unpublished","To be published", "Launched","Removed"]
  useEffect(() => {
    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res=>{
      console.log(res.data)
      setNewsInfo(res.data)
    })
  }, []);
  return (
    <div>
      {
        newsInfo && <div> 
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title= {newsInfo.title}
            subTitle= {newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Created">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="Creation Time">{moment(newsInfo.createTime).format("MM/DD/YYYY HH:mm:ss")}</Descriptions.Item>
              <Descriptions.Item label="Publish Time">{newsInfo.publishTime?moment(newsInfo.publishTime).format("MM/DD/YYYY HH:mm:ss"):"-"}</Descriptions.Item>
              <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="Review Status"><span style={{color:"red"}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item> 
              <Descriptions.Item label="Publish Status"><span style={{color:"red"}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item> 
              <Descriptions.Item label="Visits Counts">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="Likes Counts">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="Comments Counts">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </div>
        <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: "20px 24px", border: "1px solid #ccc" }}>
        </div>
        </div>
      }
    </div>
  )
}
