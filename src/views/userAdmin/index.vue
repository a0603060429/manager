<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { IUserInfo,  getRealEstates, IRealEstate, IContactInfo} from '@/api/user';
import useTableSelection from '@/hooks/useTableSelection';
import useDeleteTableData from '@/hooks/useDeleteTableData';
import useRemark from '@/hooks/useRemark';
import UserDeleteVue from './components/UserDelete.vue';
import UserUploadVue from './components/UserUpload.vue';
import UserAddBtnVue from './components/UserAddBtn.vue';
import DownloadBtnVue from './components/DownloadBtn.vue';
import RealEstateUpdateVue from './components/RealEstateUpdateBtn.vue'

const loading = ref(false);
const requestData = (
  pagData: Ref<{ page: number; size: number; total: number }>,
  tableData: Ref<IRealEstate[]>,
  searchContent?: string
) => {
  loading.value = true;

  getRealEstates(NaN, pagData.value.page, pagData.value.size).then((data) => {
    loading.value = false;
    pagData.value.total = data.data.total;
    tableData.value = data.data.records
  });
};

const updateRef = ref<InstanceType<typeof RealEstateUpdateVue>>() 

const columns = [
  {
    title: '名前',
    dataIndex: 'name'
  },{
    title: 'タイプ',
    dataIndex: 'realEstateType'
  },{
    title: 'アドレス',
    dataIndex: 'address'
  },
  {
    title: '価格',
    dataIndex: 'price',
  },
  {
    title: '交通機関',
    dataIndex: 'transportation',
    width: 220
  },
  {
    title: '間取',
    dataIndex: 'floorPlan'
  },
  {
    title: '専有面積',
    dataIndex: 'area'
  },
  {
    title: '所在階',
    dataIndex: 'floor'
  },{
    title: '築年数',
    dataIndex: 'year'
  },{
    title: '構造',
    dataIndex: 'structure'
  },{
    title: '用途地域',
    dataIndex: 'use'
  },{
    title: '建ぺい率/容積率',
    dataIndex: 'rate'
  },{
    title: '前面道路',
    dataIndex: 'theWay'
  },{
    title: '',
    dataIndex: 'remark'
  }
  
];

const visible2 = ref(false);

const tableData = ref<IRealEstate[]>([]);
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

const { checkedKeys, rowSelection } = useTableSelection();
const onDelete = () => {
  const result = useDeleteTableData(checkedKeys, pagData, tableData);
  if (!result) {
    // 请求数据更新
    requestData(pagData, tableData);
  }
};

const onUploadSuccess = () => {};

const searchContent = ref('');
const onSearch = (value: string) => {
  searchContent.value = value;
  requestData(pagData, tableData, searchContent.value);
};
const onReset = () => {
  searchContent.value = '';
  requestData(pagData, tableData);
};

const { visible, value, index, onOpenRemarkModal } = useRemark();
const onUpdateRemark = (value: string) => {
  // const item = tableData.value[index.value];
  visible.value = false;
  // updateUserRemark(item.id, value).then(() => {
  //   item.remark = value;
  //   visible.value = false;

  //   messageNotice({
  //     content: '修改备注成功',
  //     type: 'success'
  //   });
  // });
};
const infoData = ref<IRealEstate>();
const openUpdateModel = (index:number, data: IRealEstate) => {
  infoData.value = data
  updateRef.value?.updateInfo(data)
  
}
</script>

<template>
  <div class="container">
    <!-- <SelfSearch @on-search="onSearch" @on-reset="onReset" />
    <SelfTitle title="人员信息" />
     -->
    <div class="flexbox">
      <UserAddBtnVue @add-success="onReset"/>
      <div class="margin_rl-20">
        <UserDeleteVue :checked-keys="checkedKeys" @del-success="onDelete" />
      </div>
      <!-- <div class="mr-20">
        <DownloadBtnVue />
      </div>
      <UserUploadVue @upload-success="onUploadSuccess" /> -->
    </div>
    <!-- <div class="table-operations" style="display:flex;">
          <a-button type="primary" size="narmal" @click="setAgeSort">新增</a-button>
          <a-button style="margin-left:20px" type="primary" size="narmal" @click="setAgeSort">删除</a-button>
    </div> -->
    <div class="user_table">
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="loading"
        :row-selection="rowSelection"
        :scroll="{ y: 'calc(100vh - var(--headerhg) - 300px)' }"
        :row-class-name="
          (_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)
        ">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'realEstateType' && record.realEstateType == 1" >
           区分マンション
          </template>
          <template v-if="column.dataIndex === 'realEstateType' && record.realEstateType == 2" >
            区分店舗
          </template>
          <template v-if="column.dataIndex === 'realEstateType' && record.realEstateType == 3" >
            区分事務所
          </template>
          <template v-if="column.dataIndex === 'realEstateType' && record.realEstateType == 4">
            一棟収益ビル
          </template>
          <template v-if="column.dataIndex === 'realEstateType' && record.realEstateType == 5">
            売土地
          </template>
          <template v-if="column.dataIndex === 'remark'">
            <div class="table_btn--text">
              <a-button
                type="link"
                block
                @click="openUpdateModel(index, record)"
                >編集</a-button
              >
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <RealEstateUpdateVue ref="updateRef" @update-success="onReset"/>
    <SelfPagination
      :total="pagData.total"
      :curr-page="pagData.page"
      :size="pagData.size"
      @changepag="onChange" />

    <AntModalUpdate
      v-model:visible="visible"
      :value="value"
      @confirm-update="onUpdateRemark" />
  </div>
</template>

<style lang="scss" scoped>
.user_table {
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
