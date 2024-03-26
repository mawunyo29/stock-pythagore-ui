<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dataInput: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    required: true
  },
  labelPosition: {
    type: String,
    default: 'top'
  }
})
const input = ref()
const emit = defineEmits(['submit'])
const submit = () => {
  const valid = input.value.validate();
  if (valid) {
    emit('submit', props.dataInput)
  } else {
    console.log("error submit!!");
    return false;
  }
};
const reset = () => {
  console.log(input.value);

  if (input.value !== undefined) {
    input.value?.resetFields();
  }
};
const scopeInputType = (type) => {
  if (type === "text" || type === "email" || type === "password") {
    return true;
  }
  return false;
};
onMounted(() => {
  console.log(input.value.resetFields());

})
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900 h-full">
    <div
      class=" sm:px-6 px-4 md:py-12 py-9 2xl:mx-auto  w-full md:flex items-center justify-start">
      <el-card class="sm:w-1/3 w-full my-10 " shadow="hover">
        <div class="card-header text-center text-xl font-medium mb-4">
          <span>{{ title }}</span>
        </div>
        <el-form :model="dataInput" :rules="rules" ref="input" label-width="80px" :label-position="labelPosition">
          <el-row>
            <el-col :span="24">
              <template v-for="(item, index) in dataInput" :key="index">
                <el-form-item :label="item.label" :prop="item.prop">
                  <template v-if="item.is_visible">
                    <el-input v-if="scopeInputType(item.type)" v-model="item.value" :placeholder="item.placeholder"
                      :type="item.type" />
                    <client-only>
                      <el-select v-model="item.value" placeholder="Select" clearable v-if="item.type === 'select'">
                        <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex" :label="option.label"
                          :value="option.value"></el-option>
                      </el-select>
                    </client-only>
                    <el-checkbox v-if="item.type === 'checkbox'" v-model="item.value"></el-checkbox>
                  </template>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="flex justify-end">
            <div class="flex space-x-3">
              <base-button type="submit" @click="submit" label="Submit" color="primary" size="sm" />
              <base-button type="reset" @click="reset" label="Reset" color="secondary" size="sm"/>
            </div>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<style scoped></style>