<script lang="ts" setup>
import { ref } from 'vue';
import messageNotice from '@/utils/message';
import { IRealEstate, createRealEstate } from '@/api/user';

const emits = defineEmits<{
  (e: 'updateSuccess'): void
}>();

const visible = ref(false);

const updateRef = ref<any>(null)

const onUpdate = (data: IRealEstate) => {

  createRealEstate(data).then((data) => {
    if (data.code == 200) {
      visible.value = false;
      messageNotice({
          type: 'success',
          content: '编辑成功',
          duration: 5
        });
      emits('updateSuccess');
    } else {
      console.log("编辑失败")
      messageNotice({
          type: 'error',
          content: '编辑失败',
          duration: 5
        });
    }
  })
};

const dataInfo = ref<IRealEstate>()

const updateInfo = (data: IRealEstate) => {
  visible.value = true
  dataInfo.value = data
  console.log(dataInfo)
  updateRef.value?.updateInfo(dataInfo.value)
}

defineExpose({
  updateInfo
})
</script>

<template>
  <div class="add_container">
    <AddUserModal ref="updateRef" v-model:visible="visible" title="编辑" type=2 @confirm-update="onUpdate"/>
  </div>
</template>

<style lang="scss" scoped>

</style>