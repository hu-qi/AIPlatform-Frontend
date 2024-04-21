<template>
  <el-upload
    class="upload-demo"
    action="#"
    multiple
    :http-request="uploadFiles"
    :file-list="fileList"
    :on-change="onUploadChange"
    :auto-upload="false"
    limit="1"
    :on-progress="uploadProcess"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__text">
      点击选择文件
    </div>
    <template #tip>
      <div
        class="el-upload__tip"
        style="text-align: center"
      >
        每次只能上传一个文件（zip/jpg/png...）
      </div>
    </template>
  </el-upload>
  <div style="align-items: center">
    <el-button
      style="margin-left: 10px; align-items: center"
      size="small"
      type="success"
      @click="submitUpload"
    >
      上传到服务器
    </el-button>
  </div>
</template>
