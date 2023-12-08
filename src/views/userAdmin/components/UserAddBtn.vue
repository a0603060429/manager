<script lang="ts" setup>
import { ref } from 'vue';
import messageNotice from '@/utils/message';
import { IRealEstate, IUserAdd, createRealEstate } from '@/api/user';

const emits = defineEmits<{
  (e: 'addSuccess'): void
}>();

const visible = ref(false);
const onOpenModal = () => {
  visible.value = true;
};
const onAdd = (data: IRealEstate) => {
  
  createRealEstate(data).then((data) => {
    if (data.code == 200) {
      visible.value = false;
      messageNotice({
          type: 'success',
          content: '添加成功',
          duration: 5
        });
      emits('addSuccess');
    } else {
      console.log("添加失败")
      messageNotice({
          type: 'error',
          content: '添加失败',
          duration: 5
        });
    }
  })
};
</script>

<template>
  <div class="add_container">
    <AButton type="primary" block @click="onOpenModal">增加房产</AButton>

    <AddUserModal v-model:visible="visible" type=1 @confirm-add="onAdd" />
  </div>
</template>

<style lang="scss" scoped>

</style>