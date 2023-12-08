<script lang="ts" setup>
import messageNotice from '@/utils/message';
import showConfirm from '@/utils/confirm';

import { download} from '@/api/user';

const onDownload = () => {
  showConfirm({ title: '提示', content: '确定下载所有联络信息表格？' })
    .then(() => {
      console.log('download');
      download().then((data) => {
      });
    })
    .catch(() => {});
};
</script>

<template>
  <AButton type="primary" block @click="onDownload" style="width:100px">下载表格</AButton>
</template>

<style lang="scss" scoped></style>
