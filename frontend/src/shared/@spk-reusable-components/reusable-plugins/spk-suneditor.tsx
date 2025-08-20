import React, { Fragment, useRef } from "react";
import SunEditor from 'suneditor-react';
import SunEditorCore from "suneditor/src/lib/core";


interface SunEditorOptions {
  buttonList?: string[][];
  defaultTag?: string;
  minHeight?: string;
  showPathLabel?: boolean;
  font?: string[];
  defaultStyle?: string;
}

interface SunEditorProps {
  width?: string | any;
  height?: string | any;
  placeholder?: string;
  autofocus?: boolean;
  setplugin?: boolean;
  setcontent?: string;
  appendcontent?: string;
  defaultstyle?: string;
  disable?: boolean;
  hide?: boolean;
  hidetoolbar?: boolean;
  disabletoolbar?: boolean;
  onLoad?: string;
  defaulContent?: string;
  onScroll?: (event: UIEvent) => void;
  onClick?: (event: MouseEvent) => void;
  onCopy?: (event: ClipboardEvent, clipboardData: DataTransfer | null) => boolean;
  onCut?: (event: ClipboardEvent, clipboardData: DataTransfer | null) => boolean;
  setoptions?: SunEditorOptions;
}


const SpkSunEditor: React.FC<SunEditorProps> = ({ width, height, placeholder, autofocus, setplugin, setcontent, appendcontent, defaultstyle, disable, hide, hidetoolbar, disabletoolbar, defaulContent, setoptions }) => {

  const editor = useRef<SunEditorCore | null>(null);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const handleChange = (content: string) => {
    console.log("Content changed:", content);
  };

  const handleScroll = (event: UIEvent) => {
    console.log("Scroll event:", event);
  };

  const handleClick = (event: MouseEvent) => {
    console.log("Click event:", event);
  };

  const handleMouseDown = (event: MouseEvent) => {
    console.log("Mouse down event:", event);
  };

  const handleInput = (event: any) => {
    console.log("Input event:", event);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    console.log("Key up event:", event);
  };

  const handleFocus = (event: FocusEvent) => {
    console.log("Focus event:", event);
  };

  const handleBlur = (event: FocusEvent, editorContents: string) => {
    console.log("Blur event:", event, editorContents);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log("Key down event:", event);
  };

  const handleDrop = (event: DragEvent) => {
    console.log("Drop event:", event);
  };

  const handleImageUploadBefore = (data: any) => {
    console.log("Image upload before:", data);
    return true;
  };

  const handleImageUpload = (data: any) => {
    console.log("Image upload:", data);
  };

  const handleImageUploadError = (data: any) => {
    console.log("Image upload error:", data);
  };

  const handleVideoUploadBefore = (data: any) => {
    console.log("Video upload before:", data);
    return true;
  };

  const handleVideoUpload = (data: any) => {
    console.log("Video upload:", data);
  };

  const handleVideoUploadError = (data: any) => {
    console.log("Video upload error:", data);
  };

  const handleAudioUploadBefore = (data: any) => {
    console.log("Audio upload before:", data);
    return true;
  };

  const handleAudioUpload = (data: any) => {
    console.log("Audio upload:", data);
  };

  const handleAudioUploadError = (data: any) => {
    console.log("Audio upload error:", data);
  };

  const handleResizeEditor = (data: any) => {
    console.log("Editor resized:", data);
  };

  const handleCopy = (event: ClipboardEvent, clipboardData: DataTransfer | null): boolean => {
    console.log("Copy event:", event, clipboardData);
    return true;
  };

  const handleCut = (event: ClipboardEvent, clipboardData: DataTransfer | null): boolean => {
    console.log("Cut event:", event, clipboardData);
    return true;
  };

  const handlePaste = (data: any) => {
    console.log("Paste event:", data);
  };

  const imageUploadHandler = (data: any) => {
    console.log("Image upload handler:", data);
  };

  const toggleCodeView = (data: any) => {
    console.log("Toggle code view:", data);
  };

  const toggleFullScreen = (data: any) => {
    console.log("Toggle full screen:", data);
  };

  const showInline = (data: any) => {
    console.log("Show inline:", data);
  };

  const showController = (data: any) => {
    console.log("Show controller:", data);
  };

  const editorOptions: SunEditorOptions = {
    ...setoptions,
  };

  return (
    <Fragment>
      <SunEditor setOptions={editorOptions} getSunEditorInstance={getSunEditorInstance}
        width={width} height={height} placeholder={placeholder} autoFocus={autofocus}
        setAllPlugins={setplugin} setContents={setcontent} appendContents={appendcontent}
        setDefaultStyle={defaultstyle} disable={disable} hide={hide} hideToolbar={hidetoolbar}
        disableToolbar={disabletoolbar} defaultValue={defaulContent}
        onChange={handleChange}
        onScroll={handleScroll}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onImageUploadBefore={handleImageUploadBefore}
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onVideoUploadBefore={handleVideoUploadBefore}
        onVideoUpload={handleVideoUpload}
        onVideoUploadError={handleVideoUploadError}
        onAudioUploadBefore={handleAudioUploadBefore}
        onAudioUpload={handleAudioUpload}
        onAudioUploadError={handleAudioUploadError}
        onResizeEditor={handleResizeEditor}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        imageUploadHandler={imageUploadHandler}
        toggleCodeView={toggleCodeView}
        toggleFullScreen={toggleFullScreen}
        showInline={showInline}
        showController={showController}

      />
    </Fragment>
  );
};

export default SpkSunEditor;
