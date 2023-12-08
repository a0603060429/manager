<script lang="ts" setup>
import { ref, reactive, watch, toRaw } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { IRealEstate, upload } from '@/api/user';
import { create } from 'domain';

interface IRealEstateAdd {
  realEstateType: number;
}
const rules: Record<keyof IRealEstateAdd, Rule[]> = {
  realEstateType: [
    {
      required: true,
      trigger: 'blur',
      message: ''
    }
  ]
  // address: [
  //   {
  //     required: true,
  //     trigger: 'blur',
  //     message: '请选择性别'
  //   }
  // ],
  // transportation: [
  //   {
  //     required: true,
  //     trigger: 'blur',
  //     message: ''
  //   }
  // ],
  // floorPlan: [
  //   {
  //     required: true,
  //     trigger: 'blur',
  //     message: ''
  //   }
  // ]
};

const emits = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirmAdd', value: IRealEstate): void;
  (event: 'confirmUpdate', value: IRealEstate): void;
}>();
const props = defineProps({
  type: {
    type: String
  },
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '新建'
  }
});

const labelCol = { span: 7 }
const wrapperCol = { span: 16 }

let info = reactive<IRealEstate>({
  id: NaN,
  realEstateType: 1,
  name: '',
  address: '',
  price: '',
  transportation: '',
  transportation1: '',
  transportation2: '',
  floorPlan: '',
  area: '',
  area2: '',
  floor: '',
  year: '',
  structure: '',
  use: '',
  rate: '',
  theWay: '',
  image:''
});

const formElement = ref<FormInstance>();

const imgsrc = ref('')
const type = ref()

const onCancel = () => {
  emits('update:visible', false);
};

const customRequest = (data: any) => {
  const formData = new FormData();
  formData.append("file", data.file);
  upload(formData).then((data) => {
    if (data.code == 200) {
      imgsrc.value = 'http://150.158.161.223:9000/image/' + data.data
      info.image = 'http://150.158.161.223:9000/image/' + data.data
    } else {
      console.log("文件上传失败")
    }
  })
  
}

const onAdd = () => {
  formElement.value?.validate().then((value) => {
    value.image = info.image
    if (info.transportation1 !== '') {
      info.transportation = info.transportation + info.transportation1
    }
    if (info.transportation2 !== '') {
      if (info.transportation !== '') {
          info.transportation = info.transportation + ','
      }
      info.transportation = info.transportation + info.transportation2
    }
    value.transportation = info.transportation
    emits('confirmAdd', value as IRealEstate);
  });
};

const onUpdate = () => {
  formElement.value?.validate().then((value) => {
    info.transportation = ''
    value.image = info.image
    if (info.transportation1 !== '') {
      info.transportation = info.transportation + info.transportation1
    }
    if (info.transportation2 !== '') {
      if (info.transportation !== '') {
          info.transportation = info.transportation + ','
      }
      info.transportation = info.transportation + info.transportation2
    }
    value.transportation = info.transportation
    emits('confirmUpdate', value as IRealEstate);
  });
};

const confirm = () => {
  if (props.title === '新建') {
    onAdd()
  } else {
    onUpdate()
  }
}

const updateInfo = (data: IRealEstate) => {
  type.value = 2
  console.log(data)
  info = data
  if (info.transportation !== '') {
    info.transportation1 = info.transportation.split(',', 2)[0]
    info.transportation2 = info.transportation.split(',', 2)[1]
  }
  imgsrc.value = data.image
}
defineExpose({
  updateInfo
})

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      formElement.value?.resetFields();
      imgsrc.value = ''
      info.transportation1 = ''
      info.transportation2 = ''
    }
  }
);
</script>

<template>
  <a-modal width="1000px" :maskClosable=false :visible="visible" :title="title" @cancel="onCancel" @ok="confirm">
    <div style="display:flex">
      <div style="width:50%">
        <!-- :rules="rules" -->
        <a-form ref="formElement" :model="info" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-item label="タイプ：" name="realEstateType">
          <a-select
              v-model:value="info.realEstateType"
              :options="[
                { value: 1, label: '区分マンション' },
                { value: 2, label: '区分店舗' },
                { value: 3, label: '区分事務所' },
                { value: 4, label: '一棟収益ビル' },
                { value: 5, label: '売土地' }
              ]"
              style="width: 100%; text-align: left"
            >
          </a-select>
        </a-form-item>
        <a-form-item style="display:none" has-feedback label="ID" name="id">
          <a-input
            v-model:value="info.id"
            placeholder=""
            :maxlength="50"
            allow-clear />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 4" has-feedback label="名前：" name="name">
            <a-input
              v-model:value="info.name"
              placeholder=""
              :maxlength="50"
              allow-clear />
        </a-form-item>
         <a-form-item has-feedback label="価格：" name="price">
            <a-input
              v-model:value="info.price"
              placeholder=""
              :maxlength="50"
              allow-clear />
        </a-form-item>
        <a-form-item has-feedback label="アドレス：" name="address">
          <a-input
            v-model:value="info.address"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="交通機関：" name="transportation">
          <a-input
            v-model:value="info.transportation1"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
          <a-input
            v-model:value="info.transportation2"
            placeholder=""
            :maxlength="50"
            allow-clear
            style="margin-top:10px"
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 4" has-feedback label="間取：" name="floorPlan">
          <a-input
            v-model:value="info.floorPlan"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 4" has-feedback label="専有面積：" name="area">
          <a-input
            v-model:value="info.area"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType >= 4" has-feedback label="土地面積：" name="area">
          <a-input
            v-model:value="info.area"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType == 4" has-feedback label="建物面積：" name="area2">
          <a-input
            v-model:value="info.area2"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 4" has-feedback label="所在階：" name="floor">
          <a-input
            v-model:value="info.floor"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 5" has-feedback label="築年数：" name="year">
          <a-input
            v-model:value="info.year"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType < 5" has-feedback label="構造：" name="structure">
          <a-input
            v-model:value="info.structure"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType > 3" has-feedback label="用途地域：" name="use">
          <a-input
            v-model:value="info.use"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType > 3" has-feedback label="建ぺい率/容積率：" name="rate">
          <a-input
            v-model:value="info.rate"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-if="info.realEstateType == 5" has-feedback label="前面道路：" name="theWay">
          <a-input
            v-model:value="info.theWay"
            placeholder=""
            :maxlength="50"
            allow-clear
          />
        </a-form-item>
      </a-form>
      </div>
      <div style="width:50%;height:50%">
        <a-upload-dragger
          :showUploadList="false"
          name="file"
          :multiple="false"
          :customRequest="customRequest"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">拖拽上传</p>
          <p class="ant-upload-hint">
            把文件拖入指定区域，完成上传，同样支持点击上传。
          </p>
        </a-upload-dragger>
        <a-image :preview="false" :src="imgsrc"/>
      </div>
    </div>
    
  </a-modal>
</template>

<style lang="scss" scoped>
</style>
