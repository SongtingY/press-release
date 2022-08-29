import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



export default function NewsEditor(props) {
    // 这部分不懂！！！
    const [editorState, setEditorState] = useState('');
    useEffect(()=>{
        const html = props.content
        if (html == undefined) return 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
    }
    },[props.content])
    return (
        <div>
        <Editor
        //editorState为要展示的内容
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
         //onEditorStateChange方法为获取输入框的数据传给editorState作展示
        onEditorStateChange={(editorState)=> setEditorState(editorState)}
        // onblur 可以帮助
        onBlur={() => {
                    //将带标签的文本转换为纯文本
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
        />
        </div>
    )
}
