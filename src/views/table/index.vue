<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { getContacts } from '@/api/user';
import DownloadBtnVue from './components/DownloadBtn.vue';
interface ICity {
  userName: string;
  userName2: string;
  email: string;
  phone: string;
  reserveTime: string;
  content: string;
}
console.log('contact')
const loading = ref(false);
const requestData = (
  pagData: Ref<{ page: number; size: number; total: number }>,
  tableData: Ref<ICity[]>
) => {
  loading.value = true;

  getContacts(pagData.value.page, pagData.value.size).then((data) => {
    console.log(data)
    if (data.code == 200) {
      tableData.value = data.data.records
      pagData.value.total = data.data.total;
    } else {
      
    }

  });
  console.log(tableData.value)
  setTimeout(() => {
    loading.value = false;
    // const arr: ICity[] = [];
    // for (let i = 0; i < pagData.value.size; i++) {
    //   arr.push({
    //     id: `${Math.ceil(Math.random() * 1000)}${i}`,
    //     name: '广州',
    //     phone: '020-124123213',
    //     description: '中国南部的一座现代化都市',
    //     email: '123214123'
    //   });
    // }


    // tableData.value = arr;
  }, 1000);
};

const columns: { title: string; dataIndex: keyof ICity }[] = [
  {
    title: 'お名前',
    dataIndex: 'userName'
  },
  {
    title: 'ふりがな',
    dataIndex: 'userName2'
  },
  {
    title: 'メールアドレス',
    dataIndex: 'email'
  },
   {
    title: '電話番号',
    dataIndex: 'phone'
  },
   {
    title: 'ご希望の時間',
    dataIndex: 'reserveTime'
  },
  {
    title: 'ご相談内容',
    dataIndex: 'content'
  }
];
const tableData = ref<ICity[]>([]);
const pagData = ref({
  page: 1,
  size: 10,
  total: 0
});

requestData(pagData, tableData);

const onChange = (obj: { page: number; size: number }) => {
  const { page, size } = obj;
  pagData.value.page = page;
  pagData.value.size = size;

  requestData(pagData, tableData);
};
</script>

<template>
  <div class="container" style="padding-top: 0">
    <div class="flexbox" style="padding-top: 5px">
      <DownloadBtnVue />
    </div>
    <div class="table">
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="loading"
        :scroll="{ y: 'calc(100vh - var(--headerhg) - 170px)' }"
        :row-class-name="
          (_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)
        ">
      </a-table>
    </div>
    <SelfPagination
      :total="pagData.total"
      :curr-page="pagData.page"
      :size="pagData.size"
      @changepag="onChange" />
  </div>
</template>

<style lang="scss" scoped>
.table {
  flex: 1;
  padding: 10px 0px;

  .table_btn--text {
    width: 60px;

    :deep(.ant-btn) {
      padding-left: 0px;
      text-align: left;
    }
  }

  :deep(.ant-table-container > .ant-table-body) {
    // 祖先元素如不设置显式宽度，则开启表格纵向滚动且高度未达到时隐藏滚动条，则表格宽度将不正常。
    overflow-y: auto !important;
  }

  :deep(.table-striped) {
    background-color: #fafafa;
  }
}
</style>
