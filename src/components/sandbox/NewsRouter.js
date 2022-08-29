import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Home from '../../views/newssandbox/home/Home'
import RightList from '../../views/newssandbox/right-manage/RightList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import UserList from '../../views/newssandbox/user-manage/UserList'
import NoPermission from '../../views/newssandbox/nopermission/NoPermission'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/newssandbox/news-manage/NewsDraft'
import NewsAduit from '../../views/newssandbox/aduit-manage/NewsAduit'
import AuditList from '../../views/newssandbox/aduit-manage/AduitList'
import PublishUnpublished from '../../views/newssandbox/publish-manage/PublishUnpublished'
import PublishPublished from '../../views/newssandbox/publish-manage/PublishPublished'
import PublishSunset from '../../views/newssandbox/publish-manage/PublishSunset'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'


const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/audit-manage/audit": <NewsAduit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <PublishUnpublished />,
    "/publish-manage/published": <PublishPublished />,
    "/publish-manage/sunset": <PublishSunset />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />
}

export default function NewsRouter() {
    const [backRouterList, setBackRouterList] = useState([])

    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res=>{
            setBackRouterList([...res[0].data,...res[1].data])
            // console.log([...res[0].data,...res[1].data])
        })
    },[])

    const checkRoute = (item) =>{
        // console.log(LocalRouterMap[item.key],item.pagepermisson)
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    
    const checkUserPermission = (item) =>{
        return rights.includes(item.key)
    }
  return (
    <Routes>
    {backRouterList.map((item) => 
        {
            if (checkRoute(item) && checkUserPermission(item)){
                return <Route
                path={item.key}
                key={item.key}
                element={LocalRouterMap[item.key]} />
            }
            return null
        }
    )};

    <Route path="/" element={<Navigate replace from="/" to="/home" />} />
    {
      backRouterList.length >0 && <Route path="*" element={<NoPermission />} />
    }

    </Routes>
  )
}
